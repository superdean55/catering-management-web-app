export function isValidCode(input: string): boolean {
    const regex = /^\d+$/
    return regex.test(input)
}