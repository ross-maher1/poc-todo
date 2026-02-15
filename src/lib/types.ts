/**
 * Core type definitions for the Todo app.
 */

export type Task = {
  id: string;
  user_id: string;
  title: string;
  due_date: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
};
