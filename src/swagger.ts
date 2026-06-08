import swaggerJsdoc from "swagger-jsdoc";

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
        tags: [
            { name: "Livros", description: "Gerenciamento do acervo de livros" },
            { name: "Empréstimos", description: "Controle de saídas e devoluções de livros" },
        ],
        paths: {
            "/books": {
                get: {
                    tags: ["Livros"],
                    summary: "Lista todos os livros",
                    description: "Retorna todos os livros do acervo. Aceita filtro por gênero via query param.",
                    parameters: [
                        {
                            in: "query",
                            name: "genre",
                            schema: { type: "string" },
                            description: "Filtrar livros por gênero",
                        },
                    ],
                    responses: {
                        200: { 
                            description: "Lista de livros retornada com sucesso",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "array",
                                        items: { $ref: "#/components/schemas/Book" }
                                    }
                                }
                            }
                        },
                    },
                },
                post: {
                    tags: ["Livros"],
                    summary: "Cadastra um novo livro",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/BookInput" },
                            },
                        },
                    },
                    responses: {
                        201: { 
                            description: "Livro cadastrado com sucesso",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/Book" }
                                }
                            }
                        },
                        400: { description: "Campos obrigatórios faltando ou inválidos" },
                    },
                },
            },
            "/books/{id}": {
                get: {
                    tags: ["Livros"],
                    summary: "Retorna um livro pelo ID",
                    parameters: [
                        {
                            in: "path",
                            name: "id",
                            required: true,
                            schema: { type: "string" },
                            description: "ID único do livro",
                        },
                    ],
                    responses: {
                        200: { 
                            description: "Livro encontrado com sucesso",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/Book" }
                                }
                            }
                        },
                        404: { description: "Livro não encontrado" },
                    },
                },
                put: {
                    tags: ["Livros"],
                    summary: "Atualiza os dados de um livro",
                    parameters: [
                        {
                            in: "path",
                            name: "id",
                            required: true,
                            schema: { type: "string" },
                            description: "ID único do livro",
                        },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/BookInput" },
                            },
                        },
                    },
                    responses: {
                        200: { description: "Livro atualizado com sucesso" },
                        404: { description: "Livro não encontrado" },
                    },
                },
                delete: {
                    tags: ["Livros"],
                    summary: "Remove um livro do acervo",
                    parameters: [
                        {
                            in: "path",
                            name: "id",
                            required: true,
                            schema: { type: "string" },
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
                    tags: ["Empréstimos"],
                    summary: "Registra um novo empréstimo",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/BorrowInput" },
                            },
                        },
                    },
                    responses: {
                        201: { description: "Empréstimo registrado com sucesso" },
                        400: { description: "Livro indisponível ou dados malformados" },
                        404: { description: "Livro correspondente não encontrado" },
                    },
                },
                get: {
                    tags: ["Empréstimos"],
                    summary: "Lista todos os empréstimos ativos",
                    responses: {
                        200: { 
                            description: "Lista de empréstimos ativos obtida com sucesso",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "array",
                                        items: { $ref: "#/components/schemas/Borrow" }
                                    }
                                }
                            }
                        },
                    },
                },
            },
            "/borrows/{id}/return": {
                patch: {
                    tags: ["Empréstimos"],
                    summary: "Marca um empréstimo como devolvido",
                    parameters: [
                        {
                            in: "path",
                            name: "id",
                            required: true,
                            schema: { type: "string" },
                            description: "ID do empréstimo a ser retornado",
                        },
                    ],
                    responses: {
                        200: { description: "Livro devolvido e acervo atualizado com sucesso" },
                        400: { description: "Empréstimo já devolvido anteriormente" },
                        404: { description: "Empréstimo não encontrado" },
                    },
                },
            },
        },

        // COMPONENTES PARA DEFINIÇÃO DE SCHEMAS DE DADOS REUTILIZÁVEIS
        components: {
            schemas: {
                BookInput: {
                    type: "object",
                    required: ["title", "author", "genre", "description", "pages", "imageURL"],
                    properties: {
                        title: { type: "string", example: "O Senhor dos Anéis" },
                        author: { type: "string", example: "J.R.R. Tolkien" },
                        genre: { type: "string", example: "Fantasia" },
                        description: { type: "string", example: "Uma grande jornada pela Terra Média." },
                        pages: { type: "integer", example: 1178 },
                        imageURL: { type: "string", example: "http://exemplo.com/imagem.jpg" },
                    },
                },
                Book: {
                    type: "object",
                    properties: {
                        id: { type: "string", example: 1 },
                        title: { type: "string", example: "O Senhor dos Anéis" },
                        author: { type: "string", example: "J.R.R. Tolkien" },
                        genre: { type: "string", example: "Fantasia" },
                        description: { type: "string", example: "Uma grande jornada pela Terra Média." },
                        pages: { type: "integer", example: 1178 },
                        imageURL: { type: "string", example: "http://exemplo.com/imagem.jpg" },
                    },
                },
                BorrowInput: {
                    type: "object",
                    required: ["bookId", "studentName"],
                    properties: {
                        bookId: { type: "integer", example: 1 },
                        studentName: { type: "string", example: "João Silva" },
                    },
                },
                Borrow: {
                    type: "object",
                    properties: {
                        id: { type: "string", example: 123 },
                        bookId: { type: "string", example: 1 },
                        studentName: { type: "string", example: "João Silva" },
                        borrowDate: { type: "string", format: "date-time", example: "2026-02-20" },
                        returned: { type: "boolean", example: false }
                    },
                },
            },
        },
    },
    apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);