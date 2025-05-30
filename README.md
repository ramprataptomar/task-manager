# Task Manager

A full-stack web application that allows users and admins to manage tasks efficiently with role-based access, real-time updates, and task tracking features such as status and priority levels.

## 🚀 Features

- 🔐 **Authentication & Authorization** using JWT
- 👥 **Role Management** (Admin and User)
- ✅ **Create, Assign, and Track Tasks**
- 📊 **Status & Priority Tracking** (To Do, In Progress, Done | Low, Medium, High)
- 🔄 **Real-time UI Updates** using Redux
- 🎯 **Dashboard with Filters** by status and priority

## 🧑‍💻 Tech Stack

- **Frontend:** React.js, Tailwind CSS, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT, bcrypt

## 🏗️ Project Structure

```
TASK MANAGER/
├── frontend/task-manager/       # React frontend
│   ├── public/                  # Static files and index.html
│   ├── src/                     # React source code
│   │   ├── assets/              # Images, icons, etc.
│   │   ├── components/          # Reusable UI components
│   │   ├── contexts/            # Context API providers
│   │   ├── hooks/               # Custom React hooks
│   │   ├── pages/               # Page components (Dashboard, Login, etc.)
│   │   ├── routes/              # React Router definitions
│   │   ├── utils/               # Helper utilities and constants
│   │   ├── App.jsx              # Root component
│   │   ├── index.css            # Global styles
│   │   └── main.jsx             # Entry point
│   ├── index.html               # Main HTML template
│   ├── package.json             # Frontend dependencies
│   ├── package-lock.json        # Frontend lock file
│   └── eslint.config.js         # ESLint configuration
│
├── backend/                     # Express backend
│   ├── config/                  # DB config and constants
│   ├── controllers/             # Route handlers and business logic
│   ├── middlewares/             # Auth middleware, error handling, etc.
│   ├── models/                  # Mongoose schemas (User, Task)
│   ├── routes/                  # API routes (auth, users, tasks)
│   ├── uploads/                 # Uploaded images/files
│   ├── .env                     # Environment variables
│   ├── server.js                # Entry point for backend server
│   ├── package.json             # Backend dependencies
│   └── package-lock.json        # Backend lock file
│
├── .gitignore                   # Ignore files from uploading to GitHub
└── README.md                    # Project documentation
```

## ⚙️ Setup Instructions

### 📦 Backend (Node.js + Express)

```bash
cd server
npm install
npm start
```

### 🌐 Frontend (React.js)

```bash
cd client
npm install
npm start
```


## 🌐 API Endpoints

### 🔐 Authentication

* `POST /api/auth/register` – Register a new user (Admin or Member)
* `POST /api/auth/login` – Authenticate user & return JWT token
* `GET /api/auth/profile` – Get logged-in user profile details

### 👤 User Management

* `GET /api/users` – Get all users (Admin only)
* `GET /api/users/:id` – Get user by ID
* `POST /api/users` – Create a new user (Admin only)
* `PUT /api/users/:id` – Update user details
* `DELETE /api/users/:id` – Delete a user

### ✅ Task Management

* `GET /api/tasks` – Get all tasks (Admin: all tasks, User: assigned tasks)
* `GET /api/tasks/:id` – Get task by ID
* `POST /api/tasks` – Create and assign a new task (Admin only)
* `PUT /api/tasks/:id` – Update task details (status, priority, etc.)
* `DELETE /api/tasks/:id` – Delete a task (Admin only)
* `PUT /api/tasks/:id/status` – Update only task status
* `PUT /api/tasks/:id/todo` – Update checklist status of a task
* `GET /api/tasks/dashboard-data` – Get dashboard overview (Admin)
* `GET /api/tasks/user-dashboard-data` – Get dashboard data for logged-in user

### 📊 Reports

* `GET /api/report/export/tasks` – Download all tasks as Excel
* `GET /api/report/export/users` – Download user-task report as Excel

### 🖼️ Image

* `POST /api/auth/upload-image` – Upload profile or task-related image

## 🔐 Roles and Permissions

| Feature                | Admin | User |
|------------------------|:-----:|:----:|
| Create Task            | ✅    | ❌   |
| Assign Task            | ✅    | ❌   |
| View Assigned Tasks    | ✅    | ✅   |
| Update Task Status     | ✅    | ✅   |
| Delete Task            | ✅    | ❌   |


## 📌 Future Improvements

- Email notifications  
- Due dates and reminders  
- Drag-and-drop task management  
- Dark mode toggle  

---

Made with ❤️ using the MERN stack.
