import { imageUrlToBlob } from "@/helpers/imageUrlToBlob";
import type { Category } from "@/types/Category";
import { defineStore } from "pinia";
import { storage } from "@/firebase/firebaseConfig";
import { db } from "@/firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { generateImageName } from "@/helpers/generateImageName";
import { collection, doc, setDoc, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import { CategoryLevel } from "@/types/CategoryLevel";
import router from "@/router";
import type { RawMaterial } from "@/types/RawMaterial";

export const useArticleStore = defineStore('articleStore',{
    state: () => ({
        categorys:[] as Category[],
        rawMaterials:[] as RawMaterial[]
    }),
    getters: {
        levelZeroCategories: (state) => state.categorys.filter(category => category.level === CategoryLevel.levelZero),
        levelOneCategories: (state) => state.categorys.filter(category => category.level === CategoryLevel.levelOne),
        levelTwoCategories: (state) => state.categorys.filter(category => category.level === CategoryLevel.levelTwo),
        levelThreeCategories: (state) => state.categorys.filter(category => category.level === CategoryLevel.levelThree),
        levelFourCategories: (state) => state.categorys.filter(category => category.level === CategoryLevel.levelFour),
        firstCategoryId: (state) => {
            if (state.categorys.length > 0) {
              return state.categorys[0].id;
            }
            return '';
          }
    },
    actions:{
        getCategoryById(id: string) {
            return this.categorys.find(category => category.id === id)
        },
        async manageCategory(imageUrl:string | null, categoryName: string, categoryLevel: string, oldCategoryData: Category){
            try {
                if(imageUrl){
                    console.log(`TEST: image exists:`)
                    const imageBlob = await imageUrlToBlob(imageUrl)
                    console.log('Image Blob:', imageBlob);
                    if(imageBlob.size > 0){
                        this.addImageAndData('category-images', imageBlob, categoryName, categoryLevel, oldCategoryData)
                    }
                }else{
                    if(oldCategoryData){
                        console.log(`TEST: no image:`)
                        this.updateData(oldCategoryData.id, categoryName, categoryLevel, oldCategoryData.imageName, oldCategoryData.imageUrl)
                    }
                }
            } catch (error) {
                console.error('Error:', error);
            }
        },
        async addImageAndData(storageName: string, blob: Blob, categoryName: string, level: string, oldCategoryData: Category){
            const imageName = generateImageName(storageName);
            const storageRef = ref(storage, storageName + '/' + imageName);
            uploadBytes(storageRef, blob).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((url) => {
                    if(oldCategoryData){
                        console.log('Old data exists:')
                        this.deleteImage(storageName, oldCategoryData.imageName)
                        this.updateData(oldCategoryData.id, categoryName, level, imageName, url)
                    }else{
                        console.log('Old data dont exists:')
                        this.addData('categorys', categoryName, imageName, level, url)
                    }
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
                console.log("Adding new data ID: ", );
              } catch (e) {
                console.error("Error adding document: ", e);
              }
        },
        async updateData(categoryId: string, categoryName: string, level: string, imageName: string, imageUrl: string){
            try {
                const updateRef = doc(db, 'categorys', categoryId);
                await updateDoc(updateRef, {
                    name: categoryName,
                    level: level,
                    imageName: imageName,
                    imageUrl: imageUrl
                });  
                console.log('updating old data') 
            } catch (e) {
            console.error("Error Update category: ", e);
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
                                level: data.level,
                                imageName: data.imageName,
                                imageUrl: data.imageUrl
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
                                level: data.level,
                                imageName: data.imageName,
                                imageUrl: data.imageUrl
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
                    this.deleteImage('category-images', oldCategory.imageName)
                    await deleteDoc(doc(db, "categorys", categoryId))
                } catch (e) {
                    console.log("Deleting Category error: " + e)
                }
            }
            router.push({ name: 'AddCategory'})
        },
        manageRawMaterial(name: string, unit: string, code: string, oldRawMaterial: RawMaterial | undefined){
            if(oldRawMaterial){
                this.updateRawMaterial(name, unit, code, oldRawMaterial)
            }else{
                this.addRawMaterial(name, unit, code)
            }
        },
        async addRawMaterial(name: string, unit: string, code: string){
            try {
                const addRef = doc(collection(db, 'raw-materials'))
                const id = addRef.id
                await setDoc(addRef, {
                    id: id,
                    name: name,
                    unit: unit,
                    code: code,
                    quantity: 0
                } as RawMaterial )
                console.log('raw material added')
              } catch (e) {
                console.error("adding raw material error ", e);
              }
        },
        async updateRawMaterial(name: string, unit: string, code: string, oldRawMaterial: RawMaterial){
            try {
                const updateRef = doc(db, 'raw-materials', oldRawMaterial.id);
                await updateDoc(updateRef, {
                    name: name,
                    unit: unit,
                    code: code,
                    quantity: oldRawMaterial.quantity
                });  
                console.log('raw material updated') 
            } catch (e) {
            console.error("updating raw material error", e);
          }
        },
        async getRawMaterials(){
            const collectionRef = collection(db, 'raw-materials');

            const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        const data = change.doc.data()
                        const rawMaterial = this.rawMaterials.find(it => it.id === data.id)
                        if(!rawMaterial){
                            this.rawMaterials.push({
                                id: data.id,
                                name: data.name,
                                unit: data.unit,
                                code: data.code,
                                quantity: data.quantity
                            }as RawMaterial)
                        }
                        console.log("raw add: ", change.doc.data())
                    }
                    if (change.type === "modified") {
                        console.log("raw modified: ", change.doc.data())
                        const data = change.doc.data()
                        const index = this.rawMaterials.findIndex(it => it.id === data.id)
                        if (index !== -1) {
                            this.rawMaterials[index] = {
                                id: data.id,
                                name: data.name,
                                unit: data.unit,
                                code: data.code,
                                quantity: data.quantity
                            }as RawMaterial
                        }
                    }
                    if (change.type === "removed") {
                        console.log("raw removed: ", change.doc.data());
                        const data = change.doc.data()
                        const index = this.rawMaterials.findIndex(it => it.id === data.id);
                        if (index !== -1) {
                            this.rawMaterials.splice(index, 1);
                        }
                    }
                });
            });
        },
        getRawMaterialById(id: string) {
            return this.rawMaterials.find(it => it.id === id) || null
        },
        async deleteRawMaterial(id: string){
            const rawMaterial = this.rawMaterials.find(it => it.id === id)
            if(rawMaterial){
                try{
                    await deleteDoc(doc(db, "raw-materials", id))
                } catch (e) {
                    console.log("Deleting raw material error: " + e)
                }
            }
            router.push({ name: 'AddRawMaterial'})
        },
    }
})