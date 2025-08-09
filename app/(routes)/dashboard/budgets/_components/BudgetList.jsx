"use client";
import React, { useEffect, useState } from "react";
import CreateBudget from "./CreateBudget";
import BudgetItem from "./BudgetItem";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/dbConfig";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses } from "@/utils/schema";

function BudgetList() {
  const [budgetList, setBudgetList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const getBudgetList = async () => {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) return;

    try {
      setLoading(true);
      const result = await db
        .select({
          ...getTableColumns(Budgets),
          totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
          totalItem: sql`count(${Expenses.id})`.mapWith(Number),
        })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, email))
        .groupBy(Budgets.id)
        .orderBy(desc(Budgets.id));

      setBudgetList(result);
    } catch (error) {
      console.error("Failed to fetch budgets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      getBudgetList();
    }
  }, [user?.primaryEmailAddress?.emailAddress]);

  return (
    <div className="mt-7">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CreateBudget refreshData={getBudgetList} />
        {loading ? (
          [1, 2, 3, 4, 5, 6].map((item, index) => (
            <div
              key={index}
              className="w-full bg-slate-200 rounded-lg h-[150px] animate-pulse"
            ></div>
          ))
        ) : budgetList.length > 0 ? (
          budgetList.map((budget, index) => (
            <BudgetItem key={budget.id || index} budget={budget} />
          ))
        ) : (
          <div className="text-gray-500 col-span-full text-center mt-10">
            No budgets found. Create one!
          </div>
        )}
      </div>
    </div>
  );
}

export default BudgetList;
