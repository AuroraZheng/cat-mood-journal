import React, { useState } from 'react';

interface UploadImageProps {
  onImageUpload: (image: string | null) => void;
}

export const UploadImage: React.FC<UploadImageProps> = ({ onImageUpload }) => {
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string); // 返回上传的图片数据
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        disabled={loading}
      />
      {loading && <p>Loading...</p>}
    </div>
  );
};

