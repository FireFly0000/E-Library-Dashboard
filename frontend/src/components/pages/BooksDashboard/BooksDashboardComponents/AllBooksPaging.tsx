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
      />

      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="createdAt DESC">Newest First</option>
        <option value="createdAt ASC">Oldest First</option>
        <option value="title ASC">Title A-Z</option>
        <option value="title DESC">Title Z-A</option>
      </select>

      <table className="book-table">
        <thead>
          <tr>
            <th>Book ID</th>
            <th>Created At</th>
            <th>Title</th>
            <th>Author's Name</th>
            <th>PDF</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book: Book) => (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>{new Date(book.createdAt).toLocaleDateString()}</td>
              <td>{book.title}</td>
              <td>{book.author?.name || "Unknown"}</td>
              <td>
                {book.fileName ? (
                  <a
                    href={book.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="book-link"
                  >
                    {book.fileName}
                  </a>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
