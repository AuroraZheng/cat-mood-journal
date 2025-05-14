import React from 'react';

interface MoodTagProps {
  mood: string;
}

export const MoodTag = ({ mood }: MoodTagProps) => {
  return (
    <div className="text-center my-4">
      <span className="text-2xl font-semibold text-berry-pink">
        猫咪今天的心情是：{mood}
      </span>
    </div>
  );
};

