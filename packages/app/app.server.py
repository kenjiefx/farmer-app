from pathlib import Path
from flask import Flask, render_template, request, Response
import cv2
import numpy as np
from ultralytics import YOLO

app = Flask(__name__)

# Root directory of the server application
SERVER_ROOT = Path(__file__).resolve().parent

# Path to the ONNX model file.
AI_MODEL_PATH = SERVER_ROOT / 'ai_models' / 'efficientnet-b0_imgsz128.onnx'

# Load EfficientNet ONNX classification model
model = YOLO(str(AI_MODEL_PATH), task='classify')  

# --- GLOBAL VARIABLES ---
# Updated dynamically as new frames are processed.
first_frame = None

# Holds the latest frame to display on the webpage.
latest_output_frame = None  

# Holds the last status message for display.
last_status_detected = "no bugs detected"

# --- CONFIGURATION PARAMETERS ---
# Contour area threshold for motion detection. Adjust based on object size.
CONTOUR_AREA_THRESHOLD = 500  

# Brightness threshold for motion detection. Adjust based on lighting conditions.
BRIGHTNESS_THRESHOLD = 25       

# AI Classification Confidence Threshold (0.0 to 1.0). 
# If the model is more than 50% sure it sees the target class, it triggers an alarm.
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
        # Preprocess the frame for motion detection
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        gray = cv2.GaussianBlur(gray, (21, 21), 0)

        if first_frame is None:
            first_frame = gray.copy().astype("float32") # Use float32 explicitly
            latest_output_frame = frame.copy()
            last_status_detected = "no bugs detected"
            return "Initial background captured", 200

        # Dynamically merge background
        cv2.accumulateWeighted(gray, first_frame, 0.05)
        
        # Handles frame differences and types correctly
        frame_delta = cv2.absdiff(gray, cv2.convertScaleAbs(first_frame))
        
        thresh = cv2.threshold(frame_delta, BRIGHTNESS_THRESHOLD, 255, cv2.THRESH_BINARY)[1]
        thresh = cv2.dilate(thresh, None, iterations=2)

        contours, _ = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        motion_detected = False
        for contour in contours:
            if cv2.contourArea(contour) < CONTOUR_AREA_THRESHOLD:
                continue
            motion_detected = True 

        # When motion is detected, run the AI model to classify the frame
        if motion_detected:
            results = model(frame, imgsz=128, verbose=False)
            result = results[0]
            
            # Check if the model successfully returned classification probabilities
            if result.probs is not None:
                top1_idx = result.probs.top1            # Index of the highest-scoring class
                top1_conf = result.probs.top1conf.item()  # Confidence score (value between 0.0 and 1.0)
                
                # Check if the AI's confidence beats our threshold
                if top1_conf > CONFIDENCE_THRESHOLD:
                    class_name = result.names[top1_idx] if result.names else f"Class {top1_idx}"

                    if class_name.lower() != "none_dirt" and class_name.lower() != "none_bg":
                        print(f"🚨 BUG CONFIRMED! Found: {class_name} ({top1_conf*100:.1f}% confidence)")
                        last_status_detected = "bug detected"
                    
                    # overlays the top prediction text onto classification images
                    display_frame = result.plot()
                else:
                    last_status_detected = "no bugs detected"
                    display_frame = frame.copy()
                    cv2.putText(display_frame, f"Motion (Unsure: {top1_conf*100:.1f}%)", (10, 30), 
                                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 165, 255), 2)
            else:
                print("Warning: ONNX model ran but failed to return standard classification layers.")
                display_frame = frame.copy()
        else:
            display_frame = frame
            last_status_detected = "no bugs detected"

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