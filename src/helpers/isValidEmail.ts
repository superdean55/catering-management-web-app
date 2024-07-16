export function isValidEmail(email: string): boolean{
    const emailRegex: RegExp = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/
    if(emailRegex.test(email)) {
        return true
    }
    return false
}