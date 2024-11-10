
import { Actions } from "./actions";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

export const Navbar = () => {
  // const isMobileScreen = useMediaQuery(`(max-width : 640px)`);
  return (
    <div className="w-full">
      <div className= {cn(
        "container h-20 z-[49] px-2 lg:px-4 flex justify-between items-center shadow-sm",
        // isMobileScreen && 'ml-5'
      )}>
        <Logo />
        {/* Search Bar in case of searching for  doctors*/}
        <Actions />
      </div>
    </div>
  );
};
