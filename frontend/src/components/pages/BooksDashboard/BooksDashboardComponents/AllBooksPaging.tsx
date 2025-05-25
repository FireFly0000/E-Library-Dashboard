import { useEffect, useState } from "react";
import axios from "axios";

type Author = {
  id: number;
  name: string;
  country: string;
  dateOfBirth: Date;
  createdAt: Date;
  updatedAt: Date;
};

type Book = {
  id: number;
  title: string;
  authorId: number;
  fileName: string;
  createdAt: Date;
  updatedAt: Date;
  author: Author;
  fileUrl: string;
};

type AllBooksPagingProps = {
  upLoadFlag: boolean;
};

const AllBooksPaging: React.FC<AllBooksPagingProps> = ({ upLoadFlag }) => {
  const [books, setBooks] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("createdAt DESC");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // State to track window width

  // Effect to update windowWidth on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getAllBooksPaging = async (
    pageIndex: number,
    keyword: string,
    sortBy: string
  ) => {
    const response = await axios.get(
      `/api/books/paging?page_index=${pageIndex}&key_word=${keyword}&sort_by=${sortBy}`
    );
    return response.data;
  };

  useEffect(() => {
    const fetchBooks = async () => {
      const result = await getAllBooksPaging(pageIndex, keyword, sortBy);
      setBooks(result.data.data); // books array
      setTotalPages(result.data.total_page);
    };

    fetchBooks();
  }, [pageIndex, keyword, sortBy, upLoadFlag]); // Added upLoadFlag to dependencies

  return (
    <div className="all-books-paging-container">
      <input
        type="text"
        placeholder="Search title..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="search-input"
      />

      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="select-dropdown"
      >
        <option value="createdAt DESC">Newest First</option>
        <option value="createdAt ASC">Oldest First</option>
        <option value="title ASC">Title A-Z</option>
        <option value="title DESC">Title Z-A</option>
      </select>

      <div className="responsive-table-container">
        <table className="book-table">
          <thead>
            <tr>
              <th>Book ID</th>
              <th>Created At</th>
              <th>{windowWidth > 440 ? "Title" : "Title (PDF)"}</th>
              <th>Author's Name</th>
              {windowWidth > 440 && <th>PDF</th>}
            </tr>
          </thead>
          <tbody>
            {books.map((book: Book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{new Date(book.createdAt).toLocaleDateString()}</td>
                <td>
                  {windowWidth > 440 ? (
                    book.title
                  ) : (
                    <a
                      href={book.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="book-link"
                    >
                      {book.title}
                    </a>
                  )}
                </td>
                <td>{book.author?.name || "Unknown"}</td>
                {windowWidth > 440 && (
                  <td className="book-file-link">
                    {book.fileName ? (
                      <a
                        href={book.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="book-link"
                      >
                        {windowWidth < 1200 ? "PDF" : book.fileName}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => setPageIndex(pageIndex - 1)}
        disabled={pageIndex <= 1}
        className="paging-button"
      >
        Prev
      </button>
      <span>
        {" "}
        Page {pageIndex} of {totalPages}{" "}
      </span>
      <button
        onClick={() => setPageIndex(pageIndex + 1)}
        disabled={pageIndex >= totalPages}
        className="paging-button"
      >
        Next
      </button>
    </div>
  );
};

export default AllBooksPaging;
