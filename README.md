# RelationshipOS 🤝 (Epsilon TeXpedition Hackathon Project)
> **Tagline:** "Know which customers are leaving before they do."

**RelationshipOS** is a clean, minimal full-stack MERN (MongoDB, Express, React, Node.js) application built specifically for the **Epsilon TeXpedition** hackathon to help businesses predict customer churn in real time and generate AI-driven retention strategies using the Gemini API. 

---

## 🚀 Key Features

1. **User Authentication:** Secure registration and login using JWT session tokens stored in local browser storage.
2. **Dynamic Dashboard:** A central panel showcasing customer risk level breakdowns (High, Medium, Low) and immediate warning notifications for high-risk accounts.
3. **Customer Database:** Full CRUD actions allowing businesses to register, edit, and delete customer records (tracking purchases, satisfaction scores, and activity).
4. **Heuristic Churn Prediction:** A rule-based scoring engine calculating churn risks on the fly.
5. **AI Retention Generator:** Integrating the **Gemini API** to analyze customer parameters and instantly generate custom retention plans, churn explanations, marketing recommendations, and coupon rewards.
6. **Polished Analytics:** Interactive charts rendered using **Recharts** highlighting satisfaction rankings and risk ratios.

---

## 🛠️ Technology Stack

* **Frontend:** ReactJS, React Router v6, Axios, Recharts, Lucide Icons, Plain CSS layout.
* **Backend:** NodeJS, ExpressJS, Mongoose, JWT, BcryptJS, Google Generative AI SDK.
* **Database:** MongoDB Atlas / Local MongoDB.
* **AI Engine:** Google Gemini API (`gemini-1.5-flash`).

---

## ⚡ Heuristic Churn Logic
To keep execution lightweight and explainable during hackathon presentations, the application avoids heavy machine learning in favor of a rule-based algorithm:

```javascript
IF lastActiveDays > 30 AND satisfactionScore < 5:
    Churn Risk = "High"
ELSE IF lastActiveDays > 15 OR satisfactionScore < 7:
    Churn Risk = "Medium"
ELSE:
    Churn Risk = "Low"
```

---

## 📦 Project Setup

### Prerequisites
* **Node.js** (v16.x or higher installed)
* **MongoDB** (A running local MongoDB instance at `mongodb://localhost:27017` or a MongoDB Atlas URI string)
* **Gemini API Key** (Obtained from Google AI Studio. If you don't have one, the app has a built-in fallback system that will mock response parameters so the demo remains functional!)

---

### 1. Backend Configuration

1. Open your terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` configuration file by duplicating the example file:
   ```bash
   cp .env.example .env
   ```
4. Open the `.env` file and configure your variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/relationshipOS
   JWT_SECRET=hackathon_super_secret_token_12345
   GEMINI_API_KEY=your_actual_gemini_key_here
   ```
5. Start the backend server:
   ```bash
   npm start
   ```
   *The console should output: `Successfully connected to MongoDB Atlas / Local Database. Server is running on port 5000`.*

---

### 2. Frontend Configuration

1. In a separate terminal session, navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development environment:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the local server (typically [http://localhost:3000](http://localhost:3000) or [http://localhost:5173](http://localhost:5173)).

---

## 💡 Hackathon Evaluation Highlight (How to Explain)

During your presentation, highlight these aspects:
* **The Problem:** Explain how losing customers leaks revenue.
* **The Solution:** Demonstrate adding a customer with 40 active days and a satisfaction score of 3. The risk automatically turns **High** (red badge).
* **The AI integration:** Show how you pull that customer profile on the "AI Suggestions" page and click "Generate". Explain that the backend reads their history, formats a structured prompt, submits it to **Gemini**, and maps the output directly to the UI cards.
* **Fallback Design:** Point out that if the internet goes out or API keys are missing, the system gracefully shifts to a local heuristic advice generator to guarantee zero downtime during live grading.
