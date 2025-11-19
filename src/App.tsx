import { useEffect, useState } from 'react';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LayoutWrapper from './components/LayoutWrapper';
import LoginPage from './pages/LoginPage';
import type { Project, Task } from './utils/types';
import { api } from './utils/api';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  // const [isLoading, setIsLoading] = useState(false); // Eliminado porque no se usa

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      const projectsData = await api.projects.list();
      setProjects(projectsData);
      // Load tasks for all projects
      if (projectsData.length > 0) {
        const allTasks = await Promise.all(
          projectsData.map((project) => api.tasks.list(project.id))
        );
        setTasks(allTasks.flat());
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <NotificationProvider>
      <LayoutWrapper
        projects={projects}
        setProjects={setProjects}
        tasks={tasks}
        setTasks={setTasks}
      />
    </NotificationProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
