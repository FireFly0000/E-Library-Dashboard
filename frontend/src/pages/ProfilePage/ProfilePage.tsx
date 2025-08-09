import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import BlankProfilePic from "@/assets/blank-profile-picture.png";
import { useGetUserProfileQuery, userApi } from "@/services/userApis";
import { useRtkQueryErrorToast } from "@/hooks/hooks";
import {
  UserProfile,
  BookVersionByUserId,
  GetUserProfileParams,
} from "@/types/user";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Pagination from "@/components/Pagination";
import { BooksSortByOptions } from "@/utils/constants";
import CustomSelect from "@/components/ui/CustomSelect";
import "./ProfilePage.css";
import { LoaderCircle, Camera, Trash2 } from "lucide-react";
import PDFReader from "@/components/PdfReader";
import { Button } from "@/components/ui/button";
import { bookActions, userActions } from "@/redux/slices";
import { useWindowWidth } from "@/hooks/hooks";
//import ProfileImageCropper from "@/components/ProfileImgCropper";
import ProfileImgUploader from "@/components/ProfileImgUploader";
import Modal from "@/components/Modal";
import toast from "react-hot-toast";
import { ItemAction, ItemActionsMenu } from "@/components/ItemActionsMenu";
import { bookApi } from "@/services/bookApis";

const ProfilePage = () => {
  const user = useAppSelector((state) => state.authSlice.user);
  const isLogin = useAppSelector((state) => state.authSlice.isLogin);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [selectedFileTitle, setSelectedFileTitle] = useState<string | null>(
    null
  );
  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [sortBy, setSortBy] = useState("createdAt DESC");
  const [openImgCropper, setOpenImgCropper] = useState(false);
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const width = useWindowWidth();

  //Redux states to watch and trigger RTK refetch when profile is updated
  const profileImgUploaded = useAppSelector(
    (state) => state.userSlice.profileImgUploaded
  );
  const bookVersionTrashed = useAppSelector(
    (state) => state.userSlice.bookVersionTrashed
  );
  const trashedBookVersionRecovered = useAppSelector(
    (state) => state.userSlice.trashedBookVersionRecovered
  );

  //API to get user profile
  const { data, isLoading, error, refetch } = useGetUserProfileQuery({
    search: debouncedSearch,
    sortBy: sortBy,
    userId: Number(userId),
    page_index: pageIndex,
  } as GetUserProfileParams);
  useRtkQueryErrorToast(error);

  //Update book versions data
  useEffect(() => {
    if (data?.data) {
      setUserProfile(data.data);
      setTotalPages(data.total_pages);
    }
  }, [data]);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  //Set page to 1 when filters applied
  useEffect(() => {
    setPageIndex(1);
  }, [debouncedSearch, sortBy]);

  const handleViewsIncrement = async (
    bookVersionId: number,
    bookId: number
  ) => {
    await dispatch(
      bookActions.updateViewCount({
        bookId: bookId,
        bookVersionId: bookVersionId,
        contributorId: Number(userId),
      })
    );
  };

  //Refetch when profile changes (avatar, version to trash etc)
  useEffect(() => {
    if (
      profileImgUploaded ||
      bookVersionTrashed ||
      trashedBookVersionRecovered
    ) {
      refetch();
      dispatch(userActions.setProfileImgUploaded(false));
      dispatch(userActions.setBookVersionTrashed(false));
    }
  }, [
    profileImgUploaded,
    bookVersionTrashed,
    trashedBookVersionRecovered,
    refetch,
    dispatch,
  ]);

  //call versionToTrash API
  const handleVersionToTrash = async (bookVersionId: number) => {
    if (user.id && bookVersionId) {
      await dispatch(
        userActions.moveBookVersionToTrash({
          bookVersionId: bookVersionId,
          profileId: user.id,
        })
      );
    } else {
      toast.error("Unexpected error");
    }
    dispatch(userApi.util.invalidateTags(["trashed"]));
    dispatch(bookApi.util.invalidateTags(["books"]));
  };

  //Trashed items actions menu list======================================
  const bookVersionActionsMenu: ItemAction<BookVersionByUserId>[] = [
    {
      icon: Trash2,
      label: "Move to trash",
      subLabel: "Permanently delete in 15 days",
      needsConfirm: true,
      modalTitle: () => "Move this version to trash?",
      onConfirm: async (version: BookVersionByUserId) => {
        await handleVersionToTrash(version.id);
      },
    },
  ];

  const userInfos = [
    { key: "Email", value: userProfile?.email },
    { key: "Views", value: userProfile?.totalViews },
  ];

  return (
    <main
      className=" flex items-center flex-col
      min-h-screen w-screen overflow-hidden"
    >
      <div className="profile-page-root-container">
        {/*User info and user's contributed books section*/}
        <section className="flex-col xl:flex-row flex w-full items-center xl:items-start justify-between text-foreground gap-8 xl:gap-0 mb-8">
          {/*user info*/}
          <div className="bg-card rounded-2xl border-border border-2 min-w-[350px] w-[50%] md:w-[55%] xl:w-[35%] flex flex-col items-center justify-center gap-4 py-8">
            {/*Avatar and username */}
            <div className="flex flex-col items-center justify-center gap-3 border-b-1 border-b-foreground/40 w-[80%] pb-4 last:border-b-0">
              <div className="relative w-fit flex">
                <img
                  src={
                    userProfile?.url_avatar
                      ? userProfile.url_avatar
                      : BlankProfilePic
                  }
                  className="w-[150px] rounded-full"
                />
                {isLogin && user.id === Number(userId) && (
                  <Camera
                    className="text-3xl bg-primary text-white rounded-full 
                    absolute p-1 border-2 border-primary right-0 bottom-0 cursor-pointer w-[40px] h-[40px]"
                    onClick={() => setOpenImgCropper((prev) => !prev)}
                  />
                )}
              </div>
              <span className="text-xl md:text-2xl font-bold">
                {userProfile?.username}
              </span>
            </div>

            {/*user other infos*/}
            <div className="w-full flex flex-col items-center justify-center">
              {userInfos.map((item, index) => (
                <span
                  className="flex gap-4 text-base md:text-xl mb-4 border-b-1 border-b-foreground/40 w-[80%] pb-4"
                  key={index}
                >
                  {item.key}: <span className="font-bold">{item.value}</span>
                </span>
              ))}
            </div>
          </div>

          {/*User's contributed book versions*/}
          <div className="bg-card rounded-2xl border-border border-2 w-full xl:w-[60%] flex flex-col items-center justify-center gap-4 py-8">
            {/*filters*/}
            <div className="flex flex-col lg:flex-row items-start justify-center gap-5">
              <input
                type="text"
                placeholder="Search title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input"
              />

              <CustomSelect
                options={BooksSortByOptions}
                getValue={(item) => item.value}
                getLabel={(item) => item.label}
                getKey={(item) => item.key}
                changeKey={(key) => setSortBy(BooksSortByOptions[key].value)}
                className="w-[200px]"
              />
            </div>

            {isLoading ? (
              <LoaderCircle className="text-foreground w-[70px] lg:w-[90px] animate-spin" />
            ) : userProfile?.bookVersions.length === 0 ? (
              <span className="text-foreground text-lg md:text-xl">
                No Uploads Found
              </span>
            ) : (
              <div className="flex items-start flex-col gap-6 px-2 md:px-8 w-full mt-6">
                {userProfile?.bookVersions.map(
                  (version: BookVersionByUserId, index) => (
                    <div
                      className="flex items-start justify-start gap-4 border-b-2 border-foreground/60 w-full pb-2"
                      key={index}
                    >
                      <img
                        className="w-[130px] md:w-[150px]"
                        src={version.thumbnail}
                      />

                      {/*text info*/}
                      <div className="flex flex-col w-full gap-2 md:gap-3">
                        <span
                          className="w-fit text-base md:text-xl font-bold leading-none underline hover:text-primary cursor-pointer"
                          onClick={() =>
                            navigate(
                              `/book-versions/${version.bookId}/${version.authorId}`
                            )
                          }
                        >
                          {version.title}
                        </span>

                        <span className="text-sm md:text-lg leading-none">
                          By:{" "}
                          <span
                            className="italic underline hover:text-primary cursor-pointer font-bold"
                            onClick={() =>
                              navigate(
                                `/books-by-author-id/${version.authorId}/${version.authorName}/${version.authorCountry}`
                              )
                            }
                          >
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

                        <span className="text-sm md:text-lg leading-none">
                          Date:{" "}
                          <span className="font-bold">
                            {new Date(version.date).toLocaleDateString()}
                          </span>
                        </span>

                        {/*Read button*/}
                        <Button
                          variant="outline"
                          size={width >= 820 ? "lg" : "sm"}
                          onClick={() => {
                            setSelectedFileUrl(version.fileUrl);
                            setSelectedFileTitle(version.title);
                            setIsReaderOpen(true);
                            handleViewsIncrement(version.id, version.bookId);
                          }}
                          className="w-fit"
                        >
                          Read
                        </Button>
                      </div>

                      {/*Actions menu dropdown (delete version, etc..) */}
                      <ItemActionsMenu
                        item={version}
                        actions={bookVersionActionsMenu}
                      />
                    </div>
                  )
                )}
              </div>
            )}

            <Pagination
              currentPage={pageIndex}
              totalPages={totalPages}
              onPageChange={setPageIndex}
            />
          </div>
        </section>

        {/*Profile Picture upload*/}
        <div className="flex w-full p-3">
          <Modal
            isOpen={openImgCropper}
            onClose={() => setOpenImgCropper(false)}
          >
            {/*<ProfileImageCropper
                circle={false}
                profileId={user.id}
                closeModal={() => setOpenImgCropper(false)}
              />*/}
            <ProfileImgUploader
              profileId={user.id}
              closeModal={() => setOpenImgCropper(false)}
            />
          </Modal>
        </div>
      </div>
      {selectedFileUrl && isReaderOpen && selectedFileTitle && (
        <PDFReader
          fileUrl={selectedFileUrl}
          closeReader={() => setIsReaderOpen(false)}
          title={selectedFileTitle}
        />
      )}
    </main>
  );
};

export default ProfilePage;
