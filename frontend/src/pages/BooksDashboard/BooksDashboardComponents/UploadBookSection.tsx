import NewAuthorInput from "./NewAuthorInput";
import ExistingAuthorInput, {
  ExistingAuthorInputRef,
} from "./ExistingAuthorInput";
import SlideDown from "react-slidedown";
import { Button } from "@/components/ui/button";
import React, { useState, useRef, useEffect } from "react";
import ExistingBookInput, { ExistingBookInputRef } from "./ExistingBookInput";
import { ChevronRight } from "lucide-react";
import { BooksCategoryOptionsWithoutAll } from "@/utils/constants";
import Select from "react-select";
import ReactSelectStyles from "@/styles/ReactSelectStyles";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { bookActions } from "@/redux/slices";
import { bookApi } from "@/services/bookApis";

type UploadBookSectionProps = {
  closeModal: () => void;
};

const UploadBookSection: React.FC<UploadBookSectionProps> = ({
  closeModal,
}) => {
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [category, setCategory] = useState<string>(
    BooksCategoryOptionsWithoutAll[0].label
  );
  const [description, setDescription] = useState<string | null>(null);
  const [isNewAuthor, setIsNewAuthor] = useState<boolean>(false);
  const [isNewBook, setIsNewBook] = useState<boolean>(false);
  const [authorName, setAuthorName] = useState<string | null>(null);
  const [authorCountry, setAuthorCountry] = useState<string | null>(null);
  const [authorId, setAuthorId] = useState<number | null>(null);
  const [bookId, setBookId] = useState<number | null>(null);
  const bookFileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const existingBookRef = useRef<ExistingBookInputRef>(null);
  const existingAuthorRef = useRef<ExistingAuthorInputRef>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useAppDispatch();
  const uploadSuccess = useAppSelector((state) => state.bookSlice.bookUploaded);

  // File change handler
  const handleBookFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setBookFile(file);
    }
  };

  const handleThumbnailChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setThumbnail(file);
    }
  };

  //Handle if the author is new or existing
  const handleIsNewAuthorChange = () => {
    if (!isNewAuthor) {
      setAuthorId(null);
      existingAuthorRef.current?.clearInput();
    } else {
      setAuthorName(null);
      setAuthorCountry(null);
    }
    setIsNewAuthor((prev) => !prev);
  };

  const handleIsNewBookChange = () => {
    if (!isNewBook) {
      setBookId(null);
      existingBookRef.current?.clearInput();
    } else {
      setTitle(null);
      setThumbnail(null);
      setCategory(BooksCategoryOptionsWithoutAll[0].label);
      setDescription(null);
    }
    setIsNewBook((prev) => !prev);
  };

  // File upload handler
  const handleUploadBook = async () => {
    if (bookFile) {
      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();

      formData.append("bookFile", bookFile);
      formData.append("thumbnail", thumbnail ? thumbnail : String(null));
      formData.append("category", category === "Fiction" ? "FIC" : category);
      formData.append("title", title === "" ? String(null) : String(title));
      formData.append(
        "description",
        description === "" ? String(null) : String(description)
      );
      formData.append("authorId", String(authorId));
      formData.append(
        "authorName",
        authorName === "" ? String(null) : String(authorName)
      );
      formData.append(
        "authorCountry",
        authorCountry === "" ? String(null) : String(authorCountry)
      );
      formData.append("bookId", String(bookId));

      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      await dispatch(
        bookActions.createBook({
          formData,
          onProgress: (percent) => {
            setUploadProgress(percent);
          },
        })
      );
    }
    setTitle(null); // Clear the title input after upload
    setBookFile(null);
    setThumbnail(null);
    setDescription(null);
    setAuthorName(null);
    setAuthorCountry(null);
    setCategory(BooksCategoryOptionsWithoutAll[0].label);
    setBookId(null);
    setIsNewAuthor(false); // Reset the new author toggle
    setIsNewBook(false);
    setIsUploading(false);

    // Reset file input DOM
    if (bookFileInputRef.current) {
      bookFileInputRef.current.value = "";
    }

    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = "";
    }

    //reset select input search
    existingBookRef.current?.clearInput();
    existingAuthorRef.current?.clearInput();
  };

  useEffect(() => {
    if (uploadSuccess) {
      dispatch(bookApi.util.invalidateTags(["books"]));
      closeModal();
    }
  }, [uploadSuccess, dispatch, closeModal]);

  return (
    <section className="books-dashboard-upload-section-container">
      {/*1. upload book's file */}
      <div className="input-field-container">
        <label className="form-label">1. Book File</label>
        <input
          type="file"
          onChange={handleBookFileChange}
          className="form-input file-input"
          ref={bookFileInputRef}
        />
      </div>

      {/*2. Search existing book or create a new book*/}
      <ExistingBookInput
        setBookId={setBookId}
        disabled={isNewBook}
        ref={existingBookRef}
      />

      {/*create new book */}
      <label
        onClick={handleIsNewBookChange}
        className="relative flex items-center leading-none text-xl text-primary mb-4 cursor-pointer group w-fit"
      >
        <span>Or Add a new book</span>
        <ChevronRight
          className={`absolute top-[1%] left-[100%] transition-transform duration-300 ${
            isNewBook ? "rotate-90" : "rotate-0"
          }`}
        />

        <div
          className={`absolute transition-all w-0 group-hover:w-[110%] bg-primary duration-300 top-[115%] h-[2px] ${
            isNewBook ? "w-[110%]" : ""
          }`}
        />
      </label>
      <SlideDown>
        {isNewBook && (
          <>
            <div className="input-field-container">
              <label className="form-label">Title</label>
              <input
                type="text"
                placeholder="Enter Book's title"
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
                value={title ? title : ""} // Bind the input value to the state
              />
            </div>

            <div className="input-field-container">
              <label className="form-label">Thumbnail (Book's cover)</label>
              <input
                type="file"
                onChange={handleThumbnailChange}
                className="form-input file-input"
                ref={thumbnailInputRef}
              />
            </div>

            <div className="input-field-container">
              <label className="form-label">Category</label>
              <Select
                options={BooksCategoryOptionsWithoutAll}
                onChange={(e) => {
                  if (e) setCategory(e.value);
                }}
                styles={ReactSelectStyles}
                placeholder={category}
                className="w-[200px]"
              />
            </div>

            <div className="input-field-container">
              <label className="form-label">Description</label>
              <textarea
                rows={10}
                className="w-full text-area resize-none"
                value={description ? description : ""}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Book's description..."
              />
            </div>
          </>
        )}
      </SlideDown>
      {/*Create a new book */}
      {/*2. Search existing book or create a new book*/}

      {/*3. search existing author or create a new author */}
      <div className={`${!isNewBook ? "pointer-events-none opacity-50" : ""}`}>
        {/* <ExistingAuthorInput /> */}
        <ExistingAuthorInput
          setAuthorId={setAuthorId}
          disabled={isNewAuthor}
          ref={existingAuthorRef}
        />
        <label
          onClick={handleIsNewAuthorChange}
          className="relative flex items-center leading-none text-xl text-primary mb-4 cursor-pointer group w-fit"
        >
          <span>Or Add a new author</span>
          <ChevronRight
            className={`absolute top-[1%] left-[100%] transition-transform duration-300 ${
              isNewAuthor ? "rotate-90" : "rotate-0"
            }`}
          />

          <div
            className={`absolute transition-all w-0 group-hover:w-[110%] bg-primary duration-300 top-[115%] h-[2px] ${
              isNewAuthor ? "w-[110%]" : ""
            }`}
          />
        </label>

        <SlideDown>
          {isNewAuthor && (
            <>
              {/* <NewAuthorInput /> */}
              <NewAuthorInput
                setAuthorName={setAuthorName}
                setAuthorCountry={setAuthorCountry}
              />
            </>
          )}
        </SlideDown>
      </div>
      {/*3. search existing author or create a new author */}

      <Button
        onClick={handleUploadBook}
        size="lg"
        className="w-full mt-4"
        disabled={isUploading}
      >
        Submit
      </Button>

      {isUploading && (
        <div className="flex flex-col gap-2">
          <p className="text-primary">Uploading: {uploadProgress}%</p>
          <progress value={uploadProgress} max={100}></progress>
        </div>
      )}
    </section>
  );
};

export default UploadBookSection;
