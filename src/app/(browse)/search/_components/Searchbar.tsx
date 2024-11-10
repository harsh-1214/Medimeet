"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, SearchIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import qs from "query-string";
import FilterComponent from "./FilterComponent";
import { Hint } from "@/components/hint";

export const SearchBar = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!value) {
      return;
    }
    const url = qs.stringifyUrl(
      {
        url: "/search",
        query: { q: value },
      },
      { skipEmptyString: true }
    );
    router.push(url);
  }

  function onClear() {
    setValue("");
    inputRef.current?.focus();
  }

  // getUserInfo().then( (user) => {
  //   console.log(user)
  // }).catch( (err) => console.log(err));

  // useEffect( () => {

  //   // ;( async() => {  
     
  //   // })()

  // },[])

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
          disabled = {(value === '')}
        >
          <SearchIcon className="h-5 w-5 text-muted-foreground" />
        </Button>
      </form>

      <Hint label="Filters" side='top' asChild>
        <FilterComponent/>
      </Hint>
    </div>
  );
};
