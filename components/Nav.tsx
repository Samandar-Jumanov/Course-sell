
import React  from "react"

export const Navbar : React.FC = ( )  => {


    return (
          <> 
          <nav className="flex  justify-between  bg-gray-900 items-center p-5  ">
                         <h2 className="text-white hover:text-slate-400 cursor-pointer"> Your logo </h2>

                         <div className="flex gap-x-6">
                              <span className="text-white hover:text-slate-400 cursor-pointer"> Social link 1 </span>
                              <span className="text-white hover:text-slate-400 cursor-pointer"> Social link 1 </span>
                              <span className="text-white hover:text-slate-400  cursor-pointer" > Social link 1 </span>
                         </div>
          </nav>

          </>
    )
}