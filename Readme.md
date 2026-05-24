# 🚀 SillyNFTier Millionaire Maker App

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/CramerJ1470/SillyNFTier_Millionaire_Maker_App)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![API Provider: Charles Schwab](https://img.shields.io/badge/API-Schwab%20Developer-blue)](https://developer.schwab.com/)

An automated algorithmic trading framework that connects speculative digital asset strategies with institutional retail equity markets. Powered by a robust Node.js backend cluster and real-time execution pipelines via the Charles Schwab Trader API.

![Financial Market Dashboard](https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80)

---

## 📌 Table of Contents
1. [Core Features](#-core-features)
2. [System Architecture](#-system-architecture)
3. [Charles Schwab Developer Account Setup](#-charles-schwab-developer-account-setup)
4. [Local Installation & Cloning](#-local-installation--cloning)
5. [Configuration & Environment Variables](#-configuration--environment-variables)
6. [Production Deployment Guide](#-production-deployment-guide)
7. [Repository Structure](#-repository-structure)

---

## 🔥 Core Features

* **High-Frequency Order Routing:** Sub-millisecond pipeline processing for algorithmic order entry.
* **State-Persistent Workers:** Isolated background microservices handling market stream ingestion and active token validation.
* **Secure OAuth 2.0 Engine:** Automated background rotation mechanics for Schwab `access_tokens` every 25 minutes.
* **Data Isolation Model:** Structural division between localized execution models and real-time portfolio streams.

---

## 🧠 System Architecture

The ecosystem splits heavy data aggregation and token synchronization away from the core API server to prevent event-loop blocking during volatile trading sessions.

![Data Flow Diagram](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80)

* **API Server (`server.js`):** Exposes transactional endpoints and manages internal state telemetry.
* **Worker Cluster (`/workers`):** Dedicated daemons handling low-level WebSockets and refreshing authorization payloads.
* **Services Layer (`/services`):** Functional abstraction wrappers mapping raw data matrices into executable market orders.

---

## 🔑 Charles Schwab Developer Account Setup

To run live order execution or read real-time pricing telemetry, you must establish secure integration endpoints via the Schwab Developer Portal.

### Step 1: Portal Registration
1. Navigate to the [Charles Schwab Developer Portal](https://developer.schwab.com/).
2. Click **Register** and create your developer profile credentials.
3. Validate your email using the verification link provided.

### Step 2: Establish Your Developer Role
1. Log into the Dev Portal and access your profile dashboard.
2. Locate the **Individual Developer** option card and select **Continue**.
3. *Note: This links your developer profile to your retail Schwab Brokerage accounts to utilize Trader APIs.*

### Step 3: Register an Application Link
1. Go to **Dashboard** -> **Apps** -> **Create App**.
2. Define your application configurations using the matrix parameters below:

| Configuration Field | Target Definition / Action Parameter |
| :--- | :--- |
| **App Name** | `SillyNFTier Execution Engine` (Or user preference) |
| **Callback URL** | `https://127.0.0.1` *(Must be explicit HTTPS localhost or your verified server domain)* |
| **API Product Subscription** | Select both **Accounts and Trading Production** & **Market Data Production** |

3. Submit the registration form. Your application state will initially display as `Pending-Approved`. Once validated by system admins, status transforms to `Ready for Use`.
4. Open your approved App details and copy your confidential **Client ID** and **Client Secret**.

---

## 💻 Local Installation & Cloning

Ensure your local runtime environment meets or exceeds the baseline structural requirements:
* **Node.js:** v18.x.x or higher LTS
* **npm:** v9.x.x or higher

```bash
# 1. Clone the master repository branch
git clone [https://github.com/CramerJ1470/SillyNFTier_Millionaire_Maker_App.git](https://github.com/CramerJ1470/SillyNFTier_Millionaire_Maker_App.git)

# 2. Navigate straight into your application backend root
cd SillyNFTier_Millionaire_Maker_App/backend

# 3. Securely deploy native dependency packages
npm install