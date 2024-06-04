import type { FieldValue } from "firebase/firestore"
import type { CategoryItem } from "./CategoryItem"


export interface Category{
    id: string,
    name: string,
    imageName: string,
    imageUrl: string,
    creationDate: string,
    timestamp: FieldValue,
    items: CategoryItem[]
}