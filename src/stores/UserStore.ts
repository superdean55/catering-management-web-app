import { defineStore } from "pinia"
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth"
import router from "@/router"
import { doc, setDoc, collection, query, where, onSnapshot, updateDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { storage } from "@/firebase/firebaseConfig"
import { db } from "@/firebase/firebaseConfig"
import type { User } from "@/types/User"
import { generateImageName } from "@/helpers/generateImageName"
import { Role } from "@/types/Role"
import { storageDateToInputString } from "@/helpers/dateFormatterFun"
import { useToast } from 'vue-toastification'
import { imageUrlToBlob } from "@/helpers/imageUrlToBlob"
import type { Order } from "@/types/Order"
import type { Bill } from "@/types/Bill"

const toast = useToast()
const orderCollection = 'orders'
const billCollection = 'bills'

export const useUserStore = defineStore('userStore',{
    state: () => ({
        user: null as User | null,
        users: [] as User [],
        notLoggedInVisibility: false,
        loggedInVisibility: false,
        isLoading: false,
        orders: [] as Order [],
        bills: [] as Bill []
    }),
    actions: {
        async signUp(email: string, password: string) {
          this.isLoading = true
          const auth = getAuth()
          try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            let email_ = ''
            if (userCredential.user.email) {
              email_ = userCredential.user.email
            }
            await this.updateUserData(userCredential.user.uid, email_)
            router.push({ name: 'UserAccount' })
            toast.success('Uspješno ste kreirali račun')
          } catch (error) {
            toast.error('Neuspješno kreiranje računa')
            console.log('sign up', error)
          } finally {
            this.isLoading = false
          }
        },

        async signIn(email: string, password: string){
          this.isLoading = true
          const auth = getAuth();
          console.log(`auth: ${auth}`)
          try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            router.push({ name: 'HomeView' })
          } catch (error) {
            console.error('singIn error', error)
            toast.error('Neuspješna prijava')
          } finally {
            this.isLoading = false
          }
        },

        async signOut(){
          const auth = getAuth()
          signOut(auth).then(() => {
          }).catch((error) => {
            console.error("sign out error", error)
          })
          router.push({ name: 'HomeView'})
        },

        async authState(){
          const auth = getAuth()
          onAuthStateChanged(auth, (user) => {
            if (user) {
              this.getUserData(user.uid)
              this.notLoggedInVisibility = false
              this.loggedInVisibility = true
              console.log(auth.currentUser)
              console.log(`onAuthState: user is logged in: ${user.email}`)
              console.log(`onAuthState: auth: ${auth.currentUser?.email}`)
              
            } else {
              this.user = null
              this.notLoggedInVisibility = true
              this.loggedInVisibility = false
              console.log(`onAuthState: user is not logged in`)
            }
          })
          
        },

        async updateUserData(uid: string, email: string){
          try {
              const docRef = await setDoc(doc(db, "users", uid), {
                uid: uid,
                email: email,
                firstName: '',
                lastName: '',
                imageUrl: '',
                imageName: '',
                born: '',
                phoneNumber: '',
                role: Role.user
              } as User)
          } catch (error) {
            toast.error('Neuspješno kreiranje podataka korisnika')
            console.error("Adding user data error: ", error)
          }
        },
        async updateUser(user: User, imageUrl: string | null){
          this.isLoading = true
          try {
            console.log(`image name: ${user.imageName}\nimage url= ${imageUrl}`)
              if(imageUrl){
                user = await this.updateUserImage(user, imageUrl)
              }
              const updateRef = doc(db, 'users', user.uid)
              await updateDoc(updateRef, {
                  firstName: user.firstName,
                  lastName: user.lastName,
                  imageName: user.imageName,
                  imageUrl: user.imageUrl,
                  born: user.born,
                  phoneNumber: user.phoneNumber
              })
              console.log('updating user success') 
              toast.success('Korisnik ažuriran')
              router.push({name: 'UserAccount'})
          } catch (e) {
            console.error("user update error: ", e)
            toast.error('Neuspješno ažuriranje korisnika')
          }
          this.isLoading = false
        },
        async updateUserImage(user: User, imageUrl: string): Promise<User>{
          try{
            const oldImageName: string = user.imageName
            user.imageName = generateImageName('user')
            const blob = await imageUrlToBlob(imageUrl)
            const url = await this.addImage(blob, user.imageName)
            user.imageUrl = url
            if(oldImageName !== ''){
              await this.deleteImage(oldImageName)
            }
            return user
          }catch(error){
            console.error('user image update error', error)
            toast.error('Greška prilikom ažuriranja slike')
            throw error
          }
        },
        async addImage(imageBlob: Blob, imageName: string){
          try {
              const storageRef = ref(storage, 'users-images/' + imageName)
              const snapshot = await uploadBytes(storageRef, imageBlob)
              const url = await getDownloadURL(snapshot.ref)
              return url
          } catch (error) {
              console.error('Došlo je do greške prilikom spremanja ili dobivanja URL-a slike:', error)
              toast.error('Došlo je do greške prilikom spremanja ili dobivanja URL-a slike:')
              return ''
          }           
        },
        async deleteImage(imageName: string){
          try{
              if(imageName.length){
                  const deleteRef = ref(storage, 'users-images/' + imageName)
                  await deleteObject(deleteRef) 
                  console.log('old user image deleting success')  
                }
          } catch(e){
              console.error('old user image deleting error', e)
              toast.error('Brisanje stare slike korisnika nije uspjelo')  
          }
        },
        async getUserData(uid: string){

          const q = query(collection(db, "users"), where("uid", "==", uid))
          const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
              if (change.type === "added") {
                  console.log('added:')
                  const data = change.doc.data()
                  
                  this.user = {
                    uid: data.uid,
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    imageUrl: data.imageUrl,
                    imageName: data.imageName,
                    born: storageDateToInputString(data.born as string),
                    phoneNumber: data.phoneNumber,
                    role: data.role
                  }
              }
              if (change.type === "modified") {
                  console.log("modified:");
                  const data = change.doc.data()
                  this.user = {
                    uid: data.uid,
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    imageUrl: data.imageUrl,
                    imageName: data.imageName,
                    born: storageDateToInputString(data.born as string),
                    phoneNumber: data.phoneNumber,
                    role: data.role
                  }
              }
              if (change.type === "removed") {
                  console.log("removed: ", change.doc.data());
              }
            });
          });
        },
        getUsers(){
          const collectionRef = collection(db, "users");
          const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
              const data = change.doc.data()
                
              if (change.type === "added") {
                  const data = change.doc.data()
                  const user = this.users.find(it => it.uid === data.uid)
                  if(!user){
                    this.users.push({
                      uid: data.uid,
                      email: data.email,
                      firstName: data.firstName,
                      lastName: data.lastName,
                      imageUrl: data.imageUrl,
                      imageName: data.imageName,
                      born: storageDateToInputString(data.born as string),
                      phoneNumber: data.phoneNumber,
                      role: data.role
                    })
                  }
              }
              if (change.type === "modified") {
                  const data = change.doc.data()
                  const index = this.users.findIndex(it => it.uid === data.uid)
                  if (index !== -1) {
                    this.users[index] = {
                      uid: data.uid,
                      email: data.email,
                      firstName: data.firstName,
                      lastName: data.lastName,
                      imageUrl: data.imageUrl,
                      imageName: data.imageName,
                      born: storageDateToInputString(data.born as string),
                      phoneNumber: data.phoneNumber,
                      role: data.role
                    }
                  }
              }
              if (change.type === "removed") {
                  const index = this.users.findIndex(it => it.uid === data.uid);
                  if (index !== -1) {
                      this.users.splice(index, 1);
                  }
              }
            })
          })
        },
        getUserById(uid: string){
          console.log('userId = ', uid)
          console.log('find user', this.users.find(it => it.uid === uid) || null)
          console.log('users', this.users)
          return this.users.find(it => it.uid === uid) || null
        },
        async createEmployee(user: User, password: string, imageUrl: string | null){
          if(this.user?.role !== Role.admin){
            return
          }
          this.isLoading = true
          try {
            const auth = getAuth()
            const userCredential = await createUserWithEmailAndPassword(auth, user.email, password);
            const uid = userCredential.user.uid
            const email = userCredential.user.email
            if(imageUrl){
              user = await this.updateUserImage(user, imageUrl)
            }
            await setDoc(doc(db, "users", uid), {
              uid: uid,
              email: email,
              firstName: user.firstName,
              lastName: user.lastName,
              imageUrl: user.imageUrl,
              imageName: user.imageName,
              born: user.born,
              phoneNumber: user.phoneNumber,
              role: user.role
            })
    
            console.log("Employee created")
            toast.success('Zaposlenik kreiran')
          } catch (error) {
            console.error("Greška prilikom kreiranja korisnika:", error)
            toast.error('Greška prilikom kreiranja zaposlenika')
          }
          finally{
            this.isLoading = false
          }
        },
        async updateEmployee(user: User, role: Role){
          if(this.user?.role !== Role.admin){
            return
          }
          this.isLoading = true
          try {
              const updateRef = doc(db, 'users', user.uid)
              await updateDoc(updateRef, {
                  role: role
              })
              console.log('updating role success') 
              toast.success('Uloga ažurirana')
          } catch (e) {
            console.error("role update error: ", e)
            toast.error('Neuspješno ažuriranje uloge')
          }
          this.isLoading = false
        },
        async fetchUserOrders(){
          const collectionRef = collection(db, orderCollection)
          const q = query(collectionRef, where('uid' ,'==', this.user?.uid ))

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
      async fetchUserBills(){
        const collectionRef = collection(db, billCollection)
        const q = query(collectionRef, where('uid' ,'==', this.user?.uid ))

        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const data = change.doc.data()
                    const bill = this.bills.find(it => it.id === data.id)
                    if(!bill){
                      this.bills.push({
                        id: data.id,
                        number: data.number,
                        tableId: data.tableId,
                        Date: data.Date,
                        Time: data.Time,
                        billItems: data.billItems,
                        totalCash: data.totalCash,
                        JIR: data.JIR,
                        ZKI: data.ZKI,
                        paydeskName: data.paydeskName,
                        user: data.user,
                        isCancelled: data.isCancelled,
                        byOrderId: data.byOrderId,
                        uid: data.uid
                      }as Bill)
                    }
                }
                if (change.type === "modified") {
                    const data = change.doc.data()
                    const index = this.bills.findIndex(it => it.id === data.id)
                    if (index !== -1) {
                        this.bills[index] = {
                            id: data.id,
                            number: data.number,
                            tableId: data.tableId,
                            Date: data.Date,
                            Time: data.Time,
                            billItems: data.billItems,
                            totalCash: data.totalCash,
                            JIR: data.JIR,
                            ZKI: data.ZKI,
                            paydeskName: data.paydeskName,
                            user: data.user,
                            isCancelled: data.isCancelled,
                            byOrderId: data.byOrderId,
                            uid: data.uid
                          }as Bill
                    }
                }
                if (change.type === "removed") {
                    const data = change.doc.data()
                    const index = this.bills.findIndex(it => it.id === data.id)
                    if (index !== -1) {
                        this.bills.splice(index, 1)
                    }
                }
            })
        })
    },
    },
    
})




