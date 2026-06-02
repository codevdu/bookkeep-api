import { Router } from "express"
import { LoanService } from "../services/loan-service.ts"

const router = Router()
const loanService = new LoanService()

router.post("/", (req, res) => {
    const { bookId, studentName, loanDate } = req.body

    if (!bookId || !studentName) {
        res.status(400).json({ 
            error: "Os campos bookId e studentName são obrigatórios." 
        })
        return
    }

    const result = loanService.createLoan({ 
        bookId: Number(bookId), 
        studentName, loanDate 
    })
    
    if (!result.success) {
        res.status(result.status).json({ error: result.message })
        return
    }

    res.status(201).json(result.loan)
});

router.get("/", (req, res) => {
    const activeLoans = loanService.getActiveLoans()
    res.json(activeLoans)
})

router.patch("/:id/return", (req, res) => {
    const result = loanService.returnLoan(Number(req.params.id))
    
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