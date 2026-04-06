import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import Landing from './landing/Landing';
import Login from './auth/Login';
import Register from './auth/Register';
import Layout from './layout/Layout';
import Dashboard from './dashboard/Dashboard';
import Projects from './project/Projects';
import ProjectDetails from './project/ProjectDetails';
import TaskDetails from './task/TaskDetails';
import TeamManagement from './team/TeamManagement';
import Analytics from './analytics/Analytics';
import Notifications from './notifications/Notifications';
import Profile from './profile/Profile';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/task/:id" element={<TaskDetails />} />
            <Route path="/team" element={<TeamManagement />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;
