import type { Product } from "@/types/Product"
import { doc, collection, setDoc, onSnapshot, updateDoc, deleteDoc, serverTimestamp, query, orderBy, getDoc} from "firebase/firestore"
import { defineStore } from "pinia"
import { db } from "@/firebase/firebaseConfig"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { storage } from "@/firebase/firebaseConfig"
import { imageUrlToBlob } from "@/helpers/imageUrlToBlob"
import { generateImageName } from "@/helpers/generateImageName"
import router from "@/router"
import { useToast } from 'vue-toastification'
import type { PayDesk } from '../types/PayDesk'
import type { User } from "@/types/User"
import type { Bill } from "@/types/Bill"

const toast = useToast()
const payDeskCollection = 'payDesks'
const billsCollection = 'bills'

export const usePayDeskStore = defineStore('payDeskStore',{
    state: () => ({
        payDeskInUse: null as PayDesk | null,
        payDesks:[] as PayDesk[],
        isLoading: false
    }),
    actions: {
        async addPayDesk(paydesk: PayDesk){
            try {
                paydesk.timestamp = serverTimestamp()
                paydesk.creationDate = new Date().toLocaleString()
                paydesk.totalCash = '0.00'
                paydesk.billNumber = 1
                paydesk.currentYear = new Date().getFullYear().toString()
                const addRef = doc(collection(db, payDeskCollection))
                paydesk.id = addRef.id
                await setDoc(addRef, paydesk as PayDesk)
                router.push({ name: 'PayDeskDashboard'})
                console.log("PayDesk added")
                toast.success("Blagajna kreirana")
              } catch (e) {
                console.error("adding paydesk: ", e)
                toast.error('Podreška prilikom kreiranja blagajne')
              }
        },
        async updatePayDesk(paydesk: PayDesk, oldPayDesk: PayDesk){
            try {
                if(this.getPayDeskById(oldPayDesk.id)){
                    this.isLoading = true
                    const updateRef = doc(db, payDeskCollection, oldPayDesk.id)
                    
                    await updateDoc(updateRef, {
                        name: paydesk.name,
                        deposite: paydesk.deposite,
                        startOfWorkingHours: paydesk.startOfWorkingHours,
                        endOfWorkingHours: paydesk.endOfWorkingHours
                    })
                    toast.success("Blagajna ažurirana")
                    router.push({ name: 'PayDeskDashboard'})
                }else{
                    toast.warning('Nepostojeća blagajna ne može se ažurirati')
                }
            } catch (e) {
                console.error("paydesk update: ", e)
                toast.error('Podreška prilikom ažuriranja blagajne')
            } finally {
                this.isLoading = false
            }
        },
        async loginToPayDesk(userId: string, paydeskId: string){
            try {
                const paydesk = this.getPayDeskById(paydeskId)
                if(paydesk){
                    if(paydesk.currentYear !== new Date().getFullYear().toString()){
                        console.log('paydesk years are not the seam')
                        await this.updateCurrentYearAndBillNumber(paydeskId)
                    }
                    const updateRef = doc(db, payDeskCollection, paydeskId)
                    
                    await updateDoc(updateRef, {
                        userId: userId,
                        isInUse: true,
                        logInDate: new Date().toLocaleString()
                    })
                    toast.success("Uspješna prijava")
                }
            } catch (e) {
                console.error("paydesk login: ", e)
                toast.error('Podreška prilikom prijave')
            }
        },
        async updateCurrentYearAndBillNumber(paydeskId: string){
            try {
                const updateRef = doc(db, payDeskCollection, paydeskId)
                
                await updateDoc(updateRef, {
                    billNumber: 1,
                    currentYear: new Date().getFullYear().toString()
                })
                toast.success("Blagajna resetirana na novu godinu")
            } catch (e) {
                console.error("paydesk reset: ", e)
                toast.error('Pogreška prilikom reseta blagajne')
            }
        },
        async disablePayDesk(paydeskId: string, isDisabled: boolean){
            try {
                const paydesk = this.getPayDeskById(paydeskId)
                if(paydesk){
                    const updateRef = doc(db, payDeskCollection, paydeskId)
                    
                    await updateDoc(updateRef, {
                        isDisabled: isDisabled
                    })
                    if(isDisabled){
                        toast.success(`Blagajna ${paydesk.name} onemogučena`)
                    }else{
                        toast.success(`Blagajna ${paydesk.name} omogučena`)
                    }
                }
                
            } catch (e) {
                console.error("paydesk disable: ", e)
                toast.error('Podreška prilikom onemogučavanja blagajne')
            }
        },
        async logOutFromPayDesk(paydeskId: string){
            try {
                const updateRef = doc(db, payDeskCollection, paydeskId)
                
                await updateDoc(updateRef, {
                    userId: '',
                    isInUse: false,
                    logInDate: ''
                })
                toast.success("Uspješna odjava")
            } catch (e) {
                console.error("paydesk logOut: ", e)
                toast.error('Podreška prilikom odjave')
            }
        },
        async fetchPaydeskById(paydeskId: string) {
            try {
              const docRef = doc(db, payDeskCollection , paydeskId)
              const docSnap = await getDoc(docRef)
              if (docSnap.exists()) {
                this.payDeskInUse = docSnap.data() as PayDesk
              } else {
                console.error('paydesk dont exist')
                toast.error('Blagajna ne postoji')
              }
            } catch (error) {
              console.error('fatch paydesk', error)
              toast.error('Neuspješno dohvaćanje blagajne')
            }
          },
        async fetchPayDesks(){
            const collectionRef = collection(db, payDeskCollection)
            const q = query(collectionRef, orderBy("timestamp", 'asc'))

            const unsubscribe = onSnapshot(q, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        const data = change.doc.data()
                        const paydesk = this.payDesks.find(it => it.id === data.id)
                        console.log('all payDesks')
                        console.log(data)
                        if(!paydesk){
                            this.payDesks.push({
                                id: data.id,
                                name: data.name,
                                deposite: data.deposite,
                                startOfWorkingHours: data.startOfWorkingHours,
                                endOfWorkingHours: data.endOfWorkingHours,
                                totalCash: data.totalCash,
                                userId: data.userId,
                                bills: data.bills,
                                billNumber: data.billNumber,
                                currentYear: data.currentYear,
                                isInUse: data.isInUse,
                                isDisabled: data.isDisabled,
                                creationDate: data.creationDate,
                                logInDate: data.logInDate,
                                timestamp: data.timestamp,
                            }as PayDesk)
                        }
                    }
                    if (change.type === "modified") {
                        const data = change.doc.data()
                        const index = this.payDesks.findIndex(it => it.id === data.id)
                        if (index !== -1) {
                            this.payDesks[index] = {
                                id: data.id,
                                name: data.name,
                                deposite: data.deposite,
                                startOfWorkingHours: data.startOfWorkingHours,
                                endOfWorkingHours: data.endOfWorkingHours,
                                totalCash: data.totalCash,
                                userId: data.userId,
                                bills: data.bills,
                                billNumber: data.billNumber,
                                currentYear: data.currentYear,
                                isInUse: data.isInUse,
                                isDisabled: data.isDisabled,
                                creationDate: data.creationDate,
                                logInDate: data.logInDate,
                                timestamp: data.timestamp,
                            }as PayDesk
                        }
                    }
                    if (change.type === "removed") {
                        const data = change.doc.data()
                        const index = this.payDesks.findIndex(it => it.id === data.id)
                        if (index !== -1) {
                            this.payDesks.splice(index, 1)
                        }
                    }
                });
            });
        },
        async deletePayDesk(id: string){
            const paydesk = this.payDesks.find(it => it.id === id)
            if(paydesk && !paydesk.isInUse){
                try{
                    await deleteDoc(doc(db, payDeskCollection, id))
                    router.push({ name: 'PayDeskList'})
                    toast.success('Blagajna izbrisana')
                } catch (e) {
                    toast.error('Neuspješno brisanje blagajne')
                    console.error("Deleting paydesk: ", e)
                }
            }else{
                toast.warning('Blagajna je u upotrebi')
            }
            
        },
        getPayDeskById(id: string) {
            return this.payDesks.find(it => it.id === id) || null
        },
        async addBill(bill: Bill){
            try {
                this.isLoading = true
                bill.Date = new Date().toLocaleDateString()
                bill.Time = new Date().toLocaleTimeString()
                const addRef = doc(collection(db, billsCollection))
                bill.id = addRef.id
                await setDoc(addRef, bill as Bill)
                router.push({ name: 'PayDeskDashboard'})
                console.log("PayDesk added")
                toast.success("Blagajna kreirana")
              } catch (e) {
                console.error("adding paydesk: ", e)
                toast.error('Podreška prilikom kreiranja blagajne')
              }finally{
                this.isLoading = false
              }
        }

    }
})