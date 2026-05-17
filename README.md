# Salahuddin's Portfolio — Admin Panel

A full-featured admin dashboard built with **Next.js 16** and **NextAuth.js**. Manage blog posts, projects, services, reviews, certificates, site settings, and more.

## Tech Stack

- **Framework:** Next.js 16 (App Router) with TypeScript
- **Auth:** NextAuth.js v5 (JWT)
- **UI:** React, Tailwind CSS v4, Framer Motion
- **HTTP:** Axios
- **Toasts:** Sonner
- **Icons:** Lucide React

## Getting Started

```bash
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
AUTH_SECRET=your_auth_secret
AUTH_URL=http://localhost:3001
```

```bash
npm run dev
```

The admin panel runs on [http://localhost:3001](http://localhost:3001).

## Features

- **Dashboard** — Overview and quick stats
- **Blog** — Create, edit, delete posts with image upload
- **Projects** — Manage portfolio projects
- **Services** — Update service offerings
- **Reviews** — Manage client testimonials
- **Certificates** — Upload and organize certificates
- **Timeline** — Edit experience timeline
- **Settings** — Site-wide settings (bio, socials, contact info)

## Build

```bash
npm run build
npm start
```

## License

MIT — see [LICENSE](LICENSE).
