export function isValidCode(input: string) {
    const regex = /^\d+$/;
    return regex.test(input);
}