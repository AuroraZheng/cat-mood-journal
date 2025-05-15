import { useState } from 'react';
import { Upload } from 'lucide-react';

interface UploadImageProps {
  onImageUpload: (imageUrl: string | null) => void;
}

export function UploadImage({ onImageUpload }: UploadImageProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onImageUpload(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-soft-blue rounded-lg">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="image-upload"
      />
      <label
        htmlFor="image-upload"
        className="flex flex-col items-center justify-center cursor-pointer"
      >
        <Upload className="w-12 h-12 text-soft-blue mb-4" />
        <span className="text-soft-blue">
          {preview ? '点击更换图片' : '点击上传猫咪照片'}
        </span>
      </label>
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="mt-4 max-h-48 rounded-lg"
        />
      )}
    </div>
  );
}

