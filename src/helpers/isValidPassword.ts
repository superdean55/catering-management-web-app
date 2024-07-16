export function isValidPassword(password: string): boolean{
    const passwordRegex: RegExp = /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{8,32}$/
    if(passwordRegex.test(password)){
        return true
    }
    return false
}