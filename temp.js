if (!process.env.NODE_ENV || process.env.NODE_ENV !== "production") {
    const dotenv = require("dotenv").config()
}

const Ioredis = require('ioredis');

(async () => {

  const redis = new Ioredis(process.env.STACKHERO_REDIS_URL_TLS);

  // Set key "stackhero-example-key" to "abcd"
  await redis.set('stackhero-example-key', 'abcd');

  // Get key "stackhero-example-key"
  const value = await redis.get('stackhero-example-key');
  console.log(`Key "stackhero-example-key" has value "${value}"`);

  // Finally delete key "stackhero-example-key"
  await redis.del('stackhero-example-key');
redis.disconnect();
})().catch(error => {
  console.error('An error occurred!\n', error);
});