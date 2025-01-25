import type { Database } from "@/integrations/supabase/types";

export type AppRole = Database["public"]["Enums"]["app_role"];
export type GradeLevel = Database["public"]["Enums"]["grade_level"];
export type Institution = Database["public"]["Enums"]["institution_type"];

export interface AuthFormState {
  email: string;
  password: string;
  name: string;
  role: AppRole;
  grade?: GradeLevel;
  institution?: Institution;
}

export interface AuthFormErrors {
  email?: string;
  password?: string;
  name?: string;
  grade?: string;
  institution?: string;
}