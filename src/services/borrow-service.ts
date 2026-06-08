import { DatabaseRepository, IBorrow } from "../utils/db.ts"

export class BorrowService {
    public createBorrow(borrowData: Partial<IBorrow>): {
        success: boolean
        status: number
        message?: string
        borrow?: IBorrow
    } {
        const databaseState = DatabaseRepository.read();
        const targetBook = databaseState.books.find(book => book.id === borrowData.bookId)

        // verifica se o livro existe
        if (!targetBook) {
            return {
                success: false,
                status: 404,
                message: "Livro não encontrado."
            }
        }

        // livro indisponível
        if (!targetBook.available) {
            return {
                success: false,
                status: 400,
                message: "O livro selecionado já está emprestado e indisponível."
            }
        }

        // alterar o status do livro para indisponível
        targetBook.available = false

        const newBorrow: IBorrow = {
            id: Date.now() + 1,
            bookId: borrowData.bookId!,
            studentName: borrowData.studentName!,
            borrowDate: borrowData.borrowDate || new Date().toISOString().split("T")[0],
            returned: false
        }

        databaseState.borrows.push(newBorrow)
        DatabaseRepository.write(databaseState)

        return { 
            success: true, 
            status: 201, 
            borrow: newBorrow 
        }
    }

    public getActiveBorrows(): IBorrow[] {
        const databaseState = DatabaseRepository.read()
        const allBorrows = databaseState.borrows
        
        return allBorrows.filter(borrow => !borrow.returned)
    }

    public returnBorrow(borrowId: number): { 
        success: boolean,
        status: number,
        message: string 
    } {
        const databaseState = DatabaseRepository.read();
        const currentBorrow = databaseState.borrows.find(borrow => borrow.id === borrowId)

        // empréstimo não encontrado
        if (!currentBorrow) {
            return { 
                success: false, 
                status: 404, 
                message: "Empréstimo não encontrado." 
            };
        }

        if (currentBorrow.returned) {
            return { 
                success: false, 
                status: 400, 
                message: "Este empréstimo já foi devolvido anteriormente." 
            };
        }

        // atualiza o status do emprestimo para devolvido e torna o livro disponível novamente
        currentBorrow.returned = true
        
        const associatedBook = databaseState.books.find(book => book.id === currentBorrow.bookId)
        if (associatedBook) {
            associatedBook.available = true
        }

        DatabaseRepository.write(databaseState)
        
        return {
            success: true,
            status: 200,
            message: "Livro devolvido com sucesso e acervo atualizado."
        }
    }
}