export function isValidOib(input: string) {
    const regex = /^[0-9]{11}$/
    return regex.test(input)
}