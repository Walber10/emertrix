export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      committee_members: {
        Row: {
          committee_id: string;
          responsibilities: string | null;
          role: string | null;
          user_id: string;
        };
        Insert: {
          committee_id: string;
          responsibilities?: string | null;
          role?: string | null;
          user_id: string;
        };
        Update: {
          committee_id?: string;
          responsibilities?: string | null;
          role?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'committee_members_committee_id_fkey';
            columns: ['committee_id'];
            isOneToOne: false;
            referencedRelation: 'emergency_committees';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'committee_members_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      emergency_committees: {
        Row: {
          facility_id: string | null;
          id: string;
        };
        Insert: {
          facility_id?: string | null;
          id?: string;
        };
        Update: {
          facility_id?: string | null;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'emergency_committees_facility_id_fkey';
            columns: ['facility_id'];
            isOneToOne: false;
            referencedRelation: 'facilities';
            referencedColumns: ['id'];
          },
        ];
      };
      emergency_control_organizations: {
        Row: {
          control_hierarchy: string[] | null;
          facility_id: string | null;
          id: string;
        };
        Insert: {
          control_hierarchy?: string[] | null;
          facility_id?: string | null;
          id?: string;
        };
        Update: {
          control_hierarchy?: string[] | null;
          facility_id?: string | null;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'emergency_control_organizations_facility_id_fkey';
            columns: ['facility_id'];
            isOneToOne: false;
            referencedRelation: 'facilities';
            referencedColumns: ['id'];
          },
        ];
      };
      emergency_plan_procedures: {
        Row: {
          emergency_plan_id: string;
          procedure_id: string;
        };
        Insert: {
          emergency_plan_id: string;
          procedure_id: string;
        };
        Update: {
          emergency_plan_id?: string;
          procedure_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'emergency_plan_procedures_emergency_plan_id_fkey';
            columns: ['emergency_plan_id'];
            isOneToOne: false;
            referencedRelation: 'emergency_plans';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'emergency_plan_procedures_procedure_id_fkey';
            columns: ['procedure_id'];
            isOneToOne: false;
            referencedRelation: 'emergency_procedures';
            referencedColumns: ['id'];
          },
        ];
      };
      emergency_plans: {
        Row: {
          created_at: string | null;
          facility_id: string | null;
          id: string;
        };
        Insert: {
          created_at?: string | null;
          facility_id?: string | null;
          id?: string;
        };
        Update: {
          created_at?: string | null;
          facility_id?: string | null;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'emergency_plans_facility_id_fkey';
            columns: ['facility_id'];
            isOneToOne: false;
            referencedRelation: 'facilities';
            referencedColumns: ['id'];
          },
        ];
      };
      emergency_procedures: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          steps: string[] | null;
          title: string;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          steps?: string[] | null;
          title: string;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          steps?: string[] | null;
          title?: string;
        };
        Relationships: [];
      };
      exercise_review_participants: {
        Row: {
          review_id: string;
          user_id: string;
        };
        Insert: {
          review_id: string;
          user_id: string;
        };
        Update: {
          review_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'exercise_review_participants_review_id_fkey';
            columns: ['review_id'];
            isOneToOne: false;
            referencedRelation: 'exercise_reviews';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercise_review_participants_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      exercise_reviews: {
        Row: {
          completed: boolean | null;
          created_at: string | null;
          date_completed: string | null;
          email_summary_to: string | null;
          exercise_id: string | null;
          id: string;
          observations: string | null;
          reviewer: string | null;
        };
        Insert: {
          completed?: boolean | null;
          created_at?: string | null;
          date_completed?: string | null;
          email_summary_to?: string | null;
          exercise_id?: string | null;
          id?: string;
          observations?: string | null;
          reviewer?: string | null;
        };
        Update: {
          completed?: boolean | null;
          created_at?: string | null;
          date_completed?: string | null;
          email_summary_to?: string | null;
          exercise_id?: string | null;
          id?: string;
          observations?: string | null;
          reviewer?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'exercise_reviews_exercise_id_fkey';
            columns: ['exercise_id'];
            isOneToOne: false;
            referencedRelation: 'exercises';
            referencedColumns: ['id'];
          },
        ];
      };
      exercises: {
        Row: {
          coordinator: string | null;
          created_at: string | null;
          exercise_type: string | null;
          facility_id: string | null;
          id: string;
          location: string | null;
          objectives: string | null;
          proposed_date: string | null;
          proposed_time: string | null;
          selected_procedure_id: string | null;
          status: string | null;
        };
        Insert: {
          coordinator?: string | null;
          created_at?: string | null;
          exercise_type?: string | null;
          facility_id?: string | null;
          id?: string;
          location?: string | null;
          objectives?: string | null;
          proposed_date?: string | null;
          proposed_time?: string | null;
          selected_procedure_id?: string | null;
          status?: string | null;
        };
        Update: {
          coordinator?: string | null;
          created_at?: string | null;
          exercise_type?: string | null;
          facility_id?: string | null;
          id?: string;
          location?: string | null;
          objectives?: string | null;
          proposed_date?: string | null;
          proposed_time?: string | null;
          selected_procedure_id?: string | null;
          status?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'exercises_facility_id_fkey';
            columns: ['facility_id'];
            isOneToOne: false;
            referencedRelation: 'facilities';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercises_selected_procedure_id_fkey';
            columns: ['selected_procedure_id'];
            isOneToOne: false;
            referencedRelation: 'emergency_procedures';
            referencedColumns: ['id'];
          },
        ];
      };
      facilities: {
        Row: {
          address: string | null;
          city: string | null;
          created_at: string | null;
          email: string | null;
          facility_type: string | null;
          id: string;
          max_occupancy: number | null;
          name: string;
          organization_id: string | null;
          phone_number: string | null;
          point_of_contact_id: string | null;
          postcode: string | null;
          state: string | null;
        };
        Insert: {
          address?: string | null;
          city?: string | null;
          created_at?: string | null;
          email?: string | null;
          facility_type?: string | null;
          id?: string;
          max_occupancy?: number | null;
          name: string;
          organization_id?: string | null;
          phone_number?: string | null;
          point_of_contact_id?: string | null;
          postcode?: string | null;
          state?: string | null;
        };
        Update: {
          address?: string | null;
          city?: string | null;
          created_at?: string | null;
          email?: string | null;
          facility_type?: string | null;
          id?: string;
          max_occupancy?: number | null;
          name?: string;
          organization_id?: string | null;
          phone_number?: string | null;
          point_of_contact_id?: string | null;
          postcode?: string | null;
          state?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'facilities_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'facilities_point_of_contact_id_fkey';
            columns: ['point_of_contact_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      facility_occupants: {
        Row: {
          facility_id: string;
          user_id: string;
        };
        Insert: {
          facility_id: string;
          user_id: string;
        };
        Update: {
          facility_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'facility_occupants_facility_id_fkey';
            columns: ['facility_id'];
            isOneToOne: false;
            referencedRelation: 'facilities';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'facility_occupants_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      microsites: {
        Row: {
          address: string | null;
          epc_representative: string | null;
          facility_id: string | null;
          id: string;
          name: string | null;
          type: string | null;
        };
        Insert: {
          address?: string | null;
          epc_representative?: string | null;
          facility_id?: string | null;
          id?: string;
          name?: string | null;
          type?: string | null;
        };
        Update: {
          address?: string | null;
          epc_representative?: string | null;
          facility_id?: string | null;
          id?: string;
          name?: string | null;
          type?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'microsites_facility_id_fkey';
            columns: ['facility_id'];
            isOneToOne: false;
            referencedRelation: 'facilities';
            referencedColumns: ['id'];
          },
        ];
      };
      organizations: {
        Row: {
          abn: string | null;
          address: string | null;
          created_at: string | null;
          id: string;
          industry: string | null;
          max_facilities: number;
          name: string;
          nature_of_work: string | null;
          organization_size: string | null;
          phone_number: string | null;
          selected_plan: string | null;
          total_seats: number;
        };
        Insert: {
          abn?: string | null;
          address?: string | null;
          created_at?: string | null;
          id?: string;
          industry?: string | null;
          max_facilities: number;
          name: string;
          nature_of_work?: string | null;
          organization_size?: string | null;
          phone_number?: string | null;
          selected_plan?: string | null;
          total_seats: number;
        };
        Update: {
          abn?: string | null;
          address?: string | null;
          created_at?: string | null;
          id?: string;
          industry?: string | null;
          max_facilities?: number;
          name?: string;
          nature_of_work?: string | null;
          organization_size?: string | null;
          phone_number?: string | null;
          selected_plan?: string | null;
          total_seats?: number;
        };
        Relationships: [];
      };
      risk_assessments: {
        Row: {
          emergency_plan_id: string | null;
          hazards: string[] | null;
          id: string;
          notes: string | null;
        };
        Insert: {
          emergency_plan_id?: string | null;
          hazards?: string[] | null;
          id?: string;
          notes?: string | null;
        };
        Update: {
          emergency_plan_id?: string | null;
          hazards?: string[] | null;
          id?: string;
          notes?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'risk_assessments_emergency_plan_id_fkey';
            columns: ['emergency_plan_id'];
            isOneToOne: false;
            referencedRelation: 'emergency_plans';
            referencedColumns: ['id'];
          },
        ];
      };
      training_courses: {
        Row: {
          course_type: string | null;
          created_at: string | null;
          facility_id: string | null;
          id: string;
          organiser_name: string | null;
          organization_id: string | null;
          scheduled_date: string | null;
          status: string | null;
        };
        Insert: {
          course_type?: string | null;
          created_at?: string | null;
          facility_id?: string | null;
          id?: string;
          organiser_name?: string | null;
          organization_id?: string | null;
          scheduled_date?: string | null;
          status?: string | null;
        };
        Update: {
          course_type?: string | null;
          created_at?: string | null;
          facility_id?: string | null;
          id?: string;
          organiser_name?: string | null;
          organization_id?: string | null;
          scheduled_date?: string | null;
          status?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'training_courses_facility_id_fkey';
            columns: ['facility_id'];
            isOneToOne: false;
            referencedRelation: 'facilities';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'training_courses_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      training_participants: {
        Row: {
          course_id: string;
          user_id: string;
        };
        Insert: {
          course_id: string;
          user_id: string;
        };
        Update: {
          course_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'training_participants_course_id_fkey';
            columns: ['course_id'];
            isOneToOne: false;
            referencedRelation: 'training_courses';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'training_participants_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      users: {
        Row: {
          created_at: string | null;
          email: string;
          id: string;
          name: string;
          organization_id: string | null;
          phone: string | null;
          role: string | null;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          id?: string;
          name: string;
          organization_id?: string | null;
          phone?: string | null;
          role?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          id?: string;
          name?: string;
          organization_id?: string | null;
          phone?: string | null;
          role?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'users_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
