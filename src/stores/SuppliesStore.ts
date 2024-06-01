import type { Supply } from "@/types/Supply"
import { defineStore } from "pinia"
import { collection, doc, setDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore"
import { db } from "@/firebase/firebaseConfig"
import type { ReceiptItem } from "@/types/ReceiptItem"
import type { SupplyItem } from "@/types/SupplyItem"


export const useSuppliesStore = defineStore('suppliesStore',{
    state: () => ({
        supplies:[] as Supply[]
    }),
    getters: {
        
    },
    actions:{
        async updateSuppliesByReceipt(uid: string, updateCausedByDocumentName: string, receiptItems: ReceiptItem[]){
            const date = new Date().toDateString()
            console.log(`supplies length: ${this.supplies.length}`)
            
            const supply = {
                id: '',
                updateCausedByDocumentName: updateCausedByDocumentName,
                uid: uid,
                updateDate: date,
                timestamp: serverTimestamp(),
                supplyItems: []
            }as Supply

            if(!this.supplies.length){
                console.log('no supplies')
                const suppliesItems: SupplyItem[] = []
                receiptItems.forEach(element => {
                    suppliesItems.push({
                        rawMaterialId: element.rawMaterialId,
                        quantity:  isNaN(parseFloat(element.quantity)) ? 0.00 : parseFloat(element.quantity)
                    }as SupplyItem)
                })
                supply.supplyItems = suppliesItems
                this.addReceipt(supply)
                return
            }
            console.log(`supplies lenght: ${this.supplies.length}`)
            console.log(`supplies: ${this.supplies}`)
            const lastSupplyState = this.supplies[this.supplies.length - 1]
            console.log(`lastSupplyState: ${lastSupplyState}`)
            console.log(`lastSupplyState.supplyItems: ${lastSupplyState.supplyItems}`)
        
            if (lastSupplyState && Array.isArray(lastSupplyState.supplyItems)) {
                
                supply.supplyItems = lastSupplyState.supplyItems.map(item => ({ ...item }));

                console.log('old supplies items');
                supply.supplyItems.forEach(element => {
                    console.log(`id: ${element.rawMaterialId} quantity: ${element.quantity}`);
                });
            } 
            receiptItems.forEach(element => {
                const supplyItemIndex = supply.supplyItems.findIndex(it => it.rawMaterialId === element.rawMaterialId)
                console.log('index:' + supplyItemIndex)
                if(supplyItemIndex !== -1){
                    const qunatity = isNaN(parseFloat(element.quantity)) ? 0.00 : parseFloat(element.quantity)
                    console.log(`qunatity: ${qunatity} to add`)
                    console.log(`qunatity: ${supply.supplyItems[supplyItemIndex].quantity} before`)
                    supply.supplyItems[supplyItemIndex].quantity += qunatity
                    console.log(`qunatity: ${supply.supplyItems[supplyItemIndex].quantity} after`)
                }else{
                    supply.supplyItems.push({
                        rawMaterialId: element.rawMaterialId,
                        quantity: isNaN(parseFloat(element.quantity)) ? 0.00 : parseFloat(element.quantity)
                    }as SupplyItem)
                }
                
            })

            this.addReceipt(supply)
                    
        },
        async addReceipt(supply: Supply){
            try {
                const addRef = doc(collection(db, 'supplies'))
                const id = addRef.id
                supply.id = id
                
                await setDoc(addRef, supply as Supply)
                console.log('supplies is added')
              } catch (e) {
                console.error("Error adding document: ", e)
              }
        },
        
        async getSupplies(){
            const collectionRef = collection(db, "supplies")
            const q = query(collectionRef, orderBy("timestamp"))

            const unsubscribe = onSnapshot(q, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        const data = change.doc.data()
                        const receipt = this.supplies.find(it => it.id === data.id)
                        if(!receipt){
                            this.supplies.push({
                                id: data.id,
                                updateCausedByDocumentName: data.updateCausedByDocumentName,
                                uid: data.uid,
                                updateDate: data.updateData,
                                timestamp: data.timestamp,
                                supplyItems: data.supplyItems
                            }as Supply)
                        }
                        console.log("add: ", change.doc.data())
                    }
                    if (change.type === "modified") {
                        console.log("modified: ", change.doc.data())
                        const data = change.doc.data()
                        const index = this.supplies.findIndex(it => it.id === data.id)
                        if (index !== -1) {
                            this.supplies[index] = {
                                id: data.id,
                                updateCausedByDocumentName: data.updateCausedByDocumentName,
                                uid: data.uid,
                                updateDate: data.updateData,
                                timestamp: data.timestamp,
                                supplyItems: data.supplyItems
                            }as Supply
                        }
                    }
                    if (change.type === "removed") {
                        console.log("removed: ", change.doc.data());
                        const data = change.doc.data()
                        const index = this.supplies.findIndex(it => it.id === data.id);
                        if (index !== -1) {
                            this.supplies.splice(index, 1);
                        }
                    }
                });
            });
        },
    }
})