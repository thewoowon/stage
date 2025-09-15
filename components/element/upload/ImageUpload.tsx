import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { COLORS } from "@/styles/color";
import { TYPOGRAPHY } from "@/styles/typography";

const ImageUpload = ({
  imageDocument,
  file,
  setFile,
  onChange,
  setOverLimit,
  setMyUploadUrl,
  setIsLoading,
}: {
  imageDocument?: {
    source: File | null;
    name: string;
  };
  file?: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  onChange?: (file: File) => void;
  setOverLimit?: React.Dispatch<React.SetStateAction<boolean>>;
  setMyUploadUrl?: React.Dispatch<React.SetStateAction<string | null>>;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const encodeFileToBase64 = (fileBlob: File) => {
    console.log("encodeFileToBase64", fileBlob);
    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);
    return new Promise<void>((resolve) => {
      reader.onload = () => {
        // setMyUploadUrl(reader.result?.toString() || "");
        setMyUploadUrl?.(reader.result?.toString() || null);
        resolve();
      };
    });
  };

  useEffect(() => {
    if (imageDocument) {
      const { source } = imageDocument;
      setFile(source);
    }
  }, [imageDocument, setFile]);

  useEffect(() => {
    if (onChange && file) {
      onChange(file);
    }

    if (!file && inputRef.current) {
      inputRef.current.value = "";
    }
  }, [file, onChange]);

  return (
    <ImageUploadButton
      style={{
        ...TYPOGRAPHY.body1.medium,
        color: COLORS.primary[500],
      }}
      onClick={(e) => {
        e.stopPropagation();
        inputRef.current?.click();
      }}
    >
      {imageDocument?.name || file?.name || "이미지 업로드"}
      <FileInput
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        onChange={async (e) => {
          setIsLoading?.(true);
          console.log("file input change", e);
          const file = e.target.files?.[0];
          if (file) {
            // file size check 50MB
            if (file.size > 50 * 1024 * 1024) {
              setOverLimit?.(true);
              return;
            }

            setFile(file);

            await encodeFileToBase64(file);

            setIsLoading?.(false);
          }
        }}
      />
    </ImageUploadButton>
  );
};

export default ImageUpload;

const ImageUploadButton = styled.button`
  padding: 12px 26.5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.primary[50]};
  border: none;
  border-radius: 100px;
  cursor: pointer;
  color: ${COLORS.grayscale[700]};
  font-size: 16px;
  font-weight: 500;
  &:hover {
    color: ${COLORS.grayscale[900]};
    background-color: ${COLORS.primary[100]};
  }
  transition: all 0.3s ease;
`;

const FileInput = styled.input`
  display: none;
`;
