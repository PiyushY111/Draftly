# Repository Structure Guide

This document outlines the organization and structural standards of **Draftly**.

---

## 📁 Core Directory Tree

```
Draftly/
├── convex/                         # Convex Backend (Schema, Queries & Mutations)
│   ├── _documents/                 # Private document function implementations
│   ├── _folders/                   # Private folder function implementations
│   ├── _generated/                 # Convex auto-generated types
│   ├── documents.test.ts           # Vitest integration tests for documents
│   ├── documents.ts                # Main documents endpoint re-exports
│   ├── folders.ts                  # Main folders endpoint re-exports
│   └── schema.ts                   # Database schema definitions
├── src/
│   ├── app/                        # Next.js App Router (Page views & API routes)
│   ├── components/                 # Global shared components
│   │   ├── ui/                     # Sub-grouped Shadcn UI primitives
│   │   │   ├── buttons/
│   │   │   ├── carousels/
│   │   │   ├── containers/
│   │   │   ├── data-display/
│   │   │   ├── feedback/
│   │   │   ├── inputs/
│   │   │   └── index.ts            # Central re-export entry-point
│   │   └── confirm-dialog.tsx
│   ├── hooks/                      # Global custom React hooks
│   ├── lib/                        # Global utility libraries
│   ├── providers/                  # Context providers (Editor state, React Query)
│   └── modules/                    # Feature modules (Domain-driven design)
│       ├── home/                   # Home Dashboard & Landing feature
│       │   └── components/
│       │       ├── auth/
│       │       ├── dashboard/
│       │       ├── dialogs/
│       │       ├── documents/
│       │       ├── folders/
│       │       ├── landing/
│       │       └── templates/
│       ├── document/               # Collaborative Editor feature
│       │   ├── components/
│       │   │   ├── dialogs/
│       │   │   ├── editor/
│       │   │   ├── layout/
│       │   │   ├── revisions/
│       │   │   ├── tabs/
│       │   │   ├── toolbar/
│       │   │   └── voice/
│       │   ├── hooks/
│       │   └── lib/
│       └── room/                   # Liveblocks / Yjs room session module
```

---

## 🛠️ Folder Restructuring Strategy

### 1. UI Components (`src/components/ui/`)
All Shadcn UI files are grouped into 6 specific folders based on their UI roles. They are exported via `src/components/ui/index.ts`.
- **Consumer Imports**: Files outside of the UI folder import directly from `@/components/ui` (e.g., `import { Button, Input } from "@/components/ui"`).
- **Internal Imports**: UI components in subdirectories import relatively from each other to prevent circular dependencies.

### 2. Feature Modules (`src/modules/`)
Features are separated into self-contained modules (`home`, `document`, `room`):
- Components inside the modules are grouped into sub-categories (e.g., all dashboard components are under `home/components/dashboard/`).
- Local states and Event Handlers are extracted into local hooks (like `useVoiceWebRTC` or `useSmartChipData`) to keep markup files under the LOC limit.

### 3. Convex Backend (`convex/`)
- **Underscore Prefix (`_`)**: Convex ignores any subdirectory starting with an underscore (e.g., `convex/_documents/`). We place actual endpoint implementations in these folders.
- **Routing Hubs**: [documents.ts](file:///Users/piyush./Desktop/Projects/Draftly/convex/documents.ts) and [folders.ts](file:///Users/piyush./Desktop/Projects/Draftly/convex/folders.ts) re-export the implementations, presenting a clean public-facing API to the frontend (`api.documents.*`, `api.folders.*`) and preventing namespace conflicts.
