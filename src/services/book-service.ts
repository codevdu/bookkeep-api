import { randomUUID } from "node:crypto"
import { DatabaseRepository, IBook } from "../utils/db.ts"

export class BookService {
    public getAll(genre?: string): IBook[] {
        const databaseState = DatabaseRepository.read()
        const allBooks = databaseState.books

        if (genre) {
            return allBooks.filter(book => book.genre.includes(genre))
        }
        return allBooks
    }

    public getById(id: string): IBook | null {
        const databaseState = DatabaseRepository.read()
        return databaseState.books.find(book => String(book.id) === id) || null
    }

    public create(bookData: Partial<IBook>): IBook {
        const databaseState = DatabaseRepository.read()
        
        const newBook: IBook = {
            id: randomUUID(),
            title: bookData.title!,
            author: bookData.author!,
            description: bookData.description!,
            genre: bookData.genre!,
            pages: bookData.pages!,
            imageURL: bookData.imageURL!,
            available: true
        }

        databaseState.books.push(newBook)
        DatabaseRepository.write(databaseState)
        return newBook
    }

    public update(id: string, updateData: Partial<IBook>): IBook | null {
        const databaseState = DatabaseRepository.read()
        const bookIndex = databaseState.books.findIndex(book => String(book.id) === id)
        
        if (bookIndex === -1) return null

        const updatedBook = { 
            ...databaseState.books[bookIndex], 
            ...updateData, 
            id 
        }

        databaseState.books[bookIndex] = updatedBook
        
        DatabaseRepository.write(databaseState)
        return updatedBook
    }

    public delete(id: string): boolean {
        const databaseState = DatabaseRepository.read()
        const bookIndex = databaseState.books.findIndex(book => String(book.id) === id)
        
        if (bookIndex === -1) return false

        databaseState.books.splice(bookIndex, 1)
        DatabaseRepository.write(databaseState)
        return true
    }
}