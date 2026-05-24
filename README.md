# 🛠️ Salahuddin's Portfolio — Admin Control Panel

This is the content management system (CMS) dashboard for Salah Uddin Kader's portfolio website. Built with a futuristic console aesthetic using Next.js 16 App Router, it provides a high-security gateway to manage projects, blogs, certificates, services, client testimonials, and view real-time traffic statistics.

---

## ⚡ Core Features

- **🔑 Bulletproof Authentication:** Implements NextAuth.js (v5 Beta) token-based cookie authentication protecting dashboard shells.
- **📈 Live Traffic Analytics:** Visual charts displaying total hits, unique visitors, geo-locations, and client browser configurations.
- **📝 Complete Content Controls:** Dedicated workspaces for creating, editing, and deleting projects, blog posts, services, certificates, and reviews.
- **☁️ Cloudinary Drag-and-Drop:** Intuitive image drop zone component interfacing directly with backend Cloudinary upload endpoints.
- **🎨 Glassmorphic Console Theme:** Lock-themed, hyper-responsive UI matching the portfolio's developer console aesthetic.
- **🔔 Interactive Toasts:** Immediate UI validation feedback powered by `Sonner` toasts.

---

## 🛠️ The Tech Stack

- **Framework:** `Next.js 16` (App Router) + `TypeScript` + `React 19`
- **Authentication:** `NextAuth.js v5` (Credentials Provider, JWT tokens)
- **UI & Styling:** Tailwind CSS v4 + Framer Motion v12 animations
- **Communication:** Axios HTTP client with interceptor configurations
- **Toasts:** Sonner
- **Icons:** Lucide React

---

## 🚀 Getting Started

### Installation
```bash
# Clone the repository and install dependencies
npm install
# or
bun install
```

### Environment Settings
Create a `.env.local` file inside the root of the `admin` folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
AUTH_SECRET=your_nextauth_signing_secret_key
AUTH_URL=http://localhost:3001
```
*Note: Make sure `AUTH_SECRET` matches your configuration and the backend server is running on the mapped API port.*

### Dev Mode
```bash
npm run dev
# or
bun dev
```
Open [http://localhost:3001](http://localhost:3001) in your browser to view the login dashboard.

### Production Build
```bash
npm run build
npm start
```

---

## 📂 Project Architecture

```
admin/src/
├── app/                  # Next.js App Router folders
│   ├── dashboard/        # Central metrics view and traffic chart analytics
│   ├── blog/             # Blog CRUD forms with Markdown inputs
│   ├── projects/         # Project details management panel
│   ├── reviews/          # Testimonial and invitation generator page
│   ├── settings/         # Site-wide bio text, profile avatar, and social links update
│   └── page.tsx          # Login page wrapper
├── components/           # Component library
│   ├── DashboardShell.tsx# Global layout frame, navbar, and auth logs
│   └── ImageUpload.tsx   # Drag & drop upload module to Cloudinary
├── lib/                  # Custom Axios client configurations & NextAuth handlers
└── tsconfig.json         # TypeScript configuration
```

---

## 📜 Custom License

This admin panel dashboard code is protected under the **Creative Practice License (CPL)**.
- You are permitted to download and compile this panel locally **for study, personal practice, and learning purposes only**.
- Deploying this admin interface online to claim authorship or hosting it for commercial portfolio solutions is strictly prohibited.

See the full terms in the [LICENSE](LICENSE) file.
