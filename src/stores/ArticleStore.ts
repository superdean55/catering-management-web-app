import { defineStore } from "pinia"
import { db } from "@/firebase/firebaseConfig"
import { collection, doc, setDoc, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore"
import router from "@/router";
import type { RawMaterial } from "@/types/RawMaterial"

export const useArticleStore = defineStore('articleStore',{
    state: () => ({
        rawMaterials:[] as RawMaterial[]
    }),
    actions:{
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
            const collectionRef = collection(db, 'raw-materials')

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