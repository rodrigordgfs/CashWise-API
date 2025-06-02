import reportController from "../controllers/report.controller.js";

const reportRoute = (fastify) => {
  fastify.get("/reports/monthly", reportController.listMonthlyReports);
  fastify.get("/reports/categories", reportController.listCategoriesWithTransactions);
  fastify.get("/reports/balance", reportController.listBalanceReports);
  fastify.get("/reports/summary", reportController.listSummaryReports);
};

export default reportRoute;
