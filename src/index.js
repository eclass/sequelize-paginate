'use strict'

class SequelizePaginate {
  /**
   * Sequelize Model
   * @external {Model} http://docs.sequelizejs.com/class/lib/model.js~Model.html
   */
  /**
   * Method to append paginate method to Model
   * @param {Model} Model Sequelize Model
   * @param {paginateOptions} options
   */
  paginate (Model) {
    /**
     * The paginate options
     * @typedef {Object} paginateOptions Sequelize query options
     * @property {Number} paginate Results per page
     * @property {Number} page Number of page
     */
    /**
     * The paginate result
     * @typedef {Object} paginateResult
     * @property {Array} docs Docs
     * @property {Number} pages Number of page
     * @property {Number} total Total of docs
     */
    /**
     * pagination
     * @param {paginateOptions} params Options to filter query
     * @return {paginateResult} Total pages and docs
     */
    const pagination = async function (params) {
      const options = Object.keys(params).reduce((acc, key) => {
        if (!['paginate', 'page'].includes(key)) {
          acc[key] = params[key]
        }
        return acc
      }, {})
      const countOptions = Object.keys(options).reduce((acc, key) => {
        if (!['order', 'attributes'].includes(key)) {
          acc[key] = params[key]
        }
        return acc
      }, {})
      const total = await Model.count(countOptions)
      const pages = Math.ceil(total / params.paginate)
      options.limit = params.paginate
      options.offset = params.paginate * (params.page - 1)
      /* eslint-disable no-console */
      if (params.limit) {
        console.warn(`(sequelize-pagination) Warning: limit option is ignored.`)
      }
      if (params.offset) {
        console.warn(`(sequelize-pagination) Warning: offset option is ignored.`)
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
