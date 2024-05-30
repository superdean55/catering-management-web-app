export function isTwoDecimalNumber(input: string): boolean{
    const regex = /^\d+\.\d{2}$/
    return regex.test(input)
}