-- Create Sporky Profiles Table
create table if not exists public.sporky_profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  updated_at timestamp with time zone default now(),
  sporky_color text default '#06b6d4',
  challenge_1_solved integer default 0,
  challenge_2_solved integer default 0,
  challenge_3_solved integer default 0,
  challenge_4_solved integer default 0,
  challenge_5_solved integer default 0
);

-- Enable Row Level Security (RLS)
alter table public.sporky_profiles enable row level security;

-- Policies for RLS
create policy "Users can view their own sporky profile"
  on public.sporky_profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own sporky profile"
  on public.sporky_profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own sporky profile"
  on public.sporky_profiles for update
  using (auth.uid() = id);

-- Create profile automatically on sign up trigger function
create or replace function public.handle_new_sporky_user()
returns trigger as $$
begin
  insert into public.sporky_profiles (id, sporky_color, challenge_1_solved, challenge_2_solved, challenge_3_solved, challenge_4_solved, challenge_5_solved)
  values (new.id, '#06b6d4', 0, 0, 0, 0, 0);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger definition
create or replace trigger on_auth_user_created_sporky
  after insert on auth.users
  for each row execute procedure public.handle_new_sporky_user();
