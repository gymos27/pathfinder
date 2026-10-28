# 🧭 PathFinder — AI Career & Skills Navigator

> **Hackathon Edition** • Theme: *Career & Skills Navigator*  
> Built with Next.js 16 (App Router), TypeScript, Tailwind CSS, Google Gemini AI (`gemini-3.8-flash`), and Supabase.

---

## 🌟 Overview

Most online tech roadmaps give learners overwhelming, static checklists that fail to account for what they already know or how much time they actually have.

**PathFinder** turns ambiguous tech career goals into **personalized, weekly action plans**. By auditing your background, filtering out skills you already possess, and factoring in your weekly availability (5 to 40 hours/week), PathFinder generates a bespoke week-by-week curricular path with milestone capstones, interactive progress tracking, and an integrated Gemini AI career acceleration suite.

---

## ✨ Key Features

### 1. Dual Persona Onboarding (Student vs. Working Professional)
- **Student Track**: Focuses on target goal (First Tech Job, Internship, Capstones), current skill tags, skill level (Beginner/Intermediate/Advanced), and weekly availability.
- **Working Professional Track**: Tailored for career switchers and upskillers. Collects current role, target role, years of experience, existing competencies, and weekly commitment.

### 2. Fast-Track Algorithmic Scheduling Engine
- **Intelligent Filtering**: Automatically detects and skips skills you've already registered as known.
- **Level-Based Staging**: Automatically fast-tracks intermediate/advanced users directly to Stage 2 or Stage 3.
- **Weekly Hour Balancing**: Dynamically divides remaining core skills and milestone projects across realistic weekly modules based on your commitment pace.

### 3. Comprehensive Domain Curricula
Detailed stage-by-stage roadmaps, skills, and suggested capstone projects for **6 High-Demand Domains**:
- 🌐 **Web Development**: Full-stack Next.js, TypeScript, REST & GraphQL APIs, microservices, testing.
- 📊 **Data Science**: Python, SQL, exploratory data analysis, statistical modeling, machine learning.
- 🧠 **AI & Machine Learning**: PyTorch, deep neural networks, Transformers, LLM orchestration, Agentic systems.
- 🛡️ **Cybersecurity**: Network defense, ethical hacking, SOC monitoring, cryptography, cloud security.
- ☁️ **Cloud & DevOps**: Linux, Docker, Kubernetes, CI/CD pipelines, Terraform, multi-cloud architecture.
- 🎨 **UI/UX Design**: Design thinking, Figma prototyping, component systems, user research, accessibility.

### 4. Full Gemini AI Career Acceleration Suite
All AI tools return strictly structured JSON schemas rendered as high-contrast cards:
- ⚡ **Skill-Gap Analyzer**: Evaluates current skills against target industry roles, generates a 0-100% readiness score, identifies critical must-haves, and drafts a 3-phase ramp-up plan.
- 📄 **Resume Evaluator & STAR Rewriter**: Analyzes resume text against ATS standards, highlights missing keywords, and rewrites bullet points into quantified Situation-Task-Action-Result format.
- 🎙️ **Live 1-on-1 Mock Interview**: Interactive interview session one question at a time with instant feedback, scoring (1-10), answer breakdowns, and senior-level sample responses.

### 5. Backend & Authentication
- **Supabase Integration**: Secure email/password authentication and profile persistence.
- **Instant Demo Mode**: One-click demo accounts for hackathon judges with zero manual configuration required.
- **Local Fallback**: Full offline localStorage state synchronization for progress checklists and active streaks.

### 6. Design System
- **Luxury Black & White Glossy Aesthetics**: Apple/Vercel-inspired specular glassmorphism, obsidian blacks, chrome borders, and a liquid silver glowing progress bar.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language**: TypeScript 5
- **Styling**: Vanilla CSS & Tailwind CSS (Custom Specular Glassmorphism)
- **AI Engine**: Google Gemini API (`@google/genai` with `gemini-3.8-flash`)
- **Backend / Auth**: [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Visuals**: Canvas Confetti

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/gymos27/pathfinder.git
cd pathfinder
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your API credentials in `.env.local`:
```env
# Gemini API Key (Get free from https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Auth & Database (From https://supabase.com Project Settings -> API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. (Optional) Database Setup
If using Supabase, execute `supabase_schema.sql` in the **Supabase SQL Editor** to create the `profiles` table, Row Level Security policies, and the user creation trigger.

### 5. Run the development server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view PathFinder.

---

## 📂 Project Structure

```
├── data/
│   └── domains.json              # 6 structured domains, stages, skills, projects
├── src/
│   ├── app/
│   │   ├── ai-tools/             # Gemini AI Suite (Skill-Gap, Resume, Mock Interview)
│   │   ├── api/ai/               # Server-side Gemini API route handlers
│   │   ├── domains/              # Domain catalog & dynamic [slug] roadmaps
│   │   ├── login/ & signup/      # Supabase authentication screens
│   │   ├── my-path/              # Personalized interactive roadmap & checklist
│   │   ├── onboarding/           # Dual-track (Student/Pro) intake wizard
│   │   ├── globals.css           # Luxury glossy monochrome design system
│   │   └── layout.tsx            # Global metadata & AuthProvider
│   ├── components/               # Navbar, Footer, TagInput, Timeline, AI Cards
│   ├── context/                  # AuthContext with Supabase & demo fallback
│   ├── lib/
│   │   ├── gemini.ts             # Multi-model Gemini client & JSON parser
│   │   ├── roadmapGenerator.ts   # Fast-track algorithmic weekly scheduler
│   │   ├── storage.ts            # LocalStorage persistence & streak tracker
│   │   └── supabase/client.ts    # Supabase browser client
│   └── types/                    # Domain, UserProfile, and Roadmap interfaces
└── supabase_schema.sql           # Database schema, RLS, and auth trigger
```

---

## 📄 License

MIT License. Designed & developed for the Career & Skills Navigator Hackathon.
