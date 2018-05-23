# sequelize-paginate

[![npm version](https://img.shields.io/npm/v/sequelize-paginate.svg)](https://www.npmjs.com/package/sequelize-paginate)
[![npm downloads](https://img.shields.io/npm/dm/sequelize-paginate.svg)](https://www.npmjs.com/package/sequelize-paginate)
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
const options = {
  attributes: ['id', 'name'],
  page: 1,
  paginate: 25,
  order: [['name', 'DESC']],
  where: { name: { [Op.like]: `%elliot%` } }
}
const { docs, pages, total } = await db.MyModel.paginate(options)
```

## License

[MIT](https://tldrlegal.com/license/mit-license)
