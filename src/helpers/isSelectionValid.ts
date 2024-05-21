export function isSelectionValid(input: string, enumObject: any): boolean {
    const enumValues = Object.values(enumObject)
    return enumValues.includes(input)
}