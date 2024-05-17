import { CategoryLevel } from "@/types/CategoryLevel"
export function validateInputString(input: string): boolean{
    if(input.length !== 0 && input.length > 1){
        return true
    }
    return false
}

