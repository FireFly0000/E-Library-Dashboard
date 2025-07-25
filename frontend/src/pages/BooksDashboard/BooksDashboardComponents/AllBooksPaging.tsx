import { useEffect, useState } from "react";
import CustomSelect from "@/components/ui/CustomSelect";
import Select from "react-select";
import ReactSelectStyles from "@/styles/ReactSelectStyles";
import Pagination from "@/components/Pagination";
import {
  BooksSortByOptions,
  BooksCategoryOptions,
  countryList,
} from "@/utils/constants";
import { Book, BooksPaginationParams } from "@/types/books";
//import debounce from "lodash/debounce";
import { useGetBooksPagingQuery } from "@/services/bookApis";
import { useRtkQueryErrorToast } from "@/hooks/hooks";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { bookActions } from "@/redux/slices";
import { useNavigate } from "react-router-dom";
import MobileAdvancedFilters from "./MobileAdvancedFilters";

const AllBooksPaging: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt DESC");
  const [country, setCountry] = useState("All");
  const [category, setCategory] = useState("All");
  const dispatch = useAppDispatch();
  const bookUploaded = useAppSelector((state) => state.bookSlice.bookUploaded);
  const navigate = useNavigate();

  const { data, error, isLoading, refetch } = useGetBooksPagingQuery({
    search: debouncedSearch,
    page_index: pageIndex,
    country,
    category,
    sortBy,
  } as BooksPaginationParams);
  useRtkQueryErrorToast(error);

  //update books
  useEffect(() => {
    if (data?.data) {
      setBooks(data.data);
      setTotalPages(data.total_pages);
    }
  }, [data]);

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  //Set page to 1 when filters applied
  useEffect(() => {
    setPageIndex(1);
  }, [debouncedSearch, country, category, sortBy]);

  //Refetch when a new book is added
  useEffect(() => {
    if (bookUploaded) {
      refetch();
      dispatch(bookActions.setBookUploaded(false));
    }
  }, [bookUploaded, refetch, dispatch]);

  return (
    <section className="all-books-paging-container">
      <div className="flex justify-between items-start w-full">
        {/*basic filters*/}
        <div className="flex flex-col lg:flex-row items-start justify-center gap-5">
          <input
            type="text"
            placeholder="Search title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
          />

          <CustomSelect
            options={BooksSortByOptions}
            getValue={(item) => item.value}
            getLabel={(item) => item.label}
            getKey={(item) => item.key}
            changeKey={(key) => setSortBy(BooksSortByOptions[key].value)}
            className="w-[200px]"
          />
        </div>

        {/*advanced filters for desktop 1280px or above*/}
        <div className="hidden xl:flex items-center justify-center gap-5 mt-2 relative">
          <label className="text-based text-foreground absolute bottom-[110%] left-0">
            Category
          </label>
          <Select
            options={BooksCategoryOptions}
            onChange={(e) => {
              if (e) setCategory(e.value);
            }}
            styles={ReactSelectStyles}
            placeholder={category}
            className="w-[200px]"
          />

          <label className="text-based text-foreground absolute  bottom-[110%] left-55">
            Country
          </label>
          <Select
            options={countryList}
            onChange={(e) => {
              if (e) setCountry(e.label);
            }}
            styles={ReactSelectStyles}
            placeholder={country}
            className="w-[200px]"
          />
        </div>

        {/*advanced filters for mobile*/}
        <MobileAdvancedFilters
          setCategory={setCategory}
          setCountry={setCountry}
        />
      </div>

      {!isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 items-center gap-8 place-items-center my-8 w-full">
          {books.map((book: Book, index) => (
            <div
              key={index}
              className="book-version-item"
              onClick={() => navigate(`/book-versions/${book.id}`)}
              title={book.title}
            >
              <img
                className="w-full sm:w-[70%] object-cover"
                src={book.thumbnailUrl}
                alt={book.title}
                onLoad={(e) =>
                  e.currentTarget.classList.remove("animate-pulse")
                }
                loading="lazy"
              />

              <span className="w-40 sm:w-60 lg:w-40 xl:w-70 truncate text-center">
                {book.title}
              </span>
              <span className="text-xs xl:text-base leading-none text-center">
                {book.viewCount} views
              </span>
            </div>
          ))}
        </div>
      ) : (
        <span className="text-foreground text-2xl text-center">Loading...</span>
      )}

      <Pagination
        currentPage={pageIndex}
        totalPages={totalPages}
        onPageChange={setPageIndex}
      />
    </section>
  );
};

export default AllBooksPaging;
