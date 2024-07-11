
export function isValidInput(input: string): boolean{
    if(input.length !== 0 && input.length > 1 && input.length < 50){
        return true
    }
    return false
}

