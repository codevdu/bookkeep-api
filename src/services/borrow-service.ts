import { DatabaseRepository, ILoan } from "../utils/db.ts";

export class LoanService {
    public createLoan(loanData: Partial<ILoan>): {
        success: boolean
        status: number
        message?: string
        loan?: ILoan
    } {
        const data = DatabaseRepository.read()
        const book = data.books.find(b => b.id === loanData.bookId)

        // livro deve existir
        if (!book) {
            return {
                success: false,
                status: 404,
                message: "Livro não encontrado."
            }
        }

        // livro indisponível
        if (!book.available) {
            return {
                success: false,
                status: 400,
                message: "O livro selecionado já está emprestado e indisponível."
            }
        }

        // alterar o campo available do livro para false
        book.available = false;

        const newLoan: ILoan = {
            id: Date.now() + 1,
            bookId: loanData.bookId!,
            studentName: loanData.studentName!,
            loanDate: loanData.loanDate || new Date().toISOString().split("T")[0],
            returned: false
        }

        data.borrows.push(newLoan)
        DatabaseRepository.write(data)

        return { 
            success: true, 
            status: 201, 
            loan: newLoan 
        }
    }

    public getActiveLoans(): ILoan[] {
        const data = DatabaseRepository.read()
        return data.borrows.filter(l => !l.returned)
    }

    public returnLoan(id: number): { 
        success: boolean,
        status: number,
        message: string 
    } {
        const data = DatabaseRepository.read();
        const loan = data.borrows.find(l => l.id === id);

        // empréstimo não encontrado
        if (!loan) {
            return { 
                success: false, 
                status: 404, 
                message: "Empréstimo não encontrado." 
            }
        }

        if (loan.returned) {
            return { 
                success: false, 
                status: 400, 
                message: "Este empréstimo já foi devolvido anteriormente." 
            }
        }

        // atualiza o empréstimo e o livro correspondente
        loan.returned = true
        const book = data.books.find(b => b.id === loan.bookId)
        if (book) {
            book.available = true
        }

        DatabaseRepository.write(data)
        return {
            success: true,
            status: 200,
            message: "Livro devolvido com sucesso e acervo atualizado."
        }
    }
}