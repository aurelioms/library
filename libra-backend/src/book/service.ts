import { PrismaClient, Book } from "@prisma/client"
import { nanoid } from "nanoid"
import { TimestampKey } from "src/types"

type GetAllBookParams = {}

type GetBookParams = {
    id: string
}

type CreateBookParams = {
    Book: Omit<Book, TimestampKey | 'id'>
}

type UpdatePubsliherParams = {
    id: string
    Book: Omit<Book, 'id' | TimestampKey>
}


type DeleteBookParams = {
    id: string
}

type Deps = {
    prisma: PrismaClient
}

export type BookService = {
    getAllBook: (params: GetAllBookParams) => Promise<void>
    getBook: (params: GetBookParams) => Promise<void>
    createBook: (params: CreateBookParams) => Promise<void>
    updateBook: (params: UpdatePubsliherParams) => Promise<void>
    deleteBook: (params: DeleteBookParams) => Promise<void>
}

export const createBookService = (deps: Deps): BookService => {
    const { prisma } = deps

    return {
        getAllBook: async () => {
            await prisma.book.findMany()
        },
        getBook: async ({ id }) => {
            await prisma.book.findFirst({
                select: {
                    id: true,
                    title: true,
                    description: true,
                    isbn: true,
                    stock: true,
                    createdAt: true,
                    updatedAt: true,
                },
                where: {
                    id,
                },
            })
        },
        createBook: async ({ Book }) => {
            const now = new Date()

            await prisma.book.create({
                data: {
                    id: nanoid(),
                    ...Book,
                    createdAt: now,
                    updatedAt: now,
                }
            })
        },
        updateBook: async ({ id, Book }) => {
            const now = new Date()

            await prisma.book.update({
                where: {
                    id
                },
                data: {
                    ...Book,
                    updatedAt: now,
                }
            })
        },
        deleteBook: async ({ id }) => {
            const now = new Date()

            await prisma.book.update({
                where: {
                    id
                },
                data: {
                    deletedAt: now
                }
            })
        }
    }
}