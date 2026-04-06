import React, { createContext, useContext, useState, useCallback } from 'react';

const ProjectContext = createContext();
export const useProjects = () => useContext(ProjectContext);

const MEMBERS_POOL = [
  { id: 1, name: 'Alex Morgan',     email: 'alex@survex.com',    role: 'Admin',   avatar: 32, online: true },
  { id: 2, name: 'Jordan Lee',      email: 'jordan@survex.com',  role: 'Manager', avatar: 48, online: true },
  { id: 3, name: 'Taylor Kim',      email: 'taylor@survex.com',  role: 'Member',  avatar: 12, online: false },
  { id: 4, name: 'Chris Evans',     email: 'chris@survex.com',   role: 'Member',  avatar: 53, online: false },
  { id: 5, name: 'Priya Sharma',    email: 'priya@survex.com',   role: 'Member',  avatar: 25, online: true },
  { id: 6, name: 'Marcus Webb',     email: 'marcus@survex.com',  role: 'Member',  avatar: 61, online: false },
  { id: 7, name: 'Sofia Reyes',     email: 'sofia@survex.com',   role: 'Manager', avatar: 44, online: true },
];

const INITIAL_PROJECTS = [
  {
    id: 1,
    name: 'Apollo Redesign',
    desc: 'Overhaul of the main Apollo client interface to improve user retention.',
    deadline: '2026-10-24',
    status: 'In Progress',
    progress: 65,
    color: 'bg-blue-500',
    memberIds: [1, 2, 3, 5],
    tasks: [
      { id: 101, title: 'Design System Update',     column: 'todo',       priority: 'High',   assigneeId: 1, dueDate: 'Oct 10', comments: 3, attachments: 1 },
      { id: 102, title: 'Wireframe Dashboard',      column: 'todo',       priority: 'Medium', assigneeId: 3, dueDate: 'Oct 12', comments: 0, attachments: 2 },
      { id: 103, title: 'Implement JWT Auth',        column: 'inprogress', priority: 'High',   assigneeId: 2, dueDate: 'Oct 08', comments: 5, attachments: 0 },
      { id: 104, title: 'Review Database Schema',   column: 'done',       priority: 'Low',    assigneeId: 5, dueDate: 'Oct 01', comments: 1, attachments: 3 },
      { id: 105, title: 'Setup CI/CD Pipeline',     column: 'done',       priority: 'Medium', assigneeId: 1, dueDate: 'Sep 28', comments: 2, attachments: 1 },
    ],
    activity: [
      { id: 'a1', userId: 1, action: 'created the project',                        time: '5 days ago' },
      { id: 'a2', userId: 2, action: 'added task "Implement JWT Auth"',             time: '4 days ago' },
      { id: 'a3', userId: 5, action: 'completed "Review Database Schema"',          time: '3 days ago' },
      { id: 'a4', userId: 1, action: 'completed "Setup CI/CD Pipeline"',            time: '2 days ago' },
      { id: 'a5', userId: 3, action: 'commented on "Wireframe Dashboard"',          time: '1 day ago' },
      { id: 'a6', userId: 2, action: 'moved "Implement JWT Auth" to In Progress',   time: '6 hours ago' },
    ],
  },
  {
    id: 2,
    name: 'Marketing Website',
    desc: 'New marketing site with headless CMS and performance-first architecture.',
    deadline: '2026-11-12',
    status: 'Planning',
    progress: 15,
    color: 'bg-purple-500',
    memberIds: [1, 4, 6],
    tasks: [
      { id: 201, title: 'Content Strategy Doc',   column: 'todo',       priority: 'High',   assigneeId: 4, dueDate: 'Nov 01', comments: 0, attachments: 0 },
      { id: 202, title: 'CMS Selection',          column: 'inprogress', priority: 'Medium', assigneeId: 6, dueDate: 'Oct 20', comments: 2, attachments: 1 },
    ],
    activity: [
      { id: 'b1', userId: 1, action: 'created the project',          time: '2 days ago' },
      { id: 'b2', userId: 4, action: 'added task "Content Strategy"', time: '1 day ago' },
    ],
  },
  {
    id: 3,
    name: 'Mobile App V2',
    desc: 'React Native rewrite of the legacy mobile app with offline-first support.',
    deadline: '2026-12-01',
    status: 'At Risk',
    progress: 40,
    color: 'bg-orange-500',
    memberIds: [1, 2, 7],
    tasks: [
      { id: 301, title: 'Navigation Architecture', column: 'done',       priority: 'High',   assigneeId: 7, dueDate: 'Oct 05', comments: 4, attachments: 2 },
      { id: 302, title: 'Offline Sync Module',     column: 'inprogress', priority: 'High',   assigneeId: 2, dueDate: 'Oct 18', comments: 1, attachments: 0 },
      { id: 303, title: 'Push Notifications',      column: 'todo',       priority: 'Medium', assigneeId: 1, dueDate: 'Nov 10', comments: 0, attachments: 0 },
    ],
    activity: [
      { id: 'c1', userId: 1, action: 'created the project',                    time: '1 week ago' },
      { id: 'c2', userId: 7, action: 'completed "Navigation Architecture"',    time: '3 days ago' },
      { id: 'c3', userId: 2, action: 'flagged project as At Risk',             time: '1 day ago' },
    ],
  },
  {
    id: 4,
    name: 'Q4 Financials',
    desc: 'End of year financial reporting dashboard for executive stakeholders.',
    deadline: '2027-01-15',
    status: 'Completed',
    progress: 100,
    color: 'bg-emerald-500',
    memberIds: [1, 3, 4],
    tasks: [
      { id: 401, title: 'Data Pipeline Setup',    column: 'done', priority: 'High',   assigneeId: 3, dueDate: 'Dec 10', comments: 2, attachments: 4 },
      { id: 402, title: 'Dashboard UI',           column: 'done', priority: 'Medium', assigneeId: 4, dueDate: 'Dec 20', comments: 3, attachments: 1 },
      { id: 403, title: 'Stakeholder Review',     column: 'done', priority: 'Low',    assigneeId: 1, dueDate: 'Jan 05', comments: 1, attachments: 0 },
    ],
    activity: [
      { id: 'd1', userId: 1, action: 'created the project',          time: '3 weeks ago' },
      { id: 'd2', userId: 3, action: 'completed "Data Pipeline"',    time: '2 weeks ago' },
      { id: 'd3', userId: 4, action: 'completed "Dashboard UI"',     time: '1 week ago' },
      { id: 'd4', userId: 1, action: 'marked project as Completed',  time: '3 days ago' },
    ],
  },
];

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [members] = useState(MEMBERS_POOL);

  const getProject = useCallback((id) => projects.find(p => p.id === Number(id)), [projects]);

  const getMember = useCallback((id) => members.find(m => m.id === id), [members]);

  const getProjectMembers = useCallback((projectId) => {
    const project = projects.find(p => p.id === Number(projectId));
    if (!project) return [];
    return project.memberIds.map(id => members.find(m => m.id === id)).filter(Boolean);
  }, [projects, members]);

  const createProject = useCallback((data) => {
    const newProject = {
      id: Date.now(),
      name: data.name,
      desc: data.desc || 'No description provided.',
      deadline: data.deadline || 'TBD',
      status: 'Planning',
      progress: 0,
      color: data.color || 'bg-red-500',
      memberIds: [1, ...(data.memberIds || [])],
      tasks: [],
      activity: [{ id: `act-${Date.now()}`, userId: 1, action: 'created the project', time: 'just now' }],
    };
    setProjects(prev => [newProject, ...prev]);
    return newProject;
  }, []);

  const addTask = useCallback((projectId, task) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== Number(projectId)) return p;
      const newTask = { id: Date.now(), comments: 0, attachments: 0, ...task };
      const newActivity = { id: `act-${Date.now()}`, userId: 1, action: `added task "${task.title}"`, time: 'just now' };
      return { ...p, tasks: [...p.tasks, newTask], activity: [...p.activity, newActivity] };
    }));
  }, []);

  const moveTask = useCallback((projectId, taskId, newColumn) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== Number(projectId)) return p;
      const task = p.tasks.find(t => t.id === taskId);
      const colLabel = { todo: 'To Do', inprogress: 'In Progress', done: 'Done' }[newColumn];
      const newActivity = { id: `act-${Date.now()}`, userId: 1, action: `moved "${task?.title}" to ${colLabel}`, time: 'just now' };
      return {
        ...p,
        tasks: p.tasks.map(t => t.id === taskId ? { ...t, column: newColumn } : t),
        activity: [...p.activity, newActivity],
      };
    }));
  }, []);

  return (
    <ProjectContext.Provider value={{ projects, members, getProject, getMember, getProjectMembers, createProject, addTask, moveTask }}>
      {children}
    </ProjectContext.Provider>
  );
};
