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

const toast = useToast()

export const useUserStore = defineStore('userStore',{
    state: () => ({
        user: null as User | null,
        notLoggedInVisibility: false,
        loggedInVisibility: false,
        isLoading: false,
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
        }
    },
    
})




