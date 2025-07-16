# Slack Clone Frontend with Next.js

This is a modular, desktop-focused frontend built with Next.js. It supports real-time chat, workspace navigation, image/file upload, and global state management. The project is styled with Tailwind CSS and built with modern React tooling.

---

## 🛠 Tech Stack

- **TypeScript** – Strongly typed language for building scalable and maintainable code
- **Next.js** – React-based framework for building fast web apps
- **Tailwind CSS** – Utility-first CSS framework for rapid UI development
- **Shadcn UI** – Component library built on Radix UI + Tailwind
- **React Query** – Data fetching, caching, and syncing
- **Zustand** – Global state management with a minimal API
- **Socket.IO** – Real-time bidirectional communication
- **Bun** – Ultra-fast JavaScript/TypeScript runtime and package manager
- **ESLint + Husky** – Code quality and Git hook enforcement

## 🚀 Features

- 💬 **Real-Time Chat with Socket.IO**
  - Connects to FastAPI backend using WebSocket
  - Supports user, workspace, and channel rooms for real-time updates
  - Broadcasts messages, notifications, typing events

- 🖼 **Avatar & Logo Upload**
  - Users can upload their profile avatar
  - Workspaces support custom logo uploads
  - Uploads stored in S3 and rendered with public access URLs

- 📎 **(Coming Soon) Chat Image/File Upload**
  - Inline file/image message support to be added
  - Upload progress and preview pipeline planned

- 🧠 **Data & State Management**
  - React Query for async API communication
  - Zustand for lightweight global state (auth, UI state, socket)
  - Centralized query keys and API client structure


## ⚙️ Getting Started

### 1. Set up environment variables
Rename .env.dev to .env

### 2. Install Bun
Bun is used as the runtime, package manager, and script runner.

### 3. Install depencencies and run the project
```
bun install
bun run dev
```



## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details