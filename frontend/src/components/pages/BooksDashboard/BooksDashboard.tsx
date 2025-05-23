import React, { useState } from "react";
import "./BooksDashboard.css";
import NewAuthorInput from "./BooksDashboardComponents/NewAuthorInput";
import ExistingAuthorInput from "./BooksDashboardComponents/ExistingAuthorInput";
import AllBooksPaging from "./BooksDashboardComponents/AllBooksPaging";
import axios from "axios";
import { SlideDown } from "react-slidedown";
import "react-slidedown/lib/slidedown.css";

const BooksDashboard: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [isNewAuthor, setIsNewAuthor] = useState<boolean>(false);
  const [authorName, setAuthorName] = useState<string>("");
  const [authorCountry, setAuthorCountry] = useState<string>("");
  const [authorDateOfBirth, setAuthorDateOfBirth] = useState<string>("");
  const [authorId, setAuthorId] = useState<number>(0);
  const [upLoadFlag, setUploadFlag] = useState<boolean>(false);

  // File change handler
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  //Handle if the author is new or existing
  const handleIsNewAuthorChange = (checked: boolean) => {
    if (checked) {
      setAuthorName("");
      setAuthorCountry("");
      setAuthorDateOfBirth("");
      setAuthorId(0);
    }
    setIsNewAuthor(checked);
  };

  // File upload handler
  const handleUploadBook = async () => {
    if (selectedFile) {
      const formData = new FormData();
      const author = isNewAuthor
        ? {
            name: authorName,
            country: authorCountry,
            dateOfBirth: authorDateOfBirth,
          }
        : null;

      console.log("Author", author);
      console.log("AuthorId", authorId);

      formData.append("file", selectedFile);
      formData.append("title", title);
      formData.append("authorId", String(authorId));
      formData.append("author", JSON.stringify(author));

      try {
        const response = await axios.post("/api/books", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.status === 201) {
          console.log("File uploaded successfully:", response.data);
          await setUploadFlag((prev) => !prev); //toggle the upload flag to trigger books list refresh
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }

    setTitle(""); // Clear the title input after upload
    setIsNewAuthor(false); // Reset the new author toggle
  };

  return (
    <div className="books-dashboard-root-container">
      {/* Upload book section starts here */}
      <div className="books-dashboard-upload-section-container">
        <h2 className="upload-heading">Upload a Book</h2>

        <div className="input-field-container">
          <label className="form-label">Book File</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="form-input file-input"
          />
        </div>

        <div className="input-field-container">
          <label className="form-label">Title</label>
          <input
            type="text"
            placeholder="Enter Book's title"
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
            value={title} // Bind the input value to the state
          />
        </div>

        <div className="toggle-file-container">
          <label className="form-label">Add a new author</label>
          <input
            type="checkbox"
            checked={isNewAuthor}
            onChange={(e) => handleIsNewAuthorChange(e.target.checked)}
            className="toggle-switch"
          />
        </div>

        <SlideDown className="my-dropdown-slidedown">
          {isNewAuthor && (
            <>
              {/* <NewAuthorInput /> */}
              <NewAuthorInput
                setAuthorName={setAuthorName}
                setAuthorCountry={setAuthorCountry}
                setAuthorDateOfBirth={setAuthorDateOfBirth}
              />
            </>
          )}
        </SlideDown>
        {!isNewAuthor && (
          <>
            {/* <ExistingAuthorInput /> */}
            <ExistingAuthorInput
              setAuthorId={setAuthorId}
              setAuthorName={setAuthorName}
              setAuthorCountry={setAuthorCountry}
              setAuthorDateOfBirth={setAuthorDateOfBirth}
            />
          </>
        )}

        <button onClick={handleUploadBook} className="default-button">
          Submit
        </button>
      </div>
      {/* Upload book section ends here */}

      <AllBooksPaging
        upLoadFlag={upLoadFlag} // Pass the upload flag to trigger refresh
      />
    </div>
  );
};

export default BooksDashboard;
