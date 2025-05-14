// 用于调用 GPT 生成猫咪日记的API
export async function getCatDiary(prompt: string) {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    return data.result;
  }
  