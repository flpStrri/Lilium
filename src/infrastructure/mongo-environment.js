const NodeEnvironment = require('jest-environment-node') // eslint-disable-line import/no-extraneous-dependencies
const MongodbMemoryServer = require('mongodb-memory-server') // eslint-disable-line import/no-extraneous-dependencies

class MongoEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup()
    this.global.MONGOD = new MongodbMemoryServer.default({ // eslint-disable-line new-cap
      instance: {
        dbName: 'jest',
      },
      binary: {
        version: '3.2.18',
      },
    })
    this.global.MONGO_URI = await this.global.MONGOD.getConnectionString()
    this.global.MONGO_DB_NAME = 'jest'
  }

  async teardown() {
    await this.global.MONGOD.stop()
    await super.teardown()
  }

  runScript(script) {
    return super.runScript(script)
  }
}

module.exports = MongoEnvironment
