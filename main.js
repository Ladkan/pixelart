document.querySelector("#app").innerHTML = `
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
            
            <div class="controls">

                <div class="control-group">
                    <label for="widthInput">Pixel Art Width:</label>
                    <input type="number" id="widthInput" value="96" min="16" max="256">
                </div>
                
                <div class="control-group">
                    <label for="scaleInput">Scale Factor:</label>
                    <input type="number" id="scaleInput" value="16" min="8" max="32">
                </div>
                <div class="control-group">
                    <div class="checkbox-group">
                        <input type="checkbox" id="gridCheckbox" checked>
                        <label for="gridCheckbox">Show Grid Lines</label>
                    </div>
                </div>
                <div class="control-group">
                    <div class="checkbox-group">
                        <input type="checkbox" id="freecolorCheck">
                        <label for="freecolorCheck">Use only free colors</label>
                    </div>
                </div>
                <div class="control-group">
                    <label for="distanceSelect">Color Distance:</label>
                    <select id="distanceSelect">
                        <option value="de2000" selected>CIEDE2000</option>
                        <option value="de1994">CIE94 (Graphic Arts)</option>
                        <option value="rgbw">Weighted RGB</option>
                        <option value="oklab">OKLab (Euclidean)</option>
                    </select>
                </div>
                <div class="control-group">
                    <div class="checkbox-group">
                        <input type="checkbox" id="ditherCheck">
                        <label for="ditherCheck">Enable Dithering (Floyd-Steinberg)</label>
                    </div>
                </div>
                <div class="control-group">
                    <div class="checkbox-group">
                        <input type="checkbox" id="adaptiveCheck">
                        <label for="adaptiveCheck">Adaptive Quantization</label>
                    </div>
                </div>
                <div class="control-group">
                    <label for="contrastSlider">Contrast Enhancement:</label>
                    <input type="range" id="contrastSlider" min="0" max="200" value="100" step="10">
                    <span id="contrastValue">100%</span>
                </div>
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

document.addEventListener("DOMContentLoaded", function () {
  initApp();
});

function initApp() {
  const fileInputWrapper = document.getElementById("fileInputWrapper");
  const fileInput = document.getElementById("fileInput");
  const generateBtn = document.getElementById("generateBtn");
  const loading = document.getElementById("loading");
  const results = document.getElementById("results");

  fileInputWrapper?.addEventListener("click", () => fileInput?.click());

  fileInputWrapper?.addEventListener("dragover", (e) => {
    e.preventDefault();
    fileInputWrapper.classList.add("dragover");
  });

  fileInputWrapper?.addEventListener("dragleave", () => {
    fileInputWrapper.classList.remove("dragover");
  });

  fileInputWrapper?.addEventListener("drop", (e) => {
    e.preventDefault();
    fileInputWrapper.classList.remove("dragover");

    if (e.dataTransfer?.files.length > 0) {
      fileInput.files = e.dataTransfer?.files;
      updateFileDisplay();
    }
  });

  fileInput.addEventListener("change", updateFileDisplay);
  
  // Contrast slider update
  const contrastSlider = document.getElementById('contrastSlider');
  const contrastValue = document.getElementById('contrastValue');
  contrastSlider?.addEventListener('input', (e) => {
    contrastValue.textContent = e.target.value + '%';
  });
  
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

  generateBtn.addEventListener("click", async () => {
    if (!fileInput.files[0]) {
      alert("Please select an image file first!");
      return;
    }

    generateBtn.disabled = true;

    generateBtn.textContent = "Generating...";

    loading.style.display = "block";

    results.style.display = "none";

    try {
      const result = await processImage(
        fileInput.files[0],
        parseInt(document.getElementById('widthInput').value),
        parseInt(document.getElementById('scaleInput').value),
        document.getElementById('gridCheckbox').checked);

      displayEnhancedResults(result);
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      generateBtn.disabled = false;

      generateBtn.textContent = "Generate Pixel Art";

      loading.style.display = "none";
    }
  });

  function displayEnhancedResults(result) {
    results.style.display = "block";
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

  function addDwButtons(result) {
    let pixelart = document.getElementById("dw_pa");
    let numbers = document.getElementById("dw_num");
    let legend = document.getElementById("dw_lg");
    pixelart?.addEventListener("click", () =>
      downloadCanvas(result.pixelArt, `${result.baseName}_pixel_art.png`)
    );
    numbers?.addEventListener("click", () =>
      downloadCanvas(result.numbersImg, `${result.baseName}__numbers.png`)
    );
    legend?.addEventListener("click", () =>
      downloadText(result.legend, `${result.baseName}__palette_legend.txt`)
    );
  }

  function addImgResult(result) {
    let pixelart_div = document.getElementById("pixelart_img");
    let numbers_div = document.getElementById("number_img");
    pixelart_div.src = result.pixelArt.toDataURL();
    numbers_div.src = result.numbersImg.toDataURL();
  }
}

function downloadCanvas(canvas, filename) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL();
  link.click();
}

function downloadText(text, filename) {
  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");
  link.download = filename;
  link.href = URL.createObjectURL(blob);
  link.click();
  URL.revokeObjectURL(link.href);
}

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
  ["b3b9d1", "Light Slate"],
];

const paletteFree = [
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
];

function hexToRgb(hexStr) {
  return [
    parseInt(hexStr.substring(0, 2), 16),
    parseInt(hexStr.substring(2, 4), 16),
    parseInt(hexStr.substring(4, 6), 16),
  ];
}

// Color conversions and CIEDE2000 distance
function srgbToLinear(channel) {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function rgbToXyz(r, g, b) {
  const R = srgbToLinear(r);
  const G = srgbToLinear(g);
  const B = srgbToLinear(b);
  // sRGB D65
  const X = R * 0.4124564 + G * 0.3575761 + B * 0.1804375;
  const Y = R * 0.2126729 + G * 0.7151522 + B * 0.0721750;
  const Z = R * 0.0193339 + G * 0.1191920 + B * 0.9503041;
  return [X, Y, Z];
}

function xyzToLab(x, y, z) {
  // D65 reference white
  const Xn = 0.95047;
  const Yn = 1.00000;
  const Zn = 1.08883;

  let xr = x / Xn;
  let yr = y / Yn;
  let zr = z / Zn;

  const epsilon = 216 / 24389; // 0.008856
  const kappa = 24389 / 27;    // 903.3

  function f(t) {
    return t > epsilon ? Math.cbrt(t) : (kappa * t + 16) / 116;
  }

  const fx = f(xr);
  const fy = f(yr);
  const fz = f(zr);

  const L = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const b = 200 * (fy - fz);
  return [L, a, b];
}

function rgbToLab(rgb) {
  const [r, g, b] = rgb;
  const [x, y, z] = rgbToXyz(r, g, b);
  return xyzToLab(x, y, z);
}

function deltaE2000(lab1, lab2) {
  const [L1, a1, b1] = lab1;
  const [L2, a2, b2] = lab2;

  const avgLp = (L1 + L2) / 2;
  const C1 = Math.hypot(a1, b1);
  const C2 = Math.hypot(a2, b2);
  const avgC = (C1 + C2) / 2;

  const G = 0.5 * (1 - Math.sqrt(Math.pow(avgC, 7) / (Math.pow(avgC, 7) + Math.pow(25, 7))));
  const a1p = (1 + G) * a1;
  const a2p = (1 + G) * a2;
  const C1p = Math.hypot(a1p, b1);
  const C2p = Math.hypot(a2p, b2);
  const avgCp = (C1p + C2p) / 2;

  function atan2Deg(y, x) {
    let deg = Math.atan2(y, x) * 180 / Math.PI;
    return deg >= 0 ? deg : deg + 360;
  }

  const h1p = C1p === 0 ? 0 : atan2Deg(b1, a1p);
  const h2p = C2p === 0 ? 0 : atan2Deg(b2, a2p);

  let deltahp;
  const hDiff = h2p - h1p;
  if (C1p * C2p === 0) {
    deltahp = 0;
  } else if (Math.abs(hDiff) <= 180) {
    deltahp = hDiff;
  } else if (hDiff > 180) {
    deltahp = hDiff - 360;
  } else {
    deltahp = hDiff + 360;
  }

  const deltaLp = L2 - L1;
  const deltaCp = C2p - C1p;
  const deltaHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((deltahp * Math.PI / 180) / 2);

  const avgHp = (function() {
    if (C1p * C2p === 0) return h1p + h2p;
    if (Math.abs(h1p - h2p) <= 180) return (h1p + h2p) / 2;
    return (h1p + h2p + 360) / 2 % 360;
  })();

  const T = 1
    - 0.17 * Math.cos((avgHp - 30) * Math.PI / 180)
    + 0.24 * Math.cos((2 * avgHp) * Math.PI / 180)
    + 0.32 * Math.cos((3 * avgHp + 6) * Math.PI / 180)
    - 0.20 * Math.cos((4 * avgHp - 63) * Math.PI / 180);

  const SL = 1 + (0.015 * Math.pow(avgLp - 50, 2)) / Math.sqrt(20 + Math.pow(avgLp - 50, 2));
  const SC = 1 + 0.045 * avgCp;
  const SH = 1 + 0.015 * avgCp * T;

  const deltaTheta = 30 * Math.exp(-Math.pow((avgHp - 275) / 25, 2));
  const RC = 2 * Math.sqrt(Math.pow(avgCp, 7) / (Math.pow(avgCp, 7) + Math.pow(25, 7)));
  const RT = -RC * Math.sin(2 * deltaTheta * Math.PI / 180);

  const KL = 1, KC = 1, KH = 1;
  const termL = deltaLp / (KL * SL);
  const termC = deltaCp / (KC * SC);
  const termH = deltaHp / (KH * SH);
  return Math.sqrt(termL * termL + termC * termC + termH * termH + RT * termC * termH);
}

// CIE94 Delta E (Graphic Arts default): K_L=1, K_C=1, K_H=1, K1=0.045, K2=0.015
function deltaE1994(lab1, lab2) {
  const [L1, a1, b1] = lab1;
  const [L2, a2, b2] = lab2;
  const dL = L1 - L2;
  const C1 = Math.hypot(a1, b1);
  const C2 = Math.hypot(a2, b2);
  const dC = C1 - C2;
  const dA = a1 - a2;
  const dB = b1 - b2;
  const dH_sq = Math.max(0, dA * dA + dB * dB - dC * dC);
  const dH = Math.sqrt(dH_sq);

  const K_L = 1;
  const K_C = 1;
  const K_H = 1;
  const K1 = 0.045;
  const K2 = 0.015;

  const S_L = 1;
  const S_C = 1 + K1 * C1;
  const S_H = 1 + K2 * C1;

  const termL = dL / (K_L * S_L);
  const termC = dC / (K_C * S_C);
  const termH = dH / (K_H * S_H);
  return Math.sqrt(termL * termL + termC * termC + termH * termH);
}

// Weighted RGB distance (perceived weighting). Default weights approximate luminance sensitivity.
function weightedRgbDistanceSquared(rgb1, rgb2, weights = { r: 0.299, g: 0.587, b: 0.114 }) {
  const dr = rgb1[0] - rgb2[0];
  const dg = rgb1[1] - rgb2[1];
  const db = rgb1[2] - rgb2[2];
  return weights.r * dr * dr + weights.g * dg * dg + weights.b * db * db;
}

// OKLab conversion from sRGB (https://bottosson.github.io/posts/oklab/)
function rgbToOklab(rgb) {
  const [r8, g8, b8] = rgb;
  const r = (r8 / 255);
  const g = (g8 / 255);
  const b = (b8 / 255);

  // Convert to linear sRGB
  function toLinear(c) {
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }
  const rl = toLinear(r);
  const gl = toLinear(g);
  const bl = toLinear(b);

  // Linear RGB to LMS
  const l = 0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl;
  const m = 0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl;
  const s = 0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const b2 = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;
  return [L, a, b2];
}

// Floyd-Steinberg dithering implementation
function applyDithering(imageData, paletteRgb, paletteLab, paletteOklab, method, rgbWeights) {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  
  // Create working copy
  const workingData = new Float32Array(data.length);
  for (let i = 0; i < data.length; i += 4) {
    workingData[i] = data[i];     // R
    workingData[i + 1] = data[i + 1]; // G
    workingData[i + 2] = data[i + 2]; // B
    workingData[i + 3] = data[i + 3]; // A
  }
  
  // Floyd-Steinberg error diffusion
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      // Get current pixel
      const r = Math.round(Math.max(0, Math.min(255, workingData[idx])));
      const g = Math.round(Math.max(0, Math.min(255, workingData[idx + 1])));
      const b = Math.round(Math.max(0, Math.min(255, workingData[idx + 2])));
      
      // Find closest palette color
      const pixelLab = rgbToLab([r, g, b]);
      const pixelOklab = method === 'oklab' ? rgbToOklab([r, g, b]) : null;
      const colorIdx = closestColorIndexLab(pixelLab, paletteLab, method, [r, g, b], paletteRgb, rgbWeights, pixelOklab, paletteOklab);
      
      // Set quantized color
      const [qr, qg, qb] = paletteRgb[colorIdx];
      data[idx] = qr;
      data[idx + 1] = qg;
      data[idx + 2] = qb;
      data[idx + 3] = 255;
      
      // Calculate error
      const errorR = r - qr;
      const errorG = g - qg;
      const errorB = b - qb;
      
      // Distribute error to neighboring pixels
      if (x + 1 < width) {
        workingData[idx + 4] += errorR * 7/16;
        workingData[idx + 5] += errorG * 7/16;
        workingData[idx + 6] += errorB * 7/16;
      }
      
      if (y + 1 < height) {
        if (x > 0) {
          workingData[idx + width * 4 - 4] += errorR * 3/16;
          workingData[idx + width * 4 - 3] += errorG * 3/16;
          workingData[idx + width * 4 - 2] += errorB * 3/16;
        }
        
        workingData[idx + width * 4] += errorR * 5/16;
        workingData[idx + width * 4 + 1] += errorG * 5/16;
        workingData[idx + width * 4 + 2] += errorB * 5/16;
        
        if (x + 1 < width) {
          workingData[idx + width * 4 + 4] += errorR * 1/16;
          workingData[idx + width * 4 + 5] += errorG * 1/16;
          workingData[idx + width * 4 + 6] += errorB * 1/16;
        }
      }
    }
  }
  
  return imageData;
}

// Apply contrast enhancement
function applyContrast(imageData, contrastPercent) {
  const data = imageData.data;
  const factor = contrastPercent / 100;
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.max(0, Math.min(255, (data[i] - 128) * factor + 128));
    data[i + 1] = Math.max(0, Math.min(255, (data[i + 1] - 128) * factor + 128));
    data[i + 2] = Math.max(0, Math.min(255, (data[i + 2] - 128) * factor + 128));
  }
  
  return imageData;
}

function computeTargetSize(image, targetWidth) {
  const aspectRatio = image.height / image.width;
  const targetHeight = Math.max(1, Math.round(targetWidth * aspectRatio));
  return [targetWidth, targetHeight];
}

function closestColorIndexLab(pixelLab, paletteLab, method, pixelRgb, paletteRgb, rgbWeights, pixelOklab, paletteOklab) {
  let bestIdx = 0;
  let bestDist = Infinity;
  for (let idx = 0; idx < paletteLab.length; idx++) {
    let dist;
    if (method === 'rgbw') {
      dist = weightedRgbDistanceSquared(pixelRgb, paletteRgb[idx], rgbWeights);
    } else if (method === 'oklab') {
      // Euclidean in OKLab
      const [L1, a1, b1] = pixelOklab;
      const [L2, a2, b2] = paletteOklab[idx];
      const dL = L1 - L2, da = a1 - a2, db = b1 - b2;
      dist = dL * dL + da * da + db * db;
    } else if (method === 'de1994') {
      dist = deltaE1994(pixelLab, paletteLab[idx]);
    } else {
      dist = deltaE2000(pixelLab, paletteLab[idx]);
    }
    if (dist < bestDist) {
      bestDist = dist;
      bestIdx = idx;
    }
  }
  return bestIdx;
}

function quantizeSmallImage(imageSmall, paletteRgb, paletteLab, method, rgbWeights, paletteOklab, useDithering, contrastPercent) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = imageSmall.width;
  canvas.height = imageSmall.height;

  ctx.drawImage(imageSmall, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  // Apply contrast enhancement if not 100%
  if (contrastPercent !== 100) {
    applyContrast(imageData, contrastPercent);
  }
  
  // Apply dithering if enabled
  if (useDithering) {
    applyDithering(imageData, paletteRgb, paletteLab, paletteOklab, method, rgbWeights);
  } else {
    // Original quantization without dithering
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

        const pixelLab = rgbToLab([r, g, b]);
        const pixelOklab = method === 'oklab' ? rgbToOklab([r, g, b]) : null;
        const colorIdx = closestColorIndexLab(pixelLab, paletteLab, method, [r, g, b], paletteRgb, rgbWeights, pixelOklab, paletteOklab);
        const [pr, pg, pb] = paletteRgb[colorIdx];

        quantizedData[idx] = pr;
        quantizedData[idx + 1] = pg;
        quantizedData[idx + 2] = pb;
        quantizedData[idx + 3] = 255;

        indexMap[y][x] = colorIdx + 1; // 1-based indices
      }
    }

    const quantizedImageData = new ImageData(quantizedData, width, height);
    ctx.putImageData(quantizedImageData, 0, 0);
  }

  // Create index map for numbers image
  const data = imageData.data;
  const width = canvas.width;
  const height = canvas.height;
  const indexMap = new Array(height);

  for (let y = 0; y < height; y++) {
    indexMap[y] = new Array(width);
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      const pixelLab = rgbToLab([r, g, b]);
      const pixelOklab = method === 'oklab' ? rgbToOklab([r, g, b]) : null;
      const colorIdx = closestColorIndexLab(pixelLab, paletteLab, method, [r, g, b], paletteRgb, rgbWeights, pixelOklab, paletteOklab);
      indexMap[y][x] = colorIdx + 1; // 1-based indices
    }
  }

  return [canvas, indexMap];
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

function createPixelArtImage(
  imageSmallQuantized,
  scale,
  drawGrid = true,
  gridColor = [0, 0, 0]
) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

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

function createNumbersImage(
  indexMap,
  paletteRgb,
  scale,
  gridColor = [0, 0, 0]
) {
  const height = indexMap.length;
  const width = indexMap[0].length;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = width * scale;
  canvas.height = height * scale;

  // Fill background

  ctx.fillStyle = "white";

  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Lightly tint each cell with its palette color
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const colorIdxOneBased = indexMap[y][x];
      const rgb = paletteRgb[colorIdxOneBased - 1];

      const tint = rgb.map((c) => Math.round(0.12 * c + 0.88 * 255));

      ctx.fillStyle = `rgb(${tint[0]}, ${tint[1]}, ${tint[2]})`;

      ctx.fillRect(x * scale, y * scale, scale, scale);
    }
  }

  // Draw grid
  addGrid(ctx, canvas.width - 1, canvas.height - 1, scale, gridColor);

  // Draw centered numbers

  ctx.font = `${Math.max(10, Math.round(scale * 0.6))}px Arial`;

  ctx.textAlign = "center";

  ctx.textBaseline = "middle";

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
async function processImage(
  inputFile,
  targetWidth = 96,
  scale = 16,
  drawGrid = true
) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    let colorcheck = document.getElementById('freecolorCheck');

    img.onload = () => {
      try {
        // Prepare palette
        let paletteHex;

        if(colorcheck.checked){
            paletteHex = paletteFree.map(([hex]) => hex);
        } else {
            paletteHex = paletteNamed.map(([hex]) => hex);
        }

        const paletteRgb = paletteHex.map((hex) => hexToRgb(hex));
        const paletteLab = paletteRgb.map((rgb) => rgbToLab(rgb));
        const paletteOklab = paletteRgb.map((rgb) => rgbToOklab(rgb));

        // Compute target size
        const [smallW, smallH] = computeTargetSize(img, targetWidth);

        // Create canvas for downscaled image
        const smallCanvas = document.createElement("canvas");
        const smallCtx = smallCanvas.getContext("2d");
        smallCanvas.width = smallW;
        smallCanvas.height = smallH;

        // Draw and downscale

        smallCtx.drawImage(img, 0, 0, smallW, smallH);

        // Quantize
        const [quantizedCanvas, indexMap] = quantizeSmallImage(
          smallCanvas,
          paletteRgb,
          paletteLab,
          (document.getElementById('distanceSelect')?.value || 'de2000'),
          { r: 0.299, g: 0.587, b: 0.114 },
          (document.getElementById('distanceSelect')?.value === 'oklab' ? paletteOklab : null),
          document.getElementById('ditherCheck')?.checked || false,
          parseInt(document.getElementById('contrastSlider')?.value || '100')
        );

        // Create outputs
        const pixelArt = createPixelArtImage(
          quantizedCanvas,
          scale,
          drawGrid,
          [0, 0, 0]
        );
        const numbersImg = createNumbersImage(
          indexMap,
          paletteRgb,
          scale,
          [0, 0, 0]
        );

        // Create legend
        const legend = createPaletteLegend(paletteNamed);
        
        resolve({
          pixelArt,
          numbersImg,
          legend,
          baseName: inputFile.name.replace(/\.[^/.]+$/, ""),
        });
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(inputFile);
  });
}

