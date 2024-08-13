import type { Product } from "@/types/Product"
import { doc, collection, setDoc, onSnapshot, updateDoc, deleteDoc, serverTimestamp, query, orderBy, getDoc, where, getDocs} from "firebase/firestore"
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
import { generateJIR } from "@/helpers/generateJIR"
import { generateZKI } from "@/helpers/generateZKI"
import type { ConclusionItem } from "@/types/ConclusionItem"
import { generateId } from "@/helpers/generateId"
import type { Conclusion } from "@/types/Conclusion"

const toast = useToast()
const payDeskCollection = 'payDesks'
const billsCollection = 'bills'
const conclusionsCollection = 'conclusions'

export const usePayDeskStore = defineStore('payDeskStore',{
    state: () => ({
        payDeskInUse: null as PayDesk | null,
        payDesks:[] as PayDesk [],
        isLoading: false,
        bills:[] as Bill [],
        conclusions:[] as Conclusion []
    }),
    actions: {
        async addPayDesk(paydesk: PayDesk){
            try {
                paydesk.timestamp = serverTimestamp()
                paydesk.creationDate = new Date().toLocaleString()
                paydesk.totalCash = 0.00
                paydesk.billNumber = 1
                paydesk.conclusionNumber = 1
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
                        await this.resetCurrentYearAndBillNumber(paydeskId)
                    }
                    const updateRef = doc(db, payDeskCollection, paydeskId)
                    
                    await updateDoc(updateRef, {
                        userId: userId,
                        isInUse: true,
                        logInDate: new Date().toLocaleDateString(),
                        logInTime: new Date().toLocaleTimeString()
                    })
                    toast.success("Uspješna prijava")
                }
            } catch (e) {
                console.error("paydesk login: ", e)
                toast.error('Podreška prilikom prijave')
            }
        },
        async resetCurrentYearAndBillNumber(paydeskId: string){
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
        async updateBillNumberTotalCashAndBillList(paydesk: PayDesk, totalCash: number){
            try {
                const updateRef = doc(db, payDeskCollection, paydesk.id)
                const payDeskTotalCash = Math.round((paydesk.totalCash + totalCash) * 100) / 100
                console.log('paydesk state: ',paydesk)
                console.log('total cash befor = ', paydesk.totalCash)
                console.log('total cash to add = ', totalCash)
                console.log('math =', Math.round((paydesk.totalCash + totalCash) * 100))
                console.log('/100 =', Math.round((paydesk.totalCash + totalCash) * 100) / 100)
                console.log('total cash after = ', payDeskTotalCash)
                
                await updateDoc(updateRef, {
                    billNumber: paydesk.billNumber += 1,
                    totalCash: payDeskTotalCash,
                    conclusionItems: paydesk.conclusionItems
                })
                console.log("bill number ++")
            } catch (e) {
                console.error("bill number update: ", e)
                toast.error('Pogreška prilikom ažuriranja broja računa')
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
                    logInDate: '',
                    logInTime: ''
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
                                conclusionItems: data.conclusionItems,
                                conclusionNumber: data.conclusionNumber,
                                billNumber: data.billNumber,
                                currentYear: data.currentYear,
                                isInUse: data.isInUse,
                                isDisabled: data.isDisabled,
                                creationDate: data.creationDate,
                                logInDate: data.logInDate,
                                logInTime: data.logInTime,
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
                                conclusionItems: data.conclusionItems,
                                conclusionNumber: data.conclusionNumber,
                                billNumber: data.billNumber,
                                currentYear: data.currentYear,
                                isInUse: data.isInUse,
                                isDisabled: data.isDisabled,
                                creationDate: data.creationDate,
                                logInDate: data.logInDate,
                                logInTime: data.logInTime,
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
                    router.push({ name: 'PayDeskDashboard'})
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
            bill.isCancelled = false
            this.createBill(bill)
        },
        async updateBill(bill: Bill){
            bill.isCancelled = true   
            this.createBill(bill)     
        },
        async createBill(bill: Bill){
            try {
                this.isLoading = true
                bill.Date = new Date().toLocaleDateString()
                bill.Time = new Date().toLocaleTimeString()
                bill.JIR = generateJIR()
                bill.ZKI = generateZKI()
                const addRef = doc(collection(db, billsCollection))
                bill.id = addRef.id

                await setDoc(addRef, bill as Bill)
                console.log("bill added")
                toast.success("Račun zapisan")
                const paydesk = this.payDesks.find(it => it.name === bill.paydeskName)

                if(paydesk){
                    bill.billItems.forEach(billItem => {
                        const index = paydesk.conclusionItems.findIndex(it => it.productName === billItem.productName)
                        if(index !== -1){
                            paydesk.conclusionItems[index].quantity += billItem.quantity
                        }else{
                            paydesk.conclusionItems.push({
                                id: generateId(),
                                productName: billItem.productName,
                                quantity: billItem.quantity,
                                price: billItem.price,
                                taxRate: '25%'
                            }as ConclusionItem)
                        }
                        
                    })
                    await this.updateBillNumberTotalCashAndBillList(paydesk, bill.totalCash)
                }else{
                    console.error('paydesk dont exist')
                }
              } catch (e) {
                console.error("paydesk bill: ", e)
                toast.error('Podreška prilikom zapisa računa')
              }finally{
                this.isLoading = false
              }
        },
        async fetchBillsByDateAndUser(date :string, user: string) {
            this.isLoading = true
            const q = query(
              collection(db, 'bills'),
              where('Date', '==', date),
              where('user', '==', user)
            );
      
            try {
              const querySnapshot = await getDocs(q);
              this.bills = querySnapshot.docs.map(doc => ({
                id: doc.id,
                number: doc.data().number,
                tableId: doc.data().tableId,
                Date: doc.data().Date,
                Time: doc.data().Time,
                billItems: doc.data().billItems,
                totalCash: doc.data().totalCash,
                JIR: doc.data().JIR,
                ZKI: doc.data().ZKI,
                paydeskName: doc.data().paydeskName,
                user: doc.data().user,
                isCancelled: doc.data().isCancelled,
                byOrderId: doc.data().byOrderId,
                uid: doc.data().uid
              } as Bill))
            } catch (error) {
              console.error('Error getting documents: ', error)
              throw new Error('Error getting documents')
            }finally{
                this.isLoading = false
            }
        },
        async conclusion(paydesk: PayDesk, user: User){
            try {
                this.isLoading = true
                const conclusion = {
                    id: '',
                    number: paydesk.conclusionNumber,
                    userName: user.firstName + ' ' + user.lastName,
                    paydeskName: paydesk.name,
                    date: new Date().toLocaleDateString('sv-SE'),
                    time: new Date().toLocaleTimeString(),
                    timestamp: serverTimestamp(),
                    conclusionItems: paydesk.conclusionItems,
                    totalCash: paydesk.totalCash
                }as Conclusion
                
                const addRef = doc(collection(db, conclusionsCollection))
                conclusion.id = addRef.id

                await setDoc(addRef, conclusion as Conclusion)
                toast.success("Zaključak zapisan")
                await this.resetTotalCashAndConclusionItems(paydesk)
              } catch (e) {
                console.error("conclusion: ", e)
                toast.error('Podreška prilikom zapisa zaključka')
              }finally{
                this.isLoading = false
              }
        },
        async resetTotalCashAndConclusionItems(paydesk: PayDesk){
            try {
                const updateRef = doc(db, payDeskCollection, paydesk.id)
                await updateDoc(updateRef, {
                    conclusionNumber: paydesk.conclusionNumber += 1,
                    totalCash: 0,
                    conclusionItems: []
                })
            } catch (e) {
                console.error("reset total cash and conclusion items: ", e)
                toast.error('Pogreška prilikom resetiranja stanja blagajne i stavki zaključka')
            }
        },
        async fetchConclusions(startDate :string, endDate: string) {
            this.isLoading = true
            const q = query(
              collection(db, conclusionsCollection),
              where('date', '>=', startDate),
              where('date', '<=', endDate)
            )
      
            try {
              const querySnapshot = await getDocs(q)
              this.conclusions = querySnapshot.docs.map(doc => ({
                    id: doc.data().id,
                    number: doc.data().number,
                    userName: doc.data().userName,
                    paydeskName: doc.data().paydeskName,
                    date: doc.data().date,
                    time: doc.data().time,
                    timestamp: doc.data().timestamp,
                    conclusionItems: doc.data().conclusionItems,
                    totalCash: doc.data().totalCash
              } as Conclusion))
            } catch (error) {
              console.error('Error getting conclusions: ', error)
              toast.error('Pogreška prilikom dohvaćanja zaključaka')
              throw new Error('Error getting conclusions')
            }finally{
                this.isLoading = false
            }
        },
        


    }
})