export function generateId(): string {
    const randomNumber = Math.floor(Math.random() * 1000000)
    const now = new Date()
    const timestamp = now.getTime()
    
    return `${timestamp}_${randomNumber}`
}