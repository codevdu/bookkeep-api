import swaggerJsdoc from "swagger-jsdoc"

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Biblioteca",
            version: "1.0.0",
            description: "API para gerenciamento de acervo e empréstimos",
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Servidor Local",
            },
        ],
        paths: {
            "/books": {
                get: {
                    summary: "Lista todos os livros. Aceita filtro por gênero via query param",
                    parameters: [
                        {
                            in: "query",
                            name: "genre",
                            schema: { 
                                type: "string" 
                            },
                            description: "Filtrar livros por gênero",
                        },
                    ],
                    responses: {
                        200: { 
                            description: "Lista de livros retornada com sucesso" 
                        },
                    },
                },
                post: {
                    summary: "Cadastra um novo livro",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["title", "author", "genre"],
                                    properties: {
                                        title: { type: "string" },
                                        author: { type: "string" },
                                        genre: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        201: { 
                            description: "Livro cadastrado com sucesso" 
                        },
                        400: { 
                            description: "Campos obrigatórios faltando" 
                        },
                    },
                },
            },
            "/books/{id}": {
                get: {
                    summary: "Retorna um livro pelo ID",
                    parameters: [
                        {
                            in: "path",
                            name: "id",
                            required: true,
                            schema: { type: "integer" },
                            description: "ID do livro",
                        },
                    ],
                    responses: {
                        200: { description: "Livro encontrado com sucesso" },
                        404: { description: "Livro não encontrado" },
                    },
                },
                put: {
                    summary: "Atualiza os dados de um livro",
                    parameters: [
                        {
                            in: "path",
                            name: "id",
                            required: true,
                            schema: { type: "integer" },
                            description: "ID do livro",
                        },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        title: { type: "string" },
                                        author: { type: "string" },
                                        genre: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: { description: "Livro atualizado com sucesso" },
                        404: { description: "Livro não encontrado" },
                    },
                },
                delete: {
                    summary: "Remove um livro do acervo",
                    parameters: [
                        {
                            in: "path",
                            name: "id",
                            required: true,
                            schema: { type: "integer" },
                            description: "ID do livro a ser deletado",
                        },
                    ],
                    responses: {
                        200: { description: "Livro deletado com sucesso" },
                        404: { description: "Livro não encontrado" },
                    },
                },
            },
            "/borrows": {
                post: {
                    summary: "Registra um novo empréstimo",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["bookId", "studentName"],
                                    properties: {
                                        bookId: { type: "integer" },
                                        studentName: { type: "string" },
                                        loanDate: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        201: { 
                            description: "Empréstimo registrado com sucesso" 
                        },
                        400: { 
                            description: "Livro indisponível ou dados malformados" 
                        },
                        404: { 
                            description: "Livro correspondente não encontrado" 
                        },
                    },
                },
                get: {
                    summary: "Lista todos os empréstimos ativos",
                    responses: {
                        200: { 
                            description: "Lista de empréstimos ativos obtida com sucesso" 
                        },
                    },
                },
            },
            "/borrows/{id}/return": {
                patch: {
                    summary: "Marca um empréstimo como devolvido",
                    parameters: [
                        {
                            in: "path",
                            name: "id",
                            required: true,
                            schema: { type: "integer" },
                            description: "ID do empréstimo a ser devolvido",
                        },
                    ],
                    responses: {
                        200: { 
                            description: "Livro devolvido e acervo atualizado com sucesso" 
                        },
                        400: { 
                            description: "Empréstimo já devolvido anteriormente" 
                        },
                        404: { 
                            description: "Empréstimo não encontrado" 
                        },
                    },
                },
            },
        },
    },
    apis: [],
};

export const swaggerSpec = swaggerJsdoc(options)