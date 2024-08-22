import { db } from "@/firebase/firebaseConfig"
import type { Table } from "@/types/Table"
import { collection, deleteDoc, doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore"
import { defineStore } from "pinia"
import { useToast } from 'vue-toastification'

const toast = useToast()

export const useTableStore = defineStore('tableStore',{
    state: () => ({
        tables:[] as Table[],
        intervalId: null as number | null
    }),
    actions:{
        async addTable(table: Table){
            try {
                table.creationDate = new Date().toLocaleString()
                table.lastTimeUsed = new Date().toISOString()
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
        async tableUsageUpdate(tableId: string){
            try {
                console.log('tableId = ', tableId)
                const oldTabel = this.tables.find(it => it.dbId === tableId)
                console.log('table = ', oldTabel)
                if(oldTabel){
                    const updateRef = doc(db, 'tables', oldTabel.dbId)
                    await updateDoc(updateRef, {
                        lastTimeUsed: new Date().toISOString(),
                    })
                    console.log('table last time update success')
                }
                
            } catch (e) {
                console.error("Table usage update error: ", e)
            }
        },
        getTableById(id: string){
            return this.tables.find(it => it.id === id) || null
        },
        async getTables(){
            const collectionRef = collection(db, "tables")

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
                                creationDate: data.creationDate,
                                lastTimeUsed: data.lastTimeUsed,
                                timeDifference: this.calculateTimeDifference(data.lastTimeUsed),
                                backgroundColor: this.getBackgroundColor(this.calculateTimeDifference(data.lastTimeUsed))
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
                                creationDate: data.creationDate,
                                lastTimeUsed: data.lastTimeUsed,
                                timeDifference: this.calculateTimeDifference(data.lastTimeUsed),
                                backgroundColor: this.getBackgroundColor(this.calculateTimeDifference(data.lastTimeUsed))
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
        calculateTimeDifference(lastTimeUsed: string): number {
            const lastUsedDate = new Date(lastTimeUsed)
            const currentDate = new Date()
            console.log('last used date = ', lastUsedDate)
            console.log('current date = ', currentDate)
            const timeDifference = Math.floor((currentDate.getTime() - lastUsedDate.getTime()) / 60000) // u minutama
            return timeDifference
        },
        getBackgroundColor(timeDifference: number): string {
            if (timeDifference <= 20) {
                return 'bg-green-500'
            } else if (timeDifference > 20 && timeDifference <= 40) {
                return 'bg-yellow-500'
            } else {
                return 'bg-red-500'
            }
        },
        startTracking() {
            this.intervalId = setInterval(() => {
                this.tables.forEach(table => {
                    table.timeDifference = this.calculateTimeDifference(table.lastTimeUsed)
                    table.backgroundColor = this.getBackgroundColor(table.timeDifference)
                })
            }, 60000) as unknown as number
        },
        stopTracking() {
            if (this.intervalId) {
                clearInterval(this.intervalId)
            }
        },
        beforeUnmount() {
            this.stopTracking()
        }

    }
})