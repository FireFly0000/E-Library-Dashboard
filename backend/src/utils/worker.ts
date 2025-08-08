import cron from "node-cron";
import { db } from "../configs/db.config";
import { deleteFileFromS3 } from "./helper";

//For scheduled cleanup trash task. daily at 2AM
function dailyCleanupTrash() {
  // Runs every day at 2am server time
  cron.schedule(
    //"0 2 * * *",
    "0 2 * * *",
    async () => {
      console.log("🧹 Running trash cleanup task...");

      const cutoff = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000); // 15 days ago
      //const cutoff = new Date(Date.now() - 15 * 60 * 1000); // 15 minutes ago
      try {
        const deleted = await db.$transaction(async (tx) => {
          const trashedVersions = await tx.bookVersion.findMany({
            where: {
              isTrashed: true,
              trashedAt: {
                lte: cutoff,
              },
            },
            select: {
              id: true,
              fileName: true,
            },
          });

          const successfullyDeletedIds: number[] = [];

          for (const version of trashedVersions) {
            const isDeletedFromS3 = await deleteFileFromS3(version.fileName);
            if (isDeletedFromS3) {
              successfullyDeletedIds.push(version.id);
            } else {
              console.warn(
                `⚠️ Failed to delete from S3: ${version.fileName}, id:${version.id}`
              );
            }
          }

          if (successfullyDeletedIds.length === 0) {
            console.log("🚫 No files deleted from S3. Skipping DB cleanup.");
            return { count: 0 };
          }

          //Delete all successful versions in db
          const deleted = await tx.bookVersion.deleteMany({
            where: {
              id: { in: successfullyDeletedIds },
            },
          });

          return deleted;
        });

        console.log(`✅ Deleted ${deleted.count} expired trashed versions.`);
      } catch (err) {
        console.error("❌ Error during trash cleanup:", err);
      }
    },
    {
      timezone: "America/Los_Angeles", // or "UTC"
    }
  );
}

export const workers = { dailyCleanupTrash };
