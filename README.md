### 📖 E-Library App with AI Reading Assistant
An AI-powered e-library where readers can search, share, and enjoy e-books with built-in translation, summarization, and content analysis. Supports multiple book versions and in-app PDF reading for a seamless reading experience.

### 🛠 Technologies Used
React, TailwindCSS, ShadCn, Redux, RTK Query, Node.js, Prisma, JWT, PostgreSQL, Redis, Docker, CI/CD, Google Cloud, and AWS S3.

### 🌐 Deployed Demo
Check out the live app here: [E-Library App](https://e-library-dashboard-fe-deployed.vercel.app/)

**Note:** The server deployed on Google Cloud run uses cold starts, so initial load may take a moment

### 📦 Current Features

| Feature | Description |
|---------|-------------|
| 📚 **Search & Share** | Upload books with multiple versions (illustrated, plain text, etc.) |
| 👁 **View Tracking** | Tracks views per version and total per book, with anti-spam measures via IP/user ID blacklisting in Redis with set time frame |
| 🤖 **AI Assistant** | Translate, summarize, and analyze selected text in real-time |
| 📄 **In-App PDF Reading** | Read e-books (PDF files) directly in the browser without leaving the app |

### 🚀 Future Features

| Feature | Description |
|---------|-------------|
| 📚 **Reading Progress Tracking** | Track users’ reading progress (page numbers) and allow statuses such as "reading," "saved," or "completed" |
| 💡 **Books Recommendations** | Use progress data and AI agents to recommend books available on the app |
| 🤖 **Enhanced AI Assistant** | Let users interact with the AI agent through chat or questionnaires to recommend trending books — even those not yet on the app |
| 📖 **Users As Authors** | Allow users to publish their own books by implementing a stricter Role-Based Access Control (RBAC) |

![AI-demo](./frontend/ai-demo.gif)
