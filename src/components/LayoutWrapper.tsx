import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Projects from '../pages/Projects';
import Dashboard from '../pages/Dashboard';
import type { Project, Task } from '../utils/types';
import { useUserPreferences } from '../hooks/useLocalStorage';

interface LayoutWrapperProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({
  projects,
  setProjects,
  tasks,
  setTasks,
}) => {
  const { sidebarOpen, setSidebarOpen, activePage, setActivePage } =
    useUserPreferences();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderContent = () => {
    switch (activePage) {
      case 'Projects':
        return (
          <Projects
            projects={projects}
            setProjects={setProjects}
            tasks={tasks}
            setTasks={setTasks}
          />
        );
      case 'Dashboard':
        return <Dashboard projects={projects} tasks={tasks} />;
      case 'Settings':
      default:
        return (
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            {activePage}
          </h2>
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <Sidebar
        isOpen={sidebarOpen}
        activePage={activePage}
        setActivePage={setActivePage}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <Navbar onToggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default LayoutWrapper;
