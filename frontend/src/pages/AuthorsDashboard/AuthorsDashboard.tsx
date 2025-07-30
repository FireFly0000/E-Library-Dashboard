import { useState, useEffect } from "react";
import CustomSelect from "@/components/ui/CustomSelect";
import Select from "react-select";
import ReactSelectStyles from "@/styles/ReactSelectStyles";
import Pagination from "@/components/Pagination";
import {
  AuthorsSortByOptions,
  BooksCategoryOptions,
  countryList,
} from "@/utils/constants";
import MobileAdvancedFilters from "@/components/MobileAdvancedFilters";
import { LoaderCircle } from "lucide-react";
import {
  AuthorsPaginationParams,
  AuthorDashboardTableItem,
} from "@/types/authors";
import { useAllAuthorsPagingQuery } from "@/services/authorApis";
import { useRtkQueryErrorToast } from "@/hooks/hooks";
import "./AuthorDashboard.css";
import { useNavigate } from "react-router-dom";

const AuthorsDashboard = () => {
  const [authors, setAuthors] = useState<AuthorDashboardTableItem[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("created_at DESC");
  const [country, setCountry] = useState("All");
  const [category, setCategory] = useState("All");
  const navigate = useNavigate();

  const { data, error, isLoading } = useAllAuthorsPagingQuery({
    search: debouncedSearch,
    page_index: pageIndex,
    country,
    category,
    sortBy,
  } as AuthorsPaginationParams);
  useRtkQueryErrorToast(error);

  //update authors and load into format for table layout using grid
  useEffect(() => {
    const initialAuthorsTableItemList: AuthorDashboardTableItem[] = [
      {
        id: -1,
        createdAt: "Created At",
        name: "Name",
        country: "Country",
        popularity: -1,
      },
    ];

    if (data?.data) {
      setTotalPages(data.total_pages);
      data.data.forEach((author) => {
        initialAuthorsTableItemList.push({
          id: author.id,
          createdAt: new Date(author.createdAt).toLocaleDateString(),
          name: author.name,
          country: author.country,
          popularity: author.popularity,
        });
      });
      setAuthors(initialAuthorsTableItemList);
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
  return (
    <div
      className="flex items-center flex-col
    min-h-screen w-screen overflow-hidden"
    >
      <header className="text-3xl leading-none text-foreground w-[98vw] md:w-[90vw] max-w-[1400px] mt-4 px-[10px] md:px-[10px]">
        All Authors
      </header>

      <main className="default-card-container w-[98vw] md:w-[90vw] max-w-[1400px] py-[30px] px-[10px] md:p-[30px] items-center justify-center">
        {/*Filters section*/}
        <section className="flex justify-between items-start w-full">
          {/*basic filters*/}
          <div className="flex flex-col lg:flex-row items-start justify-center gap-5">
            <input
              type="text"
              placeholder="Search author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
            />

            <CustomSelect
              options={AuthorsSortByOptions}
              getValue={(item) => item.value}
              getLabel={(item) => item.label}
              getKey={(item) => item.key}
              changeKey={(key) => setSortBy(AuthorsSortByOptions[key].value)}
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
        </section>

        {/*content section*/}
        <section className="my-4 w-full">
          {!isLoading ? (
            authors?.map((author: AuthorDashboardTableItem, index) => (
              <div className="author-table-grid" key={author.id}>
                <p>{author.id === -1 ? "ID" : author.id}</p>
                <p>
                  {author.createdAt === "Created At"
                    ? "Created"
                    : new Date(author.createdAt).toLocaleDateString()}
                </p>
                <p
                  className={`break-words whitespace-normal ${
                    index > 0 ? "author-link" : ""
                  }`}
                  title={author.name}
                  onClick={() => {
                    if (index === 0) return;
                    navigate(
                      `/books-by-author-id/${author.id}/${author.name}/${author.country}/`
                    );
                  }}
                >
                  {author.name}
                </p>
                <p
                  className="break-words whitespace-normal"
                  title={author.country}
                >
                  {author.country === "Country" ? "Country" : author.country}
                </p>
                <p>{author.popularity === -1 ? "Views" : author.popularity}</p>
              </div>
            ))
          ) : (
            <LoaderCircle className="text-foreground w-[70px] lg:w-[90px] animate-spin" />
          )}
        </section>

        <Pagination
          currentPage={pageIndex}
          totalPages={totalPages}
          onPageChange={setPageIndex}
        />
      </main>
    </div>
  );
};

export default AuthorsDashboard;
