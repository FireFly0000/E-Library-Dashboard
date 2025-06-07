import { bookSchema, BookWithSignedUrl } from "../types/book.type";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../configs/aws.config";
import configs from "../configs";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { db } from "../configs/db.config";

//Get all books
export const getAllBooks = async (req, res) => {
  try {
    const allBooks = await db.book.findMany({
      include: { author: true },
    });

    res.status(200).json({ data: allBooks });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch books" });
  }
};

//get all books with pagination and sorting
export const getAllBooksPaging = async (req, res) => {
  try {
    const pageIndex = Number(req.query.page_index) || 1;
    const pageSize = 10; // Fixed page size
    const keyword = req.query.key_word || "";
    const sortBy = req.query.sort_by || "createdAt DESC";

    // Parse sort field and direction
    let [sortField, sortDirection] = sortBy.split(" ");

    // Get total matching books that match the keyword
    const totalRecord = await db.book.count({
      where: {
        title: {
          contains: keyword,
          mode: "insensitive",
        },
      },
    });

    // Fetch paginated books with filters and sorting
    const books = await db.book.findMany({
      where: {
        title: {
          contains: keyword,
          mode: "insensitive",
        },
      },
      orderBy: {
        [sortField]: sortDirection.toLowerCase() === "asc" ? "asc" : "desc",
      },
      skip: (pageIndex - 1) * pageSize,
      take: pageSize,
      include: { author: true },
    });

    /*for bookVersion =====================================
    // Generate signed URLs for each book file
    const booksWithUrls: BookWithSignedUrl[] = [];

    for (const book of books) {
      const getObjectParams = {
        Bucket: configs.general.AWS_S3_BUCKET_NAME,
        Key: book.fileName,
      };
      const command = new GetObjectCommand(getObjectParams);
      const signedUrl = await getSignedUrl(s3, command, {
        expiresIn: 3600, // URL expiration time in seconds (1 hour)
      });
      booksWithUrls.push({
        ...book,
        fileUrl: signedUrl,
      });
    }*/

    const totalPage = Math.ceil(totalRecord / pageSize);

    res.status(200).json({
      status_code: 200,
      message: "Books fetched successfully",
      data: {
        page_index: pageIndex,
        page_size: pageSize,
        total_page: totalPage,
        total_record: totalRecord,
        data: books,
      },
    });
  } catch (e) {
    res
      .status(500)
      .json({ status_code: 500, message: "Failed to fetch books" });
  }
};

//Get book by id
export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await db.book.findUnique({
      where: {
        id: Number(id),
      },
      include: { author: true },
    });

    // Raise a 404 error when book not found
    if (!book) {
      return res.status(404).json({ error: `Book with ID ${id} not found` });
    }

    res.status(200).json({ data: book });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
};

//===================================== create book =======================================

//Helper function to upload file to S3
const uploadFileToS3 = async (file): Promise<string> => {
  // Generate a unique key for the file using a timestamp and the original filename
  const timestamp = Date.now();
  const uniqueKey = `${timestamp}_${file.originalname}`;

  const params = {
    Bucket: configs.general.AWS_S3_BUCKET_NAME,
    Key: uniqueKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  const command = new PutObjectCommand(params);

  await s3.send(command);

  return uniqueKey;
};

//Create book
export const createBook = async (req, res) => {
  /*const fileName = await uploadFileToS3(req.file); // Upload the file to S3

  // Create book data object
  // Use the fileName from S3 as the file name in the database
  const createBookData = {
    title: req.body.title,
    authorId: Number(req.body.authorId),
    fileName: fileName,
    author: JSON.parse(req.body.author),
  };

  const parsed = bookSchema.safeParse(createBookData);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors });
  }

  let authorId = parsed.data.authorId;
  const author = await db.author.findUnique({
    where: {
      id: parsed.data.authorId,
    },
  });

  // Create author if it doesn't exist
  if (!author) {
    const newAuthor = await db.author.create({
      data: {
        name: parsed.data.author.name,
        country: parsed.data.author.country,
        dateOfBirth: new Date(parsed.data.author.dateOfBirth), // Convert date string to Date object
      },
    });
    authorId = newAuthor.id;
  }

  try {
    const bookData = parsed.data;

    const newBook = await db.book.create({
      data: {
        title: bookData.title,
        //fileName: bookData.fileName,
        author: {
          connect: {
            id: authorId,
          },
        },
      },
    });

    res
      .status(201)
      .json({ message: "New book created successfully", data: newBook });
  } catch (e) {
    res.status(500).json({ error: "Failed to create book" });
  }*/

  res.status(501).json({ error: "Not implemented yet" });
};

//===================================== create book =======================================
