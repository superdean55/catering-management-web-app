export function isNumber(number: string){
    let parsedNumber = parseFloat(number)
    if (isNaN(parsedNumber)) {
        return false
    }
    return true
}