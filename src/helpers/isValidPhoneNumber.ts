export function isValidPhoneNumber(phoneNumber: string): boolean{
    if(phoneNumber.length >= 9 && phoneNumber.length <= 10){
        const regex = /^[0-9]+$/
        return regex.test(phoneNumber)
    }
    return false
}