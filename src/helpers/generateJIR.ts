import { generateRandomString } from "./generateRandomString"

export function generateJIR(): string {

    const part1 = generateRandomString(8)
    const part2 = generateRandomString(4)
    const part3 = generateRandomString(4)
    const part4 = generateRandomString(4)
    const part5 = generateRandomString(12)
    
    const jir = `${part1}-${part2}-${part3}-${part4}-${part5}`
  
    return jir
}

