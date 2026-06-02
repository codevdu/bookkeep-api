import express from "express"
import swaggerUi from "swagger-ui-express"
import { swaggerSpec } from "./swagger.ts"
import bookRoutes from "./routes/books.ts"
import loanRoutes from "./routes/loans.ts"

const app = express()
const port = 3000

app.use(express.json())

app.use("/books", bookRoutes)
app.use("/loans", loanRoutes)

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.listen(port, () => {
    console.log(`A API está rodando em: http://localhost:${port}`)
    console.log(`Documentação acessível em: http://localhost:${port}/docs`)
})