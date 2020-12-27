const { promisify } = require(`util`)
const redis = require(`redis`)

const {
  REDIS_URL,
} = process.env

const redisClient = redis.createClient(REDIS_URL)

const hsetAsync = promisify(redisClient.hset).bind(redisClient)

class BaseRecommender {
  constructor(ref, storage) {
    this.ref = ref
    this.storage = storage
  }

  async *read() {
    const files = await this.storage.ls(this.ref)

    for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
      const entity = await this.storage.read(this.ref, files[fileIndex])

      yield entity
    }
  }

  async write(entityIds) {
    return hsetAsync(`recommendations`, this.ref, JSON.stringify(entityIds))
  }
}

module.exports = BaseRecommender
