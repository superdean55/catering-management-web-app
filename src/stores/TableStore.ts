import { db } from "@/firebase/firebaseConfig";
import type { Table } from "@/types/Table";
import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import { defineStore } from "pinia";
import { useToast } from 'vue-toastification'

const toast = useToast()

export const useTableStore = defineStore('tableStore',{
    state: () => ({
        tables:[] as Table[]
    }),
    actions:{
        async addTable(table: Table){
            try {
                table.cretaionDate = new Date().toLocaleString()
                const addRef = doc(collection(db, 'tables'))
                await setDoc(addRef, table as Table)
                console.log("Table added")
                toast.success("Stol dodan")
              } catch (e) {
                console.error("adding table: ", e)
                toast.error('Podreška prilikom dodavanja Stola')
              }
        },
        getTableById(id: string){
            return this.tables.find(it => it.id === id) || null
        },
        async getTables(){
            const collectionRef = collection(db, "tables");

            const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        const data = change.doc.data()
                        const table = this.tables.find(it => it.id === data.id)
                        if(!table){
                            this.tables.push({
                                id: data.id,
                                name: data.name,
                                shape: data.shape,
                                cretaionDate: data.creationDate,
                                lastTimeUsed: data.lastTimeUsed
                            }as Table)
                        }
                        console.log("add table: ", change.doc.data())
                    }
                    if (change.type === "modified") {
                        //console.log("modified: ", change.doc.data())
                        const data = change.doc.data()
                        const index = this.tables.findIndex(it => it.id === data.id)
                        if (index !== -1) {
                            this.tables[index] = {
                                id: data.id,
                                name: data.name,
                                shape: data.shape,
                                cretaionDate: data.creationDate,
                                lastTimeUsed: data.lastTimeUsed
                            }as Table
                        }
                    }
                    if (change.type === "removed") {
                        //console.log("removed: ", change.doc.data());
                        const data = change.doc.data()
                        const index = this.tables.findIndex(it => it.id === data.id)
                        if (index !== -1) {
                            this.tables.splice(index, 1)
                        }
                    }
                })
            })
        },

    }
})