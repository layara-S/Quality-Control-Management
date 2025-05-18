# MistyEMS – Quality Control Management

*A full-stack QC management system for Misty Productions, a video editing company.*

---

## ✨ Key Features

- **📋 QC Task Dashboard**  
  View, create, and manage QC tasks with real-time status updates:  
  `Pending` • `Approved` • `Need Revision`

- **📄 Automated Reporting**  
  Upon task approval, a QC report is auto-generated and available for download as a **PDF**.

- **🔁 Revision Workflow**  
  Mark a task as **"Need Revision"** to:  
  - Set a **new deadline**  
  - Add **remarks** for improvement  
  - **Automatically email** the assigned editor with the details

- **🏆 Points & Rewards System**  
  Track and reward QC performance through a built-in points system.

- **📊 Comprehensive Reports**  
  Search, filter, and download all QC reports with ease.

- **💻 Modern UI**  
  Built with **React**, **Material UI**, and a clean, intuitive dashboard experience.

---

## 🛠️ Tech Stack

- **Frontend:** React, Material UI  
- **Backend:** Node.js, Express, MongoDB  
- **Other Tools:** Nodemailer (Email) · PDFKit (PDF Reports)

---

## ⚡ Quick Start

### 1️⃣ Clone & Install

```bash
git clone https://github.com/layara-S/Quality-Control-Management.git

cd Quality-Control-Management/BACKEND
npm install

cd ../frontend
npm install
```

### 2️⃣ Configure Environment

Create a `.env` file inside the `BACKEND` folder with the following variables:

```ini
MONGODB_URL=<your MongoDB connection string>
FRONTEND_URL=http://localhost:3000
PORT=5371
```

### 3️⃣ Run the Application

**Start backend**

```bash
cd BACKEND
npm start
```

**Start frontend**

```bash
cd frontend
npm start
```

---

## 🔐 Internal Use Notice

> **For Misty Productions internal use.**  

