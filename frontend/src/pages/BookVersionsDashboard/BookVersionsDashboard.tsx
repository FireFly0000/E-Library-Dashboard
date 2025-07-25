import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
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
  const { bookId } = useParams();
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
  const initialBookVersions = useRef<BookVersionTableItem[]>([
    {
      id: -1,
      createdAt: "Created At",
      contributorName: "Contributor",
      fileUrl: "File",
      reader: "Reader",
      viewCount: -1,
    },
  ]);

  //To load bookVersions into format for table layout using grid
  useEffect(() => {
    if (data?.data) {
      setBookInfo(data.data);
      setTotalPages(data.total_pages);
      data.data.versions.forEach((version) => {
        initialBookVersions.current.push({
          id: version.id,
          createdAt: new Date(version.createdAt).toLocaleDateString(),
          contributorName: version.contributorName,
          fileUrl: version.fileUrl,
          reader: "Open",
          viewCount: version.viewCount,
        });
      });
      setBookVersions(initialBookVersions.current);
    }
  }, [data]);

  const handleViewsIncrement = async (bookVersionId: number) => {
    await dispatch(
      bookActions.updateViewCount({
        bookId: Number(bookId),
        bookVersionId: bookVersionId,
      })
    );
  };

  return (
    <div className="flex items-center flex-col min-h-screen w-screen overflow-hidden">
      <div className="default-card-container w-[98vw] md:w-[90vw] max-w-[1400px] py-[30px] px-[5px] md:p-[30px] items-center justify-center">
        {/*<div
          //className="prose max-w-none"
          dangerouslySetInnerHTML={{
            __html:
              '<div class="bg-card text-foreground border-border border-2 rounded-lg p-4">\n    <h2 class="text-xl font-bold mb-4">Discussion: The Arrival at Bag End</h2>\n    <p class="mb-4">\n        This passage describes a pivotal moment leading up to Bilbo Baggins\' Eleventy-First Birthday, introducing elements that disrupt the peaceful, predictable life of the Shire and hint at the wider world beyond.\n    </p>\n\n    <div class="mb-4">\n        <h3 class="text-lg font-semibold mb-2">Anticipation and Atmosphere</h3>\n        <ul class="list-disc pl-5 space-y-1">\n            <li>The opening phrase, "Days passed and The Day drew nearer," immediately establishes a sense of building anticipation for a significant event, capitalized as "The Day" to emphasize its importance.</li>\n            <li>This creates a subtle tension, contrasting with the usual unhurried pace of Hobbiton life.</li>\n        </ul>\n    </div>\n\n    <div class="mb-4">\n        <h3 class="text-lg font-semibold mb-2">Intrusion and Mystery</h3>\n        <ul class="list-disc pl-5 space-y-1">\n            <li>The arrival of the "odd-looking waggon laden with odd-looking packages" is the first clear indication of something unusual entering the Shire.</li>\n            <li>The repeated use of "odd-looking" highlights its strangeness and foreignness to the hobbits, who are accustomed to simple, familiar things.</li>\n            <li>Its destination, Bag End, directly links this mysterious arrival to Bilbo, the previous adventurer, and sets the stage for the birthday celebrations.</li>\n        </ul>\n    </div>\n\n    <div class="mb-4">\n        <h3 class="text-lg font-semibold mb-2">Hobbit Reaction</h3>\n        <ul class="list-disc pl-5 space-y-1">\n            <li>The "startled hobbits peered out of lamplit doors to gape at it," perfectly captures their curious yet somewhat apprehensive nature.</li>\n            <li>Their reaction underscores the rarity of such sights in Hobbiton, emphasizing how insular and peaceful their community is. The light from their doors suggests comfort, but their peering out indicates a disruption.</li>\n        </ul>\n    </div>\n\n    <div class="mb-4">\n        <h3 class="text-lg font-semibold mb-2">Arrival of the Outlandish</h3>\n        <ul class="list-disc pl-5 space-y-1">\n            <li>The drivers are explicitly described as "outlandish folk, singing strange songs," confirming their non-Shire origins and adding to the mystique.</li>\n            <li>Their identification as "dwarves with long beards and deep hoods" directly connects this event to the wider lore of Middle-earth, reminding readers of Bilbo\'s previous adventures with dwarves and Gandalf.</li>\n            <li>The dwarves\' presence is highly unusual for Hobbiton, signalling that the Shire\'s quiet existence is about to be significantly stirred.</li>\n        </ul>\n    </div>\n\n    <div>\n        <h3 class="text-lg font-semibold mb-2">Foreshadowing and Significance</h3>\n        <ul class="list-disc pl-5 space-y-1">\n            <li>This passage serves as an effective opening to the main narrative, establishing the setting while introducing the first elements of the fantastical world beyond the Shire\'s borders.</li>\n            <li>It immediately sets a tone of anticipation, wonder, and subtle foreboding, hinting that "The Day" will bring more than just a birthday party.</li>\n            <li>The arrival of the dwarves, coupled with the mysterious packages, foreshadows the return of adventure and the disruption of Frodo\'s tranquil life.</li>\n        </ul>\n    </div>\n</div>',
          }}
        />*/}
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
                  By {bookInfo?.authorName}
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

            {bookVersions?.map((book: BookVersionTableItem) => (
              <div className="book-table-grid" key={book.id}>
                <div>{book.id === -1 ? "ID" : book.id}</div>
                <div>
                  {book.createdAt === "Created At"
                    ? "Created"
                    : new Date(book.createdAt).toLocaleDateString()}
                </div>
                <div
                  className="break-words whitespace-normal"
                  title={book.contributorName}
                >
                  {book.contributorName}
                </div>
                <div onClick={() => handleViewsIncrement(book.id)}>
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
