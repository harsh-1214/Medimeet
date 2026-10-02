// components/paginationComp.tsx
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
import qs from "query-string";

interface PaginationCompProps {
  activePage?: string | number | null;
  totalPages?: number;
}

export function PaginationComp({
  activePage,
  totalPages = 1,
}: PaginationCompProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Derive currentPage directly from props or URL (no useState needed!)
  const currentPage = Math.max(
    1,
    Number(activePage || searchParams.get("page")) || 1,
  );

  // Only generate page numbers that actually exist (between 1 and totalPages)
  const visiblePages = [currentPage - 1, currentPage, currentPage + 1].filter(
    (page) => page >= 1 && page <= totalPages,
  );

  function handleClick(targetPage: number) {
    // Hard guard: prevent navigating below page 1, above totalPages, or re-clicking current page
    if (
      targetPage < 1 ||
      targetPage > totalPages ||
      targetPage === currentPage
    ) {
      return;
    }

    // Parse existing query params (?fees=500&gender=male) and merge the new page
    const currentQuery = qs.parse(searchParams.toString());

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          ...currentQuery,
          page: targetPage,
        },
      },
      { skipEmptyString: true, skipNull: true },
    );

    router.push(url);
  }

  // If there's only 1 page (or 0 results), don't render pagination at all
  if (totalPages <= 1) return null;

  return (
    <Pagination className="my-6">
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            disabled = {currentPage === 1}
            onClick={() => handleClick(currentPage - 1)}
            className={
              currentPage <= 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {/* Page Numbers */}
        {visiblePages.map((val) => (
          <PaginationItem key={val}>
            <PaginationLink
              isActive={val === currentPage}
              onClick={() => handleClick(val)}
              className="cursor-pointer"
            >
              {val}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Only show Ellipsis (...) if there are more pages ahead */}
        {currentPage + 1 < totalPages && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
          disabled = {currentPage === totalPages}
            onClick={() => handleClick(currentPage + 1)}
            className={
              currentPage >= totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
