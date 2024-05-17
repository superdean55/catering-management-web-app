import type { CategoryLevel } from "./CategoryLevel";

export interface Category{
    id: string,
    name: string,
    level: CategoryLevel,
    imageName: string,
    imageUrl: string
}