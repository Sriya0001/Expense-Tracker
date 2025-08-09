import React from 'react'

function Hero() {
  return (
    <section className="bg-indigo-200 lg:grid lg:h-screen lg:place-content-center">
  <div className="mx-auto w-screen max-w-screen-xl px-4 py-32 
  lg:flex">
    <div className="mx-auto max-w-prose text-center">
      <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
        Manage Your Expenses
        <strong className="text-indigo-600"> Contol your Money </strong>
      </h1>

      <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed">
        Start Creating your budget and save a ton of money
      </p>

      

     
    </div>
  </div>
</section>
  )
}

export default Hero