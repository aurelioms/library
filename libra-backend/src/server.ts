import { PrismaClient } from '@prisma/client'
import cors from 'cors'
import express from 'express'
import type { Express } from 'express'

import {
  bulkDeleteCategoryHandler,
  createCategoryHandler,
  getAllCategoriesHandler,
  getCategoryHandler,
  restoreCategoryHandler,
  updateCategoryHandler
} from './category/handler'
import { createCategoryService } from './category/service'
import { createRouter } from './router'
import { createPublisherService } from './publisher/service'

export type Server = Express

const prisma = new PrismaClient()

export const createServer = (): Server => {
  return express().use(cors()).use(express.json())
}

export const startServer = (server: Server, port: number) => {
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
  })
}

export const setupRoutes = (server: Server) => {
  const baseRouter = createRouter()

  baseRouter.use('/example', createExampleRouter())
  baseRouter.use('/category', createCategoryRouter())

  server.use('/api/v1', baseRouter)
}

const createExampleRouter = () => {
  return createRouter().get('/', (req, res) => {
    res.status(200).json({
      message:
        "We will not underestimate our client eventhough the request doesn't make any sense at all!",
    })
  })
}

const createCategoryRouter = () => {
  const categoryService = createCategoryService({ prisma })

  return createRouter()
    .get('/', getAllCategoriesHandler({ categoryService }))
    .get('/:id', getCategoryHandler({ categoryService }))
    .post('/', createCategoryHandler({ categoryService }))
    .put('/delete', bulkDeleteCategoryHandler({ categoryService }))
    .put('/restore', restoreCategoryHandler({ categoryService }))
    .put('/update/:id', updateCategoryHandler({ categoryService }))
}

const createPublisherRouter = () => {
  const publisherService = createPublisherService({ prisma })


}
