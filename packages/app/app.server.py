from pathlib import Path
from flask import Flask, render_template, request, Response
import cv2
import numpy as np
from ultralytics import YOLO

app = Flask(__name__)

# Root directory of the server application
SERVER_ROOT = Path(__file__).resolve().parent

# Path to your newly exported YOLO object detection ONNX model
AI_MODEL_PATH = SERVER_ROOT / 'ai_models' / 'best.onnx'

# Load YOLO ONNX object detection model
model = YOLO(str(AI_MODEL_PATH), task='detect')

# --- GLOBAL VARIABLES ---
# Holds the latest frame to display on the webpage.
latest_output_frame = None

# Holds the last status message for display.
last_status_detected = "no bugs detected"

# --- CONFIGURATION PARAMETERS ---
# AI Detection Confidence Threshold (0.0 to 1.0).
# Lower to 0.35 if the toy is occasionally missed; raise to 0.60 if false alarms occur.
CONFIDENCE_THRESHOLD = 0.45


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/upload_frame', methods=['POST'])
def upload_frame():
    global latest_output_frame, last_status_detected

    blob = request.data
    nparr = np.frombuffer(blob, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if frame is not None:
        # Run YOLO detection directly on every frame (works for stationary toys too)
        results = model(frame, imgsz=640, conf=CONFIDENCE_THRESHOLD, verbose=False)
        result = results[0]

        if result.boxes is not None and len(result.boxes) > 0:
            bug_count = len(result.boxes)
            top_conf = float(result.boxes.conf.max().item())
            top_cls_id = int(result.boxes.cls[0].item())
            class_name = result.names[top_cls_id] if result.names else "insect"

            print(f"🚨 BUG CONFIRMED! Detected {bug_count} {class_name}(s) (max conf: {top_conf * 100:.1f}%)")
            last_status_detected = "bug detected"

            # Draws bounding boxes, labels, and confidence scores onto the frame
            display_frame = result.plot()
        else:
            last_status_detected = "no bugs detected"
            display_frame = frame

        # Save to global variable for the video feed route
        latest_output_frame = display_frame

    return "Frame analyzed", 200


# Generator function to stream the latest output frame as a video feed
def gen_frames():
    global latest_output_frame
    while True:
        if latest_output_frame is not None:
            ret, buffer = cv2.imencode('.jpg', latest_output_frame)
            if ret:
                frame_bytes = buffer.tobytes()
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')


# If you decide to use your video feed tag in HTML again, uncomment this block:
# @app.route('/video_feed')
# def video_feed():
#     return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


# Route to get the last status detected by the AI model
@app.route('/status')
def status():
    global last_status_detected
    return last_status_detected, 200


if __name__ == '__main__':
    # threaded=True lets Flask handle incoming frames while streaming video frames out
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)