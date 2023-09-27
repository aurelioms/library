import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'

import { Handler } from './../handler'
import { withValidation, zodLiteralUnion } from './../validation'
import { PublisherService } from './service'

type GetAllPublisherHandlerDeps = {
    publisherService: PublisherService
}

const getAllPublisherSchema = z.object({

})

export const getAllPublisherHandler = (deps: GetAllPublisherHandlerDeps): Handler =>
    withValidation(
        {
            paramsSchema: getAllPublisherSchema
        },
        async (req, res, next) => {
            const { publisherService } = deps

            try {
                const publishers = await publisherService.getAllPublisher

                return res.status(StatusCodes.OK).json({ data: publishers })
            }

            catch (error) {
                next(error)
            }
        }
    )

type GetPublisherHandlerDeps = {
    publisherService: PublisherService
}

const getPublisherSchema = z.object({
    id: z.string()
})

export const getPublisherHandler = (deps: GetPublisherHandlerDeps): Handler =>
    withValidation(
        {
            paramsSchema: getPublisherSchema
        },
        async (req, res, next) => {
            try {
                const { id } = req.params
                const { publisherService } = deps

                const publisher = await publisherService.getPublisher({ id })

                return res.status(StatusCodes.OK).json({ data: publisher })
            }
            catch (error) {
                next(error)
            }
        }
    )

type CreatePublisherHandlerDeps = {
    publisherService: PublisherService
}

const createPublisherSchema = z.object({
    name: z.string()
        .min(1, 'Category name should have at least 1 character')
        .max(255, 'Category name can only have maximum 255 characters'),
    code: z.string()
        .min(1, 'Category code should have at least 1 character')
        .max(10, 'Category code can only have maximum 10 characters'),
    link: z.string()
        .url()
})

export const createPublisherHandler = (
    deps: CreatePublisherHandlerDeps,
): Handler =>
    withValidation(
        {
            bodySchema: createPublisherSchema
        },
        async (req, res, next) => {
            const { publisherService } = deps

            try {
                const { code, name, link } = req.body

                await publisherService.createPublisher({
                    publisher: {
                        code,
                        name,
                        link
                    }
                })

                return res.status(StatusCodes.OK).json({ success: true })
            }
            catch (error) {
                next(error)
            }
        }
    )

type UpdatePublisherHandlerDeps = {
    publisherService: PublisherService
}

const updatePublisherSchema = z.object({
    id: z.string()
})

export const updatePublisherHandler = (deps: UpdatePublisherHandlerDeps,): Handler =>
    withValidation(
        {
            paramsSchema: updatePublisherSchema
        },
        async (req, res, next) => {
            const { publisherService } = deps
            try {
                const { id } = req.params
                const { code, name, link } = req.body

                await publisherService.updatePublisher({
                    id, publisher: {
                        code,
                        name,
                        link
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

type DeletePublisherHandlerDeps = {
    publisherService: PublisherService
}

const deletePublisherSchema = z.object({
    id: z.string()
})

export const deletePublisherHandler = (deps: DeletePublisherHandlerDeps): Handler =>
    withValidation(
        {
            paramsSchema: deletePublisherSchema
        },
        async (req, res, next) => {
            try {
                const { publisherService } = deps
                const { id } = req.params

                await publisherService.deletePublisher({ id })

                return res.status(StatusCodes.OK).json({ success: true })
            }
            catch (error) {
                next(error)
            }
        }
    )
