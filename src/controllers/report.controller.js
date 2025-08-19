import { StatusCodes } from "http-status-codes";
import reportService from "../services/report.service.js";
import { handleErrorResponse } from "../utils/error.js";

/**
 * Generates monthly financial reports with income and expense data
 * @param {import('fastify').FastifyRequest} req - The request object containing period filters
 * @param {import('fastify').FastifyReply} reply - The reply object to send response
 * @returns {Promise<void>} Promise that resolves with monthly report data
 */
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

/**
 * Generates category-based financial reports with transaction totals
 * @param {import('fastify').FastifyRequest} req - The request object containing period filters and limit
 * @param {import('fastify').FastifyReply} reply - The reply object to send response
 * @returns {Promise<void>} Promise that resolves with category report data
 */
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

/**
 * Generates balance reports showing monthly financial balance (income - expenses)
 * @param {import('fastify').FastifyRequest} req - The request object containing period filters
 * @param {import('fastify').FastifyReply} reply - The reply object to send response
 * @returns {Promise<void>} Promise that resolves with balance report data
 */
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

/**
 * Generates summary financial reports with consolidated totals
 * @param {import('fastify').FastifyRequest} req - The request object containing period filters
 * @param {import('fastify').FastifyReply} reply - The reply object to send response
 * @returns {Promise<void>} Promise that resolves with summary report data
 */
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