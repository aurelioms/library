import { PrismaClient, Author } from "@prisma/client"
import { nanoid } from "nanoid"
import { TimestampKey } from "src/types"

type GetAllAuthorParams = {

}

type GetAuthorParams = {
    name: string
}

type CreateAuthorParams = {
    author: Omit<Author, 'id' | TimestampKey>
}

type UpdateAuthorParams = {
    id: string
    author: Omit<Author, 'id' | TimestampKey>
}

type DeleteAuthorParams = {
    id: string
}

export type AuthorService = {
    getAllAuthor: (params: GetAllAuthorParams) => Promise<Omit<Author, 'deletedAt'>[]>
    getAuthor: (params: GetAuthorParams) => Promise<Omit<Author, 'deletedAt'> | null>
    createAuthor: (params: CreateAuthorParams) => Promise<void>
    updateAuthor: (params: UpdateAuthorParams) => Promise<void>
    deleteAuthor: (params: DeleteAuthorParams) => Promise<void>
}

type Deps = {
    prisma: PrismaClient
}

export const authorService = (deps: Deps): AuthorService => {
    const { prisma } = deps

    return {
        getAllAuthor: async () => {
            return await prisma.author.findMany()
        },
        getAuthor: async ({ name }) => {
            return prisma.author.findFirst({
                where: {
                    name: {
                        contains: name
                    }
                }
            })
        },
        createAuthor: async ({ author }) => {
            const now = new Date()

            await prisma.author.create({
                data: {
                    id: nanoid(),
                    ...author,
                    createdAt: now,
                    updatedAt: now
                }
            })
        },

        updateAuthor: async ({ id, author }) => {
            const now = new Date()

            await prisma.author.update({
                where: {
                    id
                },
                data: {
                    ...author,
                    updatedAt: now
                }
            })
        },

        deleteAuthor: async ({ id }) => {
            const now = new Date()

            await prisma.author.update({
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