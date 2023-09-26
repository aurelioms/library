import { SortMode, TimestampKey } from './../types'

export type CategorySortBy = 'code' | 'name' | TimestampKey

export type CategorySearchBy = 'code' | 'name'

export type GetCategoryListParams = Partial<{
  limit: number
  offset: number
  sortBy: CategorySortBy
  sortMode: SortMode
  searchBy: CategorySearchBy
  search: string
}>
