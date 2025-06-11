import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import reportService from "../services/report.service.js";
import { handleErrorResponse } from "../utils/error.js";
import { getUserIdFromRequest } from "../utils/getUserId.js";

const listMonthlyReports = async (request, reply) => {
  const querySchema = z.object({
    period__gte: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Data inválida",
    }),
  });

  try {
    const validation = querySchema.safeParse(request.query);
    if (!validation.success) throw validation.error;

    const { period__gte } = validation.data;
    const userId = await getUserIdFromRequest(request);
    const reports = await reportService.listMonthlyReports(userId, period__gte);
    reply.code(StatusCodes.OK).send(reports);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const listCategoriesWithTransactions = async (request, reply) => {
  const querySchema = z.object({
    period__gte: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Data inválida",
    }),
  });

  try {
    const validation = querySchema.safeParse(request.query);
    if (!validation.success) throw validation.error;

    const { period__gte } = validation.data;
    const userId = await getUserIdFromRequest(request);
    const categories = await reportService.listCategoriesReports(
      userId,
      period__gte
    );
    reply.code(StatusCodes.OK).send(categories);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const listBalanceReports = async (request, reply) => {
  const querySchema = z.object({
    period__gte: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Data inválida",
    }),
  });

  try {
    const validation = querySchema.safeParse(request.query);
    if (!validation.success) throw validation.error;

    const { period__gte } = validation.data;
    const userId = await getUserIdFromRequest(request);
    const reports = await reportService.listBalanceReports(userId, period__gte);
    reply.code(StatusCodes.OK).send(reports);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const listSummaryReports = async (request, reply) => {
  const querySchema = z.object({
    period__gte: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Data inválida",
    }),
  });

  try {
    const validation = querySchema.safeParse(request.query);
    if (!validation.success) throw validation.error;

    const { period__gte } = validation.data;
    const userId = await getUserIdFromRequest(request);
    const reports = await reportService.listSummaryReports(userId, period__gte);
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
