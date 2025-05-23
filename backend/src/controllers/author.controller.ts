import { Prisma, PrismaClient, Author } from "@prisma/client";
import { authorSchema } from "../types/author.type";

const authorClient = new PrismaClient().author;
const prisma = new PrismaClient();

//Get all authors (without books)
export const getAllAuthors = async (req, res) => {
  try {
    const allAuthors = await authorClient.findMany();

    res.status(200).json({ data: allAuthors });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch authors" });
  }
};

//Get author by id (with books)
export const getAuthorById = async (req, res) => {
  try {
    const { id } = req.params;
    const author = await authorClient.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        books: true,
      },
    });

    // Raise a 404 error when author not found
    if (!author) {
      return res.status(404).json({ error: `Author with ID ${id} not found` });
    }

    res.status(200).json({ data: author });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch authors" });
  }
};

//filter authors by name
export const filterAuthorsByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Name query is required" });
    }

    const authors = await authorClient.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive", // Case insensitive search
        },
      },
      include: {
        books: true, // Include books if needed
      },
    });

    res.status(200).json({ data: authors });
  } catch (e) {
    console.error("Error fetching authors:", e); // ADD THIS LINE
    res.status(500).json({ error: "Failed to fetch authors" });
  }
};

//Create author
export const createAuthor = async (req, res) => {
  const parsed = authorSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.message });
  }

  const authorData: Prisma.AuthorCreateInput = {
    name: parsed.data.name.toLowerCase(),
    country: parsed.data.country,
    dateOfBirth: new Date(parsed.data.dateOfBirth), // Convert date string to Date object
  };
  try {
    const newAuthor = await authorClient.create({
      data: authorData,
    });

    res.status(201).json({ data: newAuthor });
  } catch (e) {
    res.status(500).json({ error: "Failed to create author" });
  }
};

//Update author
export const updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const authorData = req.body;
    const updatedAuthor = await authorClient.update({
      where: {
        id: Number(id),
      },
      data: authorData,
    });

    res.status(200).json({ data: updatedAuthor });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      return res
        .status(404)
        .json({ error: `Author with ID ${req.params.id} not found` });
    }
    res.status(500).json({ error: "Failed to update author" });
  }
};

//Delete author
export const deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    await authorClient.delete({
      where: {
        id: Number(id),
      },
    });

    res
      .status(200)
      .json({ message: `Author with ID ${id} deleted successfully` });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      return res
        .status(404)
        .json({ error: `Author with ID ${req.params.id} not found` });
    }
    res.status(500).json({ error: "Failed to delete author" });
  }
};
