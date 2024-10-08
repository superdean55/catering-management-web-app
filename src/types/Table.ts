import type { TableCircleShapes } from "./TableCircleShapes"
import type { TableCubeShapes } from "./TableCubeShapes"

export interface Table{
    id: string,
    dbId: string,
    name: string,
    shape: TableCircleShapes | TableCubeShapes,
    creationDate: string,
    lastTimeUsed: string,
    timeDifference: number,
    backgroundColor: string
}