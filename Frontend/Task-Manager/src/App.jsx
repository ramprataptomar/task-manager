import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';

// Admin and User routes
import PrivateRoute from './routes/PrivateRoute';
import Dashboard from './pages/admin/Dashboard';
import ManageTasks from './pages/admin/ManageTasks';
import CreateTask from './pages/admin/CreateTask';
import ManageUsers from './pages/admin/ManageUsers';

// User routes
import UserDashboard from './pages/user/UserDashboard';
import MyTasks from './pages/user/MyTasks';
import ViewTaskDetails from './pages/user/ViewTaskDetails';


const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/signup' element={<SignUp/>}></Route>

          {/* admin Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path='/admin/dashboard' element={<Dashboard/>}></Route>
            <Route path='/admin/tasks' element={<ManageTasks/>}></Route>
            <Route path='/admin/create-task' element={<CreateTask/>}></Route>
            <Route path='/admin/users' element={<ManageUsers/>}></Route>
          </Route>

          {/* User Routes */}
          <Route element={<PrivateRoute allowedRoles={["user"]} />}>
            <Route path='/user/dashboard' element={<UserDashboard/>}></Route>
            <Route path='/user/tasks' element={<MyTasks/>}></Route>
            <Route path='/user/tasks-details/:id' element={<ViewTaskDetails/>}></Route>
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App
