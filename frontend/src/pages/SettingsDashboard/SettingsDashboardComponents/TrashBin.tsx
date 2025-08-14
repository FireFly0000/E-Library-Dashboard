import PDFReader from "@/components/PdfReader";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector, useWindowWidth } from "@/hooks/hooks";
import { userActions } from "@/redux/slices";
import { useGetBookVersionsInTrashQuery, userApi } from "@/services/userApis";
import { TrashedBookVersion } from "@/types/user";
import { ArchiveRestore, LoaderCircle, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { ItemAction, ItemActionsMenu } from "@/components/ItemActionsMenu";
import { bookApi } from "@/services/bookApis";

const daysTilDelete = (trashedAt: Date) => {
  const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;

  const deleteDate = new Date(trashedAt);
  deleteDate.setDate(deleteDate.getDate() + 15);

  const now = new Date();
  const diffMs = deleteDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / MILLISECONDS_IN_DAY);

  return Math.max(diffDays, 0); // never return negative
};

//Main Component function ======================================================
const TrashBin: React.FC = () => {
  const [versionsInTrash, setVersionsInTrash] = useState<
    TrashedBookVersion[] | null
  >(null);
  const { data, isLoading } = useGetBookVersionsInTrashQuery();
  const trashedBookVersionRecovered = useAppSelector(
    (state) => state.userSlice.trashedBookVersionRecovered
  );
  const bookVersionDeleted = useAppSelector(
    (state) => state.userSlice.bookVersionDeleted
  );
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [selectedFileTitle, setSelectedFileTitle] = useState<string | null>(
    null
  );
  const dispatch = useAppDispatch();
  const width = useWindowWidth();

  //Load versionsInTrash data into state
  useEffect(() => {
    if (data?.data) {
      setVersionsInTrash(data.data);
    }
  }, [data]);

  //invalidate tags and reset success state for recover trashed book version
  useEffect(() => {
    if (trashedBookVersionRecovered) {
      dispatch(userApi.util.invalidateTags(["trashed", "profile"]));
      dispatch(bookApi.util.invalidateTags(["books"]));
      dispatch(userActions.setTrashedBookVersionRecovered(false));
    }
  });

  //invalidate tags and reset success state for permanently delete book version
  useEffect(() => {
    if (bookVersionDeleted) {
      dispatch(userApi.util.invalidateTags(["trashed"]));
      dispatch(userActions.setBookVersionDeleted(false));
    }
  });

  //Trashed items actions menu list======================================
  const trashedItemsActionsMenu: ItemAction<TrashedBookVersion>[] = [
    {
      icon: ArchiveRestore,
      label: "Recover",
      subLabel: "",
      needsConfirm: true,
      modalTitle: () => "Recover this version?",
      onConfirm: async (version: TrashedBookVersion) => {
        await dispatch(
          userActions.recoverTrashedBookVersion({
            bookVersionId: version.id,
          })
        );
      },
    },
    {
      icon: Trash2,
      label: "Delete",
      subLabel: "Permanently Delete",
      needsConfirm: true,
      modalTitle: () => "Permanently delete this version?",
      onConfirm: async (version: TrashedBookVersion) => {
        await dispatch(
          userActions.deleteBookVersion({
            bookVersionId: version.id,
          })
        );
      },
    },
  ];

  return (
    <main className="flex flex-col w-full items-center justify-center">
      <section className="flex flex-col default-card-container items-start justify-start w-[93vw] max-w-[700px] gap-5 px-3 md:px-10 py-4 sm:py-6">
        <label className="text-foreground text-2xl">Recently Trashed</label>

        {/*Trashed versions content*/}
        {isLoading ? (
          <LoaderCircle className="text-foreground w-[70px] lg:w-[90px] animate-spin" />
        ) : versionsInTrash?.length === 0 ? (
          <span className="text-foreground text-lg md:text-xl">
            Trash is empty
          </span>
        ) : (
          <div className="flex items-start flex-col gap-6 w-full max-h-[670px] overflow-y-auto p-2">
            {versionsInTrash?.map((version: TrashedBookVersion, index) => (
              <div
                className="flex items-start justify-start gap-4 border-b-2 last:border-b-0 border-foreground/60 w-full pb-4"
                key={index}
              >
                <img
                  className="w-[130px] md:w-[150px]"
                  src={version.thumbnailUrl}
                />

                {/*text info*/}
                <div className="flex flex-col w-full gap-2 md:gap-3">
                  <span className="w-fit text-base md:text-xl font-bold leading-none">
                    {version.title}
                  </span>

                  <span className="text-sm md:text-lg leading-none">
                    By:{" "}
                    <span className="italic font-bold">
                      {version.authorName}
                    </span>
                  </span>

                  <span className="text-sm md:text-lg leading-none">
                    ID: <span className="font-bold">{version.id}</span>
                  </span>

                  <span className="text-sm md:text-lg leading-none">
                    Views:{" "}
                    <span className="font-bold">{version.viewCount}</span>
                  </span>

                  <div className="text-sm md:text-lg flex items-start justify-start gap-2">
                    <Trash2 className="w-[18px] md:w-[25px] h-full" />
                    <div className="font-bold">
                      in {daysTilDelete(version.trashedAt)} days
                    </div>
                  </div>

                  {/*Read button*/}
                  <Button
                    variant="outline"
                    size={width >= 820 ? "lg" : "sm"}
                    onClick={() => {
                      setSelectedFileUrl(version.fileUrl);
                      setSelectedFileTitle(version.title);
                      setIsReaderOpen(true);
                    }}
                    className="w-fit"
                  >
                    View
                  </Button>
                </div>

                {/*Actions menu dropdown (delete version, etc..) */}
                <ItemActionsMenu
                  item={version}
                  actions={trashedItemsActionsMenu}
                />
              </div>
            ))}
          </div>
        )}

        {selectedFileUrl && isReaderOpen && selectedFileTitle && (
          <PDFReader
            fileUrl={selectedFileUrl}
            closeReader={() => setIsReaderOpen(false)}
            title={selectedFileTitle}
            isOpen={isReaderOpen}
          />
        )}
      </section>
    </main>
  );
};

export default TrashBin;
