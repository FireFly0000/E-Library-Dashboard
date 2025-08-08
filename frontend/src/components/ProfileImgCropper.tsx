import React, { useEffect, useRef, useState } from "react";
import Croppie from "croppie";
import "croppie/croppie.css";
import { Button } from "./ui/button";
import { useWindowWidth } from "@/hooks/hooks";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { userActions } from "@/redux/slices";
import { userApi } from "@/services/userApis";

interface Props {
  circle?: boolean;
  profileId: number | undefined;
  closeModal: () => void;
}

const ProfileImageCropper: React.FC<Props> = ({
  circle = true,
  profileId,
  closeModal,
}) => {
  const cropperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cropperInstance = useRef<Croppie | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useAppDispatch();
  const uploadSuccess = useAppSelector(
    (state) => state.userSlice.profileImgUploaded
  );
  const width = useWindowWidth();

  useEffect(() => {
    let isMounted = true;

    if (selectedImage && cropperRef.current) {
      const img = new Image();
      img.src = selectedImage;

      img.onload = () => {
        if (!isMounted || !cropperRef.current) return;

        const imgWidth = img.width;
        const imgHeight = img.height;

        // Auto-scale boundary width
        const maxBoundary = Math.min(width - 40, 480); // leave margin
        const aspectRatio = imgWidth / imgHeight;
        const boundaryWidth = maxBoundary;
        const boundaryHeight = boundaryWidth / aspectRatio;

        // Viewport: 70% of boundary
        const viewportSize = Math.min(boundaryWidth, boundaryHeight) * 0.7;

        if (cropperInstance.current) {
          cropperInstance.current.destroy();
        }

        cropperInstance.current = new Croppie(cropperRef.current, {
          viewport: {
            width: viewportSize,
            height: viewportSize,
            type: circle ? "circle" : "square",
          },
          boundary: {
            width: boundaryWidth,
            height: boundaryHeight,
          },
          showZoomer: true,
          enableExif: true,
        });

        cropperInstance.current.bind({ url: selectedImage });
      };
    }

    return () => {
      isMounted = false;
      cropperInstance.current?.destroy();
      cropperInstance.current = null;
    };
  }, [selectedImage, circle, width]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setSelectedImage(objectUrl);
    }
  };

  const handleUpload = async () => {
    if (cropperInstance.current) {
      const base64 = await cropperInstance.current.result({
        type: "base64",
        size: "viewport",
        format: "jpeg",
        quality: 1,
      });

      const file = base64ToFile(base64 as string, `profile-img-${profileId}`);
      //const previewUrl = URL.createObjectURL(file);
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
      setSelectedImage(null);
      setIsUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  useEffect(() => {
    if (uploadSuccess) {
      dispatch(userApi.util.invalidateTags(["users"]));
      closeModal();
    }
  }, [uploadSuccess, dispatch, closeModal]);

  const base64ToFile = (base64: string, filename: string): File => {
    const arr = base64.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  return (
    <div className="">
      <div className="input-field-container">
        <label className="form-label">Profile Image</label>
        <input
          type="file"
          accept="image/*"
          className="form-input file-input"
          ref={inputRef}
          onChange={handleFileChange}
        />
      </div>

      {selectedImage && (
        <div className="overflow-hidden w-full h-fit" ref={cropperRef} />
      )}

      {selectedImage && (
        <Button
          onClick={handleUpload}
          size="lg"
          variant="outline"
          disabled={isUploading}
        >
          Upload
        </Button>
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

export default ProfileImageCropper;
