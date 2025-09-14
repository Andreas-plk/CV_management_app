import {Category} from "@prisma/client";


export type cv={
    id: string
    name: string
    createdAt: Date
    categories: Category[]
    accepted: boolean
}