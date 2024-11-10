import React from "react";
import { Navbar } from "../_components/Navbar";
import { Footer } from "../_components/Footer";


export default function HomeLayout( {children} :  {children : React.ReactNode}){

    return (
        <div>
            <Navbar/>
            {children}
            <Footer/>
        </div>
    )

}   