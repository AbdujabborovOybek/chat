const redis = require("redis");

const redisClient = redis.createClient({ url: "redis://localhost:6379" });

redisClient.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

redisClient.on("connect", () => {
  console.log("✅ Connected to Redis successfully");
});

// Redisni ishlatishdan oldin bog'lanish
(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;
