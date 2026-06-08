import fs from "fs"
import * as path from "path"
import { fileURLToPath } from "url"

export interface IBook {
    id: number
    title: string
    author: string
    genre: string
    description: string
    imageURL: string
    available: boolean
}

export interface IBorrow {
    id: number
    bookId: number
    studentName: string
    borrowDate: string
    returned: boolean
}

export interface IDatabaseSchema {
    books: IBook[]
    borrows: IBorrow[]
}

export class DatabaseRepository {
    private static dbPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../db.json")

    public static read(): IDatabaseSchema {
        try {
            const data = fs.readFileSync(this.dbPath, "utf-8")
            return JSON.parse(data);
        } catch {
            return { 
                books: [], 
                borrows: []
            }
        }
    }

    public static write(data: IDatabaseSchema): void {
        fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2), "utf-8")
    }
}