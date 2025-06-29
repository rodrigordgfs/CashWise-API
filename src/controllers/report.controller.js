import { StatusCodes } from "http-status-codes";
import reportService from "../services/report.service.js";
import { handleErrorResponse } from "../utils/error.js";

const listMonthlyReports = async (req, reply) => {
  try {
    const reports = await reportService.listMonthlyReports(
      req.userId,
      req.query.period__gte,
      req.query.period__lte
    );
    reply.code(StatusCodes.OK).send(reports);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const listCategoriesWithTransactions = async (req, reply) => {
  try {
    const reports = await reportService.listCategoriesReports(
      req.userId,
      req.query.period__gte,
      req.query.period__lte,
      req.query.limit
    );
    reply.code(StatusCodes.OK).send(reports);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const listBalanceReports = async (req, reply) => {
  try {
    const reports = await reportService.listBalanceReports(
      req.userId,
      req.query.period__gte,
      req.query.period__lte
    );
    reply.code(StatusCodes.OK).send(reports);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const listSummaryReports = async (req, reply) => {
  try {
    const reports = await reportService.listSummaryReports(
      req.userId,
      new Date(req.query.period__gte),
      new Date(req.query.period__lte)
    );
    reply.code(StatusCodes.OK).send(reports);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

export default {
  listMonthlyReports,
  listCategoriesWithTransactions,
  listBalanceReports,
  listSummaryReports,
};
