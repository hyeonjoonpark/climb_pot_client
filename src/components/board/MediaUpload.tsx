"use client";

import { useRef } from "react";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

interface MediaUploadProps {
  imageUrls: string[];
  videoUrls: string[];
  onImageUrlsChange: (urls: string[]) => void;
  onVideoUrlsChange: (urls: string[]) => void;
}

export default function MediaUpload({
  imageUrls,
  videoUrls,
  onImageUrlsChange,
  onVideoUrlsChange,
}: MediaUploadProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      urls.push(await readFileAsDataUrl(files[i]));
    }
    onImageUrlsChange([...imageUrls, ...urls]);
    e.target.value = "";
  };

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      urls.push(await readFileAsDataUrl(files[i]));
    }
    onVideoUrlsChange([...videoUrls, ...urls]);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    onImageUrlsChange(imageUrls.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    onVideoUrlsChange(videoUrls.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-[#191f28]">
          이미지
        </label>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="hidden"
        />
        <div className="mt-2 flex flex-wrap gap-3">
          {imageUrls.map((url, i) => (
            <div key={i} className="relative">
              <img
                src={url}
                alt={`첨부 ${i + 1}`}
                className="h-24 w-24 rounded-lg object-cover border border-[#e5e8eb]"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#191f28] text-xs text-white hover:bg-[#333d4b]"
                aria-label="이미지 제거"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-[#e5e8eb] text-sm text-[#8b95a1] hover:border-burgundy hover:text-burgundy"
          >
            + 이미지
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#191f28]">
          영상
        </label>
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          multiple
          onChange={handleVideoChange}
          className="hidden"
        />
        <div className="mt-2 flex flex-wrap gap-3">
          {videoUrls.map((url, i) => (
            <div key={i} className="relative">
              <video
                src={url}
                controls
                className="h-32 w-48 rounded-lg border border-[#e5e8eb] bg-black"
              />
              <button
                type="button"
                onClick={() => removeVideo(i)}
                className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#191f28] text-xs text-white hover:bg-[#333d4b]"
                aria-label="영상 제거"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            className="flex h-32 w-48 items-center justify-center rounded-lg border-2 border-dashed border-[#e5e8eb] text-sm text-[#8b95a1] hover:border-burgundy hover:text-burgundy"
          >
            + 영상
          </button>
        </div>
      </div>
    </div>
  );
}
