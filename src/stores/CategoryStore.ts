import type { Category } from "@/types/Category"
import { doc, collection, setDoc, onSnapshot, updateDoc, deleteDoc, serverTimestamp, query, orderBy} from "firebase/firestore"
import { defineStore } from "pinia"
import { db } from "@/firebase/firebaseConfig"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { storage } from "@/firebase/firebaseConfig"
import { imageUrlToBlob } from "@/helpers/imageUrlToBlob"
import { generateImageName } from "@/helpers/generateImageName"
import router from "@/router"
import { useToast } from 'vue-toastification'

const toast = useToast()


export const useCategoryStore = defineStore('categoryStore',{
    state: () => ({
        categorys:[] as Category[]
    }),
    actions: {
        getCategoryById(id: string) {
            return this.categorys.find(category => category.id === id)
        },
        async addCategory(category: Category, imageUrl: string){
            try {
                    category.imageName = generateImageName('category')
                    const blob = await imageUrlToBlob(imageUrl)
                    category.imageUrl = await this.addImage(blob, category.imageName)
                    category.creationDate = new Date().toLocaleString()
                    category.timestamp = serverTimestamp()

                    const addRef = doc(collection(db, 'categorys'))
                    category.id = addRef.id
                    await setDoc(addRef, category as Category)
                    router.push({ name: 'Categorys'})
                    console.log("Category added")
                    toast.success("Kategorija dodana")
                } catch (error) {
                    console.error('Adding category error:', error)
                    toast.error('Dodavanje kategorije nije uspjelo')
                }
        },
        async updateCategory(category: Category, imageUrl: string | null, oldCategory: Category){
            try {
                category.imageName = oldCategory.imageName
                category.imageUrl = oldCategory.imageUrl
                if(imageUrl){
                    category.imageName = generateImageName('category')
                    const blob = await imageUrlToBlob(imageUrl)
                    const url = await this.addImage(blob, category.imageName)
                    category.imageUrl = url
                    await this.deleteImage(oldCategory.imageName)
                }
                
                const updateRef = doc(db, 'categorys', oldCategory.id)
                await updateDoc(updateRef, {
                    name: category.name,
                    imageName: category.imageName,
                    imageUrl: category.imageUrl,
                    timestamp: serverTimestamp(),
                    items: category.items
                }); 
                console.log('updating old data') 
                toast.success('Kategorija ažurirana')
                router.push({name: 'Categorys'})
            } catch (e) {
            console.error("Error Update category: ", e)
            toast.error('Neuspješno ažuriranje Kategorije')
          }
        },
        async addImage(imageBlob: Blob, imageName: string){
            try {
                const storageRef = ref(storage, 'categorys/' + imageName)
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
                    const deleteRef = ref(storage, 'categorys/' + imageName)
                    await deleteObject(deleteRef) 
                    console.log('category image deleting success')  
                  }
            } catch(e){
                console.error('category image deleting error', e)
                toast.error('Brisanje slike kategorije nije uspjelo')  
            }
        },
        async getCategorys(){
            const collectionRef = collection(db, "categorys");

            const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        const data = change.doc.data()
                        const category = this.categorys.find(it => it.id === data.id)
                        if(!category){
                            this.categorys.push({
                                id: data.id,
                                name: data.name,
                                imageName: data.imageName,
                                imageUrl: data.imageUrl,
                                creationDate: data.creationDate,
                                timestamp: data.timestamp,
                                items: data.items
                            })
                        }
                        //console.log("add: ", change.doc.data())
                    }
                    if (change.type === "modified") {
                        //console.log("modified: ", change.doc.data())
                        const data = change.doc.data()
                        const index = this.categorys.findIndex(it => it.id === data.id)
                        if (index !== -1) {
                            this.categorys[index] = {
                                id: data.id,
                                name: data.name,
                                imageName: data.imageName,
                                imageUrl: data.imageUrl,
                                creationDate: data.creationDate,
                                timestamp: data.timestamp,
                                items: data.items
                            }
                        }
                    }
                    if (change.type === "removed") {
                        //console.log("removed: ", change.doc.data());
                        const data = change.doc.data()
                        const index = this.categorys.findIndex(it => it.id === data.id);
                        if (index !== -1) {
                            this.categorys.splice(index, 1);
                        }
                    }
                });
            });
        },
        async deleteCategory(categoryId: string){
            const oldCategory = this.categorys.find(it => it.id === categoryId)
            if(oldCategory){
                try{
                    await this.deleteImage(oldCategory.imageName)
                    await deleteDoc(doc(db, "categorys", categoryId))
                    toast.success('Kategorija uspješno obrisana')
                } catch (e) {
                    console.log("Deleting Category error: " + e)
                    toast.error('Brisanje Kategorije nije uspjelo')
                }
            }
            router.push({ name: 'Categorys'})
        },
    }
})