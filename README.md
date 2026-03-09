# 🚀 LMS by TLE Terminator: The Future of Interactive STEM Learning

**Tagline:** *Stop reading about science. Start experiencing it. Explore. Experiment. Dominate.*

---

## 🌐 Live Demo

🚀 **Deployed Website:**  
👉 https://lmsbytle.codes

---

## 🌟 The Vision

Traditional digital education is broken. It relies on passive video lectures, static PDFs, and generic chatbots that don't know the curriculum. **LMS by TLE Terminator changes the game.** 

We have built a comprehensive, gamified, and hyper-intelligent ecosystem that bridges the gap between theoretical studying and hands-on, interactive mastery. We don't just host courses; we track how students feel, let them battle in live quizzes, simulate volatile chemical reactions safely, map out their futures, and give them a 24/7 AI tutor that actually knows their syllabus.

**We don't just digitize a textbook; we completely reimagine the educational feedback loop.**

---

## 🎮 Interactive Feature Walkthrough: Step Inside the Platform

### 1. 🎯 The Gamified Quiz Arena (The "Hit List")

**Imagine the satisfaction of crossing items off a to-do list, weaponized for learning.**

* **Dynamic Problem Tracking:** We ditched boring exam layouts. As you solve Math or Science problems correctly, the question instantly flashes green, is marked as "Done," and visually slides to the bottom of the list.
* **Filter by Mastery:** Toggle seamlessly between "Pending" to see your current targets, or "Completed" to bask in your progress.
* **Rich Media Integration:** Complex problems feature uploaded diagrams and images, rendering flawlessly right inside the question card.

### 2. 🧪 Virtual Experiment Labs

**No lab access? No safety goggles? No problem.**

* **Step-by-Step Simulations:** Step into the digital lab. Execute real-world Physics and Chemistry experiments by checking off sequential safety and execution steps.
* **Live Variables & Observation Logs:** Track your Independent and Dependent variables in real-time. Use the built-in digital notepad to log your hypotheses and final results securely to the database.

### 3. 🧠 The Context-Aware AI Tutor & Summarizer (RAG-Powered)

**Stuck on a concept at 2:00 AM? Your personal genius is awake.**

* **Syllabus-Specific:** Unlike standard AI, our AWS Bedrock (Llama 3) AI Tutor is powered by Retrieval-Augmented Generation (RAG). It knows your exact lecture notes and PDFs.
* **Smart Lecture Summarizer:** Don't have time to re-watch a 2-hour lecture? The AI instantly processes audio/video transcripts and generates bite-sized, high-yield summaries and key takeaways on demand.
* **Mock Interviews & Exams:** Ask the AI to test you! It can dynamically generate multiple-choice questions, full-length practice exams, and conduct simulated interviews based strictly on the course material.

### 4. 👁️ AI Attention & Stress Engine (Computer Vision)

**Are students actually learning, or are they silently burning out?**

* **Real-Time Webcam Analytics:** During live lectures, our standalone Python/Flask microservice uses OpenCV and MediaPipe to track 468 facial landmarks.
* **Focus & Stress Metrics:** It calculates head-pose, gaze direction, and facial micro-expressions to generate a real-time "Attention & Stress Score." Educators get a dashboard showing exactly when the class was highly focused, and when they started getting confused.

### 5. ⚔️ Live Multiplayer "Student Arena" (Socket.io)

**Learning meets Esport.**

* **Real-Time Battles:** Enter a room code and join a synchronous, live-streamed quiz hosted by your educator.
* **Live Leaderboards:** Watch your XP update in real-time as you answer questions faster than your peers.
* **Class Stats Graph:** After every question, a beautiful animated bar chart reveals how the entire class voted, giving instant feedback on common misconceptions.

### 6. 🗺️ Intelligent Flowchart Studio & 3D Models

**Visualize the invisible.**

* **AI Flowchart Generator:** For Computer Science students, mapping logic can be tedious. Type a prompt, and our AI instantly generates a fully editable, visual flowchart mapped out on a digital whiteboard (tldraw integration).
* **3D STEM Models:** Interact with high-fidelity, 360-degree manipulatable 3D models to study complex biological cells or physics structures.

### 7. 🧭 AI Career Architect & Smart Scheduler

**Your personal guidance counselor and time-management guru.**

* **Profile-Based Career Path Generator:** The platform analyzes your quiz scores, completed labs, enrolled courses, and overall profile to dynamically map out a personalized career trajectory. It shows you exactly which skills and projects you need to conquer next to land your dream tech role.
* **AI Timetable Generator:** Say goodbye to procrastination. The AI automatically generates an optimized, personalized study schedule, balancing your coursework, upcoming live classes, and free time to keep you on track without burning out.

### 8. 🏫 The Ultimate LMS Core

**A powerhouse for educators and administrators.**

* **Course & Community Hub:** Full support for free and paid courses (via Razorpay). Students can engage in course-specific WebSocket community chats featuring a Reddit-style upvote/downvote system for the best questions.
* **Live Video Lectures:** Seamless live streaming integrated with Stream.io SDK.
* **Educator God-Mode:** Hidden UI modals allow teachers to instantly build labs, upload Cloudinary images, deploy quizzes, and monitor granular student analytics without touching a single line of code.

---

## 🎯 Complete Feature List

### 👩‍🏫 Course & Lecture Management

* Create and manage courses and curriculum
* Upload video lectures, audio, and PDF notes
* Support for free and paid courses (Razorpay integration)
* Course-specific community chat with upvote/downvote system
* Rich media support via Cloudinary CDN

### 🎥 Live Lecture System

* Real-time live class support with Stream.io SDK
* Low-latency interaction design
* Integrated with attention tracking
* Live quiz arena during lectures

### 👀 Attention & Stress Engine

* Computer vision-based microservice for analyzing student attentiveness
* Processes webcam frames via API in real time
* Tracks 468 facial landmarks using MediaPipe
* Computes face presence, head pose, and gaze direction confidence
* Generates real-time attention and stress scores
* Dashboard for educators to monitor engagement
* Identifies attention drops and confusion moments

### 📝 Quizzes & Assessments

* Gamified quiz interface with dynamic problem tracking
* Questions flash green when solved correctly
* Filter by "Pending" or "Completed" status
* Rich media integration (diagrams, images)
* Track student attempts and scores
* Live multiplayer quiz arena with real-time leaderboards
* Class statistics graphs after each question

### 🧪 STEM Learning Module

* **Virtual Experiment Labs:** Step-by-step Physics and Chemistry simulations
* **Interactive Quizzes:** STEM-specific assessments
* **Live Variables Tracking:** Monitor independent and dependent variables
* **Digital Lab Notebook:** Log hypotheses and results
* **3D Models:** 360-degree manipulatable models for biology and physics
* **AI-Powered Doubt Resolution:** Ask any STEM question
* Separate frontend (Port 3000) and backend services for modularity

### 💬 Course Community Chat

* Course-specific discussion channels
* Real-time messaging via WebSockets (Socket.IO)
* Reddit-style upvote/downvote system
* Message relevance and moderation
* Community engagement tracking

### 🤖 AI Course Tutor (RAG-Powered)

* **Syllabus-Specific Intelligence:** AWS Bedrock (Llama 3) with RAG
* **Context-Aware Responses:** Knows your exact lecture notes and PDFs
* **Embedding-Based Retrieval:** Searches through course materials
* **Independent Chat History:** Per-student conversation tracking
* **Mock Interviews & Exams:** Dynamically generates practice questions
* **24/7 Availability:** Always ready to help

### 🧠 AI Summary Generator

* Automatically creates concise, structured summaries per lecture
* Processes audio/video transcripts
* Generates bite-sized, high-yield summaries
* Stores summaries lecture-wise for quick revision
* Zero manual effort for teachers

### 🗺️ AI Flowchart Studio

* Type a prompt to generate visual flowcharts
* Fully editable digital whiteboard (tldraw integration)
* Perfect for Computer Science logic mapping
* AI-powered diagram generation

### 🧭 AI Career Architect

* Analyzes quiz scores, completed labs, and enrolled courses
* Dynamically maps personalized career trajectories
* Shows required skills and projects for dream roles
* Profile-based recommendations

### 📅 AI Smart Scheduler

* Automatically generates optimized study schedules
* Balances coursework, live classes, and free time
* Prevents burnout with intelligent time management
* Personalized timetable generation

### 📊 Analytics & Insights

* Granular student analytics for educators
* Engagement and completion tracking
* Performance metrics and trends
* Attention and stress monitoring dashboards
* Class-wide statistics and insights

---

## 🛠️ The "Secret Sauce" (Architecture & Tech Stack)

We engineered this platform to be **lightning-fast, highly concurrent, and scalable**, deploying it entirely on an **AWS EC2 instance**.

### The Frontend
* **React 19 + Vite** - Blazing fast development and build times
* **Tailwind CSS** - Utility-first styling for premium UI
* **Framer Motion** - Buttery-smooth animations
* **Redux Toolkit** - Immaculate state management
* **Two Separate Frontends:**
  * Main LMS (Port 5173) - Dashboard, courses, quizzes, analytics
  * STEM Frontend (Port 3000) - Interactive experiments, 3D models

### The Backend Engine
* **Node.js + Express** - Robust server running on port 8000
* **MongoDB Atlas** - Highly scalable cloud database
* **Socket.IO** - Bi-directional real-time communication
* **RESTful APIs** - Clean, organized route structure
* **Comprehensive Collections:**
  * Core: Users, Courses, Lectures, Orders, Reviews, Media
  * Quiz: Quiz, QuizResult, LiveQuizResult
  * AI: AIEmbedding, AICourseChat, LectureAnalytics
  * STEM: StemTopic, StemProblem, StemExperiment, StemProgress
  * Communication: CourseChat, LiveLecture, Flowchart

### Real-Time Traffic
* **Socket.IO** handles:
  * Course community chat with upvote/downvote
  * Live Quiz Arena with real-time leaderboards
  * Real-time messaging and notifications

### The AI Brain
* **AWS Bedrock (Llama 3)** - Heavy generative lifting:
  * RAG-powered course tutor
  * Lecture summaries
  * Career path mapping
  * Flowchart generation
  * Mock interviews and exams
* **Embedding Storage** - MongoDB for vector search
* **Context-Aware Retrieval** - Knows your exact syllabus

### The Attention Engine
* **Python + Flask** - Dedicated microservice (Port 7001)
* **OpenCV + MediaPipe** - 468 facial landmark tracking
* **Real-Time CV Processing:**
  * Face detection (TFLite Model)
  * Gaze direction analysis
  * Head pose estimation
  * Attention score aggregation
  * Stress level detection
* **Flow:** Webcam → Engine → Metrics → MongoDB

### The Gatekeeper
* **NGINX Reverse Proxy** - Running on AWS EC2
* **Elegant Routing:**
  * UI asset requests → Frontend services
  * API traffic → Backend (Port 8000)
  * WebSocket traffic → Socket.IO
  * Attention API → Python microservice (Port 7001)

### Media & Payments
* **Cloudinary CDN** - Media storage and delivery
* **Razorpay** - Payment gateway for paid courses
* **Stream.io SDK** - Live video streaming
* **Nodemailer** - Email service
* **FFmpeg** - Audio/video processing for summaries

---

## 📦 Tech Stack Summary

| Layer              | Technology                                    |
| ------------------ | --------------------------------------------- |
| **Frontend**       | React 19, Vite, Tailwind CSS, Framer Motion, Redux Toolkit |
| **Backend**        | Node.js, Express 5, Socket.IO                 |
| **Database**       | MongoDB Atlas (Cloud)                         |
| **Real-Time**      | Socket.IO (WebSocket)                         |
| **AI**             | AWS Bedrock (Llama 3), RAG, Embeddings        |
| **CV Engine**      | Python, Flask, OpenCV, MediaPipe, TFLite      |
| **Media**          | Cloudinary CDN, FFmpeg                        |
| **Payments**       | Razorpay                                      |
| **Live Streaming** | Stream.io SDK                                 |
| **Proxy**          | NGINX (AWS EC2)                               |
| **Email**          | Nodemailer                                    |
| **Deployment**     | AWS EC2, Vercel (Frontend)                    |

---

## ⚙️ Installation (Local Setup)

> Tested locally for development. Adjust ports and environment variables for production deployments.

### 1. Clone the repository

```bash
git clone https://github.com/Prasoon52/lms-by-tle-terminator.git
cd lms-by-tle-terminator
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env # Create your own .env and add required secrets
npm install
npm run dev
```

> backend will typically runs on port `8000` depending on configuration.

### 3. Frontend setup

```bash
cd ../frontend
cp .env.example .env # Create your own .env and add required secrets
npm install
npm run dev
```

> LMS frontend dev server typically runs on `localhost:5173` and STEM frontend on `localhost:3000`.

### 4. Attention Engine (Optional setup for focusing monitoring)

```bash
cd Attention_Engine
python3 -m venv venv # On Windows use `python -m venv venv`
source venv/bin/activate # On Windows use `venv\Scripts\activate`

cd ../attention_engine
pip install -r requirements.txt
python app.py
```

> Attention Engine runs as a separate microservice (Flask). Configure frontend/backend to call the attention API endpoint when enabled.

### 5. Stem Learning Module
<!-- - Backend Setup

```bash
cd ../stem-backend
cp .env.example .env # Create your own .env and add required secrets
npm install
npm run dev
```
> STEM backend will typically runs on port `5001` depending on configuration. -->

- Frontend Setup

```bash
cd ../stem-frontend
cp .env.example .env # Create your own .env and add required secrets
npm install
npm run dev
```

> STEM frontend dev server typically runs on `localhost:3000`.

---

## Run Using DOCKER

```bash
  docker compose up --build
```

## 🔐 Environment Variables

Make sure you create `.env` files for backend and frontend as required.

- .env.example files are provided as templates.
- Fill in your own API keys, database URIs, and secrets.


**Do not commit `.env` files or secrets to version control.**


---

## 🏆 The Impact

**LMS by TLE Terminator** doesn't just digitize a textbook; it completely reimagines the educational feedback loop. By combining:

* **Psychological Momentum** - Gamified quizzes and live battles
* **Psychological Safety** - AI tutors and stress tracking
* **Tailored Career Guidance** - AI-powered career architect
* **Hands-On Simulation** - Virtual labs and 3D models
* **Real-Time Engagement** - Attention tracking and live analytics
* **Intelligent Scheduling** - AI-powered time management

We are delivering an education platform built exclusively for the **modern achiever**.

---

## 📈 Scalability & Extensibility

* **Microservice-Friendly Architecture** - AI layer and Attention Engine scale independently
* **Designed for Thousands** - Supports multiple institutions and users
* **Production-Ready** - Clear path to multi-tenant isolation, monitoring, and autoscaling
* **Suitable for State/District-Level Deployments** - Enterprise-grade architecture
* **Modular Design** - Easy to add new features and integrations

---

## 🏆 Hackathon Readiness

This project demonstrates:

* Real‑world problem solving
* Full‑stack engineering & integrations
* Practical AI usage (embeddings + contextual retrieval)
* Scalable system design with a clear path to production

---

## 👥 Team

Built by **TLE Terminator** — focused on impact, usability, and system‑level thinking.

---

## 📌 Future Enhancements

* Teacher analytics dashboard (engagement, completion, performance)
* Offline-first mobile app (iOS & Android)
* Parent & mentor views with progress tracking
* Automated attendance & engagement insights
* Integration with government education systems
* Advanced proctoring features for online exams
* Blockchain-based certification system
* AR/VR integration for immersive learning experiences 

---



## 👨‍💻 Team Members (Contributors)

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Prasoon52">
        <img src="https://github.com/Prasoon52.png" width="100" style="border-radius:50%" /><br />
        <b>Prasson Patel</b>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/AbhinavNeema">
        <img src="https://github.com/AbhinavNeema.png" width="100" style="border-radius:50%" /><br />
        <b>Abhinav Neema</b>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/pranavpanmand">
        <img src="https://github.com/pranavpanmand.png" width="100" style="border-radius:50%" /><br />
        <b>Pranav</b>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/abhas20">
        <img src="https://github.com/abhas20.png" width="100" style="border-radius:50%" /><br />
        <b>Abhas Nath</b>
      </a>
    </td>
  </tr>
</table>


---

