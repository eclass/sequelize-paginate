import { FindOptions, Model } from 'sequelize'

export class SequelizePaginate<TInstance, TAttributes> {
  public paginate(Model: Model<TInstance, TAttributes>): void
}

export interface Paginate {
  paginate?: number
  page?: number
}

export interface PaginateResult<TAttributes> {
  docs: Array<TAttributes>
  pages: number
  total: number
}

export function paginate<TInstance, TAttributes>(
  Model: Model<TInstance, TAttributes>
): void
export function pagination<T, TAttributes>(
  params: FindOptions & Paginate
): Promise<TAttributes>
