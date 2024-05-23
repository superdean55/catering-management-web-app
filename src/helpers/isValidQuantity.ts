import { ArticleUnit } from "@/types/ArticleUnit";

export function isValidQuantity(unit: string, input: string): boolean{
    if(unit === ArticleUnit.liter){
        const regex = /^\d+\.\d+$/
        return regex.test(input)
    }
    const regex = /^[1-9]\d*$/;
    return regex.test(input);
}