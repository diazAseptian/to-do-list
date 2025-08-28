/*
  # Create tasks table for Todo App

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `judul` (text, not null)
      - `kategori` (text with check constraint)
      - `prioritas` (text with check constraint)
      - `deadline` (timestamptz)
      - `status` (text with check constraint)
      - `deskripsi` (text)
      - `created_at` (timestamptz with default)

  2. Security
    - Enable RLS on `tasks` table
    - Add policy for users to manage their own tasks
    - Add policy for users to read their own tasks
*/

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  judul text NOT NULL,
  kategori text NOT NULL CHECK (kategori IN ('Kuliah', 'Himpunan', 'Skripsi', 'Kerja')),
  prioritas text NOT NULL CHECK (prioritas IN ('High', 'Medium', 'Low')) DEFAULT 'Medium',
  deadline timestamptz,
  status text NOT NULL CHECK (status IN ('Belum dikerjakan', 'Sedang dikerjakan', 'Selesai')) DEFAULT 'Belum dikerjakan',
  deskripsi text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can read own tasks" ON tasks;

-- Policy for users to manage their own tasks
CREATE POLICY "Users can manage own tasks"
  ON tasks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(deadline);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);