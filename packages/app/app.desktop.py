import sys
import threading
import time
from pathlib import Path
import cv2
import numpy as np
from flask import Flask, render_template, request, Response
from ultralytics import YOLO
import webview

def resource_path(relative_path: str) -> Path:
    base_path = getattr(sys, '_MEIPASS', Path(__file__).resolve().parent)
    return Path(base_path) / relative_path

app = Flask(
    __name__,
    template_folder=str(resource_path('templates')),
    static_folder=None
)

# Load AI model
AI_MODEL_PATH = resource_path('ai_models/efficientnet-b0_imgsz128.onnx')
model = YOLO(str(AI_MODEL_PATH), task='classify')

first_frame = None
latest_output_frame = None
last_status_detected = "no bugs detected"

CONTOUR_AREA_THRESHOLD = 500
BRIGHTNESS_THRESHOLD = 25
CONFIDENCE_THRESHOLD = 0.5

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload_frame', methods=['POST'])
def upload_frame():
    global first_frame, latest_output_frame, last_status_detected
    
    blob = request.data
    nparr = np.frombuffer(blob, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if frame is not None:
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        gray = cv2.GaussianBlur(gray, (21, 21), 0)

        if first_frame is None:
            first_frame = gray.copy().astype("float32")
            latest_output_frame = frame.copy()
            last_status_detected = "no bugs detected"
            return "Initial background captured", 200

        cv2.accumulateWeighted(gray, first_frame, 0.05)
        frame_delta = cv2.absdiff(gray, cv2.convertScaleAbs(first_frame))
        
        thresh = cv2.threshold(frame_delta, BRIGHTNESS_THRESHOLD, 255, cv2.THRESH_BINARY)[1]
        thresh = cv2.dilate(thresh, None, iterations=2)
        contours, _ = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        motion_detected = any(cv2.contourArea(c) >= CONTOUR_AREA_THRESHOLD for c in contours)

        if motion_detected:
            results = model(frame, imgsz=128, verbose=False)
            result = results[0]
            
            if result.probs is not None:
                top1_idx = result.probs.top1
                top1_conf = result.probs.top1conf.item()
                
                if top1_conf > CONFIDENCE_THRESHOLD:
                    class_name = result.names[top1_idx] if result.names else f"Class {top1_idx}"
                    if class_name.lower() not in ("none_dirt", "none_bg"):
                        print(f"🚨 BUG CONFIRMED: {class_name} ({top1_conf*100:.1f}%)")
                        last_status_detected = "bug detected"
                    display_frame = result.plot()
                else:
                    last_status_detected = "no bugs detected"
                    display_frame = frame.copy()
                    cv2.putText(display_frame, f"Motion (Unsure: {top1_conf*100:.1f}%)", (10, 30), 
                                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 165, 255), 2)
            else:
                display_frame = frame.copy()
        else:
            display_frame = frame
            last_status_detected = "no bugs detected"

        latest_output_frame = display_frame

    return "Frame analyzed", 200

@app.route('/status')
def status():
    global last_status_detected
    return last_status_detected, 200

def run_flask():
    """Runs Flask in a background thread without creating child OS processes."""
    app.run(host='127.0.0.1', port=5000, debug=False, threaded=True, use_reloader=False)

if __name__ == '__main__':
    # start Flask in a background daemon thread
    server_thread = threading.Thread(target=run_flask, daemon=True)
    server_thread.start()

    # give Flask a fraction of a second to bind to port 5000
    time.sleep(0.5)

    #  pywebview to connect to the running local URL
    webview.create_window("Bug Detector App", "http://127.0.0.1:5000", width=1024, height=768)
    webview.start()