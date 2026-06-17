# RelationshipOS - Epsilon TeXpedition Hackathon Project

RelationshipOS is a MERN stack web application built for the Epsilon TeXpedition hackathon. It helps businesses track customer satisfaction, predict which customers are likely to stop using their service (churn), and use Gemini AI to generate custom retention strategies.

## Tech Stack
* Frontend: ReactJS, React Router, Recharts (for analytics), Axios, CSS
* Backend: Node.js, Express.js
* Database: MongoDB Atlas
* AI model: Gemini API (gemini-2.0-flash-lite)

## Churn Prediction Logic
We use a simple rule-based system to calculate churn risk:
* High Risk: last active days > 30 AND satisfaction score < 5
* Medium Risk: last active days > 15 OR satisfaction score < 7 (and not High)
* Low Risk: All other cases

## How to Setup and Run

### 1. Backend Setup
1. Open terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the backend folder and copy these variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. Start the backend:
   ```bash
   npm start
   ```

### 2. Frontend Setup
1. Open another terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React app:
   ```bash
   npm run dev
   ```
4. Open the browser and visit the local port (usually http://localhost:3000 or http://localhost:5173).

## Live Demo Walkthrough
1. **Landing Page**: Basic promo section with hackathon details.
2. **Register/Login**: Create a user account (JWT token is saved in localStorage).
3. **Dashboard**: Shows total customers and risk stats. Lists high-risk accounts.
4. **Customers Page**: Form to add/edit/delete customer records. Risk tiering is calculated automatically.
5. **AI Suggestions Page**: Dropdown to select a customer and request Gemini AI retention advice. If the API key is not configured or hits limits, the app automatically switches to local fallback recommendations so it never crashes.
6. **Analytics Page**: Renders Recharts Pie Chart (risk distribution) and Bar Chart (purchases).
