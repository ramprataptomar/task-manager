import React, { useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";

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

import UserProvider, { UserContext } from './contexts/userContext';
import { Toaster } from 'react-hot-toast';


const App = () => {
  return (
    <UserProvider>
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

            {/* Default Routes */}
            <Route path='/' element={<Root/>}></Route>
          </Routes>
        </Router>
      </div>

      <Toaster
        toastOptions={{
          className: '',
          style: {
            fontSize: '14px',
          }
        }}
      />
    </UserProvider>
  )
}

export default App


const Root = () => {
  const { user, loading } = useContext(UserContext);

  if(loading) return <Outlet/>;

  if(!user) return <Navigate to="/login"/>;

  return (user.role === "admin") ? <Navigate to="/admin/dashboard"/> : <Navigate to="/user/dashboard"/>;
}