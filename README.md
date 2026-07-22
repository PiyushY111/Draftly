# 📄 Draftly

Draftly is a premium, real-time collaborative document workspace designed for modern productive teams. Built with a focus on speed, nested organization, and seamless co-authoring, it offers a clean, distraction-free environment to write, comment, snap version history, and manage shared organization spaces.

---

## ✨ Features

### 🤝 Real-Time Collaboration & Presence
*   **Live Co-Authoring**: Write together simultaneously with absolute consistency and near-zero latency.
*   **Presence Awareness**: Watch team members' blinking cursors, text selections, and user labels in real-time.
*   **Distraction-Free Typing**: Clean page aesthetics with no intrusive text underlines or co-author writing highlights.

### 📜 Auto-Save Version History & Time Travel
*   **Background Snaps**: Edits are captured automatically in the background, debounced after 10 seconds of inactivity (rate-limited to once a minute).
*   **Time-Travel Previews**: Open the Version History panel to view past revisions in read-only preview mode.
*   **One-Click Restore**: Restore any past document snapshot collaboratively for the entire workspace.

### 🗂️ Nested Doc Tabs
*   **Structured Organization**: Create sub-documents and nested files directly inside the left panel.
*   **Instant Switcher**: Swap between child documentation tabs without leaving the page.

### 💭 Comments, Threads, & Notifications
*   **Inline Discussions**: Select any text range to start comment threads or tag colleagues.
*   **Resolution Triggers**: Mark discussions as resolved or reopen them when needed.
*   **In-App Inbox Alerts**: Access the notification bell on your main dashboard to track shared document alerts.

### 🏢 Workspaces & Organization Switcher
*   **Clerk Organization Management**: Partition documents under personal lists or client/team organizations.
*   **Seamless Switching**: Swap directories dynamically from your dashboard.

### 📑 Templates & Export Utilities
*   **Formatting Templates**: Start writing faster with resumes, proposals, cover letters, and standard briefs.
*   **Multi-Format Export**: Download documents instantly as **PDF (via Print)**, **HTML**, **JSON**, or **Plain Text**.

---

## 🛠️ Tech Stack & Architecture

*   **Next.js 15 (App Router)**: Framework powering pages, layouts, routing, and dynamic server-rendered pages.
*   **Convex**: Reactive backend database feeding real-time updates directly to clients over active WebSockets.
*   **Liveblocks**: Collaborative infrastructure powering Y.js synced text states, cursors, comments, and alerts.
*   **Clerk**: Handles user authentication, organizations, and security directory integration.
*   **Tiptap Editor**: Headless rich text engine customized with resizable tables, image handling, smart chips, and margins.
*   **Tailwind CSS & Shadcn UI**: Styling and accessible Radix UI component library.

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/PiyushY111/Draftly.git
cd Draftly
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Environment Variables
Create a `.env.local` file in the root directory:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Convex Database
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url

# Liveblocks Collaboration
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=your_liveblocks_public_key
LIVEBLOCKS_SECRET_KEY=your_liveblocks_secret_key
```

### 4. Run Development Servers
Start the Convex database listener:
```bash
npx convex dev
```

In a separate terminal, start the Next.js local development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view your workspace.
