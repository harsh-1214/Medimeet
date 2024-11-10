import { ResultPage } from "./_components/ResultPage";
import { SearchBar } from "./_components/Searchbar";

const SearchPage = () => {


    return (
        <div className="h-full">
            <div className="flex flex-col items-center mt-5 container h-full">
                <SearchBar/>
                <ResultPage/>
            </div>
        </div>

    );

}

export default SearchPage;