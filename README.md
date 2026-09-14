# New Heritage Baptist Church (NHBC Osogbo)

> **Official Web Portal & Content Management System (CMS)**  
> *A community of faith, hope, love, and transformationâ€”growing together in Christ and serving our community in Osogbo, Osun State, Nigeria.*

---

## ðŸ“� Overview

This repository contains the complete official website and administrative Content Management System for **New Heritage Baptist Church (NHBC Osogbo)**. The platform is designed to provide church members, first-time visitors, and administrative staff with a modern, reverent, and trustworthy digital home.

### Key Highlights
- **100% Custom & Authentic**: Designed specifically for NHBC Osogbo with historical Baptist doctrines, pastoral care, and local Nigerian context.
- **Dynamic Content Management**: Church staff can publish sermons, create events, post announcements, update bank accounts, and upload gallery photos directly through the `/admin` portal without editing code.
- **Direct Multi-File Media Uploader**: Drag-and-drop photo uploader that stores high-resolution files on the server (`public/uploads`) and updates the public gallery instantly.
- **Confidential Prayer Portal**: Protected prayer inbox where submissions are restricted exclusively to pastoral leadership and never exposed publicly.
- **Giving & Stewardship**: Dedicated bank account cards with 1-click account number copying and payment description guidance.
- **First-Time Visitors Guide**: Step-by-step "Plan Your Visit" page covering what to wear, parking, children's church, and worship culture.

---

## ðŸ› ï¸ Architecture & Tech Stack

```
nhbc-osogbo/
â”œâ”€â”€ client/                     # Frontend (React 18 + Vite + Tailwind CSS)
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ admin/             # Administrative Dashboard & Management Views
â”‚   â”‚   â”œâ”€â”€ api/               # Centralized REST API client & auth tokens
â”‚   â”‚   â”œâ”€â”€ components/        # Layout (Header, Footer) & UI (Lightbox, AudioPlayer, etc.)
â”‚   â”‚   â”œâ”€â”€ context/           # AuthContext with JWT & role guards
â”‚   â”‚   â”œâ”€â”€ pages/             # 11 Public Pages (Home, About, Ministries, Sermons, etc.)
â”‚   â”‚   â”œâ”€â”€ App.jsx            # Client routing (Public routes + Protected Admin routes)
â”‚   â”‚   â””â”€â”€ main.jsx           # Application entry point
â”‚   â”œâ”€â”€ index.html             # SEO, typography (Cinzel, Playfair Display, Inter)
â”‚   â””â”€â”€ vite.config.js         # Proxy config for /api and /uploads to port 5000
â”‚
â”œâ”€â”€ server/                     # Backend (Node.js + Express)
â”‚   â”œâ”€â”€ data/
â”‚   â”‚   â””â”€â”€ db.json            # Persistent atomic file database with backup
â”‚   â”œâ”€â”€ middleware/
â”‚   â”‚   â”œâ”€â”€ auth.js            # JWT validation & role-based access control
â”‚   â”‚   â””â”€â”€ upload.js          # Multer storage engine (10MB limit, disk storage)
â”‚   â”œâ”€â”€ routes/
â”‚   â”‚   â”œâ”€â”€ admin.js           # Admin CRUD APIs (Sermons, Events, News, Gallery, etc.)
â”‚   â”‚   â”œâ”€â”€ auth.js            # Admin authentication & token generation
â”‚   â”‚   â”œâ”€â”€ contact.js         # Public contact form submission & messages inbox
â”‚   â”‚   â”œâ”€â”€ prayer.js          # Confidential prayer submission & pastoral handling
â”‚   â”‚   â””â”€â”€ public.js          # Public data feeds (Homepage, About, Ministries, etc.)
â”‚   â”œâ”€â”€ db.js                  # Atomic read/write operations with safety backups
â”‚   â””â”€â”€ index.js               # Express application entry & static SPA serving
â”‚
â””â”€â”€ public/
    â””â”€â”€ uploads/               # Local disk storage for church photos and media
```

---

## ðŸš€ Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm**: v9.0.0 or later

### Quick Start

1. **Install Root Dependencies**:
   ```bash
   npm install
   ```

2. **Install Client Dependencies**:
   ```bash
   cd client
   npm install
   cd ..
   ```

3. **Build the Client Frontend**:
   ```bash
   npm run build:client
   ```

4. **Start the Production Server**:
   ```bash
   npm start
   ```
   *The complete web portal and admin system will now be live at **`http://localhost:5000`**.*

### Development Mode (with Hot Module Replacement)
If you wish to edit frontend components with instantaneous live-reloading:
- **Terminal 1** (Start backend on port 5000):
  ```bash
  npm start
  ```
- **Terminal 2** (Start Vite dev server on port 5173):
  ```bash
  npm run client
  ```
  *Vite will proxy all `/api` and `/uploads` requests automatically to `http://localhost:5000`.*

---

## ðŸ›¡ï¸ Administrative Portal & Access

The administrative hub is located at:
ðŸ‘‰ **`http://localhost:5000/admin`**

### Pre-Configured Staff Accounts:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@nhbcosogbo.org` | `Admin@NHBC2026!` | Complete system access: Settings, Bank Accounts, All Content, Users |
| **Content Admin** | `editor@nhbcosogbo.org` | `Editor@NHBC2026!` | Management of Media, Sermons, Events, News, Ministries, Leadership |
| **Prayer Admin** | `prayer@nhbcosogbo.org` | `Prayer@NHBC2026!` | Pastoral access to confidential prayer requests and intercession notes |

*Note: 1-Click quick login buttons are integrated on the `/admin/login` screen for rapid demonstration and review.*

---

## â›ª Church Weekly Schedule

- **Sunday School & Bible Exposition**: Sundays, 8:30 AM â€“ 9:30 AM
- **Sunday Celebration & Worship Service**: Sundays, 9:30 AM â€“ 12:00 PM
- **Mid-Week Prayer & Bible Study**: Wednesdays, 5:30 PM â€“ 7:00 PM
- **House Fellowship / Cell Fellowships**: Sundays, 5:00 PM (Various Centres)

---

## ðŸ”’ Data Security & Confidentiality

- **Confidential Prayer Requests**: Petitions submitted by church members and visitors are flagged with strict confidentiality tags and are accessible only to the Pastor and verified Prayer Administrators. They are never published publicly.
- **Passwords**: All administrative passwords are encrypted with bcrypt hashing.
- **Backups**: The file-based JSON storage writes atomically (`server/db.js`) and maintains an automated backup file (`db.backup.json`) to prevent data corruption.

---

## ðŸ“„ License

This software is built for **New Heritage Baptist Church, Osogbo**. All rights reserved.