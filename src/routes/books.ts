import { Router } from "express"
import { BookService } from "../services/book-service.ts"
import { createBookSchema } from "../schema/book-schema.ts"
import { z } from "zod"

const router = Router()
const bookService = new BookService()

router.get("/", (req, res) => {
    const { genre } = req.query;
    const books = bookService.getAll(genre as string);
    res.json(books)
})

router.get("/:id", (req, res) => {
    const book = bookService.getById(String(req.params.id));
    if (!book) {
        res.status(404).json({ 
            error: "Livro não encontrado"
        })
        return
    }
    res.json(book);
})

router.post("/", (req, res) => {
    try {
        const validatedData = createBookSchema.parse(req.body)

        const newBook = bookService.create(validatedData);

        res.status(201).json(newBook)
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ 
                error: error.issues.map((err) => err.message).join("; ") 
            })
            return
        }
    }
})

router.put("/:id", (req, res) => {
    console.log('[debug] route PUT /books/:id received', req.params.id)
    const updatedBook = bookService.update(String(req.params.id), req.body)
    if (!updatedBook) {
        res.status(404).json({ 
            error: "Livro não encontrado"
        })
        return
    }
    res.json(updatedBook)
})

router.delete("/:id", (req, res) => {
    const success = bookService.delete(String(req.params.id))
    if (!success) {
        res.status(404).json({ 
            error: "Livro não encontrado"
        })
        return
    }
    res.json({ message: "Livro removido com sucesso do acervo." })
})

export default router