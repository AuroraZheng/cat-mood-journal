import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UploadImage } from '@/components/UploadImage';
import { DiaryCard } from '@/components/DiaryCard';
import { ShareButtons } from '@/components/ShareButtons';
import { MoodTag } from '@/components/MoodTag';
import * as tf from '@tensorflow/tfjs';

type MoodType = "Angry" | "Fear" | "Joy" | "Interest" | "Neutrality" | "Cat-X5dd-Cat-cat-Happy-Sad-Angry-Surprised";

// Updated mood texts based on model output
const moodTexts: Record<MoodType, string> = {
  "Angry": "今天我气得不想理你！离我远一点。",
  "Fear": "我感到害怕，希望你能陪在我身边。",
  "Joy": "我今天很开心，满脸笑容！",
  "Interest": "我对今天的事情很感兴趣，想要了解更多。",
  "Neutrality": "今天我感觉平静，不急不躁。",
  "Cat-X5dd-Cat-cat-Happy-Sad-Angry-Surprised": " . ",
};

const moodLabels: MoodType[] = ["Angry", "Fear", "Joy", "Interest", "Neutrality", "Cat-X5dd-Cat-cat-Happy-Sad-Angry-Surprised"];

export default function Home() {
  const [image, setImage] = useState<string | null>(null); // Used to store uploaded image
  const [mood, setMood] = useState<string>(''); // Store current cat mood label
  const [diaryText, setDiaryText] = useState<string>(''); // Store generated diary text
  const [model, setModel] = useState<tf.LayersModel | null>(null); // Store the loaded model
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load the model with retry mechanism
  const loadModel = async (retryCount = 0) => {
    try {
      setIsModelLoading(true);
      setLoadError(null);
      
      // 预热 TensorFlow.js
      await tf.ready();
      
      // 使用 Vercel CDN 路径加载模型
      const modelPath = process.env.NODE_ENV === 'production' 
        ? 'https://cat-mood-journal-aurorazheng.vercel.app/mobilenet/model_fixed.json'
        : '/mobilenet/model_fixed.json';
        
      const loadedModel = await tf.loadLayersModel(modelPath, {
        requestInit: {
          cache: 'force-cache'
        }
      });
      
      console.log("✅ Model Loaded Successfully");
      setModel(loadedModel);
    } catch (error) {
      console.error("❌ Error loading model:", error);
      setLoadError("模型加载失败，正在重试...");
      
      // 如果加载失败且重试次数小于3，则重试
      if (retryCount < 3) {
        setTimeout(() => {
          loadModel(retryCount + 1);
        }, 2000); // 2秒后重试
      } else {
        setLoadError("模型加载失败，请刷新页面重试");
      }
    } finally {
      setIsModelLoading(false);
    }
  };

  useEffect(() => {
    loadModel(); // Load the model when the component mounts
  }, []);

  // Image upload handler
  const handleImageUpload = async (imageUrl: string | null) => {
    if (!imageUrl) return; // Early return if no image
    
    setImage(imageUrl);

    if (model) {
      const imgElement = new Image();
      imgElement.src = imageUrl;
      
      imgElement.onload = async () => {
        const imgTensor = tf.browser.fromPixels(imgElement)
          .resizeBilinear([224, 224])
          .toFloat()
          .div(255.0)
          .expandDims();

        const prediction = model.predict(imgTensor) as tf.Tensor;
        const predictionArray = await prediction.data();
        const predictedLabelIndex = Array.from(predictionArray).indexOf(Math.max(...Array.from(predictionArray)));
        const predictedMood = moodLabels[predictedLabelIndex];

        setMood(predictedMood);
        setDiaryText(moodTexts[predictedMood]);
      };
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center p-6">
      <header className="text-center mt-8 mb-6">
        <h1 className="card-header text-berry-pink">pics</h1>
        <p className="card-content text-soft-blue text-handwritten">
          out
          {/* 上传一张猫猫照片，生成一张可爱的图文卡片。 */}
        </p>
      </header>

      <main className="w-full max-w-2xl">
        {isModelLoading ? (
          <Card>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-soft-blue">
                  {loadError || "正在加载模型，请稍候..."}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardContent>
                <UploadImage onImageUpload={handleImageUpload} />
              </CardContent>
            </Card>

            {image && <MoodTag mood={mood} />}
            <div className="my-6">
              <DiaryCard text={diaryText} image={image} />
            </div>

            <ShareButtons />
          </>
        )}
      </main>

      <footer className="card-footer text-soft-blue">
          ©
        {/* © 2025 喵语日记 · 每一张毛茸茸的心情都值得记录 */}
      </footer>
    </div>
  );
}

