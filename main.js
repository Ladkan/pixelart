document.querySelector('#app').innerHTML = `
  <div class="container">

        <div class="header">
            <h1>🎨 Pixel Art Generator</h1>
            <p>Transform your images into beautiful pixel art using a Wplace.live color palette</p>
        </div>

        <div class="upload-section">
            <div class="file-input-wrapper" id="fileInputWrapper">
                <div class="upload-icon">📁</div>
                <div class="upload-text">Click to select an image or drag & drop</div>
                <div class="upload-text" style="font-size: 0.9em; opacity: 0.7;">
                    Supports: PNG, JPG, JPEG, BMP, GIF
                </div>
                <input type="file" class="file-input" id="fileInput" accept="image/*">
            </div>        

            <button class="generate-btn" id="generateBtn">Generate Pixel Art</button>
        </div>

        <div class="loading" id="loading">
            <div class="spinner"></div>
            <div>Generating your pixel art...</div>
        </div>
        
        <div class="results" id="results" style="display: none;"></div>

  </div>
`;

document.addEventListener('DOMContentLoaded', function () {
  initApp();
})

function initApp() {
  const fileInputWrapper = document.getElementById('fileInputWrapper');
const fileInput = document.getElementById('fileInput');
const generateBtn = document.getElementById('generateBtn');
const loading = document.getElementById('loading');
const results = document.getElementById('results');

fileInputWrapper?.addEventListener('click', () => fileInput?.click());

fileInputWrapper?.addEventListener('dragover', (e) => {
  e.preventDefault();
  fileInputWrapper.classList.add('dragover');
});

fileInputWrapper?.addEventListener('dragleave', () => {
  fileInputWrapper.classList.remove('dragover');
});

fileInputWrapper?.addEventListener('drop', (e) => {
  e.preventDefault();
  fileInputWrapper.classList.remove('dragover');

  if(e.dataTransfer?.files.length > 0){
    
    fileInput.files = e.dataTransfer?.files;
    updateFileDisplay();
  }

});

            fileInput.addEventListener('change', updateFileDisplay);
function updateFileDisplay() {
  
  if (fileInput.files.length > 0) {
    
    const file = fileInput.files[0];
    
    fileInputWrapper.innerHTML = `
        <div class="upload-icon">✅</div>
        <div class="upload-text">Selected: ${file.name}</div>
        <div class="upload-text" style="font-size: 0.9em; opacity: 0.7;">
            Size: ${(file.size / 1024 / 1024).toFixed(2)} MB
        </div>
    `;
  }
}

            generateBtn.addEventListener('click', async () => {
              
                if (!fileInput.files[0]) {
                    alert('Please select an image file first!');
                    return;
                }
                
                generateBtn.disabled = true;
                
                generateBtn.textContent = 'Generating...';
                
                loading.style.display = 'block';
                
                results.style.display = 'none';
                
                try {
                    const result = await processImage(
                        fileInput.files[0]
                    );
                    
                    displayEnhancedResults(result);
                } catch (error) {
                  
                    alert('Error: ' + error.message);
                } finally {
                  
                    generateBtn.disabled = false;
                    
                    generateBtn.textContent = 'Generate Pixel Art';
                    
                    loading.style.display = 'none';
                }
            });
            
            function displayEnhancedResults(result) {
                results.style.display = 'block';
                results.innerHTML = `
                    <h2 style="text-align: center; color: #333; margin-bottom: 30px;">Generated Results</h2>
                    
                    <div class="download-buttons">
                        <button class="download-btn download-pixel-art" id="dw_pa">
                            📥 Download Pixel Art
                        </button>
                        <button class="download-btn download-numbers" id="dw_num" >
                            📥 Download Numbers
                        </button>
                        <button class="download-btn download-legend" id="dw_lg">
                            📥 Download Legend
                        </button>
                    </div>
                    
                    <div class="preview-grid">
                        <div class="preview-item">
                            <h3>Pixel Art Preview</h3>
                            <img id="pixelart_img" />
                        </div>
                        <div class="preview-item">
                            <h3>Numbers Preview</h3>
                            <img id="number_img" />
                        </div>
                    </div>
                `;
                addDwButtons(result);
                addImgResult(result);
            }

            function addDwButtons(result){
              let pixelart = document.getElementById('dw_pa');
              let numbers = document.getElementById('dw_num');
              let legend = document.getElementById('dw_lg');
              pixelart?.addEventListener('click', () => downloadCanvas(result.pixelArt, `${result.baseName}_pixel_art.png`));
              numbers?.addEventListener('click', () => downloadCanvas(result.numbersImg, `${result.baseName}__numbers.png`));
              legend?.addEventListener('click', () => downloadText(result.legend, `${result.baseName}__palette_legend.txt`));
            }

            function addImgResult(result){
              let pixelart_div = document.getElementById('pixelart_img');
              let numbers_div = document.getElementById('number_img');
                pixelart_div.src = result.pixelArt.toDataURL();
                numbers_div.src = result.numbersImg.toDataURL();
            }

}

function downloadCanvas(canvas, filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL();
    link.click();
};

function downloadText(text, filename) {
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = filename;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
};

const paletteNamed = [
    ["000000", "Black"],
    ["3c3c3c", "Dark Gray"],
    ["787878", "Gray"],
    ["d2d2d2", "Light Gray"],
    ["ffffff", "White"],
    ["600018", "Deep Red"],
    ["ed1c24", "Red"],
    ["ff7f27", "Orange"],
    ["f6aa09", "Gold"],
    ["f9dd3b", "Yellow"],
    ["fffabc", "Light Yellow"],
    ["0eb968", "Dark Green"],
    ["13e67b", "Green"],
    ["87ff5e", "Light Green"],
    ["0c816e", "Dark Teal"],
    ["10aea6", "Teal"],
    ["13e1be", "Light Teal"],
    ["60f7f2", "Cyan"],
    ["28509e", "Dark Blue"],
    ["4093e4", "Blue"],
    ["6b50f6", "Indigo"],
    ["99b1fb", "Light Indigo"],
    ["780c99", "Dark Purple"],
    ["aa38b9", "Purple"],
    ["e09ff9", "Light Purple"],
    ["cb007a", "Dark Pink"],
    ["ec1f80", "Pink"],
    ["f38da9", "Light Pink"],
    ["fab6a4", "Light Peach"],
    ["684634", "Dark Brown"],
    ["95682a", "Brown"],
    ["f8b277", "Beige"],
    ["ffc5a5", "Light Beige"],
    ["aaaaaa", "Medium Gray"],
    ["a50e1e", "Dark Red"],
    ["fa8072", "Light Red"],
    ["e45c1a", "Dark Orange"],
    ["9c8431", "Dark Goldenrod"],
    ["c5ad31", "Goldenrod"],
    ["e8d45f", "Light Goldenrod"],
    ["4a6b3a", "Dark Olive"],
    ["5a944a", "Olive"],
    ["84c573", "Light Olive"],
    ["0f799f", "Dark Cyan"],
    ["bbfaf2", "Light Cyan"],
    ["7dc7ff", "Light Blue"],
    ["4d31b8", "Dark Indigo"],
    ["4a4284", "Dark Stale Blue"],
    ["7a71c4", "Stale Blue"],
    ["b5aef1", "Light Stale Blue"],
    ["9b5249", "Dark Peach"],
    ["d18078", "Peach"],
    ["dba463", "Light Brown"],
    ["7b6352", "Dark Tan"],
    ["9c846b", "Tan"],
    ["d6b594", "Light Tan"],
    ["d18051", "Dark Beige"],
    ["6d643f", "Dark Stone"],
    ["948c6b", "Stone"],
    ["cdc59e", "Light Stone"],
    ["333941", "Dark Slate"],
    ["6d758d", "Slate"],
    ["b3b9d1", "Light Slate"]
];

function hexToRgb(hexStr) {
    return [
        parseInt(hexStr.substring(0, 2), 16),
        parseInt(hexStr.substring(2, 4), 16),
        parseInt(hexStr.substring(4, 6), 16)
    ];
}

function computeTargetSize(image, targetWidth) {
    const aspectRatio = image.height / image.width;
    const targetHeight = Math.max(1, Math.round(targetWidth * aspectRatio));
    return [targetWidth, targetHeight];
}

function closestColorIndex(rgb, paletteRgb) {
    const [r, g, b] = rgb;
    let bestIdx = 0;
    let bestDist = 1000000000;
    
    for (let idx = 0; idx < paletteRgb.length; idx++) {
        const [pr, pg, pb] = paletteRgb[idx];
        const dr = r - pr;
        const dg = g - pg;
        const db = b - pb;
        const dist = dr * dr + dg * dg + db * db;
        if (dist < bestDist) {
            bestDist = dist;
            bestIdx = idx;
        }
    }
    return bestIdx;
}

function quantizeSmallImage(imageSmall, paletteRgb) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imageSmall.width;
    canvas.height = imageSmall.height;
    
    ctx.drawImage(imageSmall, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    
    const quantizedData = new Uint8ClampedArray(data.length);
    const indexMap = new Array(height);
    
    for (let y = 0; y < height; y++) {
        indexMap[y] = new Array(width);
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            
            const colorIdx = closestColorIndex([r, g, b], paletteRgb);
            const [pr, pg, pb] = paletteRgb[colorIdx];
            
            quantizedData[idx] = pr;
            quantizedData[idx + 1] = pg;
            quantizedData[idx + 2] = pb;
            quantizedData[idx + 3] = 255;
            
            indexMap[y][x] = colorIdx + 1; // 1-based indices
        }
    }
    
    const quantizedCanvas = document.createElement('canvas');
    const quantizedCtx = quantizedCanvas.getContext('2d');
    quantizedCanvas.width = width;
    quantizedCanvas.height = height;
    
    const quantizedImageData = new ImageData(quantizedData, width, height);
    
    quantizedCtx.putImageData(quantizedImageData, 0, 0);
    
    return [quantizedCanvas, indexMap];
}

function addGrid(ctx, width, height, cell, color = [0, 0, 0]) {
    ctx.strokeStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    ctx.lineWidth = 1;
    
    for (let x = 0; x <= width; x += cell) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    
    for (let y = 0; y <= height; y += cell) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
}

function createPixelArtImage(imageSmallQuantized, scale, drawGrid = true, gridColor = [0, 0, 0]) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = imageSmallQuantized.width * scale;
    canvas.height = imageSmallQuantized.height * scale;
    
    // Upscale using nearest neighbor
    
    ctx.imageSmoothingEnabled = false;
    
    ctx.drawImage(imageSmallQuantized, 0, 0, canvas.width, canvas.height);
    
    if (drawGrid) {
        addGrid(ctx, canvas.width - 1, canvas.height - 1, scale, gridColor);
    }
    
    return canvas;
}

function createNumbersImage(indexMap, paletteRgb, scale, gridColor = [0, 0, 0]) {
    const height = indexMap.length;
    const width = indexMap[0].length;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width * scale;
    canvas.height = height * scale;
    
    // Fill background
    
    ctx.fillStyle = 'white';
    
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Lightly tint each cell with its palette color
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const colorIdxOneBased = indexMap[y][x];
            const rgb = paletteRgb[colorIdxOneBased - 1];
            
            const tint = rgb.map(c => Math.round(0.12 * c + 0.88 * 255));
            
            ctx.fillStyle = `rgb(${tint[0]}, ${tint[1]}, ${tint[2]})`;
            
            ctx.fillRect(x * scale, y * scale, scale, scale);
        }
    }
    
    // Draw grid
    addGrid(ctx, canvas.width - 1, canvas.height - 1, scale, gridColor);
    
    // Draw centered numbers
    
    ctx.font = `${Math.max(10, Math.round(scale * 0.6))}px Arial`;
    
    ctx.textAlign = 'center';
    
    ctx.textBaseline = 'middle';
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const colorIdxOneBased = indexMap[y][x];
            const textColor = [0, 0, 0]; // Fixed black text for better readability
            const text = colorIdxOneBased.toString();
            
            const cx = x * scale + scale / 2;
            const cy = y * scale + scale / 2;
            
            
            ctx.fillStyle = `rgb(${textColor[0]}, ${textColor[1]}, ${textColor[2]})`;
            
            ctx.fillText(text, cx, cy);
        }
    }
    
    return canvas;
}

function createPaletteLegend(paletteNamed) {
    let legend = "Color Palette Legend:\n";
    legend += "===================\n\n";
    
    for (let i = 0; i < paletteNamed.length; i++) {
        const [hex, name] = paletteNamed[i];
        legend += `${i + 1}: #${hex} - ${name}\n`;
    }
    
    return legend;
}


// Main function to process image
async function processImage(inputFile, targetWidth = 96, scale = 16, drawGrid = true) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            try {
                // Prepare palette
                const paletteHex = paletteNamed.map(([hex]) => hex);
                const paletteRgb = paletteHex.map(hex => hexToRgb(hex));
                
                // Compute target size
                const [smallW, smallH] = computeTargetSize(img, targetWidth);
                
                // Create canvas for downscaled image
                const smallCanvas = document.createElement('canvas');
                const smallCtx = smallCanvas.getContext('2d');
                smallCanvas.width = smallW;
                smallCanvas.height = smallH;
                
                // Draw and downscale
                
                smallCtx.drawImage(img, 0, 0, smallW, smallH);
                
                // Quantize
                const [quantizedCanvas, indexMap] = quantizeSmallImage(smallCanvas, paletteRgb);
                
                // Create outputs
                const pixelArt = createPixelArtImage(quantizedCanvas, scale, drawGrid, [0, 0, 0]);
                const numbersImg = createNumbersImage(indexMap, paletteRgb, scale, [0, 0, 0]);
                
                // Create legend
                const legend = createPaletteLegend(paletteNamed);
                console.log(pixelArt)
                resolve({
                    pixelArt,
                    numbersImg,
                    legend,
                    baseName: inputFile.name.replace(/\.[^/.]+$/, "")
                });
            } catch (error) {
                reject(error);
            }
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(inputFile);
    });
}
