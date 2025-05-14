import React from 'react';

interface DiaryCardProps {
  text: string;
  image: string | null;
}

export const DiaryCard: React.FC<DiaryCardProps> = ({ text, image }) => {
  return (
    <div className="rounded-card bg-cream p-6">
      {image && <img src={image} alt="猫咪" className="w-32 h-32 object-cover rounded-full mx-auto" />}
      <p className="text-handwritten mt-4">{text}</p>
    </div>
  );
};

