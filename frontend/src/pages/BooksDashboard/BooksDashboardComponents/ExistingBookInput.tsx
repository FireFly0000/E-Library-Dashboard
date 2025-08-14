import {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";
import { BookSearchTitleAndAuthor } from "@/types/books";
import { useGetBooksSearchByTitleAndAuthorQuery } from "@/services/bookApis";
import { useRtkQueryErrorToast } from "@/hooks/hooks";
//import debounce from "lodash/debounce";

type ExistingBookInputProps = {
  setBookId: (id: number) => void;
  disabled: boolean;
};

export type ExistingBookInputRef = {
  clearInput: () => void;
};

const ExistingBookInput = forwardRef<
  ExistingBookInputRef,
  ExistingBookInputProps
>(({ setBookId, disabled }, ref) => {
  const [books, setBooks] = useState<BookSearchTitleAndAuthor[]>([]);
  const [selectedVal, setSelectedVal] = useState<string>("");
  const [debouncedVal, setDebouncedVal] = useState<string>("");
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data, error } = useGetBooksSearchByTitleAndAuthorQuery(debouncedVal, {
    skip: debouncedVal.trim() === "" || isSelected, // prevent API call when input is empty
  });
  useRtkQueryErrorToast(error);

  //Update data from API here
  useEffect(() => {
    if (debouncedVal.trim() === "") {
      setBooks([]);
      return;
    }

    if (data?.data) {
      setBooks(data.data);
    }
  }, [data, debouncedVal]);

  // Debounce search val
  useEffect(() => {
    if (isSelected) return;

    const handler = setTimeout(() => {
      setDebouncedVal(selectedVal);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [selectedVal, isSelected]);

  // Expose method to parent via ref
  useImperativeHandle(ref, () => ({
    clearInput: () => {
      setSelectedVal("");
      setDebouncedVal("");
      setBooks([]);
      setIsSelected(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
  }));

  const handleSelectBook = (book: BookSearchTitleAndAuthor) => {
    setBookId(book.id);
    setBooks([]); // Clear the books list after selection
    setSelectedVal(`${book.title} by ${book.author}`); // Set the selected value to the input field
    setIsSelected(true); // freeze input
  };

  return (
    <div className="input-field-container">
      <label className="form-label">2. Search Existing Book</label>
      <input
        type="text"
        className={`form-input ${disabled ? "opacity-50" : ""}`}
        onChange={(e) => {
          setSelectedVal(e.target.value); // update value as user types
        }}
        onClick={() => {
          setSelectedVal(""); // Clear the input to allow new search
          setDebouncedVal("");
          setBooks([]); // Also clear the list in case it's stale
          setIsSelected(false);
        }}
        value={selectedVal} // Set the input value to the selected value
        placeholder="Book's title by author's name..."
        disabled={disabled}
        ref={inputRef}
      />

      {books.length ? (
        <div className="author-list">
          {books.map((book: BookSearchTitleAndAuthor) => (
            <div
              key={book.id}
              className="book-search-item"
              onClick={() => handleSelectBook(book)}
            >
              <img src={book.thumbnailUrl} className="w-15 object-contain" />
              <div className="flex flex-col justify-center">
                <p>{book.title}</p>
                <p className="italic">By {book.author}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
});

export default ExistingBookInput;
