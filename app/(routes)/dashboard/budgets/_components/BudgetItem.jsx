import Link from 'next/link';
import React from 'react';

function BudgetItem({ budget }) {
  // ✅ Prevent runtime error if budget is missing
  if (!budget) return null;

  const totalSpend = budget?.totalSpend || 0;
  const total = budget?.amount || 1; // avoid divide by zero
  const remaining = total - totalSpend;
  const progress = Math.min((totalSpend / total) * 100, 100);
  const calculateProgressPerc=()=>{
    const perc=(budget.totalSpend/budget.amount)*100;
    return perc.toFixed(2);
  }

  return (
    <Link href={'/dashboard/expenses/' + budget?.id} >
      <div className="p-5 border rounded-lg hover:shadow-md cursor-pointer h-[170px]">
      <div className='flex gap-2 items-center justify-between'>
        <div className="flex gap-2 items-center">
          <h2 className="text-2xl p-3 px-4 bg-slate-100 rounded-full">
            {budget?.icon || '📦'}
          </h2>
          <div>
            <h2 className='font-bold'>{budget.name || 'Unnamed Budget'}</h2>
            <h2 className='text-sm text-gray-500'>{budget.totalItem ?? 0} Item{budget.totalItem !== 1 && 's'}</h2>
          </div>
        </div>
        <h2 className='font-bold text-primary text-lg'>₹{budget.amount ?? 0}</h2>
      </div>

      <div className='mt-5'>
        <div className='flex items-center justify-between mb-3'>
          <h2 className='text-xs text-slate-400'>₹{totalSpend} Spend</h2>
          <h2 className='text-xs text-slate-400'>₹{remaining} Remaining</h2>
        </div>
        <div className='w-full bg-slate-300 h-2 rounded-full'>
          <div
            className='bg-primary h-2 rounded-full'
            style={{ 
              width: `${calculateProgressPerc()}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
    </Link>
  );
}

export default BudgetItem;
