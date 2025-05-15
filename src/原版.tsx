import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App

// landing page 结构和代码框架

// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { UploadImage } from '@/components/UploadImage';
// import { DiaryCard } from '@/components/DiaryCard';
// import { ShareButtons } from '@/components/ShareButtons';
// import { MoodTag } from '@/components/MoodTag';

// export default function Home() {
//   const [image, setImage] = useState<string | null>(null); // 用于存储上传的图片
//   const [mood, setMood] = useState<string>(''); // 存储当前猫咪心情标签
//   const [diaryText, setDiaryText] = useState<string>(''); // 存储生成的日记文本

//   return (
//     <div className="min-h-screen bg-pink-50 flex flex-col items-center p-6">
//       <header className="text-center mt-8 mb-6">
//         <h1 className="text-4xl font-bold text-pink-700">喵语日记</h1>
//         <p className="text-lg text-gray-600 mt-2">
//           上传一张猫猫照片，生成一张可爱的图文卡片。
//         </p>
//       </header>

//       <main className="w-full max-w-2xl">
//         <Card className="rounded-2xl shadow-md p-4 bg-white">
//           <CardContent>
//             <UploadImage onImageUpload={setImage} />
//           </CardContent>
//         </Card>

//         {image && <MoodTag mood={mood} />}
//         <div className="my-6">
//           <DiaryCard text={diaryText} image={image} />
//         </div>

//         <ShareButtons />
//       </main>

//       <footer className="text-sm text-gray-400 mt-12">
//         © 2025 喵语日记 · 每一张毛茸茸的心情都值得记录
//       </footer>
//     </div>
//   );
// }
