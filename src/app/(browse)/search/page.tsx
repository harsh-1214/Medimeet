import { queryParamsInfo } from "@/lib/doctor-service";
import { ResultPage } from "./_components/ResultPage";
import { SearchBar } from "./_components/Searchbar";

interface SearchPageProps {
  searchParams: queryParamsInfo;
}

const SearchPage = ({ searchParams }: SearchPageProps) => {
  return (
    <div className="h-full">
      <div className="flex flex-col items-center mt-5 container h-full">
        <SearchBar />
        <ResultPage searchParams={searchParams} />
      </div>
    </div>
  );
};

export default SearchPage;