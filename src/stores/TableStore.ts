import { db } from "@/firebase/firebaseConfig"
import type { Table } from "@/types/Table"
import { collection, deleteDoc, doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore"
import { defineStore } from "pinia"
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
                table.dbId = addRef.id
                await setDoc(addRef, table as Table)
                console.log("Table added")
                toast.success("Stol dodan")
              } catch (e) {
                console.error("adding table: ", e)
                toast.error('Podreška prilikom dodavanja Stola')
              }
        },
        async updateTable(table: Table){
            try {
                const oldTabel = this.getTableById(table.id)
                console.log(`oldTable: ${oldTabel}`)
                console.log(oldTabel)
                if(oldTabel){
                    const updateRef = doc(db, 'tables', oldTabel.dbId)
                    await updateDoc(updateRef, {
                        name: table.name,
                        shape: table.shape,
                    })
                    toast.success("Stol ažuriran")
                }
            } catch (e) {
                console.error("Table Update error: ", e)
                toast.error('Podreška prilikom ažuriranja Stola')
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
                                dbId: data.dbId,
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
                                dbId: data.dbId,
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
        async deleteTable(id: string){
            const table = this.getTableById(id)
            if(table){
                try{
                    await deleteDoc(doc(db, "tables", table.dbId))
                    console.log('Table deleted')
                    toast.success("Stol obrisan")
                } catch (e) {
                    toast.error('Pogreška prilikom brisanja stola')
                    console.error("Deleting product error: " , e)
                }
            }
            
        },

    }
})