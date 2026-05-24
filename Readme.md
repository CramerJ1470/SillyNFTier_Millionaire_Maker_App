# 🚀 SillyNFTier Millionaire Maker App

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/CramerJ1470/SillyNFTier_Millionaire_Maker_App)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![API Provider: Charles Schwab](https://img.shields.io/badge/API-Schwab%20Developer-blue)](https://developer.schwab.com/)

An automated algorithmic trading framework that bridges speculative digital asset strategies with institutional retail equity markets. Powered by a highly optimized Node.js backend cluster and real-time execution pipelines via the Charles Schwab Trader API.

![Financial Market Dashboard](https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80)

---

## 📌 Table of Contents
1. [Core Features](#-core-features)
2. [System Architecture](#-system-architecture)
3. [Step 1: Charles Schwab Developer Account Setup](#-step-1-charles-schwab-developer-account-setup)
4. [Step 2: Local Installation & Cloning](#-step-2-local-installation--cloning)
5. [Step 3: Configuration & Environment Setup](#-step-3-configuration--environment-setup)
6. [Step 4: Production Deployment Guide](#-step-4-production-deployment-guide)
7. [Repository Structure](#-repository-structure)
8. [Production Security Protocols](#-production-security-protocols)
9. [Testing Suite Execution](#-testing-suite-execution)
10. [Monitoring, Logging & Error Handling](#-monitoring-logging--error-handling)
11. [Contributing Guidelines](#-contributing-guidelines)

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

## 🔑 Step 1: Charles Schwab Developer Account Setup

To run live order execution or read real-time pricing telemetry, you must establish secure integration endpoints via the Schwab Developer Portal.

### 1.1 Portal Registration
1. Navigate to the [Charles Schwab Developer Portal](https://developer.schwab.com/).
2. Click **Register** and create your developer profile credentials.
3. Validate your email using the verification link sent to your inbox.

### 1.2 Establish Your Developer Role
1. Log into the Dev Portal and access your profile dashboard.
2. Locate the **Individual Developer** option card and select **Continue**.
3. *Note: This links your developer profile to your retail Schwab Brokerage accounts to utilize Trader APIs.*

### 1.3 Register an Application Link
1. Go to **Dashboard** -> **Apps** -> **Create App**.
2. Define your application configurations using the matrix parameters below:

| Configuration Field | Target Definition / Action Parameter |
| :--- | :--- |
| **App Name** | `SillyNFTier Execution Engine` (Or user preference) |
| **Callback URL** | `https://127.0.0.1` *(Must be explicit HTTPS localhost or your verified server domain)* |
| **API Product Subscription** | Select both **Accounts and Trading Production** & **Market Data Production** |

3. Submit the registration form. Your application state will initially display as `Pending-Approved`. Once validated by system admins, the status transforms to `Ready for Use`.
4. Open your approved App details and copy your confidential **Client ID** and **Client Secret**.

---

## 💻 Step 2: Local Installation & Cloning

Ensure your local runtime environment meets or exceeds the baseline structural requirements before proceeding:
* **Node.js:** v18.x.x or higher LTS
* **npm:** v9.x.x or higher

### 2.1 Clone the Repository
Open your terminal and pull the master branch down to your workspace:

    git clone https://github.com/CramerJ1470/SillyNFTier_Millionaire_Maker_App.git

### 2.2 Navigate to Backend Root
Move directly into the directory where the backend application configurations sit:

    cd SillyNFTier_Millionaire_Maker_App/backend

### 2.3 Install Dependencies
Securely deploy native dependency packages listed in the package manifest:

    npm install

---

## ⚙️ Step 3: Configuration & Environment Setup

### 3.1 Create the Environment File
Instantiate a production environment profile named `.env` directly within your root backend directory to isolate runtime variables securely:

    touch .env

### 3.2 Populate App Environment Parameters
Open the newly created `.env` file in your preferred system text editor (`nano`, `vim`, or VS Code) and add the following configuration block. Ensure you substitute the placeholder strings with the actual keys retrieved from your approved application inside the Charles Schwab Developer Portal dashboard:

    # System Runtime Modes
    PORT=8080
    NODE_ENV=production

    # Charles Schwab API Integrations
    SCHWAB_CLIENT_ID=your_schwab_developer_client_id_here
    SCHWAB_CLIENT_SECRET=your_schwab_developer_client_secret_here
    SCHWAB_CALLBACK_URL=https://127.0.0.1

    # Session & Crypto Encryption Passphrases
    SESSION_SECRET=9be3f210d7a041f6e248b1113c49e29a9b70cfc24d1736a

### 3.3 Option 1: VS Code Integrated Terminal Setup (Temporary Session)
If you prefer mapping your environment keys directly through your local VS Code terminal session instead of a plain-text profile, open your integrated terminal and run the commands matching your operating system before launching the app:

#### For macOS / Linux (bash/zsh):
    export MY_SCHWAB_KEY="your_actual_client_id_here"
    export MY_SCHWAB_SECRET="your_actual_client_secret_here"
    export MY_SCHWAB_URL="https://127.0.0.1"
    node server.js

#### For Windows (PowerShell):
    $env:MY_SCHWAB_KEY="your_actual_client_id_here"
    $env:MY_SCHWAB_SECRET="your_actual_client_secret_here"
    $env:MY_SCHWAB_URL="https://127.0.0.1"
    node server.js

*Note: These variables will safely clear out of your memory pipelines the moment you close or kill that specific terminal tab.*

### 3.4 Verify Local Inclusions Exclusion (.gitignore)
To safeguard production authentication pipelines from exposure hazards, confirm your `.gitignore` configuration effectively excludes localized sensitive data files. Your system should automatically catch:

    .env
    *state.json
    node_modules/

> ⚠️ **CRITICAL SECURITY NOTE:** Never commit your production `.env` configuration template or localized validation files (`*state.json`) to public Git nodes. These are automatically blocked under the local workspace `.gitignore`.

## 🚀 Step 4: Production Deployment Guide

Follow this standardized workflow sequence to push the application live onto continuous Linux compute infrastructure (such as Ubuntu 22.04 LTS or Debian cloud environments).

![Server Rack Data Center](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80)

### 4.1 Update System Frameworks & Deploy Dependencies
Log into your target cloud server instance via SSH and ensure all basic build dependencies and system repositories are explicitly up to date:

    sudo apt update && sudo apt upgrade -y
    sudo apt install build-essential libssl-dev -y

### 4.2 Initialize Runtime Engine (PM2 Node Process Supervisor)
Install PM2 globally. This daemon continuously supervises your server's application instance execution health, handles automatic cluster thread reboots if memory heaps crash, and buffers standard out streams.

    sudo npm install pm2 -g

### 4.3 Trigger Production Node App Boot Sequence
Launch your backend process using the PM2 manager while passing explicit process names to make service tracking easy:

    pm2 start server.js --name "sillynftier-backend"

### 4.4 Configure Host Linux Daemon Recovery Ingestion
To ensure the backend service survives hard infrastructure server resets or physical kernel system reboots, map the execution profile straight into your Linux system startup system paths:

    pm2 startup
    pm2 save

### 4.5 Production Status Telemetry Auditing
Inspect process performance variables and parse live terminal stream events using the built-in system managers:

    # View active CPU and memory profiles for running threads
    pm2 status

    # Access live, real-time logging buffers for order routing verification
    pm2 logs sillynftier-backend

---

## 📁 Repository Structure

An overview of how the architectural codebase layout maps structural duties across files:

    backend/
    ├── models/          # Structural data validation schemas
    ├── services/        # Third-party execution engines and Schwab API clients
    ├── workers/         # Dedicated event loops for real-time background tasks
    ├── .gitignore       # System exclusions configuration map
    ├── package.json     # Node manifests and module trees
    └── server.js        # Core cluster instantiation entry point

---

## 🔒 Production Security Protocols

When deploying an automated trading script with direct brokerage access, you must enforce strict infrastructure security boundaries:

### 1. Secret Management (Do Not Hardcode)
* **Zero-Leak Policy:** Under no circumstances should your `SCHWAB_CLIENT_SECRET` or app tokens be written inside your codebase. 
* **Environment Isolation:** Use a production secret manager (like AWS Secrets Manager, HashiCorp Vault, or encrypted environment spaces) rather than leaving plain-text `.env` files on an open server.

### 2. Linux Server Hardening
If you are hosting this application on a cloud VPS (Ubuntu/Debian), execute these foundational baseline security steps immediately:
* **Disable Root SSH Logging:** Force authentication through a dedicated, non-root user account utilizing SSH Keys. Disable password authentication entirely in `/etc/ssh/sshd_config`.
* **Configure Uncomplicated Firewall (UFW):** Drop all inbound packets except explicit tracking nodes and your remote access port:

    sudo ufw default deny incoming
    sudo ufw default allow outgoing
    sudo ufw allow ssh
    sudo ufw allow 8080/tcp
    sudo ufw enable

### 3. Rate Limiting & API Throttling
* Charles Schwab endpoints enforce strict transactional rate limits. Ensure your internal loops utilize a sliding-window queue or token bucket algorithm to prevent hard HTTP `429 Too Many Requests` bans, which can freeze active positions mid-execution.

---

## 🧪 Testing Suite Execution

A serious financial framework requires high testing coverage before touching live capital.

### Local Mock Testing
This project utilizes **Jest** alongside **Supertest** to mock active brokerage data feeds without hitting the live Schwab endpoints.

    # Run the complete end-to-end integration test suite
    npm test

    # Run tests with active coverage reports
    npm run test:coverage

Make sure your test configurations validate:
1. **Token Refresh Failures:** The app gracefully holds execution if the Schwab API fails to rotate keys.
2. **Order Slippage Faults:** The calculation engine rejects trades if the spread between Ask/Bid is too wide.

---

## 📈 Monitoring, Logging & Error Handling

When code errors equal actual financial losses, simple `console.log` statements are not enough.

### Structured Logging
The backend uses **Winston** to generate structured JSON logs. This allows logs to be easily parsed by log aggregators (like Datadog, ELK stack, or Logtail). 

Logs are systematically split into two separate local streams:
* `logs/combined.log`: Captures system telemetry, order entries, and heartbeat logs.
* `logs/error.log`: Captures network drops, database faults, and rejected execution triggers.

### Critical Failure Notification Loop
Inside `services/errorNotifier.js`, configure a webhook to broadcast critical runtime alerts directly to your personal Discord server or Slack channel if a production worker loop crashes:

    // Example webhook trigger within the application core
    const alertWebhook = process.env.DISCORD_WEBHOOK_URL; 

---

## 🤝 Contributing Guidelines

If you want others to collaborate or review your code:
1. **Fork the Repository** and create your branch (`feature/AmazingFeature`).
2. **Commit with Conventional Messages** (e.g., `feat: add order queue throttling`, `fix: token refresh math`).
3. **Submit a Pull Request** targeting the `master` branch for code review.