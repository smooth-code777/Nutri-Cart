# NutriCart - Health-Conscious Food Ordering System

NutriCart is a specialized food ordering web application designed to help users make informed dietary choices based on their specific health conditions and preferences.

## 🎯 Core Concept
The application bridges the gap between food delivery and health management. Unlike standard food apps, NutriCart is aware of the user's health profile (e.g., Diabetes, Hypertension) and dietary preferences (Veg/Non-Veg). It proactively warns users if a specific food item might be harmful to their condition.

## ✨ Key Features

### 👤 User Features
*   **Smart Health Profiling**: Users register with their specific health conditions (Diabetes, Hypertension, Heart Disease, etc.) and dietary preference.
*   **Intelligent Warnings**: The system analyzes food nutritional content (Sugar, Sodium, Fat) against the user's profile and displays warnings (e.g., "High Sugar - Not recommended for Diabetics").
*   **Nutritional Transparency**: Every food item displays clear calorie, protein, and sugar content.
*   **Seamless Ordering**: Easy-to-use cart and checkout process.
*   **Currency Support**: All prices are displayed in Indian Rupees (₹).

### 🛡️ Admin Features
*   **Dashboard**: Overview of products and orders.
*   **Product Management**: Add, edit, or delete food items.
*   **Inventory Control**: Manage stock levels.
*   **Order Tracking**: View customer orders and details.

## 🛠️ Technology Stack

*   **Frontend**: 
    *   React.js (Vite)
    *   Tailwind CSS (Styling)
    *   React Router (Navigation)
    *   Context API (State Management)
*   **Backend**: 
    *   Node.js & Express.js
    *   SQLite (Database) with `better-sqlite3`
    *   JWT (Authentication)
    *   Bcrypt (Security)

## 🚀 How to Run

1.  **Backend Server**:
    ```bash
    cd server
    npm run dev
    ```
    Runs on `http://localhost:5000`

2.  **Frontend Client**:
    ```bash
    cd client
    npm run dev
    ```
    Runs on `http://localhost:5173` (or similar)

## 🔑 Default Credentials

*   **Admin Username**: `admin`
*   **Admin Password**: `admin123`

## 📦 Version Control (Git)

To push this code to your GitHub repository, install [Git](https://git-scm.com/downloads) and run the following commands in the project folder:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/smooth-code777/NutriCart.git
git push -u origin main
```
