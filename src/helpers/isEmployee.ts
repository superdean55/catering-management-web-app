import { Role } from "@/types/Role"
import type { User } from "@/types/User"

export function isEmployee(user: User){
    if(user.role === Role.admin || user.role === Role.manager || user.role === Role.staff){
        return true
    }
    return false
}