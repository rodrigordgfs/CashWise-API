// src/plugins/zodValidate.js
import fp from "fastify-plugin";

function makeValidator({ body, query, params }) {
  return async (request) => {
    if (body)   request.body   = body.parse(request.body);
    if (query)  request.query  = query.parse(request.query);
    if (params) request.params = params.parse(request.params);
  };
}

export default fp(async (fastify) => {
  fastify.decorate("zodValidate", makeValidator);
});
