export function generateImageName(prefix: string): string {
    const randomNumber = Math.floor(Math.random() * 1000000);
    const now = new Date();
    const timestamp = now.getTime();
    
    const uniqueName = `${prefix}_${timestamp}_${randomNumber}.jpg`;
    return uniqueName;
}