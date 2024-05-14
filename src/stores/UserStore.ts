import { defineStore } from "pinia";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import router from "@/router";


export const useUserStore = defineStore('userStore',{
    state: () => ({
        user: {
            email: null as string | null,
            uid: null as string | null
        },
        notLoggedInVisibility: false,
        loggedInVisibility: false
    }),
    actions: {
        async signUp(email: string, password: string) {
            const auth = getAuth();
            createUserWithEmailAndPassword(auth, email, password)
              .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                console.log(user)
                router.push({ name: 'HomeView' }) 
                // ...
              })
              .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode)
                console.log(errorMessage)
                // ..
              });
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
        },

        async authState(){
            const auth = getAuth();
          onAuthStateChanged(auth, (user) => {
            if (user) {
              this.user = {email: user.email, uid: user.uid}
              this.notLoggedInVisibility = false
              this.loggedInVisibility = true
              console.log(auth.currentUser)
              console.log(`onAuthState: user is logged in: ${user.email}`)
              console.log(`onAuthState: auth: ${auth.currentUser?.email}`)
              console.log(`user state: ${this.user.email}\n${this.user.uid}`)
            } else {
              this.user = {email: null, uid: null}
              this.notLoggedInVisibility = true
              this.loggedInVisibility = false
              console.log(`onAuthState: user is not logged in`)
              console.log(`user state: ${this.user.email} : ${this.user.uid}`)
            }
          });
          
        }
    }
})

interface User{
  email: string | null,
  uid: string | null
}


