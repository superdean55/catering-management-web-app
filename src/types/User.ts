import type { Role } from "./Role"


export interface User{
    uid: string,
    email: string,
    firstName: string,
    lastName: string,
    imageUrl: string,
    imageName: string,
    born: string,
    phoneNumber: string,
    role: Role
}

