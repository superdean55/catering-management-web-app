import { generateRandomString } from "./generateRandomString"

export function generateZKI(): string {
    return generateRandomString(32)
}