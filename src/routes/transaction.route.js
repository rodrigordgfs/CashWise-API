import transactionController from "../controllers/transaction.controller.js";
import {
  createTransactionSchema,
  createTransactionsFromOfxSchema,
  idParamSchema,
  querySchema,
  updateTransactionSchema,
} from "../schemas/transaction.schema.js";

/**
 * Registers transaction-related HTTP routes on the Fastify instance with schema validation and controller handlers.
 *
 * Sets up endpoints for creating, importing, listing, retrieving, updating, and deleting transactions, applying Zod-based validation to request bodies, query parameters, and route parameters before invoking the corresponding controller methods.
 */
export default async function transactionRoute(fastify) {
  const v = fastify.zodValidate;   // atalho opcional

  fastify.post(
    "/transaction",
    { preHandler: v({ body: createTransactionSchema }) },
    transactionController.createTransaction,
  );

  fastify.post(
    "/transaction/import-ofx",
    { preHandler: v({ body: createTransactionsFromOfxSchema }) },
    transactionController.createTransactionsFromOfx,
  );

  fastify.get(
    "/transaction",
    { preHandler: v({ query: querySchema }) },
    transactionController.listTransactions,
  );

  fastify.get(
    "/transaction/:id",
    { preHandler: v({ params: idParamSchema }) },
    transactionController.listTransactionById,
  );

  fastify.delete(
    "/transaction/:id",
    { preHandler: v({ params: idParamSchema }) },
    transactionController.deleteTransaction,
  );

  fastify.patch(
    "/transaction/:id",
    {
      preHandler: v({ params: idParamSchema, body: updateTransactionSchema }),
    },
    transactionController.updateTransaction,
  );
}