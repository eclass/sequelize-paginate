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
     * @typedef {Object} paginateOptions
     * @property {Array} attributes Model attributes
     * @property {Object} where Model where
     * @property {Array} order Model order
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
      const options = {
        attributes: params.attributes,
        where: params.where
      }
      const total = await Model.count({ where: options.where })
      const pages = Math.ceil(total / params.paginate)
      options.limit = params.paginate
      options.offset = params.paginate * (params.page - 1)
      if (params.order) options.order = params.order
      const docs = await Model.findAll(options)
      return { docs, pages, total }
    }
    const instanceOrModel = Model.Instance || Model
    instanceOrModel.paginate = pagination
  }
}

module.exports = new SequelizePaginate()
