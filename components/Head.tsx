

import Image from "next/image"

export const Head  = () =>{

    return (
        <div className="w-screen h-screen bg-slate-700 text-white flex flex-col md:flex-row justify-center items-center gap-8 p-4">

        <div className="max-w-lg space-y-4">
            <h1 className="text-2xl font-bold">Header</h1>
            <p className="text-sm md:text-base ">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with 
            desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </p>
         </div>

         <div className="flex justify-center items-center">
              <Image
                src="/user.jpeg"
                alt="Image"
                width={300}
                height={300}
                className="rounded-full object-cover"
              />
         </div>
 </div>
    )
}