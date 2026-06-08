import { Router } from "express"
import { BookService } from "../services/book-service.ts"

const router = Router()
const bookService = new BookService()

router.get("/", (req, res) => {
    const { genre } = req.query;
    const books = bookService.getAll(genre as string);
    res.json(books)
})

router.get("/:id", (req, res) => {
    const book = bookService.getById(Number(req.params.id));
    if (!book) {
        res.status(404).json({ 
            error: "Livro não encontrado"
        })
        return
    }
    res.json(book);
})

router.post("/", (req, res) => {
    const { title, author, genre, description, imageURL } = req.body

    if (!title) {
        res.status(400).json({ 
            error: "Preencha todos os campos!" 
        })
        return
    }

    if (!genre) {
        res.status(400).json({ 
            error: "O gênero do livro é obrigatório." 
        })
        return
    }

    if (!description) {
        res.status(400).json({ 
            error: "A descrição do livro é obrigatório." 
        })
        return
    }

    if (!imageURL) {
        res.status(400).json({ 
            error: "A imagem do livro é obrigatória." 
        })
        return
    }

    const newBook = bookService.create({ 
        title, 
        author, 
        genre,
        description,
        imageURL
    })
    res.status(201).json(newBook)
})

router.put("/:id", (req, res) => {
    const updatedBook = bookService.update(Number(req.params.id), req.body)
    if (!updatedBook) {
        res.status(404).json({ 
            error: "Livro não encontrado"
        })
        return
    }
    res.json(updatedBook)
})

router.delete("/:id", (req, res) => {
    const success = bookService.delete(Number(req.params.id))
    if (!success) {
        res.status(404).json({ 
            error: "Livro não encontrado"
        })
        return
    }
    res.json({ message: "Livro removido com sucesso do acervo." })
})

export default router