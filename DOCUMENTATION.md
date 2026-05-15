# BlogCraft AI — Technical Documentation

**Version:** 1.0  
**Date:** May 2026  
**Stack:** Next.js 15 · Node.js / Express · MongoDB · Redis · Groq (LLaMA 3.3) · ImageKit

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [File Structure](#3-file-structure)
4. [User Roles & Access Flow](#4-user-roles--access-flow)
5. [Backend — API Reference](#5-backend--api-reference)
6. [Database Models](#6-database-models)
7. [Frontend — Pages & Components](#7-frontend--pages--components)
8. [AI Content Generation](#8-ai-content-generation)
9. [Caching Layer (Redis)](#9-caching-layer-redis)
10. [Authentication & Security](#10-authentication--security)
11. [Environment Variables](#11-environment-variables)
12. [How to Run Locally](#12-how-to-run-locally)

---

## 1. Project Overview

BlogCraft AI is a **multi-tenant B2B blog publishing platform** where multiple companies can each manage their own blog content. It uses AI (via Groq's LLaMA 3.3 model) to generate and refine blog posts, and provides separate dashboards for company admins and a platform-level super admin.

### Key Capabilities

| Feature | Description |
|---|---|
| AI Blog Generation | Generate full blog posts from a topic prompt using LLaMA 3.3 70B |
| AI Refinement | Edit existing blog content with natural language instructions |
| Multi-tenant | Each company has isolated blogs, comments, and subscribers |
| Company Onboarding | Companies request access → super admin approves → admin signs up |
| Analytics | Per-blog view tracking, comment trends, AI-powered recommendations |
| Newsletter | Email subscription with automated newsletter on blog publish |
| SEO | Auto-generated slugs, structured data (JSON-LD), sitemap, robots.txt |

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js 15)                │
│  Public Site  │  Admin Dashboard  │  Super Admin Panel   │
│  (port 3000)  │  /admin/*         │  /super-admin/*      │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTP (Axios)
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  BACKEND (Express.js)                    │
│                     (port 5000)                          │
│                                                          │
│  /api/blog/*   /api/admin/*   /api/super-admin/*         │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐   │
│  │  Redis   │  │  Groq AI │  │  ImageKit (CDN)       │   │
│  │  Cache   │  │  LLaMA   │  │  Image Upload/Serve   │   │
│  └──────────┘  └──────────┘  └──────────────────────┘   │
└──────────────────────────┬──────────────────────────────┘
                           │ Mongoose ODM
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    MongoDB Atlas                          │
│  blogs · admins · requests · comments · emails · views   │
└─────────────────────────────────────────────────────────┘
```

---

## 3. File Structure

```
BlogCraftAI/
├── backend/
│   ├── index.js                        # Express app entry point
│   ├── .env                            # Environment variables
│   ├── vercel.json                     # Vercel deployment config
│   ├── scripts/
│   │   └── createSuperAdmin.js         # One-time super admin seed script
│   └── lib/
│       ├── config/
│       │   ├── db.js                   # MongoDB connection
│       │   ├── gemini.js               # Groq AI (LLaMA) integration
│       │   ├── imagekit.js             # ImageKit CDN config
│       │   ├── nodemailer.js           # Email (SMTP) config
│       │   └── redis.js                # Redis (ioredis) client
│       ├── controllers/
│       │   ├── blog.controller.js      # Blog CRUD, AI generate/refine, comments, subscribe
│       │   ├── admin.controller.js     # Admin signup/login, dashboard, comments, emails
│       │   ├── superAdmin.controller.js# Super admin login, company requests, approvals
│       │   └── analytics.controller.js # View tracking, analytics data
│       ├── middlewares/
│       │   ├── auth.middleware.js      # JWT verification (admin + super admin)
│       │   ├── multer.middleware.js    # File upload handling
│       │   └── redis.middleware.js     # Response caching middleware
│       ├── models/
│       │   ├── BlogModel.js            # Blog schema
│       │   ├── adminModel.js           # Admin user schema
│       │   ├── requestModel.js         # Company access request schema
│       │   ├── CommentModel.js         # Blog comment schema
│       │   ├── EmailModel.js           # Newsletter subscriber schema
│       │   ├── PostViewModel.js        # Blog view tracking schema
│       │   └── superAdminModel.js      # Super admin schema
│       └── routes/
│           ├── blogRoute.js            # /api/blog/* routes
│           ├── adminRoute.js           # /api/admin/* routes
│           ├── superAdminroutes.js     # /api/super-admin/* routes
│           ├── analyticsRoute.js       # /api/admin/analytics/* routes
│           └── emailRoute.js           # /api/email/* routes
│
└── frontend/
    ├── config/
    │   └── api.js                      # baseURL config (reads NEXT_PUBLIC_BASE_URL)
    ├── context/
    │   └── AppContext.jsx              # Global state: token, blogs, axios instance
    ├── public/
    │   └── images/                     # Static images for navbar dropdowns
    └── src/
        ├── app/
        │   ├── (home)/                 # Public homepage (blog listing)
        │   ├── blogs/[id]/             # Individual blog post page (SSR)
        │   ├── login/                  # Admin login page
        │   ├── signup/                 # Admin signup page
        │   ├── super-login/            # Super admin login page
        │   ├── request-for-company/    # Company access request form
        │   ├── About-us/               # Public about page
        │   ├── admin/
        │   │   ├── layout.jsx          # Admin layout (sidebar + navbar)
        │   │   ├── dashboard/          # Stats overview
        │   │   ├── addBlog/            # Create/edit blog with AI
        │   │   ├── blogList/           # Manage all blogs
        │   │   ├── comments/           # Moderate comments
        │   │   ├── subscriptions/      # View email subscribers
        │   │   └── settings/           # Account settings
        │   └── super-admin/
        │       ├── layout.jsx          # Super admin layout
        │       ├── dashboard/          # Platform-wide stats
        │       └── incomingRequest/    # Approve/reject company requests
        ├── Components/
        │   ├── NavbarNew.jsx           # Public site navbar with dropdowns
        │   ├── Navbar.jsx              # Admin panel top bar
        │   ├── Header.jsx              # Homepage hero section
        │   ├── BlogItem.jsx            # Blog card component
        │   ├── BlogList.jsx            # Blog grid with search
        │   ├── Footer.jsx              # Site footer
        │   ├── Newsletter.jsx          # Email subscription widget
        │   ├── privateComponent.jsx    # Auth guard (redirects to /login)
        │   └── AdminComponents/
        │       ├── Sidebar.jsx         # Admin sidebar navigation
        │       ├── newSidebar.jsx      # Super admin sidebar
        │       ├── AiChatPanel.jsx     # AI chat assistant panel
        │       ├── AiContextPanel.jsx  # AI context/settings panel
        │       ├── BlogTableItem.jsx   # Blog row in admin table
        │       ├── CommentTableItem.jsx# Comment row in admin table
        │       ├── SubsTableItem.jsx   # Subscriber row in admin table
        │       └── analytics/
        │           ├── AnalyticsSection.jsx      # Analytics dashboard wrapper
        │           ├── AiRecommendationsPanel.jsx# AI-powered content suggestions
        │           ├── CommentTrendChart.jsx      # Comment activity chart
        │           └── TopPostsList.jsx           # Most-viewed posts list
        └── Assets/
            └── assets.js               # Static asset imports
```

---

## 4. User Roles & Access Flow

The platform has three distinct user types with a structured onboarding flow:

### Roles

| Role | Access | Login URL |
|---|---|---|
| **Public Visitor** | Read published blogs, subscribe to newsletter, leave comments | — |
| **Company Admin** | Manage their company's blogs, comments, subscribers, analytics | `/login` |
| **Super Admin** | Approve/reject company requests, view platform-wide stats | `/super-login` |

### Company Onboarding Flow

```
1. Company fills out request form (/request-for-company)
        │
        ▼
2. Request saved to DB with status: "pending"
        │
        ▼
3. Super Admin reviews at /super-admin/incomingRequest
        │
   ┌────┴────┐
   │         │
Approve    Reject
   │         │
   ▼         ▼
status:   status:
"approved" "rejected"
   │
   ▼
4. Company signs up at /signup
   (system verifies company name matches an approved request)
        │
        ▼
5. Admin account created → redirected to /login
        │
        ▼
6. Admin logs in → JWT token stored in localStorage
        │
        ▼
7. Access to /admin/* dashboard
```

### Authentication Flow

```javascript
// Login response stores:
localStorage.setItem('token', token);     // JWT for API calls
localStorage.setItem('email', email);     // Used by PrivateComponent guard
localStorage.setItem('company', company); // Used to scope all API requests

// Every protected API call includes:
Authorization: Bearer <JWT>

// Backend verifies JWT and attaches company to request:
req.company = admin.company; // from DB, not client-supplied
```

---

## 5. Backend — API Reference

### Base URL
- **Local:** `http://localhost:5000`
- **Production:** configured via `NEXT_PUBLIC_BASE_URL`

### Blog Routes — `/api/blog`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/all` | No | Get all published blogs (Redis cached) |
| `GET` | `/slug/:slug` | No | Get blog by URL slug |
| `GET` | `/:blogId` | No | Get blog by MongoDB ID |
| `POST` | `/add` | ✅ JWT | Create new blog (with image upload) |
| `POST` | `/delete` | ✅ JWT | Delete blog by ID |
| `POST` | `/toggle-publish` | ✅ JWT | Publish / unpublish a blog |
| `POST` | `/generate` | ✅ JWT | AI-generate blog content |
| `POST` | `/refine` | ✅ JWT | AI-refine existing blog content |
| `POST` | `/add-comment` | No | Submit a comment (pending approval) |
| `POST` | `/comments` | No | Get approved comments for a blog |
| `POST` | `/subscribe` | No | Subscribe email to newsletter |
| `POST` | `/request` | No | Submit company access request |
| `POST` | `/track-view` | No | Record a blog page view |

### Admin Routes — `/api/admin`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/login` | No | Admin login → returns JWT |
| `POST` | `/signUp` | No | Admin signup (requires approved company) |
| `GET` | `/blogs` | ✅ JWT | Get all blogs for this admin's company |
| `GET` | `/dashboard` | ✅ JWT | Dashboard stats (blogs, comments, drafts) |
| `GET` | `/comments` | ✅ JWT | Get all comments for this company |
| `POST` | `/approve-comment` | ✅ JWT | Approve a comment |
| `POST` | `/delete-comment` | ✅ JWT | Delete a comment |
| `GET` | `/emails` | ✅ JWT | Get newsletter subscribers |
| `DELETE` | `/emails` | ✅ JWT | Remove a subscriber |
| `PUT` | `/updatePassword` | ✅ JWT | Update admin password |

### Super Admin Routes — `/api/super-admin`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/login` | No | Super admin login → returns JWT |
| `POST` | `/signup` | ✅ Super Admin JWT | Create another super admin |
| `GET` | `/getRequests` | ✅ Super Admin JWT | List all company requests |
| `PUT` | `/approveRequest/:id` | ✅ Super Admin JWT | Approve or reject a request |
| `DELETE` | `/deleteRequest/:id` | ✅ Super Admin JWT | Delete a request |
| `GET` | `/company-blogs` | ✅ Super Admin JWT | Blog count per company |

---

## 6. Database Models

### Blog
```javascript
{
  title:       String,   // required
  description: String,   // HTML content (required)
  category:    String,   // required
  author:      String,   // required
  image:       String,   // ImageKit CDN URL (required)
  authorImg:   String,   // Author avatar URL
  slug:        String,   // URL-safe version of title (required)
  date:        Date,     // defaults to now
  isPublished: Boolean,  // defaults to false (draft)
  company:     String    // tenant identifier (required)
}
```

### Admin
```javascript
{
  company:   String,  // must match an approved request
  email:     String,  // login email
  password:  String,  // plain text (⚠ should be hashed in production)
  createdAt: Date,
  updatedAt: Date
}
```

### Request (Company Access)
```javascript
{
  fullname:     String,  // required
  company:      String,  // required
  email:        String,  // required, unique index
  businessType: String,  // required
  status:       String,  // "pending" | "approved" | "rejected" (default: "pending")
  createdAt:    Date,
  updatedAt:    Date
}
```

### Comment
```javascript
{
  blog:       ObjectId,  // ref → Blog (required)
  name:       String,    // commenter name (required)
  content:    String,    // comment text (required)
  isApproved: Boolean,   // defaults to false (moderation queue)
  createdAt:  Date
}
```

### Email (Newsletter Subscriber)
```javascript
{
  email:   String,  // subscriber email
  company: String,  // which company they subscribed to
  date:    Date     // subscription date
}
```

---

## 7. Frontend — Pages & Components

### Public Pages

**Homepage (`/`)**
- Displays all published blogs for the current company
- Search/filter by category
- Newsletter subscription widget
- Uses `BlogList` and `BlogItem` components

**Blog Post (`/blogs/[slug]`)**
- Full blog content rendered from stored HTML
- Author, publish date, category
- Comment section (submit + view approved comments)
- Social share buttons (Facebook, Twitter, LinkedIn)
- Newsletter subscription
- "You may also like" related posts
- View tracking (fires once per session per blog)
- JSON-LD structured data for SEO

**Request Access (`/request-for-company`)**
- Form: Full Name, Company Name, Business Type, Email
- Validates for duplicate email before submitting
- Shows status-aware error if email already has a request

**Signup (`/signup`)**
- Requires company name to match an approved request
- Creates admin account linked to that company

### Admin Dashboard Pages

All admin pages are protected by `PrivateComponent` (checks `localStorage.email`).

**Dashboard (`/admin/dashboard`)**
- Total blogs, drafts, comments count
- Recent posts list
- Analytics section with charts and AI recommendations

**Add Blog (`/admin/addBlog`)**
- Topic input with AI generation options (tone, length, audience, keywords)
- Rich text editor for the generated content
- AI refinement panel — give instructions to modify the content
- Image upload (sent to ImageKit CDN)
- Publish / save as draft toggle

**Blog List (`/admin/blogList`)**
- Table of all company blogs
- Toggle publish/unpublish
- Delete blog

**Comments (`/admin/comments`)**
- Moderation queue
- Approve or delete comments

**Subscriptions (`/admin/subscriptions`)**
- List of newsletter subscribers
- Delete subscriber

**Settings (`/admin/settings`)**
- Update admin password

### Super Admin Pages

**Dashboard (`/super-admin/dashboard`)**
- Total approved companies, total blogs across platform, total comments
- Blog count per company selector
- List of all approved companies

**Incoming Requests (`/super-admin/incomingRequest`)**
- Table of all company access requests
- Approve or reject with reason
- Delete requests

### Key Components

**`PrivateComponent`**
Wraps all admin and super-admin pages. Checks `localStorage.email` on mount — redirects to `/login` if not present.

```jsx
// Usage in layout:
<PrivateComponent>
  <AppProvider>
    {children}
  </AppProvider>
</PrivateComponent>
```

**`AppContext`**
Global state provider. Provides:
- `token` — JWT from localStorage
- `blogs` — company's blog list
- `axios` — pre-configured axios instance with `Authorization` header
- `input` — search input state

**`NavbarNew`**
Public site navbar with mega-menu dropdowns for Services, Solutions, and B2B Knowledge Base. Fixed position, scrolls with shadow effect.

---

## 8. AI Content Generation

The AI system uses **Groq's API** with the **LLaMA 3.3 70B Versatile** model (not Google Gemini — the file is named `gemini.js` for legacy reasons).

### Generate Blog

**Endpoint:** `POST /api/blog/generate`  
**Auth:** Required

**Request body:**
```json
{
  "prompt": "The future of B2B content marketing",
  "tone": "professional",
  "length": "medium",
  "audience": "B2B marketing professionals",
  "style": "HBR",
  "keywords": "content syndication, lead generation",
  "extraContext": "Focus on AI tools"
}
```

**Length targets:**
| Value | Word Count |
|---|---|
| `short` | 350–500 words |
| `medium` | 700–900 words |
| `long` | 1300–1600 words |

**Response:** Returns clean HTML body content (no `<html>`, `<body>` wrappers).

### Refine Blog

**Endpoint:** `POST /api/blog/refine`  
**Auth:** Required

**Request body:**
```json
{
  "currentContent": "<p>Existing HTML...</p>",
  "instruction": "Make the tone more conversational and add a section about ROI"
}
```

The model receives the full current HTML and the instruction, then returns the complete updated HTML.

---

## 9. Caching Layer (Redis)

Redis (via `ioredis`) is used to cache two high-traffic endpoints:

| Cache Key | Endpoint | TTL |
|---|---|---|
| `"blogs"` | `GET /api/blog/all` | 60 seconds |
| `"comments"` | `POST /api/blog/comments` | 60 seconds |

The `cachedData` middleware checks Redis before hitting MongoDB:

```javascript
// If cache hit → return cached JSON immediately
// If cache miss → call controller, controller writes to Redis, returns response
```

Cache is invalidated automatically by TTL expiry. Blog publish/unpublish operations will reflect within 60 seconds.

---

## 10. Authentication & Security

### JWT Flow

```
Login → server signs JWT with { email, role } → client stores in localStorage
Every request → client sends Authorization: Bearer <token>
Server verifies → attaches req.user and req.company → controller runs
```

### Two Auth Middlewares

**`auth`** (admin)
- Verifies JWT signature
- Looks up admin in DB to get `company` (prevents client from spoofing company)
- Attaches `req.user` and `req.company`

**`superAdminAuth`** (super admin only)
- Verifies JWT signature
- Checks `decoded.role === "superadmin"`
- Returns 403 if role doesn't match

### Multi-tenancy Isolation

All admin API endpoints scope data by `req.company` (set from DB, not from the request body). This means an admin can only ever read/write data belonging to their own company, even if they manipulate the request.

### Known Limitations (for production hardening)
- Passwords are stored in plain text — should use `bcrypt`
- No rate limiting on public endpoints
- JWT secret should be rotated periodically

---

## 11. Environment Variables

### Backend (`.env`)

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `GROQ_API_KEY` | Groq API key for LLaMA AI |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit public key |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit CDN base URL |
| `REDIS_HOST` | Redis host (e.g. from Upstash) |
| `REDIS_PORT` | Redis port |
| `REDIS_PASSWORD` | Redis auth password |
| `PORT` | Server port (default: 5000) |

### Frontend (`.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_BASE_URL` | Backend API base URL (e.g. `http://localhost:5000`) |

---

## 12. How to Run Locally

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Redis instance (Upstash free tier works)
- Groq API key (free at console.groq.com)
- ImageKit account (free tier)

### Backend

```bash
cd BlogCraftAI/backend
npm install
# Create .env with all variables listed above
node scripts/createSuperAdmin.js   # Run once to create the first super admin
npm run dev                        # Starts on port 5000
```

### Frontend

```bash
cd BlogCraftAI/frontend
npm install
# Create .env.local:
# NEXT_PUBLIC_BASE_URL=http://localhost:5000
npm run dev                        # Starts on port 3000
```

### First-time Setup Order

1. Start backend
2. Run `createSuperAdmin.js` to seed the super admin account
3. Start frontend
4. Go to `/request-for-company` and submit a company request
5. Log in as super admin at `/super-login` and approve the request
6. Go to `/signup` and create the company admin account
7. Log in at `/login` and start publishing

---

*Document generated May 2026 — BlogCraft AI internal technical reference*
