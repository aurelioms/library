import { Category, PrismaClient } from '@prisma/client'
import { nanoid } from 'nanoid'

import { TimestampKey } from './../types'
import { GetCategoryListParams } from './types'

type Deps = {
  prisma: PrismaClient
}

type GetCategoryParams = {
  id: string
}

type CreateCategoryParams = {
  category: Omit<Category, TimestampKey | 'id'>
}

type DeleteCategoryParams = {
  id: string
}

type BulkDeleteCategory = {
  ids: string[]
}

type RestoreCategories = {
  ids: string[]
}

type UpdateCategory = {
  id: string
  category: Omit<Category, 'id' | TimestampKey>
}

// CategoryService type is the return type of createCategoryService function.
// the return type is call CategoryService which is an object consist of multiple function.
export type CategoryService = {
  getAllCategories: (
    params: GetCategoryListParams,
  ) => Promise<Omit<Category, 'deletedAt'>[]>
  getCategory: (
    params: GetCategoryParams,
  ) => Promise<Omit<Category, 'deletedAt'> | null>
  createCategory: (params: CreateCategoryParams) => Promise<void>
  deleteCategory: (params: DeleteCategoryParams) => Promise<void>
  bulkDeleteCategory: (params: BulkDeleteCategory) => Promise<void>
  restoreCategories: (params: RestoreCategories) => Promise<void>
  updateCategory: (params: UpdateCategory) => Promise<void>
}

export const createCategoryService = (deps: Deps): CategoryService => {
  const { prisma } = deps

  return {
    getAllCategories: async ({
      limit = 10,
      offset = 0,
      searchBy = 'code',
      search = '',
      sortBy = 'createdAt',
      sortMode = 'desc',
    }) => {
      const test = await prisma.category.findMany({
        take: limit,
        skip: offset,
        select: {
          id: true,
          code: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          [sortBy]: sortMode
        },
        where: {
          deletedAt: null,
          [searchBy]: {
            contains: search,
          }
        },
      })
      console.log("HERE")
      return test
    },

    getCategory: async ({ id }) => {
      return await prisma.category.findFirst({
        select: {
          id: true,
          code: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
        where: {
          id,
        },
      })
    },

    createCategory: async ({ category }) => {
      const now = new Date()

      await prisma.category.create({
        data: {
          id: nanoid(),
          ...category,
          createdAt: now,
          updatedAt: now,
        },
      })
    },

    deleteCategory: async ({ id }) => {
      const now = new Date()

      await prisma.category.update({
        where: {
          id
        },
        data: {
          deletedAt: now
        }
      })
    },

    bulkDeleteCategory: async ({ ids }) => {
      const now = new Date()

      await prisma.category.updateMany({
        where: {
          id: {
            in: ids,
          },
        },
        data: {
          deletedAt: now,
        },
      })
    },

    restoreCategories: async ({ ids }) => {
      const now = new Date()

      await prisma.category.updateMany({
        where: {
          id: {
            in: ids,
          },
        },
        data: {
          deletedAt: now,
        },
      })
    },

    updateCategory: async ({ id, category }) => {
      await prisma.category.update({
        where: {
          id,
        },
        data: {
          ...category,
          updatedAt: new Date(),
        },
      })
    },
  }
}
