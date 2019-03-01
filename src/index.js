'use strict'

/**
 * Class to paginate sequelite results.
 */
class SequelizePaginate {
  /**
   * Sequelize Model
   * @typedef {Object} Model
   * @external {Model} http://docs.sequelizejs.com/class/lib/model.js~Model.html
   */
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
     * The paginate options
     * @typedef {Object} paginateOptions Sequelize query options
     * @property {Number} [paginate=25] Results per page
     * @property {Number} [page=1] Number of page
     */
    /**
     * The paginate result
     * @typedef {Object} paginateResult
     * @property {Array} docs Docs
     * @property {Number} pages Number of page
     * @property {Number} total Total of docs
     */
    /**
     * Pagination.
     *
     * @param {paginateOptions} [params] - Options to filter query.
     * @returns {paginateResult} Total pages and docs.
     * @example
     * const { docs, pages, total } = MyModel.paginate({ page: 1, paginate: 25 })
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

      let total = await Model.count(countOptions)

      if (options.group !== undefined) {
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
      const docs = await Model.findAll(options)
      return { docs, pages, total }
    }
    const instanceOrModel = Model.Instance || Model
    instanceOrModel.paginate = pagination
  }
}

module.exports = new SequelizePaginate()
