'use strict'

const { describe, before, it } = require('mocha')
const { expect } = require('chai')
const Sequelize = require('sequelize')
const range = require('lodash.range')
const sequential = require('promise-sequential')
const sequelizePaginate = require('../src')

describe('sequelizePaginate', () => {
  let Author
  let Book
  before(async () => {
    const DATABASE = process.env.DATABASE || 'mysql://root:root@localhost/test'
    const sequelize = new Sequelize(DATABASE, {
      logging: false,
      operatorsAliases: false
    })
    await sequelize.authenticate()
    Author = sequelize.define('author', {
      name: Sequelize.STRING
    })
    Book = sequelize.define('book', {
      name: Sequelize.STRING,
      authorId: Sequelize.INTEGER
    })
    Author.hasMany(Book, { foreignKey: 'authorId' })
    sequelizePaginate.paginate(Author)
    await Book.drop()
    await Author.drop()
    await Author.sync({ force: true })
    await Book.sync({ force: true })
    await sequential(range(1, 100).map(authorId => {
      return () => Author.create({
        name: `author${authorId}`,
        books: range(1, 100).map(bookId => ({ name: `book${bookId}` }))
      }, {
        include: [ Book ]
      })
    }))
  })
  describe('', () => {
    it('should paginate authors', async () => {
      const { docs, pages, total } = await Author.paginate({
        include: [{ model: Book }],
        order: [['id']],
        page: 1,
        paginate: 25
      })
      expect(docs).to.be.an('array')
      expect(docs.length).to.equal(25)
      expect(pages).to.equal(4)
      expect(total).to.equal(99)
      expect(docs[0].books).to.be.an('array')
      expect(docs[0].books.length).to.equal(99)
    })
  })
})
