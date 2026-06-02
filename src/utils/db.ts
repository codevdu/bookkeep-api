import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

export interface IBook {
    id: number
    title: string
    author: string
    genre: string
    available: boolean
}

export interface ILoan {
    id: number
    bookId: number
    studentName: string
    loanDate: string
    returned: boolean
}

export interface IDatabaseSchema {
    books: IBook[]
    borrows: ILoan[]
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