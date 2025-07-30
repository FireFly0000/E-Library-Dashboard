import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { BookInfo, BookVersionTableItem } from "@/types/books";
import "./BookVersionsDashboard.css";
import { useGetBookVersionsQuery } from "@/services/bookApis";
import { BooksSortByOptions } from "@/utils/constants";
import CustomSelect from "@/components/ui/CustomSelect";
import { useRtkQueryErrorToast } from "@/hooks/hooks";
import Pagination from "@/components/Pagination";
import PDFReader from "@/components/PdfReader";
import { useAppDispatch } from "@/hooks/hooks";
import { bookActions } from "@/redux/slices";

const BookVersionsDashboard = () => {
  const { bookId, authorId } = useParams();
  const [bookInfo, setBookInfo] = useState<BookInfo | null>(null);
  const [bookVersions, setBookVersions] = useState<
    BookVersionTableItem[] | null
  >();
  const [pageIndex, setPageIndex] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt DESC");
  const [totalPages, setTotalPages] = useState(0);
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const { data, error, isLoading } = useGetBookVersionsQuery({
    bookId: Number(bookId),
    page_index: pageIndex,
    sortBy,
  });
  useRtkQueryErrorToast(error);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  //To load bookVersions into format for table layout using grid
  useEffect(() => {
    const initialBookVersions: BookVersionTableItem[] = [
      {
        id: -1,
        createdAt: "Created At",
        contributorName: "Contributor",
        contributorId: -1,
        fileUrl: "File",
        reader: "Reader",
        viewCount: -1,
      },
    ];
    if (data?.data) {
      setBookInfo(data.data);
      setTotalPages(data.total_pages);
      data.data.versions.forEach((version) => {
        initialBookVersions.push({
          id: version.id,
          createdAt: new Date(version.createdAt).toLocaleDateString(),
          contributorName: version.contributorName,
          contributorId: version.contributorId,
          fileUrl: version.fileUrl,
          reader: "Open",
          viewCount: version.viewCount,
        });
      });
      setBookVersions(initialBookVersions);
    }
  }, [data]);

  const handleViewsIncrement = async (
    bookVersionId: number,
    contributorId: number
  ) => {
    await dispatch(
      bookActions.updateViewCount({
        bookId: Number(bookId),
        bookVersionId: bookVersionId,
        contributorId: contributorId,
      })
    );
  };

  return (
    <div className="flex items-center flex-col min-h-screen w-screen overflow-hidden">
      <div className="default-card-container w-[98vw] md:w-[90vw] max-w-[1400px] py-[30px] px-[5px] md:p-[30px] items-center justify-center">
        {!isLoading ? (
          <>
            {/*Book general info*/}
            <div
              className="flex flex-col items-center justify-center gap-4 
                xl:flex-row xl:items-start xl:justify-between xl:gap-10"
            >
              <img
                className="w-full sm:w-[80%] lg:w-[50%] xl:w-[20%] object-cover"
                src={bookInfo?.thumbnailUrl}
                alt={bookInfo?.title}
                onLoad={(e) =>
                  e.currentTarget.classList.remove("animate-pulse")
                }
                loading="lazy"
              />

              {/*text info*/}
              <div className="flex flex-col gap-2 xl:gap-4 text-foreground">
                <span className="text-2xl text-center xl:text-start">
                  {bookInfo?.title}
                </span>
                <span className="text-lg italic text-center xl:text-start">
                  By{" "}
                  <span
                    className="hover:text-primary underline transition-colors duration-200 cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/books-by-author-id/${authorId}/${bookInfo?.authorName}/${bookInfo?.authorCountry}`
                      )
                    }
                  >
                    {bookInfo?.authorName}
                  </span>
                </span>
                <span className="text-lg text-center xl:text-start">
                  Country: {bookInfo?.authorCountry}
                </span>
                <span className="text-lg text-center xl:text-start">
                  Total Views: {bookInfo?.totalViews}
                </span>
                <span className="text-lg mt-2">{bookInfo?.description}</span>
              </div>
            </div>

            {/*sortBy filter*/}
            <div className="w-full flex items-start justify-start my-6">
              <CustomSelect
                options={BooksSortByOptions}
                getValue={(item) => item.value}
                getLabel={(item) => item.label}
                getKey={(item) => item.key}
                changeKey={(key) => setSortBy(BooksSortByOptions[key].value)}
                className="w-[200px]"
              />
            </div>

            {bookVersions?.map((book: BookVersionTableItem, index) => (
              <div className="book-table-grid" key={index}>
                <div>{book.id === -1 ? "ID" : book.id}</div>
                <div>
                  {book.createdAt === "Created At"
                    ? "Created"
                    : new Date(book.createdAt).toLocaleDateString()}
                </div>
                <div
                  className={`break-words whitespace-normal ${
                    index > 0 ? "book-link" : ""
                  }`}
                  title={book.contributorName}
                  onClick={() => {
                    console.log("Hello World");
                    //if (index === 0) return;
                    navigate(`/profile/${book.contributorId}`);
                  }}
                >
                  {book.contributorName}
                </div>
                <div
                  onClick={() =>
                    handleViewsIncrement(book.id, book.contributorId)
                  }
                >
                  {book.reader === "Reader" ? (
                    <span>File</span>
                  ) : (
                    <button
                      className="book-link"
                      onClick={() => {
                        setSelectedFileUrl(book.fileUrl);
                        setIsReaderOpen(true);
                      }}
                    >
                      Open
                    </button>
                  )}
                </div>
                <div>{book.viewCount === -1 ? "Views" : book.viewCount}</div>
              </div>
            ))}

            {selectedFileUrl && isReaderOpen && (
              <PDFReader
                fileUrl={selectedFileUrl}
                closeReader={() => setIsReaderOpen(false)}
                title={bookInfo?.title}
              />
            )}

            <Pagination
              currentPage={pageIndex}
              totalPages={totalPages}
              onPageChange={setPageIndex}
            />
          </>
        ) : (
          <span className="text-foreground text-2xl text-center">
            Loading...
          </span>
        )}
      </div>
    </div>
  );
};

export default BookVersionsDashboard;
