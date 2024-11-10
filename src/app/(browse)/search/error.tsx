'use client'

export default function ErrorSearchPage({err} : {err : any}){

    return (
        <div>
            {err}
            Internal Server Error!
        </div>
    )

}