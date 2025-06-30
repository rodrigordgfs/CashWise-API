import fp from "fastify-plugin";

/**
 * Creates a request validator function using optional Zod schemas for body, query, and params.
 *
 * The returned function validates and parses the corresponding properties of a Fastify request using the provided Zod schemas. If a schema is provided for a property, the request property is replaced with the parsed and validated data.
 *
 * @param {Object} schemas - Object containing optional Zod schemas.
 * @param {import('zod').ZodType} [schemas.body] - Zod schema for request body validation.
 * @param {import('zod').ZodType} [schemas.query] - Zod schema for request query validation.
 * @param {import('zod').ZodType} [schemas.params] - Zod schema for request params validation.
 * @return {function(import('fastify').FastifyRequest): Promise<void>} An async function that validates and parses the request.
 */
function makeValidator({ body, query, params }) {
  return async (request) => {
    if (body)   request.body   = body.parse(request.body);
    if (query)  request.query  = query.parse(request.query);
    if (params) request.params = params.parse(request.params);
  };
}

/**
 * Fastify plugin that provides Zod validation functionality
 * Decorates the Fastify instance with a zodValidate method for request validation
 * @param {import('fastify').FastifyInstance} fastify - The Fastify instance
 * @returns {Promise<void>} Promise that resolves when plugin is registered
 */
export default fp(async (fastify) => {
  fastify.decorate("zodValidate", makeValidator);
});