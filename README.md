# sequelize-paginate

[![npm version](https://img.shields.io/npm/v/sequelize-paginate.svg)](https://www.npmjs.com/package/sequelize-paginate)
[![npm downloads](https://img.shields.io/npm/dm/sequelize-paginate.svg)](https://www.npmjs.com/package/sequelize-paginate)
[![Build Status](https://travis-ci.org/eclass/sequelize-paginate.svg?branch=master)](https://travis-ci.org/eclass/sequelize-paginate)
[![devDependency Status](https://img.shields.io/david/dev/eclass/sequelize-paginate.svg)](https://david-dm.org/eclass/sequelize-paginate#info=devDependencies)

> Sequelize model plugin for add paginate method

## Installation

```bash
npm i sequelize-paginate
```

## Use

```js
// model.js
const sequelizePaginate = require('sequelize-paginate')

module.exports = (sequelize, DataTypes) => {
  const MyModel = sequelize.define(
    'MyModel',
    {
      name: { type: DataTypes.STRING(255) }
    }
  )
  sequelizePaginate.paginate(MyModel)
  return MyModel
}

// controller.js
const { Op } = db.sequelize
// Default page = 1 and paginate = 25
const { docs, pages, total } = await db.MyModel.paginate()
// Or with extra options
const options = {
  attributes: ['id', 'name'],
  page: 1, // Default 1
  paginate: 25, // Default 25
  order: [['name', 'DESC']],
  where: { name: { [Op.like]: `%elliot%` } }
}
const { docs, pages, total } = await db.MyModel.paginate(options)
```

**NOTE:** _If **options** include **limit** or **offset** are ignored._

## License

[MIT](https://tldrlegal.com/license/mit-license)
