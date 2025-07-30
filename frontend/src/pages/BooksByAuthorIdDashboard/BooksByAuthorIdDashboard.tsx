import { useEffect, useState } from "react";
import CustomSelect from "@/components/ui/CustomSelect";
import Select from "react-select";
import ReactSelectStyles from "@/styles/ReactSelectStyles";
import Pagination from "@/components/Pagination";
import { BooksSortByOptions, BooksCategoryOptions } from "@/utils/constants";
import { BookByAuthorId, BooksByAuthorIdParams } from "@/types/books";
import { useGetBooksByAuthorIdQuery } from "@/services/bookApis";
import { useRtkQueryErrorToast } from "@/hooks/hooks";
import { LoaderCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import "./BooksByAuthorIdDashboard.css";
import MobileAdvancedFilters from "@/components/MobileAdvancedFilters";

const BooksByAuthorIdDashboard = () => {
  const { authorId, authorName, authorCountry } = useParams();
  const [totalViews, setTotalViews] = useState(0);
  const [books, setBooks] = useState<BookByAuthorId[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt DESC");
  const [category, setCategory] = useState("All");

  const navigate = useNavigate();

  //Fetch book by author id and filters
  const { data, error, isLoading } = useGetBooksByAuthorIdQuery({
    search: debouncedSearch,
    page_index: pageIndex,
    authorId: Number(authorId),
    category,
    sortBy,
  } as BooksByAuthorIdParams);
  useRtkQueryErrorToast(error);

  //update books
  useEffect(() => {
    if (data?.data) {
      setBooks(data.data.books);
      setTotalPages(data.total_pages);
      setTotalViews(data.data.totalViews);
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
  }, [debouncedSearch, category, sortBy]);

  return (
    <main className="flex items-center flex-col min-h-screen w-screen overflow-hidden">
      <header
        className="text-2xl leading-none text-foreground 
        w-[98vw] md:w-[90vw] max-w-[1400px] 
        mt-4 px-[20px] md:px-[10px] flex flex-col gap-3"
      >
        <p>Author: {authorName}</p>
        <p>Country: {authorCountry}</p>
        <p>Total Views: {totalViews}</p>
      </header>

      <section className="books-by-author-id-paging-container">
        {/*filters section*/}
        <div className="flex justify-between items-start w-full">
          {/*basic filters*/}
          <div className="flex flex-col lg:flex-row items-start justify-start gap-5 w-full">
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

          {/*Category Filters for sm (640px or above)*/}
          <div className="hidden xl:flex items-center justify-center mt-2 relative">
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
          </div>

          {/*Category Filters for below sm (640px)*/}
          <MobileAdvancedFilters setCategory={setCategory} />
        </div>

        {/*content section */}
        {!isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 items-center gap-8 place-items-center my-8 w-full">
            {books.map((book: BookByAuthorId, index) => (
              <div
                key={index}
                className="book-version-item"
                onClick={() =>
                  navigate(`/book-versions/${book.id}/${authorId}`)
                }
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
          <LoaderCircle className="text-foreground w-[70px] lg:w-[90px] animate-spin" />
        )}

        <Pagination
          currentPage={pageIndex}
          totalPages={totalPages}
          onPageChange={setPageIndex}
        />
      </section>
    </main>
  );
};

export default BooksByAuthorIdDashboard;
