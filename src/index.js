'use strict'

/**
 * Class to paginate sequelite results.
 */
class SequelizePaginate {
  /** @typedef {import('sequelize').Model} Model */
  /**
   * Method to append paginate method to Model.
   *
   * @param {Model} Model - Sequelize Model.
   * @returns {*} -
   * @example
   * const sequelizePaginate = require('sequelize-paginate')
   *
   * sequelizePaginate.paginate(MyModel)
   */
  paginate (Model) {
    /**
     * @typedef {Object} Paginate Sequelize query options
     * @property {number} [paginate=25] Results per page
     * @property {number} [page=1] Number of page
     */
    /**
     * @typedef {import('sequelize').FindOptions & Paginate} paginateOptions
     */
    /**
     * The paginate result
     * @typedef {Object} PaginateResult
     * @property {Array} docs Docs
     * @property {number} pages Number of page
     * @property {number} total Total of docs
     */
    /**
     * Pagination.
     *
     * @param {paginateOptions} [params] - Options to filter query.
     * @returns {Promise<PaginateResult>} Total pages and docs.
     * @example
     * const { docs, pages, total } = await MyModel.paginate({ page: 1, paginate: 25 })
     * @memberof Model
     */
    const pagination = async function ({
      page = 1,
      paginate = 25,
      ...params
    } = {}) {
      const options = Object.assign({}, params)
      const countOptions = Object.keys(options).reduce((acc, key) => {
        if (!['order', 'attributes', 'include'].includes(key)) {
          // eslint-disable-next-line security/detect-object-injection
          acc[key] = options[key]
        }
        return acc
      }, {})

      let total = await this.count(countOptions)

      if (options.group !== undefined) {
        // @ts-ignore
        total = total.length
      }

      const pages = Math.ceil(total / paginate)
      options.limit = paginate
      options.offset = paginate * (page - 1)
      /* eslint-disable no-console */
      if (params.limit) {
        console.warn(`(sequelize-pagination) Warning: limit option is ignored.`)
      }
      if (params.offset) {
        console.warn(
          `(sequelize-pagination) Warning: offset option is ignored.`
        )
      }
      /* eslint-enable no-console */
      if (params.order) options.order = params.order
      const docs = await this.findAll(options)
      return { docs, pages, total }
    }
    const instanceOrModel = Model.Instance || Model
    // @ts-ignore
    instanceOrModel.paginate = pagination
  }
}

module.exports = new SequelizePaginate()
