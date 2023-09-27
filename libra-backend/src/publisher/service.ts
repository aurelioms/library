import { PrismaClient, Publisher } from "@prisma/client"
import { nanoid } from "nanoid"
import { TimestampKey } from "src/types"

type GetAllPublisherParams = {}

type GetPublisherParams = {
    id: string
}

type CreatePublisherParams = {
    publisher: Omit<Publisher, TimestampKey | 'id'>
}

type UpdatePubsliherParams = {
    id: string
    publisher: Omit<Publisher, 'id' | TimestampKey>
}


type DeletePublisherParams = {
    id: string
}

type Deps = {
    prisma: PrismaClient
}

export type PublisherService = {
    getAllPublisher: (params: GetAllPublisherParams) => Promise<Omit<Publisher, 'deletedAt'>[]>
    getPublisher: (params: GetPublisherParams) => Promise<Omit<Publisher, 'deletedAt'> | null>
    createPublisher: (params: CreatePublisherParams) => Promise<void>
    updatePublisher: (params: UpdatePubsliherParams) => Promise<void>
    deletePublisher: (params: DeletePublisherParams) => Promise<void>
}

export const createPublisherService = (deps: Deps): PublisherService => {
    const { prisma } = deps

    return {
        getAllPublisher: async () => {
            return await prisma.publisher.findMany()
        },
        getPublisher: async ({ id }) => {
            return await prisma.publisher.findFirst({
                select: {
                    id: true,
                    code: true,
                    name: true,
                    link: true,
                    createdAt: true,
                    updatedAt: true,
                },
                where: {
                    id,
                },
            })
        },
        createPublisher: async ({ publisher }) => {
            const now = new Date()

            await prisma.publisher.create({
                data: {
                    id: nanoid(),
                    ...publisher,
                    createdAt: now,
                    updatedAt: now,
                }
            })
        },
        updatePublisher: async ({ id, publisher }) => {
            const now = new Date()

            await prisma.publisher.update({
                where: {
                    id
                },
                data: {
                    ...publisher,
                    updatedAt: now,
                }
            })
        },
        deletePublisher: async ({ id }) => {
            const now = new Date()

            await prisma.publisher.update({
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