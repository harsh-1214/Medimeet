import React from "react";
import { Navbar } from "../_components/Navbar";


export default function SearchLayout ({children} : {children : React.ReactNode}) {

    return (
        <>
            <Navbar/>
            {children}
        </>
    );

}