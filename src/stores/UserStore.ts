import { defineStore } from "pinia"
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth"
import router from "@/router"
import { doc, setDoc, collection, query, where, onSnapshot } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { storage } from "@/firebase/firebaseConfig"
import { db } from "@/firebase/firebaseConfig"
import type { UserData } from "@/types/UserData"



export const useUserStore = defineStore('userStore',{
    state: () => ({
        user: null as UserData | null,
        notLoggedInVisibility: false,
        loggedInVisibility: false
    }),
    actions: {
        async signUp(email: string, password: string) {
            const auth = getAuth()
            createUserWithEmailAndPassword(auth, email, password)
              .then((userCredential) => {
                // Signed up 
                this.updateUserData({
                  uid: userCredential.user.uid,
                  email: userCredential.user.email,
                  firstName: '',
                  lastName: '',
                  imageUrl: '',
                  imageName: '',
                  born: '',
                  phoneNumber: '',
                })
                router.push({ name: 'HomeView' }) 
                // ...
              })
              .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode)
                console.log(errorMessage)
                // ..
              })
        },

        async signIn(email: string, password: string){
          const auth = getAuth();
          console.log(`auth: ${auth}`)
          signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              const user = userCredential.user;
              console.log(userCredential.user)
              router.push({ name: 'HomeView' }) 
              
              // ...
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log(errorCode)
              console.log(errorMessage)
            });
        },

        async signOut(){
          const auth = getAuth()
          signOut(auth).then(() => {
          }).catch((error) => {
            console.log("sign out error")
          });
          router.push({ name: 'HomeView'})
        },

        async authState(){
            const auth = getAuth();
          onAuthStateChanged(auth, (user) => {
            if (user) {
              this.getUserData(user.uid)
              this.notLoggedInVisibility = false
              this.loggedInVisibility = true
              console.log(auth.currentUser)
              console.log(`onAuthState: user is logged in: ${user.email}`)
              console.log(`onAuthState: auth: ${auth.currentUser?.email}`)
              
            } else {
              this.user = {
                uid: null,
                email: null,
                firstName: null,
                lastName: null,
                imageUrl: null,
                imageName: null,
                born: null,
                phoneNumber: null,
              }
              this.notLoggedInVisibility = true
              this.loggedInVisibility = false
              console.log(`onAuthState: user is not logged in`)
              console.log(`user state: ${this.user.email} : ${this.user.uid}`)
            }
          });
          
        },

        async updateUserData(
          user: UserData
        ){
          try {
            if(user.uid){
              const docRef = await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                born: user.born,
                imageName: user.imageName,
                imageUrl: user.imageUrl
              });
              router.push({ name: 'UserAccount'})
            }
            console.log("Document written with ID: ", );
          } catch (e) {
            console.error("Error adding document: ", e);
          }
          
         },

        async uploadUserImage(imageUrl: string, user: UserData){
          const fileName = this.generateImageName()
          const storageRef = ref(storage, 'users-images/' + fileName);
            const img = new Image();

            img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            var MAX_WIDTH = 200;
            var MAX_HEIGHT = 200;
            var width = img.width;
            var height = img.height;
        
            if (width > height) {

                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }

            } else {

                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }
            canvas.width = width;
            canvas.height = height;
        
            ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(blob => {
              if (blob) {
                uploadBytes(storageRef, blob).then((snapshot) => {
                  getDownloadURL(snapshot.ref).then((url) => {
                    if(this.user){
                      this.deleteUserImage(this.user.imageName)
                      user.imageUrl = url
                      user.imageName = fileName
                      user.uid = this.user.uid
                      this.updateUserData(user)
                    }
                  }).catch((error) => {
                    console.error('Došlo je do greške prilikom dobivanja URL-a slike:', error);
                  });
                  
                }).catch(error => {
                  console.error('Došlo je do pogreške prilikom spremanja slike:', error);
                });
              }
            }, 'image/jpeg');
            
            };
          
            img.src = imageUrl;
        },

        async deleteUserImage(imageName: string | null){
          console.log('inside delete image func')
          if(imageName && imageName !== ''){
            console.log('deleting image condition is true')
            const desertRef = ref(storage, 'users-images/' + imageName);

            deleteObject(desertRef).then(() => {
              console.log(`deleting user image success`)
            }).catch((error) => {
              console.log(`deleting user image error: ${error.message}`)
            });
          }
        },

        async getUserData(uid: string){

          const q = query(collection(db, "users"), where("uid", "==", uid));
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
                    born: data.born,
                    phoneNumber: data.phoneNumber,
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
                    born: data.born,
                    phoneNumber: data.phoneNumber,
                  }
              }
              if (change.type === "removed") {
                  console.log("removed: ", change.doc.data());
              }
            });
          });
        },
        generateImageName(): string {
          const randomNumber = Math.floor(Math.random() * 1000000);
          const now = new Date();
          const timestamp = now.getTime();
          
          const uniqueName = `image_${timestamp}_${randomNumber}.jpg`;
          return uniqueName;
        }
    },
    
})




