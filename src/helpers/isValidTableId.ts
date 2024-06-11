export function isValidTableId(tableId: string): boolean{
    for (let i = 0; i < 22; i++) {
        var id = `table-${i + 1}`
        if(id === tableId){
            return true
        }
    }
    return false
}