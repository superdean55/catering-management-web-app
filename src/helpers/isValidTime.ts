export function isValidTime(time: string) {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/
    if (!timeRegex.test(time)) {
        return false
    }
    return true
}