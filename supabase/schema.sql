-- Create profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text not null,
  role text check (role in ('admin', 'collaborator', 'viewer')) default 'viewer',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create projects table
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  owner_id uuid references public.profiles(id) not null
);

-- Enable RLS
alter table public.projects enable row level security;

-- Create tasks table
create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  priority text check (priority in ('Low', 'Medium', 'High')) default 'Medium',
  due_date timestamp with time zone,
  assigned_user text,
  status text check (status in ('To Do', 'In Progress', 'Done')) default 'To Do',
  project_id uuid references public.projects(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.tasks enable row level security;

-- Create comments table
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  text text not null,
  author_id uuid references public.profiles(id) not null,
  task_id uuid references public.tasks(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.comments enable row level security;

-- Policies (Simplified for demo)

-- Profiles: Everyone can view, users can update own
create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Projects: Viewable by everyone (authenticated), Insert/Update/Delete by owner or admin (simplified to authenticated for demo flexibility)
create policy "Projects are viewable by authenticated users" on public.projects
  for select using (auth.role() = 'authenticated');

create policy "Authenticated users can create projects" on public.projects
  for insert with check (auth.role() = 'authenticated');

create policy "Owners can update projects" on public.projects
  for update using (auth.uid() = owner_id);

create policy "Owners can delete projects" on public.projects
  for delete using (auth.uid() = owner_id);

-- Tasks: Viewable by authenticated, Insert/Update/Delete by authenticated
create policy "Tasks are viewable by authenticated users" on public.tasks
  for select using (auth.role() = 'authenticated');

create policy "Authenticated users can create tasks" on public.tasks
  for insert with check (auth.role() = 'authenticated');

create policy "Authenticated users can update tasks" on public.tasks
  for update using (auth.role() = 'authenticated');

create policy "Authenticated users can delete tasks" on public.tasks
  for delete using (auth.role() = 'authenticated');

-- Comments: Viewable by authenticated, Insert by authenticated
create policy "Comments are viewable by authenticated users" on public.comments
  for select using (auth.role() = 'authenticated');

create policy "Authenticated users can create comments" on public.comments
  for insert with check (auth.role() = 'authenticated');

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'viewer');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
