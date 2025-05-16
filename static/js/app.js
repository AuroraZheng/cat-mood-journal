// 表情包文本映射
const memeTexts = {
    'happy': {
        top: "When I see my human",
        bottom: "I'm so happy!"
    },
    'sad': {
        top: "When my human",
        bottom: "forgets to feed me"
    },
    'angry': {
        top: "When someone",
        bottom: "touches my food"
    },
    'neutral': {
        top: "Me watching",
        bottom: "my human work"
    }
};

// 日记文本映射
const diaryTexts = {
    'happy': {
        mood: "super happy and playful",
        emotion: "sparkling"
    },
    'sad': {
        mood: "a bit down and needs cuddles",
        emotion: "sad"
    },
    'angry': {
        mood: "grumpy and needs space",
        emotion: "angry"
    },
    'neutral': {
        mood: "calm and relaxed",
        emotion: "peaceful"
    }
};

async function processImage(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
        const response = await fetch('/api/predict', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if (result.error) {
            throw new Error(result.error);
        }

        return result;
    } catch (error) {
        console.error('Error processing image:', error);
        throw error;
    }
}

async function processBatchImages(imageFiles) {
    const formData = new FormData();
    imageFiles.forEach(file => {
        formData.append('images', file);
    });

    try {
        const response = await fetch('/api/batch-predict', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if (result.error) {
            throw new Error(result.error);
        }

        return result.results;
    } catch (error) {
        console.error('Error processing batch images:', error);
        throw error;
    }
}

// 更新文件上传处理
document.getElementById('imageUpload').addEventListener('change', async function(e) {
    const files = e.target.files;
    if (files.length === 0) return;

    try {
        showLoading();
        
        if (files.length === 1) {
            // 单张图片处理
            const result = await processImage(files[0]);
            displayResult(result);
        } else {
            // 批量处理
            const results = await processBatchImages(Array.from(files));
            displayBatchResults(results);
        }
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
});

function displayResult(result) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <h3>预测结果</h3>
        <p>情绪: ${result.emotion}</p>
        <p>置信度: ${(result.confidence * 100).toFixed(2)}%</p>
    `;
}

function displayBatchResults(results) {
    const resultDiv = document.getElementById('result');
    let html = '<h3>批量预测结果</h3>';
    
    results.forEach(([imageId, result]) => {
        html += `
            <div class="result-item">
                <p>图片 ${imageId}:</p>
                <p>情绪: ${result.emotion}</p>
                <p>置信度: ${(result.confidence * 100).toFixed(2)}%</p>
            </div>
        `;
    });
    
    resultDiv.innerHTML = html;
}

document.getElementById('uploadForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const fileInput = document.getElementById('imageUpload');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select an image first!');
        return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch('/api/predict', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        
        if (result.error) {
            alert(result.error);
            return;
        }

        // 显示结果容器
        const resultContainer = document.querySelector('.result-container');
        resultContainer.style.display = 'block';

        // 更新图片（显示新生成的表情包图片）
        const resultImage = document.getElementById('resultImage');
        if (result.meme_image) {
            resultImage.src = 'data:image/jpeg;base64,' + result.meme_image;
        } else {
            resultImage.src = URL.createObjectURL(file);
        }

        // 更新表情包文本
        const topText = document.getElementById('topText');
        const bottomText = document.getElementById('bottomText');
        topText.textContent = memeTexts[result.emotion].top;
        bottomText.textContent = memeTexts[result.emotion].bottom;

        // 更新结果详情
        document.getElementById('emotion').textContent = result.emotion;
        document.getElementById('confidence').textContent = 
            `${(result.confidence * 100).toFixed(1)}%`;

        // 更新日记文本
        document.getElementById('mood-text').textContent = 
            diaryTexts[result.emotion].mood;
        document.getElementById('emotion-text').textContent = 
            diaryTexts[result.emotion].emotion;

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while processing the image.');
    }
}); 