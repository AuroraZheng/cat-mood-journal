import React, { useRef, useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

const catHero = '/images/cat-hero.jpeg';
const jumpCat = '/images/jump-cat.png';

// 心情类型和文案
const moodTexts = {
  Angry: '今天我气得不想理你！离我远一点。',
  Fear: '我感到害怕，希望你能陪在我身边。',
  Joy: '我今天很开心，满脸笑容！',
  Interest: '我对今天的事情很感兴趣，想要了解更多。',
  Neutrality: '今天我感觉平静，不急不躁。',
  'Cat-X5dd-Cat-cat-Happy-Sad-Angry-Surprised': ' . ',
};
const moodLabels = [
  'Angry',
  'Fear',
  'Joy',
  'Interest',
  'Neutrality',
  'Cat-X5dd-Cat-cat-Happy-Sad-Angry-Surprised',
];

type MoodType = keyof typeof moodTexts;

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImg, setUploadedImg] = useState<string | null>(null);
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [mood, setMood] = useState<MoodType | null>(null);
  const [isAnxiety, setIsAnxiety] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载模型
  useEffect(() => {
    const loadModel = async () => {
      try {
        setModelLoading(true);
        await tf.ready();
        const loaded = await tf.loadLayersModel('/mobilenet/model_fixed.json');
        setModel(loaded);
      } catch (e) {
        setError('模型加载失败');
      } finally {
        setModelLoading(false);
      }
    };
    loadModel();
  }, []);

  // 上传图片并推理
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imgUrl = reader.result as string;
        setUploadedImg(imgUrl);
        setMood(null);
        setIsAnxiety(null);
        setError(null);
        if (model) {
          try {
            setLoading(true);
            // 创建图片元素
            const img = new window.Image();
            img.src = imgUrl;
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
            });
            // 预处理
            const tensor = tf.browser.fromPixels(img)
              .resizeBilinear([224, 224])
              .toFloat()
              .div(255.0)
              .expandDims();
            // 推理
            const prediction = model.predict(tensor) as tf.Tensor;
            const predictionArray = await prediction.data();
            const idx = Array.from(predictionArray).indexOf(Math.max(...Array.from(predictionArray)));
            const predictedMood = moodLabels[idx] as MoodType;
            setMood(predictedMood);
            // 简单判断anxiety
            setIsAnxiety(predictedMood === 'Fear' || predictedMood === 'Angry');
            tf.dispose([tensor, prediction]);
          } catch (err) {
            setError('图片分析失败');
          } finally {
            setLoading(false);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-[#FFF5E1] flex flex-col items-center py-10 px-4 relative overflow-x-hidden">
      {/* 背景爪印 */}
      <div className="absolute left-8 top-16 opacity-20 text-5xl select-none">🐾</div>
      <div className="absolute right-8 top-24 opacity-20 text-4xl select-none">🐾</div>
      <div className="absolute left-12 bottom-24 opacity-20 text-4xl select-none">🐾</div>
      <div className="absolute right-16 bottom-12 opacity-20 text-5xl select-none">🐾</div>

      {/* 顶部标题和插画 */}
      <div className="flex flex-col items-center mb-8 mt-4">
        <h1 className="text-3xl md:text-4xl font-bold text-[#5B3A29] text-center mb-4 leading-snug">
          Track your pet's behavior<br />and mood using AI
        </h1>
        <img
          src={uploadedImg || catHero}
          alt="cat hero"
          className="w-48 h-48 object-contain mb-6 drop-shadow-lg rounded-2xl bg-white"
        />
        <button
          className="bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded-xl px-8 py-3 text-lg shadow mb-2 transition-all"
          onClick={handleButtonClick}
          disabled={modelLoading || loading}
        >
          {modelLoading
            ? 'Loading model...'
            : loading
              ? 'Analyzing...'
              : 'Upload a photo'}
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>

      {/* 信息区块 */}
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly summary */}
        <div className="bg-white rounded-2xl shadow p-6 col-span-2 md:col-span-2 mb-2">
          <h2 className="text-xl font-bold text-[#5B3A29] mb-3">Weekly summary</h2>
          {mood ? (
            <ul className="space-y-2 text-[#5B3A29] text-base">
              <li className="flex items-center gap-2"><span className="text-lg">🐾</span> Mood: <span className="font-bold">{mood}</span></li>
              <li className="flex items-center gap-2"><span className="text-lg">❗</span> Anxiety: <span className={isAnxiety ? 'text-red-500 font-bold' : 'text-green-600 font-bold'}>{isAnxiety ? 'Yes' : 'No'}</span></li>
            </ul>
          ) : (
            <ul className="space-y-2 text-[#5B3A29] text-base">
              <li className="flex items-center gap-2"><span className="text-lg">🐾</span> Mostly active and content this week</li>
              <li className="flex items-center gap-2"><span className="text-lg">🛏️</span> Recorded 12 hr per day</li>
              <li className="flex items-center gap-2"><span className="text-lg">❗</span> Check for signs of anxiety</li>
            </ul>
          )}
        </div>
        {/* Today's Diary */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
          <h3 className="text-lg font-bold text-[#5B3A29] mb-2">Today's Diary</h3>
          <div className="bg-[#EAF7E1] rounded-lg px-4 py-2 mb-3 text-[#5B3A29] text-center font-medium min-h-[48px] flex items-center">
            {mood ? moodTexts[mood] : 'I bird-watched by the window today!'}
          </div>
          <img src={uploadedImg || jumpCat} alt="cat diary" className="w-28 h-28 object-contain rounded-xl bg-white" />
        </div>
        {/* Enhance your pet's well-being */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
          <h3 className="text-lg font-bold text-[#5B3A29] mb-2">Enhance your pet's well-being</h3>
          <ul className="space-y-3 text-[#5B3A29] text-base mt-2">
            <li className="flex items-center gap-2"><span className="bg-orange-100 rounded-full p-2">🔔</span> Mood notifications</li>
            <li className="flex items-center gap-2"><span className="bg-green-100 rounded-full p-2">🎵</span> Talk to your pet</li>
            <li className="flex items-center gap-2"><span className="bg-orange-100 rounded-full p-2">🔈</span> Ambient sounds</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

