import React from 'react';
import type { Project } from '../utils/types';
import ProjectCard from '../components/ProjectCard';

interface ProjectsListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onViewKanban: (project: Project) => void;
  canEdit: boolean;
  canDelete: boolean;
}

const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  onEdit,
  onDelete,
  onViewKanban,
  canEdit,
  canDelete,
}) => {
  if (projects.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
        No projects yet. Create your first project!
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {projects.map((project) => (
        <div key={project.id} className="h-full">
          <ProjectCard
            project={project}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onViewKanban}
            canEdit={canEdit}
            canDelete={canDelete}
          />
        </div>
      ))}
    </div>
  );
};

export default ProjectsList;
