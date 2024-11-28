const fastify = require("fastify")();
const jwt = require("jsonwebtoken");
const cookie = require("@fastify/cookie");

const { connectDatabase } = require("./infrastructure/db");
const routes = require("./routes");

connectDatabase();

fastify.register(cookie);
fastify.register(routes);

fastify.decorate("authenticate", async (request, reply) => {
  try {
	jwt.verify(request.headers.authorization.split(' ')[1], process.env.JWT_SECRET);
  } catch (err) {
    reply.status(401).send({ error: "Unauthorized" });
  }
});

fastify.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
});