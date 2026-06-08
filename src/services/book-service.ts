import { DatabaseRepository, IBook } from "../utils/db.ts"

export class BookService {
    public getAll(genre?: string): IBook[] {
        const databaseState = DatabaseRepository.read()
        const allBooks = databaseState.books

        if (genre) {
            return allBooks.filter(book => book.genre.toLowerCase() === genre.toLowerCase())
        }
        return allBooks
    }

    public getById(id: number): IBook | null {
        const databaseState = DatabaseRepository.read()
        return databaseState.books.find(book => book.id === id) || null
    }

    public create(bookData: Partial<IBook>): IBook {
        const databaseState = DatabaseRepository.read()
        
        const newBook: IBook = {
            id: Date.now(),
            title: bookData.title!,
            author: bookData.author!,
            description: bookData.description!,
            genre: bookData.genre!,
            imageURL: bookData.imageURL!,
            available: true
        };

        databaseState.books.push(newBook)
        DatabaseRepository.write(databaseState)
        return newBook
    }

    public update(id: number, updateData: Partial<IBook>): IBook | null {
        const databaseState = DatabaseRepository.read()
        const bookIndex = databaseState.books.findIndex(book => book.id === id)
        
        if (bookIndex === -1) return null

        const updatedBook = { 
            ...databaseState.books[bookIndex], 
            ...updateData, 
            id 
        };

        databaseState.books[bookIndex] = updatedBook
        
        DatabaseRepository.write(databaseState)
        return updatedBook
    }

    public delete(id: number): boolean {
        const databaseState = DatabaseRepository.read();
        const bookIndex = databaseState.books.findIndex(book => book.id === id)
        
        if (bookIndex === -1) return false

        databaseState.books.splice(bookIndex, 1)
        DatabaseRepository.write(databaseState)
        return true
    }
}