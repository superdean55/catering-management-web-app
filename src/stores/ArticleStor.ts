import { imageUrlToBlob } from "@/helpers/imageUrlToBlob";
import type { Category } from "@/types/Category";
import { defineStore } from "pinia";
import { storage } from "@/firebase/firebaseConfig";
import { db } from "@/firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { generateImageName } from "@/helpers/generateImageName";
import { collection, doc, setDoc, onSnapshot } from "firebase/firestore";
import { CategoryLevel } from "@/types/CategoryLevel";

export const useArticleStore = defineStore('articleStore',{
    state: () => ({
        categorys:[] as Category[],
    }),
    getters: {
        levelZeroCategories: (state) => {
            const categoryZero =  state.categorys.filter(category => category.level === CategoryLevel.levelZero);
            console.log(categoryZero)
            return categoryZero
          },
        levelOneCategories: (state) => state.categorys.filter(category => category.level === CategoryLevel.levelOne),
        levelTwoCategories: (state) => state.categorys.filter(category => category.level === CategoryLevel.levelTwo),
        levelThreeCategories: (state) => state.categorys.filter(category => category.level === CategoryLevel.levelThree),
        levelFourCategories: (state) => state.categorys.filter(category => category.level === CategoryLevel.levelFour),
    },
    actions:{
        getCategoryById(id: string) {
            return this.categorys.find(category => category.id === id)
        },
        async addCategory(imageUrl:string, categoryName: string, categoryLevel: string){
            try {
                const imageBlob = await imageUrlToBlob(imageUrl)
                console.log('Image Blob:', imageBlob);
                if(imageBlob.size > 0){
                    this.addImageAndData('category-images', imageBlob, '', categoryName, categoryLevel)
                }
            } catch (error) {
                console.error('Error:', error);
            }
        },
        async addImageAndData(storageName: string, blob: Blob, oldImageName: string, categoryName: string, level: string){
            const imageName = generateImageName(storageName);
            const storageRef = ref(storage, storageName + '/' + imageName);
            uploadBytes(storageRef, blob).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((url) => {
                    this.deleteImage(storageName, oldImageName)
                    this.addData('categorys', categoryName, imageName, level, url)
                }).catch((error) => {
                  console.error('Došlo je do greške prilikom dobivanja URL-a slike:', error);
                });
                
              }).catch(error => {
                console.error('Došlo je do pogreške prilikom spremanja slike:', error);
              });
        },
        async deleteImage(storageName: string, oldImageName: string){
          if(oldImageName.length){
            const deleteRef = ref(storage, storageName + '/' + oldImageName);
            deleteObject(deleteRef).then(() => {
              console.log(`deleting success ${storageName}/${oldImageName}`)
            }).catch((error) => {
              console.log(`deleting ${storageName}/${oldImageName} error: ${error.message}`)
            });
          }
        },
        async addData(dbName: string, categoryName: string, imageName: string, level: string, imageUrl : string){
            try {
                const addRef = doc(collection(db, dbName))
                const id = addRef.id
                await setDoc(addRef, {
                    id: id,
                    name: categoryName,
                    level: level,
                    imageName: imageName,
                    imageUrl: imageUrl
                } as Category );
                console.log("Document written with ID: ", );
              } catch (e) {
                console.error("Error adding document: ", e);
              }
        },
        async getCategorys(){
            const collectionRef = collection(db, "categorys");

            const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        const data = change.doc.data()
                        
                        this.categorys.push({
                            id: data.id,
                            name: data.name,
                            level: data.level,
                            imageName: data.imageName,
                            imageUrl: data.imageUrl
                        })
                        console.log("add: ", change.doc.data());
                    }
                    if (change.type === "modified") {
                        console.log("modified: ", change.doc.data());
                    }
                    if (change.type === "removed") {
                        console.log("removed: ", change.doc.data());
                    }
                });
            });
        }
    }
})