import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import * as poseDetection from "@tensorflow-models/pose-detection";
import { useLocation, useNavigate } from "react-router-dom";
import { ALL_PRODUCTS } from "./Products";

const overlayMap = {
  eyewear: "/images/glasses_main_tryon.png",
  watch: "/images/watch_tryon.png",
  clothing: "/images/pants_tryon.png",
};

const typeLabel = { eyewear: "Eyewear", watch: "Watch", clothing: "Clothing" };

let faceMeshDetectorPromise = null;

function getFaceMeshDetector() {
  if (!faceMeshDetectorPromise) {
    faceMeshDetectorPromise = faceLandmarksDetection.createDetector(
      faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
      {
        runtime: "mediapipe",
        solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh",
        refineLandmarks: true,
        maxFaces: 1,
      }
    ).catch(async (err) => {
      faceMeshDetectorPromise = null;
      console.warn("FaceMesh first load failed, retrying...", err);
      await new Promise((r) => setTimeout(r, 900));
      faceMeshDetectorPromise = faceLandmarksDetection.createDetector(
        faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
        {
          runtime: "mediapipe",
          solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh",
          refineLandmarks: true,
          maxFaces: 1,
        }
      );
      return faceMeshDetectorPromise;
    });
  }

  return faceMeshDetectorPromise;
}

function normalizeType(category = "", image = "", name = "") {
  const text = `${category} ${image} ${name}`.toLowerCase();
  if (text.includes("watch") || text.includes("wrist") || text.includes("accessor")) return "watch";
  if (text.includes("cloth") || text.includes("pant") || text.includes("cargo") || text.includes("trouser")) return "clothing";
  return "eyewear";
}

function dist(a, b) {
  if (!a || !b) return 0;
  return Math.hypot((a.x || 0) - (b.x || 0), (a.y || 0) - (b.y || 0));
}

function midpoint(a, b) {
  if (!a || !b) return { x: 0, y: 0 };
  return { x: ((a.x || 0) + (b.x || 0)) / 2, y: ((a.y || 0) + (b.y || 0)) / 2 };
}

function lerp(a, b, t) {
  return a * (1 - t) + b * t;
}

function smooth(prev, next, factor = 0.38) {
  if (!prev) return { ...next };
  return {
    x: lerp(prev.x, next.x, factor),
    y: lerp(prev.y, next.y, factor),
    w: lerp(prev.w, next.w, factor),
    h: lerp(prev.h, next.h, factor),
    angle: lerp(prev.angle, next.angle, factor),
  };
}

function drawRotatedImage(ctx, img, cx, cy, width, height, angle = 0, alpha = 0.96) {
  if (!img || !img.complete || img.naturalWidth === 0) return;
  if (!width || !height || Number.isNaN(cx) || Number.isNaN(cy)) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.drawImage(img, -width / 2, -height / 2, width, height);
  ctx.restore();
}

function pickProductFromState(state) {
  if (!state) return null;
  if (state.product) return state.product;

  const fromList = ALL_PRODUCTS.find(
    (p) => p.image_url === state.selectedImage && p.name === state.productName
  );

  if (fromList) return fromList;

  if (state.selectedImage || state.productName) {
    return {
      id: "selected",
      name: state.productName || "Selected Product",
      category: state.category || "eyewear",
      image_url: state.selectedImage || "/images/glasses_main.jpg",
    };
  }

  return null;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Try-on image not found: ${src}`));
    img.src = src.startsWith("/") ? src : `/${src}`;
  });
}

export default function AITryOn() {
  const location = useLocation();
  const navigate = useNavigate();

  const initialProduct = useMemo(
    () => pickProductFromState(location.state) || ALL_PRODUCTS[0],
    [location.state]
  );

  const [selectedProduct, setSelectedProduct] = useState(initialProduct);
  const productType = normalizeType(
    selectedProduct.category,
    selectedProduct.image_url,
    selectedProduct.name
  );

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayImgRef = useRef(null);
  const detectorRef = useRef(null);
  const detectorTypeRef = useRef(null);
  const frameRef = useRef(null);
  const smoothRef = useRef(null);
  const mountedRef = useRef(true);
  const busyRef = useRef(false);
  const trackingRef = useRef("Waiting");

  const [status, setStatus] = useState("Camera ready ho rahi hai...");
  const [tracking, setTracking] = useState("Waiting");
  const [camError, setCamError] = useState(false);

  const updateTracking = useCallback((msg) => {
    if (trackingRef.current !== msg) {
      trackingRef.current = msg;
      setTracking(msg);
    }
  }, []);

  useEffect(() => {
    overlayImgRef.current = null;
    smoothRef.current = null;

    const src = selectedProduct.tryon_image || overlayMap[productType];

    loadImage(src)
      .then((img) => {
        overlayImgRef.current = img;
        console.log("Try-on overlay loaded:", src);
      })
      .catch((err) => {
        console.error(err.message);
        setStatus(`Image missing: ${src}`);
        updateTracking("Image Error");
      });
  }, [productType, selectedProduct, updateTracking]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      if (frameRef.current) cancelAnimationFrame(frameRef.current);

      const videoEl = webcamRef.current?.video;
      if (videoEl?.srcObject) {
        videoEl.srcObject.getTracks().forEach((t) => t.stop());
      }

      if (detectorRef.current?.dispose && detectorTypeRef.current !== "eyewear") {
        detectorRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function buildDetector() {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }

      if (detectorRef.current?.dispose && detectorTypeRef.current !== "eyewear") {
        detectorRef.current.dispose();
      }

      detectorRef.current = null;
      detectorTypeRef.current = null;
      smoothRef.current = null;
      busyRef.current = false;

      setStatus(`${typeLabel[productType]} AI model load ho raha hai...`);
      updateTracking("Loading...");

      try {
        if (productType === "eyewear") {
          await new Promise((r) => setTimeout(r, 500));

          detectorRef.current = await getFaceMeshDetector();
          detectorTypeRef.current = "eyewear";
          setStatus("Face model ready. Face center mein rakho.");
        } else if (productType === "watch") {
          detectorRef.current = await handPoseDetection.createDetector(
            handPoseDetection.SupportedModels.MediaPipeHands,
            {
              runtime: "mediapipe",
              solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
              modelType: "lite",
              maxHands: 2,
            }
          );

          detectorTypeRef.current = "watch";
          setStatus("Hand model ready. Palm + wrist camera mein clear rakho.");
        } else {
          await tf.setBackend("webgl");
          await tf.ready();

          detectorRef.current = await poseDetection.createDetector(
            poseDetection.SupportedModels.MoveNet,
            { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
          );

          detectorTypeRef.current = "clothing";
          setStatus("Lower-body model ready. Camera mein hips + legs dikhni chahiye.");
        }

        if (!cancelled && mountedRef.current) {
          setTimeout(() => {
            if (!cancelled && mountedRef.current) startLoop();
          }, 450);
        }
      } catch (err) {
        console.error("Model load error:", err);
        if (!cancelled) {
          setStatus(`AI model load nahi hua: ${err.message || "unknown error"}`);
          updateTracking("Model Error");
        }
      }
    }

    buildDetector();

    return () => {
      cancelled = true;
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productType, updateTracking]);

  async function drawEyewear(ctx, video, detector, overlay) {
    const faces = await detector.estimateFaces(video, { flipHorizontal: false });

    if (!faces?.length) {
      updateTracking("No face detected");
      return;
    }

    const kp = faces[0].keypoints || [];
    const byIdx = (i) => kp[i] || kp.find((p) => p.index === i);

    const leftOuter = byIdx(33);
    const leftInner = byIdx(133);
    const rightInner = byIdx(362);
    const rightOuter = byIdx(263);

    if (!leftOuter || !leftInner || !rightInner || !rightOuter) {
      updateTracking("Eyes not found");
      return;
    }

    const leftEye = midpoint(leftOuter, leftInner);
    const rightEye = midpoint(rightOuter, rightInner);
    const center = midpoint(leftEye, rightEye);
    const eyeGap = dist(leftEye, rightEye);

    if (eyeGap < 25) {
      updateTracking("Face closer");
      return;
    }

    const angle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
    const aspect = overlay.naturalWidth / overlay.naturalHeight;

    const w = eyeGap * 2.65;
    const h = w / aspect;

    const next = {
      x: center.x,
      y: center.y - h * 0.02,
      w,
      h,
      angle,
    };

    smoothRef.current = smooth(smoothRef.current, next, 0.42);
    const s = smoothRef.current;

    drawRotatedImage(ctx, overlay, s.x, s.y, s.w, s.h, s.angle, 0.98);
    updateTracking("Face locked ✓");
  }

  async function drawWatch(ctx, video, detector, overlay) {
    const hands = await detector.estimateHands(video, { flipHorizontal: false });

    if (!hands?.length) {
      updateTracking("No hand detected");
      return;
    }

    const hand = hands[0];
    const kp = hand.keypoints || [];

    const wrist = kp[0] || kp.find((p) => p.name === "wrist");
    const indexMcp = kp[5];
    const middleMcp = kp[9];
    const pinkyMcp = kp[17];

    if (!wrist || !middleMcp) {
      updateTracking("Show full hand + wrist");
      return;
    }

    const palmWidth = Math.max(
      indexMcp && pinkyMcp ? dist(indexMcp, pinkyMcp) : dist(wrist, middleMcp),
      70
    );

    const dx = middleMcp.x - wrist.x;
    const dy = middleMcp.y - wrist.y;
    const len = Math.hypot(dx, dy) || 1;

    const nx = dx / len;
    const ny = dy / len;

    const aspect = overlay.naturalWidth / overlay.naturalHeight;

    let w = palmWidth * 3.0;
    w = Math.max(150, Math.min(w, 320));

    const h = w / aspect;

    const cx = wrist.x - nx * (h * 0.08);
    const cy = wrist.y - ny * (h * 0.08);

    const angle = Math.atan2(dy, dx) - Math.PI / 2;

    const next = { x: cx, y: cy, w, h, angle };

    smoothRef.current = smooth(smoothRef.current, next, 0.65);
    const s = smoothRef.current;

    drawRotatedImage(ctx, overlay, s.x, s.y, s.w, s.h, s.angle, 0.98);
    updateTracking("Wrist locked ✓");
  }

  async function drawClothing(ctx, video, detector, overlay) {
    const poses = await detector.estimatePoses(video);
    const pose = poses?.[0];

    if (!pose?.keypoints?.length) {
      updateTracking("No body detected");
      return;
    }

    const get = (name, minScore = 0.25) =>
      pose.keypoints.find(
        (p) => (p.name || p.part) === name && (p.score == null || p.score >= minScore)
      );

    const lHip = get("left_hip");
    const rHip = get("right_hip");
    const lKnee = get("left_knee");
    const rKnee = get("right_knee");
    const lAnkle = get("left_ankle", 0.18);
    const rAnkle = get("right_ankle", 0.18);

    if (!lHip || !rHip) {
      updateTracking("Hips not visible");
      return;
    }

    if (!lKnee || !rKnee) {
      updateTracking("Knees not visible");
      return;
    }

    const hipCenter = midpoint(lHip, rHip);
    const kneeCenter = midpoint(lKnee, rKnee);

    const bottomCenter =
      lAnkle && rAnkle
        ? midpoint(lAnkle, rAnkle)
        : {
            x: kneeCenter.x + (kneeCenter.x - hipCenter.x) * 0.25,
            y: kneeCenter.y + Math.abs(kneeCenter.y - hipCenter.y) * 1.35,
          };

    const hipWidth = dist(lHip, rHip);
    const legLen = Math.max(dist(hipCenter, bottomCenter), hipWidth * 2.4);

    if (hipWidth < 30 || legLen < 120 || hipCenter.y < video.videoHeight * 0.32) {
      updateTracking("Show lower body clearly");
      return;
    }

    const aspect = overlay.naturalWidth / overlay.naturalHeight;

    let h = Math.min(Math.max(legLen * 1.08, 150), video.videoHeight * 0.82);
    let w = h * aspect;

    const minW = hipWidth * 2.15;

    if (w < minW) {
      w = minW;
      h = w / aspect;
    }

    w = Math.min(w, video.videoWidth * 0.72);

    const dx = bottomCenter.x - hipCenter.x;
    const dy = bottomCenter.y - hipCenter.y;
    const angle = Math.atan2(dx, dy) * -0.45;

    const cx = hipCenter.x + (bottomCenter.x - hipCenter.x) * 0.5;
    const cy = hipCenter.y + h * 0.46;

    const next = { x: cx, y: cy, w, h, angle };

    smoothRef.current = smooth(smoothRef.current, next, 0.36);
    const s = smoothRef.current;

    drawRotatedImage(ctx, overlay, s.x, s.y, s.w, s.h, s.angle, 0.94);
    updateTracking("Lower body locked ✓");
  }

  const startLoop = useCallback(() => {
    const loop = async () => {
      if (!mountedRef.current) return;

      const video = webcamRef.current?.video;
      const canvas = canvasRef.current;
      const detector = detectorRef.current;
      const overlay = overlayImgRef.current;
      const dType = detectorTypeRef.current;

      if (
        video?.readyState === 4 &&
        video.videoWidth > 0 &&
        canvas &&
        detector &&
        overlay &&
        !busyRef.current
      ) {
        busyRef.current = true;

        if (canvas.width !== video.videoWidth) canvas.width = video.videoWidth;
        if (canvas.height !== video.videoHeight) canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        try {
          if (dType === "eyewear") {
            await drawEyewear(ctx, video, detector, overlay);
          } else if (dType === "watch") {
            await drawWatch(ctx, video, detector, overlay);
          } else if (dType === "clothing") {
            await drawClothing(ctx, video, detector, overlay);
          }
        } catch (err) {
          console.warn("Bad frame skipped:", err.message);
        }

        busyRef.current = false;
      }

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const guide =
    productType === "eyewear"
      ? "Face seedha aur center mein rakho. Glasses eyes ke bridge par lock hongi."
      : productType === "watch"
      ? "Palm aur wrist dono camera mein lao. Watch wrist point ke thora upar draw hogi."
      : "Pants ke liye hips, knees aur ankles frame mein lao. Sirf face/upper body se pants draw nahi hongi.";

  return (
    <main className="tryon-page">
      <section className="tryon-shell">
        <div className="tryon-header">
          <button className="secondary-btn" onClick={() => navigate(-1)}>
            Back
          </button>

          <div>
            <p className="eyebrow">Smart Shop 3D AI Try-On</p>
            <h1>{typeLabel[productType]} virtual fitting</h1>
            <p>{selectedProduct.name}</p>
          </div>

          <div className="tracking-pill">{tracking}</div>
        </div>

        <div className="tryon-grid">
          <div className="camera-card">
            {camError ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: "#fff",
                  padding: 24,
                  textAlign: "center",
                }}
              >
                <p>
                  Camera access denied ya available nahi hai.
                  <br />
                  Browser settings mein camera permission allow karein.
                </p>
              </div>
            ) : (
              <>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  mirrored={false}
                  videoConstraints={{
                    facingMode: "user",
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                  }}
                  playsInline
                  className="webcam-feed"
                  onUserMediaError={() => setCamError(true)}
                />
                <canvas ref={canvasRef} className="overlay-canvas" />
              </>
            )}
          </div>

          <aside className="tryon-panel">
            <p className="eyebrow">Live status</p>
            <h2>{status}</h2>
            <p>{guide}</p>

            <div className="selected-product">
              <img src={selectedProduct.image_url} alt={selectedProduct.name} />
              <div>
                <p>{selectedProduct.name}</p>
                <span>{typeLabel[productType]}</span>
              </div>
            </div>

            <div className="tryon-product-list">
              {ALL_PRODUCTS.map((product) => (
                <button
                  key={product.id}
                  className={String(product.id) === String(selectedProduct.id) ? "active" : ""}
                  onClick={() => {
                    smoothRef.current = null;
                    setSelectedProduct(product);
                  }}
                >
                  <img src={product.image_url} alt={product.name} />
                  <span>{product.name}</span>
                </button>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}