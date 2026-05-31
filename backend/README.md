# Unlife Dashboard Backend

Simple Node/Express backend for the Unlife Dashboard frontend.

Quick start (Windows PowerShell):

1. Install dependencies

```powershell
cd backend
npm install
```

2. Run MongoDB locally (e.g., via Docker or installed MongoDB)

3. Start the server

```powershell
npm run dev
```

Default server URL: `http://localhost:4000` and API base `http://localhost:4000/api`.

Environment variables (optional): create a `.env` file with:

```
MONGO_URI=mongodb://127.0.0.1:27017/unlife
JWT_SECRET=your_secret_here
PORT=4000
```
