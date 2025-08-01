import "react-image-crop/dist/ReactCrop.css";
import React, { useRef, useState, useEffect } from "react";
import { Button } from "./ui/button";
import ReactCrop, {
  makeAspectCrop,
  type Crop,
  centerCrop,
  convertToPixelCrop,
} from "react-image-crop";
import toast from "react-hot-toast";
import CroppingTool from "./CroppingTool";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { userApi } from "@/services/userApis";
import { userActions } from "@/redux/slices";

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

interface ProfileImgUploaderProps {
  profileId: number | undefined;
  closeModal: () => void;
}

const ProfileImgUploader: React.FC<ProfileImgUploaderProps> = ({
  profileId,
  closeModal,
}) => {
  const [crop, setCrop] = useState<Crop | undefined>(undefined);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const imgFileRef = useRef<HTMLInputElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const dispatch = useAppDispatch();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const uploadSuccess = useAppSelector(
    (state) => state.userSlice.profileImgUploaded
  );

  //handle file change when new img is open through HTML input
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    //Trigger reader to read and process image file
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageElement = new Image();
      const imageUrl = reader.result?.toString() || "";
      imageElement.src = imageUrl;

      //Min Size check
      imageElement.addEventListener("load", (e) => {
        const { naturalWidth, naturalHeight } =
          e.currentTarget as HTMLImageElement;
        if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
          toast.error("Image must be at least 150 x 150 pixels.");

          if (imgFileRef.current) {
            imgFileRef.current.value = "";
          }

          return setImgSrc(null);
        }
        setImgSrc(imageUrl); //Only set imgSrc if size is good
      });
    });
    reader.readAsDataURL(file);
  };

  //Set crop property once input img finished loading
  const onImgLoad = async (e: React.FormEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const widthPercent = (MIN_DIMENSION / width) * 100;

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: widthPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    await setCrop(centeredCrop);
  };

  //convert cropped area to canvas, and from canvas to file
  const handleUpload = async () => {
    if (
      crop === undefined ||
      imgRef?.current?.width === undefined ||
      imgRef?.current?.height === undefined
    ) {
      return;
    }
    CroppingTool(
      imgRef?.current, // HTMLImageElement
      previewCanvasRef?.current, // HTMLCanvasElement
      convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height)
    );
    if (previewCanvasRef.current instanceof HTMLCanvasElement) {
      //Convert cropped area to canvas and canvas to file again
      previewCanvasRef.current.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], `profile-img-${profileId}`, {
            type: "image/jpeg",
          });

          //API call
          if (file) {
            setIsUploading(true);
            setUploadProgress(0);

            const formData = new FormData();

            formData.append("profileId", String(profileId));
            formData.append("profileImg", file ? file : String(null));

            await dispatch(
              userActions.updateUserProfileImg({
                formData,
                onProgress: (percent) => {
                  setUploadProgress(percent);
                },
              })
            );
          }
          setImgSrc(null);
          setIsUploading(false);

          if (imgFileRef.current) {
            imgFileRef.current.value = "";
          }
        }
      }, "image/jpeg");
    }
  };

  //Close modal and invalidate tag for refetch if upload succeeds
  useEffect(() => {
    if (uploadSuccess) {
      dispatch(userApi.util.invalidateTags(["users"]));
      closeModal();
    }
  }, [uploadSuccess, dispatch, closeModal]);

  return (
    <div>
      <div className="input-field-container">
        <label className="form-label">Profile Image</label>
        <input
          type="file"
          accept="image/*"
          className="form-input file-input"
          ref={imgFileRef}
          onChange={handleFileChange}
        />
      </div>

      {imgSrc && (
        <div className="flex flex-col items-start justify-center gap-4">
          <ReactCrop
            crop={crop}
            circularCrop
            keepSelection
            aspect={ASPECT_RATIO}
            minWidth={50}
            maxWidth={600}
            onChange={(percentCrop) => setCrop(percentCrop)}
          >
            <img
              src={imgSrc}
              ref={imgRef}
              style={{ maxHeight: "70vh" }}
              onLoad={onImgLoad}
              alt="upload"
            />
          </ReactCrop>

          <Button
            onClick={handleUpload}
            size="lg"
            variant="outline"
            //disabled={isUploading}
          >
            Upload
          </Button>
        </div>
      )}

      {previewCanvasRef && (
        <canvas
          ref={previewCanvasRef}
          className="mt-4 border-red-500 border-2 object-contain w-[150px] h-[150px] hidden"
        />
      )}

      {isUploading && (
        <div className="flex flex-col gap-2">
          <p className="text-primary">Uploading: {uploadProgress}%</p>
          <progress value={uploadProgress} max={100}></progress>
        </div>
      )}
    </div>
  );
};

export default ProfileImgUploader;
