# farmer-app

A bug detection software

## Installation

Install the Flask, OpenCV and Ultralytics

```
pip install flask opencv-python ultralytics
```

Install Onnx

```
pip install onnx onnxruntime
```

Install pywebview and pyinstaller - packages the application as an executable

```
pip install pywebview pyinstaller
```

## Open In Browser

Open in browser: http://127.0.0.1:5000

### Build Steps

1. Change into the packages/app directory
2. Run the following command:

```
pyinstaller --noconfirm --onedir --windowed --add-data "templates;templates" --add-data "ai_models;ai_models" --collect-all ultralytics --collect-all webview app.desktop.py
```

## Dataset Sources

- https://github.com/spoodzxs2345/pest-detection
- https://github.com/maxsitt/insect-detect-ml
