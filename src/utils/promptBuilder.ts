// 用于构建GPT生成猫咪日记的提示语
export function buildPrompt({ mood, timeOfDay, personality }: {
    mood: string;
    timeOfDay: string;
    personality: string;
  }) {
    return `你是个会模仿猫咪说话的软萌作家。已知猫咪正在“${mood}”，是在“${timeOfDay}”，是个“${personality}”的猫。请写一句今日日记风格的话，不超过50字，软萌、自然、能打动人。`;
  }
  