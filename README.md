# 🌿 PulseStream — Personalized Content Aggregator & Dashboard

**PulseStream** is a modern, real-time personalized content aggregator built with **Next.js 16**, **TypeScript**, **Redux Toolkit**, and **Tailwind CSS**. It combines live headlines, cinema releases, and developer community discussions into a unified, customizable feed wrapped in a crisp **Emerald & White** design system.

---

## 🌟 Key Features

### 📡 100% Live Multi-Source API Aggregation
- **📰 Real Live News**: Powered by **NewsAPI** and **SpaceFlight News API** for real-time global news, technology headlines, and business updates.
- **🎬 Live Movies & Cinema**: Powered by **TMDB (The Movie Database API)** for trending movies, ratings, duration, director details, and posters.
- **💬 Live Community & Social**: Powered by **Dev.to API** for developer discussions, tech articles, user avatars, and reaction metrics.

### 🎨 Modern Green & White Design System
- **Emerald Aesthetic**: Vibrant light emerald accents (`#10b981`), crisp white cards, smooth glassmorphism, and dark/light theme switching.
- **Micro-Animations**: Framer Motion transitions, responsive hover states, and smooth drag-and-drop feedback.
- **Mobile Responsive**: Off-canvas mobile navigation drawer, responsive grid layouts, and touch-friendly controls.

### 🔍 Dynamic Filtering & Real-Time Search
- **Instant Search (`Cmd + K`)**: Debounced search input filtering title, description, tags, author, and content across all streams.
- **Category Chips**: Instant category filtering for *Technology*, *Business*, *Entertainment*, *Movies*, *Science*, *Gaming*, and *Design*.
- **Content Type Filter**: Toggle between *All*, *News*, *Movies*, and *Social Posts*.
- **Layout Switching**: Toggle between **Grid View** and **List View** with persisted preferences.

### 🎯 Customization & State Management
- **Redux Toolkit (RTK)**: Centralized state for UI controls, content filters, active tabs, user preferences, and bookmarks.
- **Drag-and-Drop Reordering**: Custom feed card ordering using `@hello-pangea/dnd`.
- **Bookmark / Favorites**: One-click bookmarking saved to `localStorage` for offline persistence.
- **Hydration-Safe SSR**: Built with hydration-safe components ensuring zero SSR mismatch errors.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 16** | App Router, Server Components, Route Handlers |
| **TypeScript** | Type-safe models, props, and API interfaces |
| **Redux Toolkit** | State management (UI, Preferences, Favorites) |
| **Tailwind CSS v4** | Modern utility-first styling |
| **Lucide React** | Clean SVG icon library |
| **Framer Motion** | Micro-interactions and smooth layout transitions |
| **@hello-pangea/dnd** | Drag-and-drop card reordering |

---

## 📁 Project Architecture

```text
allinone/
├── app/
│   ├── api/
│   │   └── feed/
│   │       └── route.ts            # Server-side feed aggregation route
│   ├── favorites/
│   │   └── page.tsx                # Saved bookmarks view
│   ├── settings/
│   │   └── page.tsx                # Preferences & interest settings
│   ├── globals.css                 # Global Emerald & White design tokens
│   ├── layout.tsx                  # Root layout with Redux Store Provider
│   └── page.tsx                    # Main Personalized Dashboard
├── src/
│   ├── components/
│   │   ├── dashboard/              # Header, Sidebar, Cards, Interest Chips, Modals
│   │   ├── feed/                   # SearchFilterBar, FeedGrid, FeedCard
│   │   └── ui/                     # Button, Input, Badge, FavoriteButton
│   ├── hooks/                      # Custom hooks (useDebounce, useMediaQuery)
│   ├── lib/                        # API Services (newsService, tmdbService, socialService)
│   ├── store/                      # Redux Store configuration & Slices
│   ├── types/                      # TypeScript interfaces (ContentItem, NewsItem, MovieItem)
│   └── data/                       # Mock data fallbacks
├── .env.local                      # Server-side API key configuration
└── README.md                       # Documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Node.js 18+** installed on your system.

### 2. Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/pulsesream-dashboard.git
cd pulsesream-dashboard
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:

```env
# Server-side environment variables ONLY.
# NEVER prefix with NEXT_PUBLIC_ to prevent browser key leaks.

NEWS_API_KEY=your_news_api_key_here
TMDB_API_KEY=your_tmdb_api_key_here
```

> **Note**: You can obtain free API keys from [NewsAPI.org](https://newsapi.org) and [The Movie Database (TMDB)](https://www.themoviedb.org/documentation/api).

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Production Build & Type Check

To compile and verify TypeScript type safety and build the production bundle:

```bash
# Type check
npx tsc --noEmit

# Production build
npm run build

# Start production server
npm run start
```

---

## 📡 Server API Endpoint

### `GET /api/feed`
Aggregates live news, movies, and social posts into a unified sorted stream.

**Query Parameters:**
- `query` *(string)*: Search keyword (e.g. `quantum`, `elden ring`)
- `category` *(string)*: Filter category (`all`, `technology`, `movies`, `science`, etc.)
- `type` *(string)*: Content type (`all`, `news`, `movie`, `social`)
- `trending` *(boolean)*: Filter trending items only (`true`/`false`)
- `page` *(number)*: Page number for pagination
- `pageSize` *(number)*: Items per page (default: 20)

**Response Format:**
```json
{
  "items": [
    {
      "id": "movie-12345",
      "type": "movie",
      "title": "Inception",
      "description": "A thief who steals corporate secrets through the use of dream-sharing technology...",
      "image": "https://image.tmdb.org/t/p/w500/...",
      "category": "movies",
      "url": "https://www.themoviedb.org/movie/12345",
      "author": { "name": "Christopher Nolan" },
      "publishedAt": "2010-07-16T00:00:00.000Z",
      "rating": 8.8,
      "isFavorite": false,
      "isTrending": true,
      "tags": ["Cinema", "Film", "Movies"],
      "movieDetails": { "director": "Christopher Nolan", "year": 2010, "rating": 8.8 }
    }
  ],
  "total": 45,
  "page": 1
}
```

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
