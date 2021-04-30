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
    await sequential(
      range(1, 100).map(authorId => {
        return () =>
          Author.create(
            {
              name: `author${authorId}`,
              books: range(1, 100).map(bookId => ({ name: `book${bookId}` }))
            },
            {
              include: [Book]
            }
          )
      })
    )
  })
  describe('', () => {
    it('should paginate with defaults', async () => {
      const { docs, pages, total } = await Author.paginate()
      expect(docs).to.be.an('array')
      expect(docs.length).to.equal(25)
      expect(pages).to.equal(4)
      expect(total).to.equal(99)
    })

    it('should paginate with page and paginate', async () => {
      const { docs, pages, total } = await Author.paginate({
        page: 2,
        paginate: 50
      })
      expect(docs).to.be.an('array')
      expect(docs.length).to.equal(49)
      expect(pages).to.equal(2)
      expect(total).to.equal(99)
    })

    it('should paginate and ignore limit and offset', async () => {
      const { docs, pages, total } = await Author.paginate({
        limit: 2,
        offset: 50
      })
      expect(docs).to.be.an('array')
      expect(docs.length).to.equal(25)
      expect(pages).to.equal(4)
      expect(total).to.equal(99)
    })

    it('should paginate with extras', async () => {
      const { docs, pages, total } = await Author.paginate({
        include: [{ model: Book }],
        order: [['id']]
      })
      expect(docs).to.be.an('array')
      expect(docs.length).to.equal(25)
      expect(pages).to.equal(4)
      expect(total).to.equal(99)
      expect(docs[0].books).to.be.an('array')
      expect(docs[0].books.length).to.equal(99)
    })

    it('should paginate with defaults and group by statement', async () => {
      const group = ['id']
      const { docs, pages, total } = await Author.paginate({ group })
      expect(docs).to.be.an('array')
      expect(docs.length).to.equal(25)
      expect(pages).to.equal(4)
      expect(total).to.equal(99)
    })

    it('should paginate with filters, order and paginate', async () => {
      const { docs, pages, total } = await Author.paginate({
        order: [['name', 'DESC']],
        where: { name: { [Sequelize.Op.like]: 'author1%' } },
        paginate: 5
      })
      expect(docs).to.be.an('array')
      expect(docs.length).to.equal(5)
      expect(pages).to.equal(3)
      expect(total).to.equal(11)
    })

    it('should paginate with custom scope', async () => {
      Author.addScope('author1', {
        where: { name: { [Sequelize.Op.like]: 'author1%' } }
      })
      const { docs, pages, total } = await Author.scope('author1').paginate({
        order: [['name', 'DESC']],
        paginate: 5
      })
      expect(docs).to.be.an('array')
      expect(docs.length).to.equal(5)
      expect(pages).to.equal(3)
      expect(total).to.equal(11)
    })

    it('should paginate with aggregate required', async () => {
      const { docs, pages, total } = await Author.paginate({
        include: [{ model: Book, where: { name: 'book100' }, required: true }],
        order: [['id']]
      })
      expect(docs).to.be.an('array')
      expect(docs.length).to.equal(0)
      expect(pages).to.equal(0)
      expect(total).to.equal(0)
    })

    it('should paginate with aggregate not required', async () => {
      const { docs, pages, total } = await Author.paginate({
        include: [{ model: Book, where: { name: 'book100' }, required: false }],
        order: [['id']]
      })
      expect(docs).to.be.an('array')
      expect(docs.length).to.equal(25)
      expect(docs[0].books).to.be.an('array')
      expect(docs[0].books.length).to.equal(0)
      expect(pages).to.equal(4)
      expect(total).to.equal(99)
    })
  })
})
