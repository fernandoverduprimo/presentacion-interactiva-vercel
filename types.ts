
export type SlideContent = {
  type: 'content' | 'question';
  title: string;
  content?: string[];
  image?: string;
  question?: string;
  options?: { id: string; text: string }[];
  correctOptionId?: string;
};

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      answers: {
        Row: {
          id: number
          session_id: string
          user_id: string
          question_index: number
          selected_option: string
          is_correct: boolean
          created_at: string
        }
        Insert: {
          id?: number
          session_id: string
          user_id: string
          question_index: number
          selected_option: string
          is_correct: boolean
          created_at?: string
        }
        Update: {
          id?: number
          session_id?: string
          user_id?: string
          question_index?: number
          selected_option?: string
          is_correct?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "answers_session_id_fkey"
            columns: ["session_id"]
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      sessions: {
        Row: {
          id: string
          session_code: string
          current_question_index: number
          created_at: string
        }
        Insert: {
          id?: string
          session_code: string
          current_question_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          session_code?: string
          current_question_index?: number
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
