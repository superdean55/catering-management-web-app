import { isNumber } from "./isNumber"

export function isPositiveNumber(number: string){
    if(isNumber(number)){
        let parsedNumber = parseFloat(number)
        if(parsedNumber < 0){
            return false
        }
        return true
    }
    return false
}