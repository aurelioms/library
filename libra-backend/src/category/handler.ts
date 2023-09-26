import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'

import { Handler } from './../handler'
import { withValidation, zodLiteralUnion } from './../validation'
import { CategoryService } from './service'

type GetAllCategoriesHandlerDeps = {
  categoryService: CategoryService
}

const getAllCategoriesQuerySchema = z.object({
  limit: z
    .string()
    .regex(/^[0-9]+$/, 'Should be a number')
    .optional(),
  offset: z
    .string()
    .regex(/^[0-9]+$/, 'Should be a number')
    .optional(),
  searchBy: zodLiteralUnion(['code', 'name'], { isOptional: true }),
  search: z.string().optional(),
  sortBy: zodLiteralUnion(['code', 'name', 'createdAt'], { isOptional: true }),
  sortMode: zodLiteralUnion(['asc', 'desc'], { isOptional: true }),
})

type GetAllCategoriesQuerySchema = z.infer<typeof getAllCategoriesQuerySchema>

export const getAllCategoriesHandler = (
  deps: GetAllCategoriesHandlerDeps,
): Handler =>
  withValidation(
    {
      querySchema: getAllCategoriesQuerySchema,
    },
    async (req, res, next) => {
      const { categoryService } = deps

      try {
        const { limit, offset, searchBy, search, sortBy, sortMode } =
          req.query as GetAllCategoriesQuerySchema

        const categories = await categoryService.getAllCategories({
          limit: parseInt(limit as string) || undefined,
          offset: parseInt(offset as string) || undefined,
          searchBy,
          search,
          sortBy,
          sortMode,
        })

        return res.status(StatusCodes.OK).json({ data: categories })
      } catch (error) {
        next(error)
      }
    },
  )

type GetCategoryHandlerDeps = {
  categoryService: CategoryService
}

const getCategoryParamsSchema = z.object({
  id: z.string(),
})

type GetCategoryParamsSchema = z.infer<typeof getCategoryParamsSchema>

export const getCategoryHandler = (deps: GetCategoryHandlerDeps): Handler =>
  withValidation(
    {
      paramsSchema: getCategoryParamsSchema,
    },
    async (req, res, next) => {
      const { categoryService } = deps
      try {
        const { id } = req.params as GetCategoryParamsSchema
        const category = await categoryService.getCategory({ id })

        return res.status(StatusCodes.OK).json({ data: category })
      } catch (error) {
        next(error)
      }
    },
  )

type CreateCategoryHandlerDeps = {
  categoryService: CategoryService
}

const categoryBodySchema = z.object({
  code: z
    .string()
    .min(1, 'Category code should have at least 1 character')
    .max(10, 'Category code can only have maximum 10 characters'),
  name: z
    .string()
    .min(1, 'Category name should have at least 1 character')
    .max(255, 'Category name can only have maximum 255 characters'),
})

type CategoryBodySchema = z.infer<typeof categoryBodySchema>

export const createCategoryHandler = (
  deps: CreateCategoryHandlerDeps,
): Handler =>
  withValidation(
    {
      bodySchema: categoryBodySchema,
    },
    async (req, res, next) => {
      try {
        const { categoryService } = deps

        const { code, name } = req.body as CategoryBodySchema

        if (code.length <= 0) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Code cannot be empty.',
          })
        }

        if (name.length <= 0) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Name cannot be empty.',
          })
        }

        await categoryService.createCategory({
          category: {
            code,
            name,
          },
        })

        return res.status(StatusCodes.OK).json({
          success: true,
        })
      } catch (error) {
        next(error)
      }
    },
  )

type BulkDeleteCategoryHandlerDeps = {
  categoryService: CategoryService
}

const bulkDeleteBodySchema = z.object({
  ids: z.string().array().min(1),
})

type BulkDeleteBodySchema = z.infer<typeof bulkDeleteBodySchema>

export const bulkDeleteCategoryHandler = (
  deps: BulkDeleteCategoryHandlerDeps,
): Handler =>
  withValidation(
    {
      bodySchema: bulkDeleteBodySchema,
    },
    async (req, res, next) => {
      const { categoryService } = deps
      try {
        const { ids } = req.body as BulkDeleteBodySchema

        await categoryService.bulkDeleteCategory({ ids })

        return res.status(StatusCodes.OK).json({
          success: true,
        })
      } catch (error) {
        next(error)
      }
    },
  )

type UpdateCategory = {
  categoryService: CategoryService
}

const updateCategoryParamsSchema = z.object({
  id: z.string(),
})

type UpdateCategoryParamsSchema = z.infer<typeof updateCategoryParamsSchema>

const updateCategoryBodySchema = z.object({
  code: z
    .string()
    .min(1, 'Category code should have at least 1 character')
    .max(10, 'Category code can only have maximum 10 characters'),
  name: z
    .string()
    .min(1, 'Category name should have at least 1 character')
    .max(255, 'Category name can only have maximum 255 characters'),
})

type UpdateCategoryBodySchema = z.infer<typeof updateCategoryBodySchema>

export const updateCategoryHandler = (deps: UpdateCategory): Handler =>
  withValidation(
    {
      bodySchema: updateCategoryBodySchema,
      paramsSchema: updateCategoryParamsSchema,
    },
    async (req, res, next) => {
      const { categoryService } = deps

      try {
        const { id } = req.params as UpdateCategoryParamsSchema
        const { code, name } = req.body as UpdateCategoryBodySchema

        await categoryService.updateCategory({
          id,
          category: {
            code,
            name,
          },
        })

        return res.status(StatusCodes.OK).json({
          success: true,
        })
      } catch (error) {
        console.log(error)
        next(error)
      }
    },
  )

type RestoreCategory = {
  categoryService: CategoryService
}

const bulkRestoreBodySchema = z.object({
  ids: z.string().array().min(1),
})

type BulkRestoreBodySchema = z.infer<typeof bulkRestoreBodySchema>

export const restoreCategoryHandler = (deps: RestoreCategory): Handler =>
  withValidation(
    {
      bodySchema: bulkRestoreBodySchema,
    },
    async (req, res, next) => {
      const { categoryService } = deps
      try {
        const { ids } = req.body as BulkRestoreBodySchema

        await categoryService.restoreCategories({ ids })

        return res.status(StatusCodes.OK).json({
          success: true,
        })
      } catch (error) {
        next(error)
      }
    },
  )
