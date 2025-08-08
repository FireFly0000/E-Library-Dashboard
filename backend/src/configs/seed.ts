import { db } from "./db.config";
import { CategoryCode } from "@prisma/client";

async function main() {
  const defaultCategories = [
    { name: "Fiction", categoryCode: CategoryCode.FIC },
    { name: "Science", categoryCode: CategoryCode.SCI },
    { name: "Biography", categoryCode: CategoryCode.BIO },
    { name: "Romance", categoryCode: CategoryCode.ROM },
    { name: "Fantasy", categoryCode: CategoryCode.FANT },
    { name: "Thriller", categoryCode: CategoryCode.THR },
    { name: "Historical", categoryCode: CategoryCode.HIST },
    { name: "Mystery", categoryCode: CategoryCode.MYST },
    { name: "Horror", categoryCode: CategoryCode.HORR },
  ];

  const count = await db.category.count();
  if (count > 0) {
    console.log("✅ Categories already seeded, skipping.");
    return;
  }

  for (const category of defaultCategories) {
    await db.category.upsert({
      where: { categoryCode: category.categoryCode as any },
      update: {},
      create: category,
    });
  }

  console.log("✅ Default categories seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    db.$disconnect();
  });
