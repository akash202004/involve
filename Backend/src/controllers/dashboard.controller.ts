import { Request, Response } from "express";
import { db } from "@/config/drizzle";
import { jobs, workers, transactions } from "@/db/schema";
import { sql, count, avg, max, sum, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    const totalWorkers = await db
      .select({ value: count(workers.id) })
      .from(workers);
    const totalRevenue = await db
      .select({ value: sum(transactions.amount) })
      .from(transactions);
    const avgIncomeResult = await db
      .select({ value: avg(transactions.amount) })
      .from(transactions);

    // Since Drizzle returns string for aggregation, we parse them.
    const totalRevenueValue = totalRevenue[0].value
      ? parseFloat(totalRevenue[0].value)
      : 0;
    const avgIncomeValue = avgIncomeResult[0].value
      ? parseFloat(avgIncomeResult[0].value)
      : 0;

    // For highest income, we need to group by worker and find the max of sums.
    const workerTransactions = alias(transactions, "worker_transactions");
    const incomePerWorker = await db
      .select({
        workerId: workerTransactions.jobId,
        totalIncome: sum(workerTransactions.amount).as("total_income"),
      })
      .from(workerTransactions)
      .groupBy(workerTransactions.jobId);

    const highestIncome = incomePerWorker.reduce((max, current) => {
      const income = current.totalIncome ? parseFloat(current.totalIncome) : 0;
      return income > max ? income : max;
    }, 0);

    const monthlyOrders = await db.select({ value: count(jobs.id) }).from(jobs); // This can be refined to be 'monthly'

    const topWorkers = await db
      .select({
        name: workers.firstName,
        income: sql<number>`sum(${transactions.amount})`.mapWith(Number),
        orders: sql<number>`count(${jobs.id})`.mapWith(Number),
      })
      .from(workers)
      .leftJoin(transactions, eq(workers.id, transactions.jobId))
      .leftJoin(jobs, eq(workers.id, jobs.workerId))
      .groupBy(workers.id)
      .orderBy(sql`sum(${transactions.amount}) DESC`)
      .limit(5);

    res.status(200).json({
      totalWorkers: totalWorkers[0].value,
      totalRevenue: totalRevenueValue,
      avgIncome: avgIncomeValue,
      highestIncome: highestIncome,
      monthlyOrders: monthlyOrders[0].value,
      topWorkers,
    });
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    res.status(500).json({ error: "Failed to get dashboard statistics" });
  }
};
