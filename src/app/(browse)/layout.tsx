import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import React from "react";
// import { Navbar } from "./_components/Navbar";


export default function BrowserLayout ({children} : {children : React.ReactNode}) {

    return (
        <>
                {children}

        </>
    );

}