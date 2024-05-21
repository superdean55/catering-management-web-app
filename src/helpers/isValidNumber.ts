export function isValidNumber(input: string): boolean{
    const regex = /^\d+(\.\d+)?$/;
    return regex.test(input);
}