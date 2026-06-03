import { DatabaseRepository, IBook } from "../utils/db.ts";

export class BookService {
    public getAll(genre ?: string): IBook[] {
        const data = DatabaseRepository.read()
        if (genre) {
            return data.books.filter(b => b.genre.toLowerCase() === genre.toLowerCase())
        }
        return data.books;
    }

    public getById(id: number): IBook | null {
        const data = DatabaseRepository.read();
        return data.books.find(b => b.id === id) || null;
    }

    public create(bookData: Partial<IBook>): IBook {
        const data = DatabaseRepository.read();
        
        const newBook: IBook = {
            id: Date.now(),
            title: bookData.title!,
            author: bookData.author!,
            description: bookData.description!,
            genre: bookData.genre!,
            imageURL: bookData.imageURL!,
            available: true
        }

        data.books.push(newBook)
        DatabaseRepository.write(data)
        return newBook
    }

    public update(
        id: number, 
        updateData: Partial<IBook>): IBook | null {
        const data = DatabaseRepository.read()
        const index = data.books.findIndex(b => b.id === id)
        
        if (index === -1) return null

        const updatedBook = { 
            ...data.books[index], 
            ...updateData, 
            id 
        }

        data.books[index] = updatedBook
        
        DatabaseRepository.write(data)
        return updatedBook
    }

    public delete(id: number): boolean {
        const data = DatabaseRepository.read()
        const index = data.books.findIndex(b => b.id === id)
        
        if (index === -1) return false;

        data.books.splice(index, 1)
        DatabaseRepository.write(data)
        return true
    }
}