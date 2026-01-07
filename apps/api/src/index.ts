import Fastify, { type FastifyRequest } from "fastify";

const fastify = Fastify({
  logger: true,
});

fastify.get("/", (req, reply) => {
  return { message: "Hello World" };
});

fastify.route({
  method: "GET",
  url: "/hello/:name",
  handler: (req: FastifyRequest<{ Params: { name: string } }>, reply) => {
    const { name } = req.params;
    return { message: `Hello ${name}` };
  },
});

try {
  fastify.listen({
    port: 8080,
    host: "0.0.0.0",
  });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
