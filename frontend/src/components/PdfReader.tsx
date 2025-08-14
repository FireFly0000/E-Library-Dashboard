import { Document, Page, pdfjs } from "react-pdf";
import { useState, useRef, useEffect } from "react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Button } from "./ui/button";
import {
  ArrowRight,
  ArrowLeft,
  Plus,
  Minus,
  Download,
  LoaderCircle,
} from "lucide-react";
import CustomSelect from "./ui/CustomSelect";
import { readModes } from "@/utils/constants";
import Select from "react-select";
import { languageList } from "@/utils/constants";
import ReactSelectStyles from "@/styles/ReactSelectStyles";
import Modal from "./Modal";
import { useAppDispatch, useAppSelector, useWindowWidth } from "@/hooks/hooks";
import { bookActions } from "@/redux/slices";
import toast from "react-hot-toast";
//import "@/styles/ReactPdf.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type PDFReaderProps = {
  fileUrl: string;
  title: string | undefined;
  closeReader: () => void;
  isOpen?: boolean;
};

const PDFReader: React.FC<PDFReaderProps> = ({
  fileUrl,
  title,
  closeReader,
}) => {
  const width = useWindowWidth();
  const [isScrollMode, setIsScrollMode] = useState(width >= 820 ? true : false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState(String(currentPage));
  const [manuallySetPage, setManuallySetPage] = useState(false);
  const [scale, setScale] = useState(width >= 820 ? 1.2 : 0.8); // zoom level
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]); // Ref for each page
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  //const width = useWindowWidth();

  //AI services
  const [highlightedText, setHighlightedText] = useState("");
  const [AIServiceOption, setAIServiceOption] = useState("");
  const [AILanguage, setAILanguage] = useState("English");
  const [AIContentOpen, setAIContentOpen] = useState(false);
  const [AIContentData, setAIContentData] = useState("");
  const isAILoading = useAppSelector((state) => state.bookSlice.isLoading);
  const dispatch = useAppDispatch();

  //Toast AI error message and close AI content modal
  const AIErrorMessage = useAppSelector((state) => state.bookSlice.error);
  useEffect(() => {
    if (AIErrorMessage !== "") {
      toast.error(AIErrorMessage);
      setAIContentOpen(false);
    }
  }, [AIErrorMessage]);

  //Fetch AI response when AI content modal opened
  useEffect(() => {
    const fetchAIResponse = async () => {
      if (AIContentOpen) {
        const response = await dispatch(
          bookActions.bookAIServices({
            content: highlightedText,
            language: AILanguage,
            service: AIServiceOption,
            title: title ? title : "",
          })
        );
        setAIContentData(response.payload?.data ?? "");
      }
    };

    fetchAIResponse();
  }, [
    AIContentOpen,
    highlightedText,
    AILanguage,
    AIServiceOption,
    title,
    dispatch,
  ]);

  //Highlight text for AI service
  const [desktopAIMenuOpen, setDesktopAIMenuOpen] = useState(false);
  const [mobileAIMenuOpen, setMobileAIMenuOpen] = useState(false);
  //const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  const handleMouseUp = (/*e: React.MouseEvent*/) => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (selectedText) {
      setHighlightedText(selectedText);
      setDesktopAIMenuOpen(true);

      // Positioning at mouse cursor
      /*let yOffset = 0;
      if (width <= 393) {
        yOffset = 610;
      }
      if (width <= 820) {
        yOffset = 560;
      }
      if (width <= 1024) {
        yOffset = 380;
      }

      console.log(yOffset);
      setPopupPosition({ x: e.pageX, y: e.pageY - yOffset });*/
    } else {
      setDesktopAIMenuOpen(false);
      setHighlightedText("");
    }
  };

  const handleTouchEnd = (/*e: React.MouseEvent*/) => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (selectedText) {
      setHighlightedText(selectedText);
      setMobileAIMenuOpen(true);

      // Positioning at mouse cursor
      /*let yOffset = 0;
      if (width <= 393) {
        yOffset = 610;
      }
      if (width <= 820) {
        yOffset = 560;
      }
      if (width <= 1024) {
        yOffset = 380;
      }

      console.log(yOffset);
      setPopupPosition({ x: e.pageX, y: e.pageY - yOffset });*/
    } else {
      setMobileAIMenuOpen(false);
      setHighlightedText("");
    }
  };

  const handleOptionClick = (option: string) => {
    setAIServiceOption(option);
    setDesktopAIMenuOpen(false);
    setMobileAIMenuOpen(false);
    setAIContentOpen(true);
  };

  //Use only to bypass scrolling page tracker's useEffect dependency warning
  const manuallySetPageRef = useRef(false);
  useEffect(() => {
    manuallySetPageRef.current = manuallySetPage;
  }, [manuallySetPage]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  //pageInput always reflects currentPage
  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  // Scroll into view when currentPage changes and scrollMode is on
  useEffect(() => {
    if (isScrollMode && pageRefs.current[currentPage - 1] && manuallySetPage) {
      manuallySetPageRef.current = true; // mark as manually triggered
      pageRefs.current[currentPage - 1]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Remove manual flag after delay to resume scroll tracking
      setTimeout(() => {
        setManuallySetPage(false);
      }, 500);
    }
  }, [currentPage, isScrollMode, manuallySetPage]);

  //page tracking for scroll mode
  useEffect(() => {
    if (!isScrollMode || !numPages || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      if (manuallySetPageRef.current) return;

      //the top of the scroll container.
      const containerTop = container.scrollTop;
      //visible height of the container (viewport height).
      const containerHeight = container.clientHeight;

      let closestPageIndex = -1;
      let minDistance = Infinity;

      pageRefs.current.forEach((ref, index) => {
        if (!ref) return;
        //how far the page is from the top of the scroll container.
        const offsetTop = ref.offsetTop;
        const distance = Math.abs(containerTop - offsetTop);

        if (
          offsetTop < containerTop + containerHeight && //makes sure the page is within the visible area (top + height = bottom)
          distance < minDistance //ensures always tracking the closest page
        ) {
          minDistance = distance;
          closestPageIndex = index;
        }
      });

      if (closestPageIndex !== -1 && currentPage !== closestPageIndex + 1) {
        setCurrentPage(closestPageIndex + 1);
      }
    };

    const debouncedScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        manuallySetPageRef.current = false;
      }, 500);
      handleScroll();
    };

    container.addEventListener("scroll", debouncedScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", debouncedScroll);
      clearTimeout(scrollTimeout);
    };
  }, [isScrollMode, numPages, currentPage]);

  // Handle page input submission on enter key press
  const inputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const value = parseInt(pageInput, 10);
      if (!isNaN(value)) {
        if (value < 1) {
          setCurrentPage(1);
        } else if (value > numPages!) {
          setCurrentPage(numPages!);
        } else {
          setCurrentPage(value);
        }
        setManuallySetPage(true);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center overflow-y-auto w-full max-h-screen">
      <div className="flex flex-col items-center w-full bg-card rounded-2xl sm:px-[35px] shadow-xl relative max-h-screen overflow-y-auto">
        {/* Controls */}
        <div className="max-w-[600px] w-full px-2 flex flex-col gap-1">
          <div className="flex gap-4 items-center justify-start w-full px-2 sm:w-fit sm:px-0 my-2 select-none">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary cursor-pointer hidden sm:flex text-foreground"
            >
              <Download />
            </a>

            {/* Read Mode Selector */}
            {width >= 820 && (
              <CustomSelect
                options={readModes}
                getValue={(item) => item.value}
                getLabel={(item) => item.label}
                getKey={(item) => item.key}
                changeKey={(key) => setIsScrollMode(readModes[key].value)}
                className="w-[90px]"
                variant="highlight"
              />
            )}

            {/* Page Input */}
            <input
              type="text"
              value={pageInput}
              onKeyDown={(e) => inputSubmit(e)}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*$/.test(val)) {
                  setPageInput(val);
                }
              }}
              className="w-20 px-2 py-1 border-foreground border-1 rounded text-center text-foreground"
            />
            {/* Zoom Controls */}
            <Minus
              onClick={() => setScale((s) => Math.max(0.6, s - 0.2))}
              className="hover:text-primary cursor-pointer text-foreground"
            />
            <span className="text-sm text-foreground">
              {scale.toFixed(1)} / 3
            </span>
            <Plus
              onClick={() => setScale((s) => Math.min(3, s + 0.2))}
              className="hover:text-primary cursor-pointer text-foreground"
            />

            {/* Pagination Controls for 1024 or above*/}
            <div className="hidden lg:flex items-center justify-center gap-2">
              <Button
                onClick={() => {
                  setCurrentPage((p) => {
                    if (p - 1 >= 1) {
                      return p - 1;
                    } else {
                      return numPages!;
                    }
                  });
                  setManuallySetPage(true);
                }}
                size="sm"
                variant="outline"
              >
                <ArrowLeft />
              </Button>
              <span className="text-sm text-foreground">
                Page {currentPage} / {numPages}
              </span>
              <Button
                onClick={() => {
                  setCurrentPage((p) => {
                    if (p + 1 <= numPages!) {
                      return p + 1;
                    } else {
                      return 1;
                    }
                  });
                  setManuallySetPage(true);
                }}
                size="sm"
                variant="outline"
              >
                <ArrowRight />
              </Button>
            </div>

            <button
              className="absolute top-0 right-5 text-foreground hover:text-destructive cursor-pointer"
              onClick={closeReader}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          {/*AI language selector*/}
          <div className="flex w-fit flex-col gap-1 z-80 px-2 select-none">
            <label className="text-foreground">AI Language</label>
            <Select
              options={languageList}
              onChange={(e) => {
                if (e) setAILanguage(e.label);
              }}
              styles={ReactSelectStyles}
              placeholder={AILanguage}
              className="w-[150px] sm:w-[200px] border-foreground text-base"
            />
          </div>
        </div>

        {/* PDF Display */}
        <div
          className="w-full overflow-auto"
          ref={scrollContainerRef}
          onTouchEnd={handleTouchEnd}
          onMouseUp={handleMouseUp}
        >
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<p>Loading PDF...</p>}
          >
            {isScrollMode && numPages ? (
              Array.from(new Array(numPages), (_, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    pageRefs.current[index] = el;
                  }}
                  className={`flex justify-center w-fit min-w-[100%] py-4`}
                >
                  <Page
                    key={index}
                    pageNumber={index + 1}
                    scale={scale}
                    className="border-black border-[2px]"
                  />
                </div>
              ))
            ) : (
              <div className="flex justify-center w-fit min-w-[100%] py-4">
                <Page
                  pageNumber={currentPage}
                  scale={scale}
                  renderTextLayer={true}
                  renderAnnotationLayer={false}
                />
              </div>
            )}
          </Document>
        </div>

        {/* Pagination Controls for below 1024px*/}
        <div className="lg:hidden flex items-center justify-center w-full my-2 gap-2 relative text-foreground select-none">
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary cursor-pointer absolute left-3"
          >
            <Download />
          </a>
          <Button
            onClick={() => {
              setCurrentPage((p) => {
                if (p - 1 >= 1) {
                  return p - 1;
                } else {
                  return numPages!;
                }
              });
              setManuallySetPage(true);
            }}
            size="sm"
            variant="outline"
          >
            <ArrowLeft />
          </Button>
          <span className="text-sm text-foreground">
            Page {currentPage} / {numPages}
          </span>
          <Button
            onClick={() => {
              setCurrentPage((p) => {
                if (p + 1 <= numPages!) {
                  return p + 1;
                } else {
                  return 1;
                }
              });
              setManuallySetPage(true);
            }}
            size="sm"
            variant="outline"
          >
            <ArrowRight />
          </Button>
        </div>

        {/*popup menu for desktop when highlight a chunk of text for AI Services*/}
        {desktopAIMenuOpen && (
          <div
            className="absolute z-50 bg-card border-2 border-primary rounded-lg shadow-lg p-2 bottom-16 right-[1%] text-foreground"
            style={
              {
                //top: `${popupPosition.y}px`,
                //left: `${popupPosition.x}px`,
              }
            }
          >
            <Select
              options={languageList}
              onChange={(e) => {
                if (e) setAILanguage(e.label);
              }}
              styles={ReactSelectStyles}
              placeholder={AILanguage}
              className="w-[200px] border-foreground"
            />
            <button
              className="block w-full text-left px-2 py-1 hover:bg-primary rounded"
              onClick={() => handleOptionClick("translate")}
            >
              Translate
            </button>
            <button
              className="block w-full text-left px-2 py-1 hover:bg-primary rounded"
              onClick={() => handleOptionClick("summarize")}
            >
              Context Summarize
            </button>
            <button
              className="block w-full text-left px-2 py-1 hover:bg-primary rounded"
              onClick={() => handleOptionClick("discuss")}
            >
              Discuss
            </button>
          </div>
        )}

        {/*Modal for displaying AI Services Content*/}
        <Modal
          isOpen={AIContentOpen}
          onClose={() => {
            setAIContentData("");
            setAIContentOpen(false);
          }}
          title={AIServiceOption.toLocaleUpperCase()}
          className="flex flex-col w-[95vw] sm:w-[80vw]"
        >
          {isAILoading ? (
            <div className="flex w-full items-center justify-center">
              <LoaderCircle className="text-foreground w-[70px] lg:w-[90px] animate-spin" />
            </div>
          ) : (
            <div
              className="w-full text-foreground border-border border-2 rounded-lg py-4 px-8"
              dangerouslySetInnerHTML={{ __html: AIContentData }}
            />
          )}
        </Modal>
      </div>

      {/*popup menu for mobile when highlight a chunk of text for AI Services*/}
      {mobileAIMenuOpen && (
        <div
          className="absolute flex w-[95%] z-50 bg-card border-2 border-primary rounded-lg shadow-lg bottom-15 left-1/2 -translate-x-1/2 text-foreground"
          style={
            {
              //top: `${popupPosition.y}px`,
              //left: `${popupPosition.x}px`,
            }
          }
        >
          <button
            className="text-sm block w-full text-center p-2 hover:bg-primary border-r-1 border-border"
            onClick={() => handleOptionClick("translate")}
          >
            Translate
          </button>
          <button
            className="text-sm block w-full text-center p-2 hover:bg-primary border-r-1 border-border"
            onClick={() => handleOptionClick("summarize")}
          >
            Summarize
          </button>
          <button
            className="text-sm block w-full text-center p-2 hover:bg-primary border-none"
            onClick={() => handleOptionClick("discuss")}
          >
            Discuss
          </button>
        </div>
      )}
    </div>
  );
};

export default PDFReader;
