import React, { useRef, useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

const catHero = '/images/cat-hero.jpeg';
const jumpCat = '/images/jump-cat.png';

// 心情类型和文案
const moodTexts = {
  Angry: '今天我气得不想理你！离我远一点。',
  Fear: '我感到害怕，希望你能陪在我身边。',
  Happy: '我今天很开心，满脸笑容！',
  Interest: '我对今天的事情很感兴趣，想要了解更多。',
  Joy: '我今天特别开心，想要和你分享！',
  Neutrality: '今天我感觉平静，不急不躁。',
};
const moodLabels = [
  'Angry',
  'Fear',
  'Happy',
  'Interest',
  'Joy',
  'Neutrality',
];

type MoodType = keyof typeof moodTexts;

// 爪印SVG
const PawSVG = ({ className = "", style = {} }) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <ellipse cx="20" cy="30" rx="8" ry="10" fill="#F9E7B0" fillOpacity="0.5" />
    <ellipse cx="8" cy="18" rx="4" ry="5" fill="#F9E7B0" fillOpacity="0.5" />
    <ellipse cx="32" cy="18" rx="4" ry="5" fill="#F9E7B0" fillOpacity="0.5" />
    <ellipse cx="13" cy="10" rx="3" ry="4" fill="#F9E7B0" fillOpacity="0.5" />
    <ellipse cx="27" cy="10" rx="3" ry="4" fill="#F9E7B0" fillOpacity="0.5" />
  </svg>
);

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImg, setUploadedImg] = useState<string | null>(null);
  const [model, setModel] = useState<tf.GraphModel | null>(null);
  const [mood, setMood] = useState<MoodType | null>(null);
  const [isAnxiety, setIsAnxiety] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false); // 只用于图片分析
  const [modelLoading, setModelLoading] = useState(true); // 新增，专用于模型加载
  const [error, setError] = useState<string | null>(null);

  // 加载模型
  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log('开始加载模型...');
        const loaded = await tf.loadGraphModel('/model/model.json');
        console.log('模型加载成功:', loaded);
        setModel(loaded);
        setModelLoading(false);
        console.log('模型已设置到state');
      } catch (error) {
        console.error('模型加载失败:', error);
        setError('模型加载失败');
        setModelLoading(false);
      }
    };
    loadModel();
  }, []);

  // 上传图片并推理
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedImg(URL.createObjectURL(file));
    setMood(null);
    setIsAnxiety(null);
    setError(null);
    if (!model) {
      alert('模型未加载');
      console.warn('模型未加载，无法推理');
      return;
    }
    setLoading(true);
    try {
      console.log('开始读取图片文件:', file.name);
      const img = new window.Image();
      img.src = URL.createObjectURL(file);
      img.crossOrigin = 'anonymous';
      img.onload = async () => {
        try {
          console.log('图片加载完成，开始预处理');
          const tensor = tf.tidy(() =>
            tf.browser.fromPixels(img).resizeBilinear([224, 224]).toFloat().div(255).expandDims(0)
          );
          console.log('图片预处理完成，shape:', tensor.shape);
          // 推理
          const prediction = model.predict(tensor) as tf.Tensor;
          const predictionArray = await prediction.data();
          console.log('Prediction array:', predictionArray);
          console.log('Prediction shape:', prediction.shape);
          const idx = Array.from(predictionArray).indexOf(Math.max(...Array.from(predictionArray)));
          const predictedMood = moodLabels[idx] as MoodType;
          setMood(predictedMood);
          setIsAnxiety(predictedMood === 'Fear' || predictedMood === 'Angry');
          tf.dispose([tensor, prediction]);
          setLoading(false);
        } catch (err) {
          setLoading(false);
          setMood(null);
          setIsAnxiety(null);
          setError('图片分析失败');
          console.error('推理异常:', err);
        }
      };
      img.onerror = (err) => {
        setLoading(false);
        setMood(null);
        setIsAnxiety(null);
        setError('图片加载失败');
        console.error('图片加载失败:', err);
      };
    } catch (err) {
      setLoading(false);
      setMood(null);
      setIsAnxiety(null);
      setError('图片处理异常');
      console.error('图片处理异常:', err);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4 relative overflow-x-hidden" style={{ background: '#FFFDE7' }}>
      {/* 背景爪印 SVG，分布在页面不同角落 */}
      <PawSVG style={{ position: 'absolute', left: 20, top: 40, width: 60, height: 60, zIndex: 0, opacity: 0.35 }} />
      <PawSVG style={{ position: 'absolute', right: 40, top: 120, width: 48, height: 48, zIndex: 0, opacity: 0.28, transform: 'rotate(-20deg)' }} />
      <PawSVG style={{ position: 'absolute', left: 60, bottom: 80, width: 52, height: 52, zIndex: 0, opacity: 0.32, transform: 'rotate(15deg)' }} />
      <PawSVG style={{ position: 'absolute', right: 80, bottom: 40, width: 64, height: 64, zIndex: 0, opacity: 0.3, transform: 'rotate(10deg)' }} />

      <div className="flex flex-col items-center mb-8 mt-4 relative z-10">
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
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
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

