"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import qs from "query-string";

export function PaginationComp({activePage} : {activePage : string | null | undefined}) {


  // If a person came after refresh this will reset to 1
  const pageNumber = activePage ? Number(activePage) : 1;
  const [currentPage, setCurrentPage] = useState(pageNumber);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();


  const arr = [currentPage - 1, currentPage, currentPage + 1];

  function handleClick(val: number) {

    const urlQueryParams = searchParams.toString();

    let searchUrl: string;
    if (!urlQueryParams) {
      searchUrl = pathname
    } else {
      searchUrl = pathname + '?' + urlQueryParams;
    }
    
    const url = qs.stringifyUrl(
      {
        url: searchUrl,
        query: {page : val},
      },
      { skipEmptyString: true }
    );
    setCurrentPage(val);
    router.push(url);
  }

  return (
    <Pagination className="">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious disabled = {currentPage === 1} onClick={ () => handleClick(currentPage-1)} />
        </PaginationItem>

        {arr.map(
          (val, ind) =>
            val >= 1 && (
              <PaginationItem key={ind}>
                {/* <PaginationLink href="">{val}</PaginationLink> */}
                <PaginationLink
                  isActive = {val === currentPage}
                  onClick={() => handleClick(val)}
                >
                  {val}
                </PaginationLink>
              </PaginationItem>
            )
        )}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext onClick={ () => handleClick(currentPage+1)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
