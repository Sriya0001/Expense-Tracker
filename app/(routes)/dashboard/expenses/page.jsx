"use client";

import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { useEffect, useState } from "react";
import { desc, eq } from "drizzle-orm";
import ExpenseListTable from "./[id]/_components/ExpenseListTable";

export default function AllExpensesPage() {
  const { user } = useUser();
  const [expensesList, setExpensesList] = useState([]);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchAllExpenses();
    }
  }, [user]);

  const fetchAllExpenses = async () => {
    const result=await db.select({
            id:Expenses.id,
            name:Expenses.name,
            amount:Expenses.amount,
            createdAt:Expenses.createdAt
          }).from(Budgets)
          .rightJoin(Expenses,eq(Budgets.id,Expenses.budgetId))
          .where(eq(Budgets.createdBy,user?.primaryEmailAddress.emailAddress))
          .orderBy(desc(Expenses.id));
          setExpensesList(result);
  };

  return (
    <div className="p-10">
    <h2 className='font-bold text-3xl'>My Expenses</h2>
      
      <ExpenseListTable
        expensesList={expensesList}
        refreshData={fetchAllExpenses}
      />
    </div>
  );
}
