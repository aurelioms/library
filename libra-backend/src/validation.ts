import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'

import { Handler } from './handler'

type Options = Partial<{
  bodySchema: z.Schema
  querySchema: z.Schema
  paramsSchema: z.Schema
}>

export const withValidation = (options: Options, handler: Handler): Handler => {
  const { bodySchema, querySchema, paramsSchema } = options

  return (req, res, next) => {
    try {
      if (bodySchema !== undefined) {
        bodySchema.parse(req.body)
      }

      if (querySchema !== undefined) {
        querySchema.parse(req.query)
      }

      if (paramsSchema !== undefined) {
        paramsSchema.parse(req.params)
      }

      handler(req, res, next)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldsError = error.errors.map(({ path, message }) => ({
          key: path.join('.'),
          message,
        }))

        return res.status(StatusCodes.BAD_REQUEST).json(fieldsError)
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error,
      })
    }
  }
}

export const zodLiteralUnion = (
  union: string[],
  options: { isOptional: boolean } = { isOptional: false },
) => {
  const schema = union.reduce(
    (acc: z.Schema, literal) => acc.or(z.literal(literal)) as z.Schema,
    z.literal(union[0]),
  )

  if (options.isOptional) return schema.optional()

  return schema
}
