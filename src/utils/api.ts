import { supabase } from '../lib/supabase';
import type { Project, Task } from './types';

export const api = {
  projects: {
    list: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform snake_case to camelCase
      return (data || []).map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        createdAt: new Date(p.created_at),
      })) as Project[];
    },

    create: async (project: Omit<Project, 'id' | 'createdAt'>) => {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: project.name,
          description: project.description,
          owner_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        createdAt: new Date(data.created_at),
      } as Project;
    },

    update: async (id: string, project: Partial<Project>) => {
      const { data, error } = await supabase
        .from('projects')
        .update({
          name: project.name,
          description: project.description,
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        createdAt: new Date(data.created_at),
      } as Project;
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
  },

  tasks: {
    list: async (projectId: string) => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform snake_case to camelCase
      return (data || []).map(t => ({
        id: t.id,
        title: t.title,
        description: t.description,
        priority: t.priority,
        dueDate: t.due_date ? new Date(t.due_date) : new Date(),
        assignedUser: t.assigned_user || 'Unassigned',
        status: t.status,
        projectId: t.project_id,
        comments: [], // Comments would need separate query
      })) as Task[];
    },

    create: async (task: Omit<Task, 'id' | 'comments'>) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: task.title,
          description: task.description,
          priority: task.priority,
          due_date: task.dueDate,
          assigned_user: task.assignedUser,
          status: task.status,
          project_id: task.projectId,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.due_date ? new Date(data.due_date) : new Date(),
        assignedUser: data.assigned_user || 'Unassigned',
        status: data.status,
        projectId: data.project_id,
        comments: [],
      } as Task;
    },

    update: async (id: string, task: Partial<Task>) => {
      const updateData: any = {};
      
      if (task.title !== undefined) updateData.title = task.title;
      if (task.description !== undefined) updateData.description = task.description;
      if (task.priority !== undefined) updateData.priority = task.priority;
      if (task.dueDate !== undefined) updateData.due_date = task.dueDate;
      if (task.assignedUser !== undefined) updateData.assigned_user = task.assignedUser;
      if (task.status !== undefined) updateData.status = task.status;
      
      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.due_date ? new Date(data.due_date) : new Date(),
        assignedUser: data.assigned_user || 'Unassigned',
        status: data.status,
        projectId: data.project_id,
        comments: [],
      } as Task;
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
  },
};
