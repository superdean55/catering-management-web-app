export function inputDateToString(date: string): string{
    const formattedDate = new Date(date).toLocaleDateString('hr-HR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
    return formattedDate.replace(/ /g, '')
}



export function storageDateToInputString(date: string): string{
    if(date){
        const parts = date.split('.');
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];
        return `${year}-${month}-${day}`;
    }
     return ''
}

