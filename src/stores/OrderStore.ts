import { db } from "@/firebase/firebaseConfig"
import { generateOrderCode } from "@/helpers/generateOrderCode"
import type { BillItem } from "@/types/BillItem"
import type { Order } from "@/types/Order"
import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore"
import { defineStore } from "pinia"
import { useToast } from 'vue-toastification'


const toast = useToast()
const orderCollection = 'orders'


export const useOrderStore = defineStore('orderStore',{
    state: () => ({
        billItems:[] as BillItem [],
        orders:[] as Order [],
        approvedOrders: [] as Order [],
        isLoading: false
    }),
    actions: {
        addOrderItem(billItem: BillItem){
            this.billItems.push(billItem)
        },
        removeOrderItem(index: number){
            this.billItems.splice(index, 1)
        },
        async addOrder(order: Order){
            try {
                this.isLoading = true
                order.code = generateOrderCode()
                order.timestamp = serverTimestamp()
                order.date = new Date().toLocaleDateString()
                order.time = new Date().toLocaleTimeString()
                order.isApproved = false
                order.isCompleted = false
                const addRef = doc(collection(db, orderCollection))
                order.id = addRef.id
                await setDoc(addRef, order as Order)
                console.log("order sent")
                toast.success("Narudžba poslana")
              } catch (e) {
                console.error("order: ", e)
                toast.error('Pogreška prilikom narudžbe')
              } finally{
                this.isLoading = false
              }
        },
        async fetchOrders(){
            const collectionRef = collection(db, orderCollection)
            const q = query(collectionRef, where("isApproved", "==", false))

            const unsubscribe = onSnapshot(q, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        const data = change.doc.data()
                        const order = this.orders.find(it => it.id === data.id)
                        if(!order){
                            this.orders.push({
                                id: data.id,
                                code: data.code,
                                tableId: data.tableId,
                                payDeskId: data.payDeskId,
                                date: data.date,
                                time: data.time,
                                billItems: data.billItems,
                                uid: data.uid,
                                timestamp: data.timestamp,
                                isApproved: data.isApproved,
                                isCompleted: data.isCompleted
                            }as Order)
                        }
                    }
                    if (change.type === "modified") {
                        const data = change.doc.data()
                        const index = this.orders.findIndex(it => it.id === data.id)
                        if (index !== -1) {
                            this.orders[index] = {
                                id: data.id,
                                code: data.code,
                                tableId: data.tableId,
                                payDeskId: data.payDeskId,
                                date: data.date,
                                time: data.time,
                                billItems: data.billItems,
                                uid: data.uid,
                                timestamp: data.timestamp,
                                isApproved: data.isApproved,
                                isCompleted: data.isCompleted
                            }as Order
                        }
                    }
                    if (change.type === "removed") {
                        const data = change.doc.data()
                        const index = this.orders.findIndex(it => it.id === data.id)
                        if (index !== -1) {
                            this.orders.splice(index, 1)
                        }
                    }
                })
            })
        },
        async fetchApprovedOrders(){
            const collectionRef = collection(db, orderCollection)
            const q = query(collectionRef, where("isApproved", "==", true), where("isCompleted", "==", false))

            const unsubscribe = onSnapshot(q, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        const data = change.doc.data()
                        const order = this.approvedOrders.find(it => it.id === data.id)
                        if(!order){
                            this.approvedOrders.push({
                                id: data.id,
                                code: data.code,
                                tableId: data.tableId,
                                payDeskId: data.payDeskId,
                                date: data.date,
                                time: data.time,
                                billItems: data.billItems,
                                uid: data.uid,
                                timestamp: data.timestamp,
                                isApproved: data.isApproved,
                                isCompleted: data.isCompleted
                            }as Order)
                        }
                    }
                    if (change.type === "modified") {
                        const data = change.doc.data()
                        const index = this.approvedOrders.findIndex(it => it.id === data.id)
                        if (index !== -1) {
                            this.approvedOrders[index] = {
                                id: data.id,
                                code: data.code,
                                tableId: data.tableId,
                                payDeskId: data.payDeskId,
                                date: data.date,
                                time: data.time,
                                billItems: data.billItems,
                                uid: data.uid,
                                timestamp: data.timestamp,
                                isApproved: data.isApproved,
                                isCompleted: data.isCompleted
                            }as Order
                        }
                    }
                    if (change.type === "removed") {
                        const data = change.doc.data()
                        const index = this.approvedOrders.findIndex(it => it.id === data.id)
                        if (index !== -1) {
                            this.approvedOrders.splice(index, 1)
                        }
                    }
                })
            })
        },
        async approveTheOrder(order: Order){
            try {
                this.isLoading = true
                const updateRef = doc(db, orderCollection, order.id)
                await updateDoc(updateRef, {
                    payDeskId: order.payDeskId,
                    isApproved: true
                })
                toast.success("Narudžba odorena")
            } catch (e) {
                console.error("Order approval: ", e)
                toast.error('Pograška prilikom odobranja narudžbe')
            } finally{
                this.isLoading = false
            }
        },
        async completeTheOrder(orderId: string){
            try {
                this.isLoading = true
                const updateRef = doc(db, orderCollection, orderId)
                await updateDoc(updateRef, {
                    isCompleted: true
                })
            } catch (e) {
                console.error("Order completion: ", e)
                toast.error('Pograška prilikom dovršetka narudžbe')
            } finally{
                this.isLoading = false
            }
        },
    }
})