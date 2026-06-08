import { Router } from "express"
import { BorrowService } from "../services/borrow-service.ts"

const router = Router()
const borrowService = new BorrowService()

router.post("/", (req, res) => {
    const { bookId, studentName, borrowDate } = req.body

    if (!bookId || !studentName) {
        res.status(400).json({ 
            error: "Os campos bookId e studentName são obrigatórios." 
        })
        return
    }

    const result = borrowService.createBorrow({ 
        bookId: Number(bookId), 
        studentName, borrowDate
    })
    
    if (!result.success) {
        res.status(result.status).json({ error: result.message })
        return
    }

    res.status(201).json(result.borrow)
})

router.get("/", (req, res) => {
    const activeBorrows = BorrowService.prototype.getActiveBorrows()
    res.json(activeBorrows)
})

router.patch("/:id/return", (req, res) => {
    const result = borrowService.returnBorrow(Number(req.params.id))
    
    if (!result.success) {
        res.status(result.status).json({ 
            error: result.message
        })
        return
    }

    res.json({ 
        message: result.message 
    })
})

export default router