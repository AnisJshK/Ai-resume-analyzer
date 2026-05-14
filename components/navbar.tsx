import React from 'react'
import {Link} from "react-router";

const Navbar = () => {
  return (
   <nav className="navbar my-0  border shadow-xl">
       <Link to={"/"}>
           <p className="text-2xl font-bold text-gradient">NeuraHire</p>
       </Link>
       <Link to={"/upload"} className={"border rounded-2xl p-3 bg-slate-200 gradient-hover w-fit"}>
           Upload Resume
       </Link>
   </nav>
  )
}

export default Navbar