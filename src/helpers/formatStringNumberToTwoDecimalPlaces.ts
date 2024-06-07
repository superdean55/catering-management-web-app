export function formatStringNumberToTwoDecimalPlaces(input: string){
    const number = parseFloat(input)
    if (isNaN(number)) {
      return 0
    }
    return number.toFixed(2).toString()
}