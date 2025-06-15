import AppError from "../utils/error.js";
import transactionRepository from "../repositories/transaction.repository.js";
import categoryRepository from "../repositories/category.repository.js";
import { format, isAfter, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const capitalize = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const listMonthlyReports = async (userId, period__gte, period__lte) => {
  try {
    const periodDateGte = new Date(period__gte);
    const periodDateLte = new Date(period__lte);
    const { transactions } = await transactionRepository.listTransactions(
      userId,
      null,
      null,
      periodDateGte,
      periodDateLte,
      "desc",
      null,
      null
    );

    const monthlyMap = {};

    transactions.forEach((tx) => {
      const dateObj = typeof tx.date === "string" ? parseISO(tx.date) : tx.date;
      const monthKey = format(dateObj, "MMM/yyyy", { locale: ptBR });

      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { income: 0, expense: 0 };
      }

      if (tx.type === "INCOME") {
        monthlyMap[monthKey].income += tx.amount;
      } else if (tx.type === "EXPENSE") {
        monthlyMap[monthKey].expense += tx.amount;
      }
    });

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    const result = Object.entries(monthlyMap).map(([name, values]) => ({
      name: capitalize(name),
      income: Number(values.income.toFixed(2)),
      expense: Number(values.expense.toFixed(2)),
    }));

    result.sort((a, b) => {
      const parseDateSafe = (str) =>
        parseISO(str, "MMM/yyyy", new Date(), { locale: ptBR });

      const dateA = parseDateSafe(a.name);
      const dateB = parseDateSafe(b.name);

      return dateA.getTime() - dateB.getTime();
    });

    return result;
  } catch (error) {
    throw new AppError(error.message);
  }
};

const listCategoriesReports = async (userId, period__gte) => {
  try {
    const periodDate = new Date(period__gte);
    const categories = await categoryRepository.listCategoriesWithTransactions(
      userId
    );

    const result = categories
      .map((category) => {
        const filteredTransactions = category.Transaction.filter((tx) => {
          const txDate =
            typeof tx.date === "string" ? parseISO(tx.date) : tx.date;
          return isAfter(txDate, periodDate);
        });

        const total = filteredTransactions.reduce(
          (acc, tx) => acc + tx.amount,
          0
        );

        return {
          name: category.name,
          value: Number(total.toFixed(2)),
          fill: category.color,
        };
      })
      .filter((c) => c.value > 0);

    return result;
  } catch (error) {
    throw new AppError(error.message);
  }
};

const listBalanceReports = async (userId, period__gte, period__lte) => {
  try {
    const periodDateGte = new Date(period__gte);
    const periodDateLte = new Date(period__lte);
    const { transactions } = await transactionRepository.listTransactions(
      userId,
      null,
      null,
      periodDateGte,
      periodDateLte,
      "desc",
      null
    );

    const monthlyMap = {};

    transactions.forEach((tx) => {
      const dateObj = typeof tx.date === "string" ? parseISO(tx.date) : tx.date;
      const rawMonth = format(dateObj, "MMM", { locale: ptBR });
      const monthKey = capitalize(rawMonth);

      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { balance: 0 };
      }

      if (tx.type === "INCOME") {
        monthlyMap[monthKey].balance += tx.amount;
      } else if (tx.type === "EXPENSE") {
        monthlyMap[monthKey].balance -= tx.amount;
      }
    });

    const result = Object.entries(monthlyMap).map(([name, { balance }]) => ({
      name,
      balance: Number(balance.toFixed(2)),
    }));

    const monthOrder = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];

    result.sort((a, b) => {
      const aIndex = monthOrder.indexOf(a.name);
      const bIndex = monthOrder.indexOf(b.name);
      return aIndex - bIndex;
    });

    return result;
  } catch (error) {
    throw new AppError(error.message);
  }
};

const listSummaryReports = async (userId, period__gte, period__lte) => {
  try {
    const { transactions } = await transactionRepository.listTransactions(
      userId,
      null,
      null,
      new Date(period__gte),
      new Date(period__lte),
      "desc",
      null,
      null
    );

    const summary = {
      income: 0,
      expense: 0,
      balance: 0,
    };

    transactions.forEach((tx) => {
      if (tx.type === "INCOME") {
        summary.income += tx.amount;
      } else if (tx.type === "EXPENSE") {
        summary.expense += tx.amount;
      }
    });
    summary.balance = summary.income - summary.expense;

    const result = {
      income: Number(summary.income.toFixed(2)),
      expense: Number(summary.expense.toFixed(2)),
      balance: Number(summary.balance.toFixed(2)),
    };

    return result;
  } catch (error) {
    throw new AppError(error.message);
  }
};

export default {
  listMonthlyReports,
  listCategoriesReports,
  listBalanceReports,
  listSummaryReports,
};
