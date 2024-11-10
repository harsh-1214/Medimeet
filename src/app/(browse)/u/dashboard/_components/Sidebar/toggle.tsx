"use client";

import { Menu } from "lucide-react";
import { useSidebar } from "@/store/use-sidebar";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "usehooks-ts";

export function Toggle() {
  const { collapsed, onExpand, onCollapse } = useSidebar((state) => state);

  function handleToggle() {
    if (collapsed) {
      onExpand();
    } else {
      onCollapse();
    }
  }

  const isMobileScreen = useMediaQuery(`(max-width : 640px)`);

  // const label = collapsed ? 'Expand' : 'Collapse'
  return (
    <>
      <div className="p-3 pl-6 mb-2 flex items-center gap-5 w-full">
        <Menu
          className={cn(
            "cursor-pointer w-7 h-7"
            // isMobileScreen && 'hidden'
          )}
          onClick={handleToggle}
        />
        <p
          className={cn(
            collapsed && "hidden",
            !collapsed && "font-semibold text-primary inline",
            isMobileScreen && 'hidden'
          )}
        >
          Dashboard
        </p>
      </div>
    </>
  );
}
