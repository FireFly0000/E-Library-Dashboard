import Redis from "ioredis";

/*const redis = new Redis({
  host: "127.0.0.1",
  //host: process.env.REDIS_HOST || "127.0.0.1",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
  password: process.env.REDIS_PASSWORD || undefined,
});*/

const redis = new Redis(process.env.REDIS_URL);

export default redis;
