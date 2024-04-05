
import React  from "react"

export const Navbar : React.FC = ( )  => {


    return (
          <> 
          <nav className="flex  justify-between  bg-gray-900 items-center p-5  ">
                         <h2 className="text-white hover:text-slate-400 cursor-pointer font-bold"> Your logo </h2>

                         <div className="flex gap-x-6">
                         <button className="mt-2 px-4 py-2 bg-blue-500 rounded hover:bg-blue-700 transition-colors">All courses</button>
                         <button className="mt-2 px-4 py-2 bg-blue-500 rounded hover:bg-blue-700 transition-colors">Donate</button>
                         </div>
          </nav>

          </>
    )
}