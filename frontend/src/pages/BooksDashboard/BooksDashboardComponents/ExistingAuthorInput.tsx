import {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";
//import debounce from "lodash/debounce";
import { useSearchAuthorsByNameQuery } from "@/services/authorApis";
import { Author } from "@/types/authors";
import { useRtkQueryErrorToast } from "@/hooks/hooks";

type ExistingAuthorInputProps = {
  setAuthorId: (id: number) => void;
  disabled: boolean;
};

export type ExistingAuthorInputRef = {
  clearInput: () => void;
};

const ExistingAuthorInput = forwardRef<
  ExistingAuthorInputRef,
  ExistingAuthorInputProps
>(({ setAuthorId, disabled }, ref) => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [selectedVal, setSelectedVal] = useState<string>("");
  const [debouncedVal, setDebouncedVal] = useState<string>("");
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data, error } = useSearchAuthorsByNameQuery(debouncedVal, {
    skip: debouncedVal.trim() === "" || isSelected, // prevent API call when input is empty
  });
  useRtkQueryErrorToast(error);

  //Update data from API here
  useEffect(() => {
    if (debouncedVal.trim() === "") {
      setAuthors([]);
      return;
    }

    if (data?.data) {
      setAuthors(data.data);
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
      setAuthors([]);
      setIsSelected(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
  }));

  const handleSelectAuthor = (author: Author) => {
    setAuthorId(author.id);
    setAuthors([]); // Clear the authors list after selection
    setSelectedVal(`${author.name} (${author.country}) - id: ${author.id}`); // Set the selected value to the input field
    setIsSelected(true);
  };

  return (
    <div className="input-field-container">
      <label className="form-label">3. Search Existing Author</label>
      <input
        type="text"
        className={`form-input ${disabled ? "opacity-50" : ""}`}
        onChange={(e) => {
          setSelectedVal(e.target.value); // update value as user types
        }}
        onClick={() => {
          setSelectedVal(""); // Clear the input to allow new search
          setDebouncedVal("");
          setAuthors([]); // Also clear the list in case it's stale
          setIsSelected(false);
        }}
        value={selectedVal} // Set the input value to the selected value
        placeholder="Search author by name..."
        disabled={disabled}
        ref={inputRef}
      />

      {authors.length ? (
        <div className="author-list">
          {authors.map((author: Author) => (
            <div
              key={author.id}
              className="author-item"
              onClick={() => handleSelectAuthor(author)}
            >
              <p>
                {author.name} {`(${author.country})`} - id: {author.id}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
});

export default ExistingAuthorInput;
