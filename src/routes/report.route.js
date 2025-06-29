import reportController from "../controllers/report.controller.js";
import {
  basePeriodSchema,
  reportWithLimitSchema,
} from "../schemas/report.schema.js";

/**
 * Registers report-related GET endpoints on the Fastify instance with schema-based query validation.
 *
 * Sets up routes for monthly, category, balance, and summary reports, ensuring incoming queries conform to the appropriate Zod schemas before invoking the corresponding controller methods.
 */
export default async function reportRoutes(fastify) {
  const v = fastify.zodValidate;

  fastify.get(
    "/report/monthly",
    { preHandler: v({ query: basePeriodSchema }) },
    reportController.listMonthlyReports
  );

  fastify.get(
    "/report/categories",
    { preHandler: v({ query: reportWithLimitSchema }) },
    reportController.listCategoriesWithTransactions
  );

  fastify.get(
    "/report/balance",
    { preHandler: v({ query: basePeriodSchema }) },
    reportController.listBalanceReports
  );

  fastify.get(
    "/report/summary",
    { preHandler: v({ query: basePeriodSchema }) },
    reportController.listSummaryReports
  );
}
