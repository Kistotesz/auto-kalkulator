import * as THREE from "three";
import { flavors } from "@/lib/products";

/**
 * Draws a wrap-around jar label on a canvas. The label is a black band with
 * the wordmark, the flavour name and a heat scale, printed twice around the
 * circumference so a name is always facing the camera.
 */
export function makeLabelTexture(index: number) {
  const f = flavors[index];
  const W = 4096;
  const H = 640;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // paper: near black with a fibrous grain
  ctx.fillStyle = "#050302";
  ctx.fillRect(0, 0, W, H);
  const img = ctx.getImageData(0, 0, W, H);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 22;
    img.data[i] += n;
    img.data[i + 1] += n * 0.8;
    img.data[i + 2] += n * 0.6;
  }
  ctx.putImageData(img, 0, 0);

  // thin printed borders
  ctx.strokeStyle = f.labelInk;
  ctx.lineWidth = 6;
  ctx.strokeRect(0, 22, W, H - 44);
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 40, W, H - 80);

  const display = getComputedStyle(document.documentElement)
    .getPropertyValue("--font-brasa-display")
    .trim() || "Impact, sans-serif";
  const body = getComputedStyle(document.documentElement)
    .getPropertyValue("--font-brasa-body")
    .trim() || "sans-serif";

  for (let k = 0; k < 2; k++) {
    const cx = W / 4 + k * (W / 2);
    ctx.textAlign = "center";

    ctx.fillStyle = f.labelInk;
    ctx.font = `900 190px ${display}`;
    ctx.fillText("BRASA", cx, 250);

    ctx.fillStyle = "#f5e9d8";
    ctx.font = `800 74px ${display}`;
    ctx.fillText(f.name.toUpperCase(), cx, 360);

    ctx.font = `500 30px ${body}`;
    ctx.fillStyle = "rgba(245,233,216,0.7)";
    ctx.fillText(`Small batch · ${f.size} · ${f.scoville}`, cx, 420);

    // heat scale: ten little flames, filled up to the heat level
    const pip = 34;
    const gap = 12;
    const total = 10 * pip + 9 * gap;
    for (let i = 0; i < 10; i++) {
      const x = cx - total / 2 + i * (pip + gap) + pip / 2;
      const y = 500;
      ctx.beginPath();
      ctx.moveTo(x, y - 24);
      ctx.bezierCurveTo(x + 18, y - 6, x + 14, y + 16, x, y + 18);
      ctx.bezierCurveTo(x - 14, y + 16, x - 18, y - 6, x, y - 24);
      if (i < f.heat) {
        ctx.fillStyle = f.labelInk;
        ctx.fill();
      } else {
        ctx.strokeStyle = "rgba(245,233,216,0.35)";
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    }
  }

  // vertical batch strip between the two faces
  for (const sx of [0, W / 2]) {
    ctx.save();
    ctx.translate(sx + 6, H / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = "rgba(245,233,216,0.5)";
    ctx.font = `600 26px ${body}`;
    ctx.textAlign = "center";
    ctx.fillText("BATCH 214 · HAND POURED", 0, 30);
    ctx.restore();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.wrapS = THREE.RepeatWrapping;
  return tex;
}
