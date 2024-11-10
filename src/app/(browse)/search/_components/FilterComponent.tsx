"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { FilterIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useState, useTransition } from "react";

const FilterComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams()
  const pathname = usePathname();
  const [isPending,startTransition] = useTransition(); 

  const [filters, setFilters] = useState({
    gender: "",
    Experience: "",
    fees: "",
  });

  function handleChange(val: string, name: string) {
    setFilters((prev) => ({
      ...prev,
      [name]: val,
    }));
  }

  function handleSubmit() {

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
        query: {gender : filters.gender,Experience : filters.Experience, fees : filters.fees},
      },
      { skipEmptyString: true }
    );
    router.push(url);
    router.refresh();
  }

  function handleReset(){

    startTransition( () => {
      setFilters({
        gender: "",
        Experience: "",
        fees: "",
      })
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="">
          <FilterIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Search Filters</DialogTitle>
          <DialogDescription>
            Select One More filters to search
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-4 py-4">
          <div className="">
            <div>Gender</div>
            <Separator className="my-4" />
            <RadioGroup
              onValueChange={(val) => handleChange(val, "gender")}
              name="gender"
              value={filters.gender}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="m1" />
                <Label htmlFor="m1">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="f2" />
                <Label htmlFor="f2">Female</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="">
            <div>Experience</div>
            <Separator className="my-4" />
            <RadioGroup
              onValueChange={(val) => handleChange(val, "Experience")}
              name="Experience"
              value={filters.Experience}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5" id="5y" />
                <Label htmlFor="5y">5+ Years of Experience</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="10" id="10y" />
                <Label htmlFor="10y">10+ Years of Experience</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="15" id="15y" />
                <Label htmlFor="15y">15+ Years of Experience</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="20" id="20y" />
                <Label htmlFor="20y">20+ Years of Experience</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="">
            <div>Fees</div>
            <Separator className="my-4" />
            <RadioGroup
              onValueChange={(val) => handleChange(val, "fees")}
              name="fees"
              value={filters.fees}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id="r1" />
                <Label htmlFor="r1">0&#8377;-500&#8377;</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="500" id="r2" />
                <Label htmlFor="r2">Above 500&#8377;</Label> 
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1000" id="r3" />
                <Label htmlFor="r3">Above 1000&#8377;</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2000" id="r4" />
                <Label htmlFor="r4">Above 2000&#8377;</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button disabled={isPending} variant={'destructive'} onClick={handleReset}>
            Reset Filter
          </Button>
          <DialogClose>
            <Button variant={"default"} onClick={handleSubmit}>
              Apply Changes
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilterComponent;
