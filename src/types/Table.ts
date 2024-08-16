import type { TableCircleShapes } from "./TableCircleShapes"
import type { TableCubeShapes } from "./TableCubeShapes"

export interface Table{
    id: string,
    dbId: string,
    name: string,
    shape: TableCircleShapes | TableCubeShapes,
    cretaionDate: string,
    lastTimeUsed: string
}