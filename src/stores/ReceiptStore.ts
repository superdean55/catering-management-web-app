import type { Receipt } from "@/types/Receipt";
import { defineStore } from "pinia";
import { db } from "@/firebase/firebaseConfig";
import { doc, collection, setDoc, onSnapshot } from "firebase/firestore";
import { useSuppliesStore } from "./SuppliesStore";
import { useUserStore } from "./UserStore";



export const useReceiptStore = defineStore('receiptStore',{
    state: () => ({
        receipts:[] as Receipt[]
    }),
    getters: {
        getReceiptById: (state) => {
            return (id: string) => {
                return state.receipts.find(receipt => receipt.id === id);
            }
        }
    },
    actions:{
        async addReceipt(receipt: Receipt){
            try {
                const addRef = doc(collection(db, 'receipts'))
                receipt.id = addRef.id
                await setDoc(addRef, receipt as Receipt )
                console.log("Adding new data ID: ")
                const suppliesStore = useSuppliesStore()
                const userStore = useUserStore()                
                if(userStore.user && userStore.user.email){
                    const updateCausedByDocumentName = `receipt numb. ${receipt.receiptNumber}`
                    await suppliesStore.updateSuppliesByReceipt(userStore.user.email, updateCausedByDocumentName, receipt.receiptItems)
                }
              } catch (e) {
                console.error("Error adding document: ", e)
              }
        },
        async getReceipts(){
            const collectionRef = collection(db, "receipts");

            const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        const data = change.doc.data()
                        const receipt = this.receipts.find(it => it.id === data.id)
                        if(!receipt){
                            this.receipts.push({
                                id: data.id,
                                supplierName: data.supplierName,
                                supplierOib: data.supplierOib,
                                documentDate: data.documentDate,
                                receiptNumber: data.receiptNumber,
                                documentIdentifier: data.documentIdentifier,
                                receiptItems: data.receiptItems,
                                uploadDate: data.uploadDate
                            }as Receipt)
                        }
                        console.log("add: ", change.doc.data())
                    }
                    if (change.type === "modified") {
                        console.log("modified: ", change.doc.data())
                        const data = change.doc.data()
                        const index = this.receipts.findIndex(it => it.id === data.id)
                        if (index !== -1) {
                            this.receipts[index] = {
                                id: data.id,
                                supplierName: data.supplierName,
                                supplierOib: data.supplierOib,
                                documentDate: data.documentDate,
                                receiptNumber: data.receiptNumber,
                                documentIdentifier: data.documentIdentifier,
                                receiptItems: data.receiptItems,
                                uploadDate: data.uploadDate
                            }as Receipt
                        }
                    }
                    if (change.type === "removed") {
                        console.log("removed: ", change.doc.data());
                        const data = change.doc.data()
                        const index = this.receipts.findIndex(it => it.id === data.id);
                        if (index !== -1) {
                            this.receipts.splice(index, 1);
                        }
                    }
                });
            });
        }
    }
})