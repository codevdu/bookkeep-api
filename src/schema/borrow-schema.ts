import { z } from "zod"

export const createBorrowSchema = z.object({
    bookId: z.string({
        error: "O ID do livro é obrigatório"
    }),
    studentName: z.string({
        error: "O nome do estudante é obrigatório"
    })
})

export type CreateBorrowInput = z.infer<typeof createBorrowSchema>