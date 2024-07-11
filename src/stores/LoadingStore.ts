import { defineStore } from "pinia"

export const useLoadingStore = defineStore('loadingStore',{
    state: () => ({
        isLoading: false
    }),
    actions:{
        setLoadingState(isLoading: boolean){
            this.isLoading = isLoading
        }
    }
})