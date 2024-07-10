import type { Product } from "@/types/Product"
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


export const useProductStore = defineStore('productStore',{
    state: () => ({
        products:[] as Product[]
    }),
    actions: {
        async addProduct(product: Product, selectedImageUrl: string){
            try {
                product.imageName = generateImageName('product')
                product.timestamp = serverTimestamp()
                const imageUrl = await this.addImage(selectedImageUrl, product.imageName)
                product.imageUrl = imageUrl
                product.creationDate = new Date().toLocaleString()
                
                const addRef = doc(collection(db, 'products'))
                product.id = addRef.id
                await setDoc(addRef, product as Product)
                router.push({ name: 'Products'})
                console.log("Product added")
                toast.success("Proizvod dodan")
              } catch (e) {
                console.error("adding product: ", e)
                toast.error('Podreška prilikom dodavanja Proizvoda')
              }
        },
        async updateProduct(product: Product, oldProduct: Product, selectedImageUrl: string | null){
            try {
                product.imageName = oldProduct.imageName
                product.imageUrl = oldProduct.imageUrl
                if(selectedImageUrl){
                    product.imageName = generateImageName('product')
                    const imageUrl = await this.addImage(selectedImageUrl, product.imageName)
                    product.imageUrl = imageUrl
                    await this.removeImage(oldProduct.imageName)
                }
                const updateRef = doc(db, 'products', oldProduct.id)
                
                await updateDoc(updateRef, {
                    name: product.name,
                    code: product.code,
                    articleUnit: product.articleUnit,
                    taxRate: product.taxRate,
                    price: product.price,
                    imageName: product.imageName,
                    imageUrl: product.imageUrl,
                    productItems: product.productItems,
                    timestamp: serverTimestamp()
                })
                router.push({ name: 'Products'})
                toast.success("Proizvod ažuriran")
            } catch (e) {
                console.error("Product Update error: ", e)
                toast.error('Podreška prilikom ažuriranja Proizvoda')
            }
        },
        async addImage(selectedImageUrl: string, imageName: string): Promise<string> {
            try {
                const storageRef = ref(storage, 'products/' + imageName)
                const blob = await imageUrlToBlob(selectedImageUrl)
                const snapshot = await uploadBytes(storageRef, blob)
                const url = await getDownloadURL(snapshot.ref)
                return url
            } catch (error) {
                console.error('Došlo je do greške prilikom spremanja ili dobivanja URL-a slike:', error)
                return ''
            }
        },
        async removeImage(imageName: string){
            try{
                const deleteRef = ref(storage, 'products/' + imageName)
                deleteObject(deleteRef)
            } catch(error){
                console.error('Došlo je do greške prilikom brisnja stare slike slike:', error)
            }
        },
        async getProducts(){
            const collectionRef = collection(db, "products");
            const q = query(collectionRef, orderBy("timestamp", 'asc'))

            const unsubscribe = onSnapshot(q, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        const data = change.doc.data()
                        const product = this.products.find(it => it.id === data.id)
                        if(!product){
                            this.products.unshift({
                                id: data.id,
                                name: data.name,
                                code: data.code,
                                articleUnit: data.articleUnit,
                                taxRate: data.taxRate,
                                price: data.price,
                                creationDate: data.creationDate,
                                imageName: data.imageName,
                                imageUrl: data.imageUrl,
                                productItems: data.productItems,
                                timestamp: data.timestamp
                            }as Product)
                        }
                    }
                    if (change.type === "modified") {
                        const data = change.doc.data()
                        const index = this.products.findIndex(it => it.id === data.id)
                        if (index !== -1) {
                            this.products[index] = {
                                id: data.id,
                                name: data.name,
                                code: data.code,
                                articleUnit: data.articleUnit,
                                taxRate: data.taxRate,
                                price: data.price,
                                creationDate: data.creationDate,
                                imageName: data.imageName,
                                imageUrl: data.imageUrl,
                                productItems: data.productItems,
                                timestamp: data.timestamp
                            }as Product
                        }
                    }
                    if (change.type === "removed") {
                        //console.log("removed: ", change.doc.data());
                        const data = change.doc.data()
                        const index = this.products.findIndex(it => it.id === data.id);
                        if (index !== -1) {
                            this.products.splice(index, 1);
                        }
                    }
                });
            });
        },
        async deleteProduct(id: string){
            const product = this.products.find(it => it.id === id)
            if(product){
                try{
                    await this.removeImage(product.imageName)
                    await deleteDoc(doc(db, "products", id))
                    router.push({ name: 'Products'})
                    console.log('Product deleted')
                } catch (e) {
                    console.error("Deleting product error: " , e)
                }
            }
            
        },
        getProductById(id: string) {
            return this.products.find(it => it.id === id) || null
        }

    }
})