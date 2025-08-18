(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))d(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&d(r)}).observe(document,{childList:!0,subtree:!0});function t(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function d(a){if(a.ep)return;a.ep=!0;const i=t(a);fetch(a.href,i)}})();const w=[["000000","Black"],["3c3c3c","Dark Gray"],["787878","Gray"],["d2d2d2","Light Gray"],["ffffff","White"],["600018","Deep Red"],["ed1c24","Red"],["ff7f27","Orange"],["f6aa09","Gold"],["f9dd3b","Yellow"],["fffabc","Light Yellow"],["0eb968","Dark Green"],["13e67b","Green"],["87ff5e","Light Green"],["0c816e","Dark Teal"],["10aea6","Teal"],["13e1be","Light Teal"],["60f7f2","Cyan"],["28509e","Dark Blue"],["4093e4","Blue"],["6b50f6","Indigo"],["99b1fb","Light Indigo"],["780c99","Dark Purple"],["aa38b9","Purple"],["e09ff9","Light Purple"],["cb007a","Dark Pink"],["ec1f80","Pink"],["f38da9","Light Pink"],["fab6a4","Light Peach"],["684634","Dark Brown"],["95682a","Brown"],["f8b277","Beige"],["ffc5a5","Light Beige"],["aaaaaa","Medium Gray"],["a50e1e","Dark Red"],["fa8072","Light Red"],["e45c1a","Dark Orange"],["9c8431","Dark Goldenrod"],["c5ad31","Goldenrod"],["e8d45f","Light Goldenrod"],["4a6b3a","Dark Olive"],["5a944a","Olive"],["84c573","Light Olive"],["0f799f","Dark Cyan"],["bbfaf2","Light Cyan"],["7dc7ff","Light Blue"],["4d31b8","Dark Indigo"],["4a4284","Dark Stale Blue"],["7a71c4","Stale Blue"],["b5aef1","Light Stale Blue"],["9b5249","Dark Peach"],["d18078","Peach"],["dba463","Light Brown"],["7b6352","Dark Tan"],["9c846b","Tan"],["d6b594","Light Tan"],["d18051","Dark Beige"],["6d643f","Dark Stone"],["948c6b","Stone"],["cdc59e","Light Stone"],["333941","Dark Slate"],["6d758d","Slate"],["b3b9d1","Light Slate"]];function B(e){return[parseInt(e.substring(0,2),16),parseInt(e.substring(2,4),16),parseInt(e.substring(4,6),16)]}function E(e,o){const t=e.height/e.width,d=Math.max(1,Math.round(o*t));return[o,d]}function P(e,o){const[t,d,a]=e;let i=0,r=1e9;for(let l=0;l<o.length;l++){const[s,n,g]=o[l],c=t-s,u=d-n,f=a-g,m=c*c+u*u+f*f;m<r&&(r=m,i=l)}return i}function C(e,o){const t=document.createElement("canvas"),d=t.getContext("2d");t.width=e.width,t.height=e.height,d.drawImage(e,0,0);const i=d.getImageData(0,0,t.width,t.height).data,r=t.width,l=t.height,s=new Uint8ClampedArray(i.length),n=new Array(l);for(let f=0;f<l;f++){n[f]=new Array(r);for(let m=0;m<r;m++){const p=(f*r+m)*4,b=i[p],v=i[p+1],h=i[p+2],y=P([b,v,h],o),[I,D,k]=o[y];s[p]=I,s[p+1]=D,s[p+2]=k,s[p+3]=255,n[f][m]=y+1}}const g=document.createElement("canvas"),c=g.getContext("2d");g.width=r,g.height=l;const u=new ImageData(s,r,l);return c.putImageData(u,0,0),[g,n]}function x(e,o,t,d,a=[0,0,0]){e.strokeStyle=`rgb(${a[0]}, ${a[1]}, ${a[2]})`,e.lineWidth=1;for(let i=0;i<=o;i+=d)e.beginPath(),e.moveTo(i,0),e.lineTo(i,t),e.stroke();for(let i=0;i<=t;i+=d)e.beginPath(),e.moveTo(0,i),e.lineTo(o,i),e.stroke()}function G(e,o,t=!0,d=[0,0,0]){const a=document.createElement("canvas"),i=a.getContext("2d");return a.width=e.width*o,a.height=e.height*o,i.imageSmoothingEnabled=!1,i.drawImage(e,0,0,a.width,a.height),t&&x(i,a.width-1,a.height-1,o,d),a}function T(e,o,t,d=[0,0,0]){const a=e.length,i=e[0].length,r=document.createElement("canvas"),l=r.getContext("2d");r.width=i*t,r.height=a*t,l.fillStyle="white",l.fillRect(0,0,r.width,r.height);for(let s=0;s<a;s++)for(let n=0;n<i;n++){const g=e[s][n],u=o[g-1].map(f=>Math.round(.12*f+.88*255));l.fillStyle=`rgb(${u[0]}, ${u[1]}, ${u[2]})`,l.fillRect(n*t,s*t,t,t)}x(l,r.width-1,r.height-1,t,d),l.font=`${Math.max(10,Math.round(t*.6))}px Arial`,l.textAlign="center",l.textBaseline="middle";for(let s=0;s<a;s++)for(let n=0;n<i;n++){const g=e[s][n],c=[0,0,0],u=g.toString(),f=n*t+t/2,m=s*t+t/2;l.fillStyle=`rgb(${c[0]}, ${c[1]}, ${c[2]})`,l.fillText(u,f,m)}return r}function R(e){let o=`Color Palette Legend:
`;o+=`===================

`;for(let t=0;t<e.length;t++){const[d,a]=e[t];o+=`${t+1}: #${d} - ${a}
`}return o}async function _(e,o=96,t=16,d=!0){return new Promise((a,i)=>{const r=new Image;r.onload=()=>{try{const s=w.map(([h])=>h).map(h=>B(h)),[n,g]=E(r,o),c=document.createElement("canvas"),u=c.getContext("2d");c.width=n,c.height=g,u.drawImage(r,0,0,n,g);const[f,m]=C(c,s),p=G(f,t,d,[0,0,0]),b=T(m,s,t,[0,0,0]),v=R(w);console.log(p),a({pixelArt:p,numbersImg:b,legend:v,baseName:e.name.replace(/\.[^/.]+$/,"")})}catch(l){i(l)}},r.onerror=()=>i(new Error("Failed to load image")),r.src=URL.createObjectURL(e)})}document.querySelector("#app").innerHTML=`
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
`;document.addEventListener("DOMContentLoaded",function(){$()});function $(){const e=document.getElementById("fileInputWrapper"),o=document.getElementById("fileInput"),t=document.getElementById("generateBtn"),d=document.getElementById("loading"),a=document.getElementById("results");e?.addEventListener("click",()=>o?.click()),e?.addEventListener("dragover",n=>{n.preventDefault(),e.classList.add("dragover")}),e?.addEventListener("dragleave",()=>{e.classList.remove("dragover")}),e?.addEventListener("drop",n=>{n.preventDefault(),e.classList.remove("dragover"),n.dataTransfer?.files.length>0&&(o.files=n.dataTransfer?.files,i())}),o.addEventListener("change",i);function i(){if(o.files.length>0){const n=o.files[0];e.innerHTML=`
        <div class="upload-icon">✅</div>
        <div class="upload-text">Selected: ${n.name}</div>
        <div class="upload-text" style="font-size: 0.9em; opacity: 0.7;">
            Size: ${(n.size/1024/1024).toFixed(2)} MB
        </div>
    `}}t.addEventListener("click",async()=>{if(!o.files[0]){alert("Please select an image file first!");return}t.disabled=!0,t.textContent="Generating...",d.style.display="block",a.style.display="none";try{const n=await _(o.files[0]);r(n)}catch(n){alert("Error: "+n.message)}finally{t.disabled=!1,t.textContent="Generate Pixel Art",d.style.display="none"}});function r(n){a.style.display="block",a.innerHTML=`
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
                `,l(n),s(n)}function l(n){let g=document.getElementById("dw_pa"),c=document.getElementById("dw_num"),u=document.getElementById("dw_lg");g?.addEventListener("click",()=>L(n.pixelArt,`${n.baseName}_pixel_art.png`)),c?.addEventListener("click",()=>L(n.numbersImg,`${n.baseName}__numbers.png`)),u?.addEventListener("click",()=>O(n.legend,`${n.baseName}__palette_legend.txt`))}function s(n){let g=document.getElementById("pixelart_img"),c=document.getElementById("number_img");g.src=n.pixelArt.toDataURL(),c.src=n.numbersImg.toDataURL()}}function L(e,o){const t=document.createElement("a");t.download=o,t.href=e.toDataURL(),t.click()}function O(e,o){const t=new Blob([e],{type:"text/plain"}),d=document.createElement("a");d.download=o,d.href=URL.createObjectURL(t),d.click(),URL.revokeObjectURL(d.href)}
