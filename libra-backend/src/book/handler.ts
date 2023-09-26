import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'

import { Handler } from './../handler'
import { withValidation, zodLiteralUnion } from './../validation'
import { BookService } from './service'
import { prisma } from '@prisma/client'

type GetAllBookHandlerDeps = {
    bookService: BookService
}

const getAllBookSchema = z.object({

})

export const getAllBookHandler = (deps: GetAllBookHandlerDeps): Handler =>
    withValidation(
        {
            paramsSchema: getAllBookSchema
        },
        async (req, res, next) => {
            const { bookService } = deps

            try {
                const Books = await bookService.getAllBook

                return res.status(StatusCodes.OK).json({ data: Books })
            }

            catch (error) {
                next(error)
            }
        }
    )

type GetBookHandlerDeps = {
    bookService: BookService
}

const getBookSchema = z.object({
    id: z.string()
})

export const getBookHandler = (deps: GetBookHandlerDeps): Handler =>
    withValidation(
        {
            paramsSchema: getBookSchema
        },
        async (req, res, next) => {
            try {
                const { id } = req.params
                const { bookService } = deps

                const Book = await bookService.getBook({ id })

                return res.status(StatusCodes.OK).json({ data: Book })
            }
            catch (error) {
                next(error)
            }
        }
    )

type CreateBookHandlerDeps = {
    bookService: BookService
}

const createBookSchema = z.object({
    title: z.string()
        .min(1, 'Category name should have at least 1 character')
        .max(255, 'Category name can only have maximum 255 characters'),
    description: z.string().optional(),
    isbn: z.string(),
    stock: z.number(),
})

export const createBookHandler = (
    deps: CreateBookHandlerDeps,
): Handler =>
    withValidation(
        {
            bodySchema: createBookSchema
        },
        async (req, res, next) => {
            const { bookService } = deps

            try {
                const { title, description, isbn, stock } = req.body

                await bookService.createBook({
                    Book: {
                        title,
                        description,
                        isbn,
                        stock,
                    }
                })

                return res.status(StatusCodes.OK).json({ success: true })
            }
            catch (error) {
                next(error)
            }
        }
    )

type UpdateBookHandlerDeps = {
    bookService: BookService
}

const updateBookSchema = z.object({
    id: z.string()
})

export const updateBookHandler = (deps: UpdateBookHandlerDeps,): Handler =>
    withValidation(
        {
            paramsSchema: updateBookSchema
        },
        async (req, res, next) => {
            const { bookService } = deps
            try {
                const { id } = req.params
                const { title, description, isbn, stock } = req.body

                await bookService.updateBook({
                    id, Book: {
                        title,
                        description,
                        isbn,
                        stock,
                    }
                })

                return res.status(StatusCodes.OK).json({
                    success: true,
                })
            }
            catch (error) {
                next(error)
            }
        }
    )

type DeleteBookHandlerDeps = {
    bookService: BookService
}

const deleteBookSchema = z.object({
    id: z.string()
})

export const deleteBookHandler = (deps: DeleteBookHandlerDeps): Handler =>
    withValidation(
        {
            paramsSchema: deleteBookSchema
        },
        async (req, res, next) => {
            try {
                const { bookService } = deps
                const { id } = req.params

                await bookService.deleteBook({ id })

                return res.status(StatusCodes.OK).json({ success: true })
            }
            catch (error) {
                next(error)
            }
        }
    )
