import { useEffect, useMemo, useState } from "react";
import debounce from "lodash/debounce";
import axios from "axios";

type ExistingAuthorInputProps = {
  setAuthorId: (id: number) => void;
  setAuthorName: (name: string) => void;
  setAuthorCountry: (country: string) => void;
  setAuthorDateOfBirth: (date: string) => void;
};

type Author = {
  id: number;
  name: string;
  country: string;
  dateOfBirth: string;
};

const ExistingAuthorInput: React.FC<ExistingAuthorInputProps> = ({
  setAuthorId,
  setAuthorName,
  setAuthorCountry,
  setAuthorDateOfBirth,
}) => {
  const [authors, setAuthors] = useState([]);
  const [selectedVal, setSelectedVal] = useState<string>("");

  const handleSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        if (query === "") {
          setAuthors([]);
          return;
        }
        const response = await axios.get(`/api/authors/filter?name=${query}`);
        setAuthors(response.data.data);
      }, 500),
    []
  );

  useEffect(() => {
    return () => {
      handleSearch.cancel(); // Only works if using lodash.debounce
    };
  }, [handleSearch]);

  const handleSelectAuthor = (author: Author) => {
    setAuthorId(author.id);
    setAuthorName(author.name);
    setAuthorCountry(author.country);
    setAuthorDateOfBirth(author.dateOfBirth);
    setAuthors([]); // Clear the authors list after selection
    setSelectedVal(`${author.name} (${author.country}) - id: ${author.id}`); // Set the selected value to the input field
  };

  return (
    <div className="input-field-container">
      <label className="form-label">Search Existing Author</label>
      <input
        type="text"
        className="form-input"
        onChange={(e) => {
          setSelectedVal(e.target.value); // update value as user types
          handleSearch(e.target.value); // debounce API call
        }}
        onClick={() => {
          setSelectedVal(""); // Clear the input to allow new search
          setAuthors([]); // Also clear the list in case it's stale
        }}
        value={selectedVal} // Set the input value to the selected value
        placeholder="Search author by name..."
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
};

export default ExistingAuthorInput;
