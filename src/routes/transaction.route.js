import transactionController from "../controllers/transaction.controller.js";

const transactionRoute = (fastify) => {
  fastify.post("/transaction", transactionController.createTransaction);
  fastify.get("/transaction", transactionController.listTransactions);
  fastify.get("/transaction/:id", transactionController.listTransactionById);
  fastify.delete("/transaction/:id", transactionController.deleteTransaction);
  fastify.patch("/transaction/:id", transactionController.updateTransaction);
};

export default transactionRoute;
