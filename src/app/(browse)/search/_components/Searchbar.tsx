"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, SearchIcon, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import qs from "query-string";
import FilterComponent from "./FilterComponent";
import { Hint } from "@/components/hint";

export const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const activeQuery = searchParams.get("q") || "";
  const [value, setValue] = useState(activeQuery);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Edge Case 4 Fix: Sync input when browser Back/Forward buttons are clicked
  useEffect(() => {
    setValue(activeQuery);
  }, [activeQuery]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedValue = value.trim();
    setValue(trimmedValue); // Edge Case 2 Fix: Clean up trailing/empty spaces

    // Edge Case 1 Fix: Prevent redundant router pushes if query hasn't changed
    if (trimmedValue === activeQuery) return;

    const currentParams = qs.parse(searchParams.toString());

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          ...currentParams,
          q: trimmedValue,
          page: undefined, // Edge Case 3 Fix: Reset pagination on new search
        },
      },
      { skipEmptyString: true, skipNull: true },
    );

    router.push(url);
  }

  function onClear() {
    setValue("");
    inputRef.current?.focus();

    // Edge Case 1 Fix: Only push to router if there was actually an active query in the URL
    if (!activeQuery) return;

    const currentParams = qs.parse(searchParams.toString());

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          ...currentParams,
          q: "",
          page: undefined,
        },
      },
      { skipEmptyString: true, skipNull: true },
    );

    router.push(url);
  }

  return (
    <div className="w-full flex justify-center sm:gap-16 gap-4">
      <form
        onSubmit={onSubmit}
        className="relative w-full lg:w-[400px] flex items-center gap-1"
      >
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search"
          ref={inputRef}
          className="rounded-r-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
        />
        {value && (
          <X
            className="absolute top-2.5 right-14 h-5 w-5 text-muted-foreground cursor-pointer hover:opacity-75 transition"
            onClick={onClear}
          />
        )}
        <Button
          type="submit"
          size="sm"
          variant="secondary"
          className="rounded-l-none"
        >
          <SearchIcon className="h-5 w-5 text-muted-foreground" />
        </Button>
      </form>

      <Hint label="Filters" side="top" asChild>
        <Button variant="outline" className="">
          <FilterComponent />
        </Button>
      </Hint>
    </div>
  );
};
