import type { Supply } from "@/types/Supply"
import { defineStore } from "pinia"
import { collection, doc, setDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore"
import { db } from "@/firebase/firebaseConfig"
import type { ReceiptItem } from "@/types/ReceiptItem"
import type { SupplyItem } from "@/types/SupplyItem"
import type { User } from "@/types/User"


export const useSuppliesStore = defineStore('suppliesStore',{
    state: () => ({
        supplies:[] as Supply[]
    }),
    getters: {
        lastSupply: (state) => {
            return state.supplies.length > 0 ? state.supplies[state.supplies.length - 1] : null;
        }
    },
    actions:{
        async updateSuppliesByReceipt(email: string, updateCausedByDocumentName: string, receiptItems: ReceiptItem[]){
            const date = new Date().toLocaleString()
            console.log(`supplies length: ${this.supplies.length}`)
            
            const supply = {
                id: '',
                updateCausedByDocumentName: updateCausedByDocumentName,
                email: email,
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
                        name: element.name,
                        code: element.code,
                        unit: element.unit,
                        quantity:  isNaN(parseFloat(element.quantity)) ? 0.00 : parseFloat(element.quantity)
                    }as SupplyItem)
                })
                supply.supplyItems = suppliesItems
                this.addSupply(supply)
                return
            }
            
            const lastSupplyState = this.supplies[this.supplies.length - 1]
            
            if (lastSupplyState && Array.isArray(lastSupplyState.supplyItems)) {
                supply.supplyItems = lastSupplyState.supplyItems.map(item => ({ ...item }))
            } 
            receiptItems.forEach(element => {
                const supplyItemIndex = supply.supplyItems.findIndex(it => it.rawMaterialId === element.rawMaterialId || it.name === element.name)
                console.log('index:' + supplyItemIndex)
                if(supplyItemIndex !== -1){
                    const qunatity = isNaN(parseFloat(element.quantity)) ? 0.00 : parseFloat(element.quantity)
                    supply.supplyItems[supplyItemIndex].quantity += qunatity
                }else{
                    supply.supplyItems.push({
                        rawMaterialId: element.rawMaterialId,
                        name: element.name,
                        code: element.code,
                        unit: element.unit,
                        quantity: isNaN(parseFloat(element.quantity)) ? 0.00 : parseFloat(element.quantity)
                    }as SupplyItem)
                }
                
            })

            this.addSupply(supply)
                    
        },
        async updateSuppliesByBill(user: User, documentName: string, supplyItems: SupplyItem[]){
            const date = new Date().toLocaleString()
            console.log(`supplies length: ${this.supplies.length}`)
            
            const supply = {
                id: '',
                updateCausedByDocumentName: documentName,
                email: user.email,
                updateDate: date,
                timestamp: serverTimestamp(),
                supplyItems: []
            }as Supply

            const lastSupplyState = this.supplies[this.supplies.length - 1]
            if (lastSupplyState && Array.isArray(lastSupplyState.supplyItems)) {
                supply.supplyItems = lastSupplyState.supplyItems.map(item => ({ ...item }))
            } 
            supplyItems.forEach(supplyItem => {
                const supplyItemIndex = supply.supplyItems.findIndex(it => it.rawMaterialId === supplyItem.rawMaterialId)
                console.log('index:' + supplyItemIndex)
                if(supplyItemIndex !== -1){
                    const qunatity = supplyItem.quantity
                    supply.supplyItems[supplyItemIndex].quantity += qunatity
                }else{
                    console.log('supply item not exists in ')
                    supply.supplyItems.push(supplyItem)
                }
            })

            this.addSupply(supply)
                    
        },
        async addSupply(supply: Supply){
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
                                email: data.email,
                                updateDate: data.updateDate,
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
                                email: data.email,
                                updateDate: data.updateDate,
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