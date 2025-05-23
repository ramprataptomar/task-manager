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

- **Frontend:** React.js, Redux, CSS, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT, bcrypt

## 🏗️ Project Structure

```
/client         --> React frontend  
/server         --> Express backend  
  └── models    --> Mongoose schemas (User, Task)  
  └── routes    --> API routes (auth, tasks)  
  └── controllers --> Business logic  
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

- `POST /api/auth/register` – Register new user  
- `POST /api/auth/login` – User login  
- `GET /api/tasks` – Get all tasks (Admin only)  
- `POST /api/tasks` – Create and assign task (Admin only)  
- `PUT /api/tasks/:id` – Update task status or priority  
- `DELETE /api/tasks/:id` – Delete task (Admin only)  

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
