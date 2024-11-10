import { Logo } from "../Logo";
import { Actions } from "./actions";

export const Navbar = () => {
  return (
    <div className="w-full">
      <div className="container h-20 z-[49] px-2 lg:px-4 flex justify-between items-center shadow-sm">
        <Logo />
        {/* Search Bar in case of searching for  doctors*/}
        <Actions />
      </div>
    </div>
  );
};
