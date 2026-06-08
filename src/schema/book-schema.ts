import { z } from "zod"

export const createBookSchema = z.object({
    title: z.string({
        message: "O título é obrigatório"
    })
    .min(1, "O título não pode estar vazio"),
    author: z.string({ 
        message: "O autor é obrigatório" 
    })
    .min(1, "O autor não pode estar vazio"),
    description: z.string({
        message: "A descrição é obrigatória"
    })
    .max(500, "A descrição deve ter no máximo 500 caracteres")
    .min(1, "A descrição não pode estar vazia"),
    genre: z.string({
        message: "O gênero é obrigatório"
    })
    .transform((str) => str.split(",").map(g => g.trim()).filter(g => g.length > 0)),
    pages: z.number({
        message: "O número de páginas é obrigatório"
    })
    .positive("O número de páginas deve ser maior que zero")
    .int("O número de páginas deve ser um número inteiro"),
    imageURL: z.string({
        message: "A URL da imagem é obrigatória"
    })
    .url("A URL da imagem não é inválida"),
})

export const updateBookSchema = createBookSchema.partial()

export type CreateBookInput = z.infer<typeof createBookSchema>
export type UpdateBookInput = z.infer<typeof updateBookSchema>