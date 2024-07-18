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

const toast = useToast()
const payDeskCollection = 'payDesks'

export const usePayDeskStore = defineStore('payDeskStore',{
    state: () => ({
        payDeskInUse: null as PayDesk | null,
        payDesks:[] as PayDesk[]
    }),
    actions: {
        async addPayDesk(paydesk: PayDesk){
            try {
                console.log('in tay bloku paydesk')
                paydesk.timestamp = serverTimestamp()
                paydesk.creatinoDate = new Date().toLocaleString()
                const addRef = doc(collection(db, payDeskCollection))
                paydesk.id = addRef.id
                await setDoc(addRef, paydesk as PayDesk)
                router.push({ name: 'PayDeskList'})
                console.log("PayDesk added")
                toast.success("Blagajna kreirana")
              } catch (e) {
                console.error("adding paydesk: ", e)
                toast.error('Podreška prilikom kreiranja blagajne')
              }
        },
        async loginToPayDesk(userId: string, paydeskId: string){
            try {
                const updateRef = doc(db, payDeskCollection, paydeskId)
                
                await updateDoc(updateRef, {
                    user: userId,
                    isInUse: true
                })
                toast.success("Uspješna prijava")
            } catch (e) {
                console.error("paydesk login: ", e)
                toast.error('Podreška prilikom prijave')
            }
        },
        async logOutToPayDesk(userId: string, paydeskId: string){
            try {
                const updateRef = doc(db, payDeskCollection, paydeskId)
                
                await updateDoc(updateRef, {
                    user: '',
                    isInUse: false
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
                                isInUse: data.isInUse,
                                creatinoDate: data.creationDate,
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
                                isInUse: data.isInUse,
                                creatinoDate: data.creationDate,
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
        }

    }
})