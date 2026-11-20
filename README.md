# 🐛 Farmer App — Bug Detection Software

Welcome! **Farmer App** is a desktop and web application that detects bugs using artificial intelligence.

This guide will walk you through setting up your Windows laptop from scratch and running the app—no prior coding experience needed!

---

## Step 1: Unzip the Folder

1. Find the `farmer-app.zip` file you received.
2. Right-click it and select **Extract All...**
3. Choose an easy-to-find place like your **Desktop** or **Documents** folder, then click **Extract**.

---

## Step 2: Install Python (Skip if you already have it)

Because this app runs on Python, you need to install it first.

1. Go to the official Python website: https://www.python.org/downloads/
2. Download **Python 3.12** or **Python 3.14** (avoid 3.15 if listed, as some AI tools don't support it yet).
3. Double-click the downloaded installer file.
4. **SUPER IMPORTANT:** Before clicking "Install Now", check the box at the very bottom that says:
   - `[x] Add python.exe to PATH`
     _(If you forget this step, Windows won't recognize Python commands later!)_
5. Click **Install Now** and wait for it to finish.

---

## Step 3: Open the Terminal in the App Folder

1. Open the extracted `farmer-app` folder.
2. Open the **`packages`** folder, then open the **`app`** folder inside it.
3. Click on the **address bar** at the top of the File Explorer window (where it shows the folder path like `Desktop > farmer-app > packages > app`).
4. Type **`cmd`** and press **Enter**.
   - A black command prompt window will pop up, already pointed at the right folder!

---

## Step 4: Set Up the App Environment & Libraries

Copy and paste the commands below into the black window one at a time (press **Enter** after each one):

**1. Create a private workspace for the app:**

```bat
python -m venv .venv
```

**2. Activate that workspace:**

```bat
.venv\Scripts\activate
```

_(You will know it worked when you see `(.venv)` appear at the beginning of the line.)_

**3. Install the required AI and app tools:**
_(Make sure you are connected to the internet—this downloads the AI brain and camera tools, so it may take 3 to 5 minutes.)_

```bat
python -m pip install -r requirements.txt
```

---

## Step 5: Run the App!

Once the installation finishes, start the server by typing:

```bat
python app.server.py
```

### Open the App in Your Browser:

1. Leave the black terminal window open (closing it turns off the app).
2. Open **Google Chrome**, **Microsoft Edge**, or any web browser.
3. Click the address bar at the top, type the link below, and press **Enter**:
   - **http://127.0.0.1:5000**

---

## How to Run It Again Later

Next time you want to use Farmer App, you **do not** need to install anything again! Just:

1. Open `farmer-app\packages\app` and type `cmd` in the address bar.
2. Activate the workspace:
   ```bat
   .venv\Scripts\activate
   ```
3. Start the app:
   ```bat
   python app.server.py
   ```
4. Open **http://127.0.0.1:5000** in your browser.

---

## Common Issues & Fixes

- **"python is not recognized as an internal or external command"**
  - You missed checking **"Add python.exe to PATH"** during Step 2. Re-run the Python installer, click **Modify**, and make sure **Add Python to environment variables** is checked.
- **The webpage says "This site can't be reached"**
  - Make sure the black terminal window is still open and running `python app.server.py` without any red error messages.
