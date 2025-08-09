"use client";
import { db } from '@/utils/dbConfig';
import { Budgets, Expenses } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation'; // ✅ fix: useParams for client components
import BudgetItem from '../../budgets/_components/BudgetItem';
import AddExpense from './_components/AddExpense';
import ExpenseListTable from './_components/ExpenseListTable';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PenBox, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner';
import EditBudget from './_components/EditBudget';

function ExpensesScreen() {
  const { user } = useUser();
  const params = useParams(); // ✅ this returns { id: '...' }
  const budgetId = params?.id;
  const[budgetInfo,setbudgetInfo]=useState();
  const[expensesList,setExpensesList]=useState();
  const route =useRouter();

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress && budgetId) {
      getBudgetInfo();
    }
  }, [user, budgetId]);

  /**
   * Get budget Information
   */
  const getBudgetInfo = async () => {
    try {
      const result = await db
        .select({
          ...getTableColumns(Budgets),
          totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
          totalItem: sql`count(${Expenses.id})`.mapWith(Number),
        })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user.primaryEmailAddress.emailAddress))
        .where(eq(Budgets.id, budgetId)) 
        .groupBy(Budgets.id);


      setbudgetInfo(result[0]);
      getExpensesList();

      console.log("Budget info:", result);
    } catch (err) {
      console.error("Failed to fetch budget info:", err);
    }
  };

  /**
   * Get Budget information
   */

  const getExpensesList=async()=>{

    const result=await db.select().from(Expenses)
    .where(eq(Expenses.budgetId,params.id))
    .orderBy(desc(Expenses.id));
    setExpensesList(result);
  }

  /**
   * Used to delete budget
   */

  const deleteBudget=async()=>{

    const deleteExpenseResult=await db.delete(Expenses)
    .where(eq(Expenses.budgetId,params.id))
    .returning()

    if(deleteExpenseResult){
      const result=await db.delete(Budgets)
      .where(eq(Budgets.id,params.id))
      .returning();
    }
    toast('Budget Deleted!');
    route.replace('/dashboard/budgets')
  }

  return (
    <div className='p-10'>
      <h2 className='text-2xl font-bold flex justify-between items-center'>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => route.push('/dashboard/budgets')} >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          My Expenses
        </div>
        <div className='flex gap-2 items-center'>
        <EditBudget budgetInfo={budgetInfo}
        refreshData={()=>getBudgetInfo()}/>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="flex gap-2" variant="destructive">
            <Trash/>Delete</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your current budget along with expenses
                and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={()=>deleteBudget()}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </div>

        
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 mt-6 gap-5'>
        {budgetInfo?
        <BudgetItem
        budget={budgetInfo}
        />:
        <div className='h-[150px] w-full bg-slate-200 rounded-lg animate-pulse'>

        </div>}
        <AddExpense budgetId={params.id}
        user={user}
        refreshData={()=>getBudgetInfo()}
        
        />

      </div>
      <div className='mt-4'>
        <ExpenseListTable expensesList={expensesList}
        refreshData={()=>getBudgetInfo()}/>
      </div>
    </div>
  );
}

export default ExpensesScreen;
