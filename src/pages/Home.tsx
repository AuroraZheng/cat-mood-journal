import { useState, useEffect } from 'react';
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
  const [image, setImage] = useState<string | null>(null);
  const [mood, setMood] = useState<string>('');
  const [diaryText, setDiaryText] = useState<string>('');
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [predictionError, setPredictionError] = useState<string | null>(null);

  // Load the model with retry mechanism
  const loadModel = async (retryCount = 0) => {
    try {
      setIsModelLoading(true);
      setLoadError(null);
      
      // 预热 TensorFlow.js
      await tf.ready();
      console.log("TensorFlow.js is ready");
      
      // 使用相对路径加载模型
      const modelPath = '/mobilenet/model_fixed.json';
      console.log("Loading model from:", modelPath);
      
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
      
      if (retryCount < 3) {
        setTimeout(() => {
          loadModel(retryCount + 1);
        }, 2000);
      } else {
        setLoadError("模型加载失败，请刷新页面重试");
      }
    } finally {
      setIsModelLoading(false);
    }
  };

  useEffect(() => {
    loadModel();
  }, []);

  // Image upload handler
  const handleImageUpload = async (imageUrl: string | null) => {
    if (!imageUrl) return;
    
    setImage(imageUrl);
    setPredictionError(null);

    if (model) {
      try {
        const imgElement = new Image();
        imgElement.src = imageUrl;
        
        await new Promise((resolve, reject) => {
          imgElement.onload = resolve;
          imgElement.onerror = reject;
        });

        console.log("Processing image...");
        const imgTensor = tf.browser.fromPixels(imgElement)
          .resizeBilinear([224, 224])
          .toFloat()
          .div(255.0)
          .expandDims();

        console.log("Running prediction...");
        const prediction = model.predict(imgTensor) as tf.Tensor;
        const predictionArray = await prediction.data();
        console.log("Prediction array:", predictionArray);

        const predictedLabelIndex = Array.from(predictionArray).indexOf(Math.max(...Array.from(predictionArray)));
        console.log("Predicted label index:", predictedLabelIndex);
        
        const predictedMood = moodLabels[predictedLabelIndex];
        console.log("Predicted mood:", predictedMood);

        setMood(predictedMood);
        setDiaryText(moodTexts[predictedMood]);

        // Cleanup tensors
        tf.dispose([imgTensor, prediction]);
      } catch (error) {
        console.error("Error processing image:", error);
        setPredictionError("图片处理失败，请重试");
      }
    } else {
      console.error("Model not loaded");
      setPredictionError("模型未加载，请等待或刷新页面");
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

            {predictionError && (
              <div className="text-center text-red-500 mt-4">
                {predictionError}
              </div>
            )}

            {image && mood && <MoodTag mood={mood} />}
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

