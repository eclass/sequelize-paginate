import { FindOptions, Model } from 'sequelize'

type TModel = typeof Model

export class SequelizePaginate<TInstance, TAttributes> {
  public paginate (Model: Model<TInstance, TAttributes> | TModel): void
}

export interface Paginate {
  paginate?: number
  page?: number
}

export interface PaginateResult<TAttributes> {
  docs: TAttributes[]
  pages: number
  total: number
}

export function paginate<TInstance, TAttributes> (
  Model: Model<TInstance, TAttributes> | TModel
): void

export function pagination<T, TAttributes> (
  params: FindOptions & Paginate
): Promise<TAttributes>
