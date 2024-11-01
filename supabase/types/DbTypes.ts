export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      aidata: {
        Row: {
          aidata_id: number
          airesponsetemplate_id: number
          calory_data: string | null
          heartrate_data: string | null
          sleep_data: string | null
          step_data: string | null
          user_id: string
          water_data: string | null
        }
        Insert: {
          aidata_id?: number
          airesponsetemplate_id: number
          calory_data?: string | null
          heartrate_data?: string | null
          sleep_data?: string | null
          step_data?: string | null
          user_id: string
          water_data?: string | null
        }
        Update: {
          aidata_id?: number
          airesponsetemplate_id?: number
          calory_data?: string | null
          heartrate_data?: string | null
          sleep_data?: string | null
          step_data?: string | null
          user_id?: string
          water_data?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "aidata_airesponsetemplate_id_fkey"
            columns: ["airesponsetemplate_id"]
            isOneToOne: false
            referencedRelation: "airesponsetemplate"
            referencedColumns: ["airesponsetemplate_id"]
          },
          {
            foreignKeyName: "aidata_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      aiknowledge: {
        Row: {
          body: string
          datecreated: string
          id: string
          vector: string
        }
        Insert: {
          body: string
          datecreated?: string
          id: string
          vector: string
        }
        Update: {
          body?: string
          datecreated?: string
          id?: string
          vector?: string
        }
        Relationships: []
      }
      airesponse: {
        Row: {
          aidata_id: number | null
          airesponse_id: number
          reponse: string
        }
        Insert: {
          aidata_id?: number | null
          airesponse_id?: number
          reponse: string
        }
        Update: {
          aidata_id?: number | null
          airesponse_id?: number
          reponse?: string
        }
        Relationships: [
          {
            foreignKeyName: "airesponse_aidata_id_fkey"
            columns: ["aidata_id"]
            isOneToOne: false
            referencedRelation: "aidata"
            referencedColumns: ["aidata_id"]
          },
        ]
      }
      airesponsetemplate: {
        Row: {
          airesponsetemplate_id: number
          datecreated: string
          dateupdated: string | null
          template: string
        }
        Insert: {
          airesponsetemplate_id?: number
          datecreated: string
          dateupdated?: string | null
          template: string
        }
        Update: {
          airesponsetemplate_id?: number
          datecreated?: string
          dateupdated?: string | null
          template?: string
        }
        Relationships: []
      }
      approvedstatus: {
        Row: {
          id: number
          status: string
        }
        Insert: {
          id?: number
          status: string
        }
        Update: {
          id?: number
          status?: string
        }
        Relationships: []
      }
      article: {
        Row: {
          article_id: number
          articlecategory_id: number
          datecreated: string
          dateupdated: string
          description: string
          title: string
        }
        Insert: {
          article_id?: number
          articlecategory_id: number
          datecreated: string
          dateupdated: string
          description: string
          title: string
        }
        Update: {
          article_id?: number
          articlecategory_id?: number
          datecreated?: string
          dateupdated?: string
          description?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_articlecategory_id_fkey"
            columns: ["articlecategory_id"]
            isOneToOne: false
            referencedRelation: "articlecategory"
            referencedColumns: ["articlecategory_id"]
          },
        ]
      }
      articlecategory: {
        Row: {
          articlecategory_id: number
          name: string
        }
        Insert: {
          articlecategory_id?: number
          name: string
        }
        Update: {
          articlecategory_id?: number
          name?: string
        }
        Relationships: []
      }
      assessmentbmi: {
        Row: {
          datecreated: string
          height: number
          id: number
          user_id: string
          weight: number
        }
        Insert: {
          datecreated: string
          height: number
          id?: number
          user_id: string
          weight: number
        }
        Update: {
          datecreated?: string
          height?: number
          id?: number
          user_id?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "assessmentbmi_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      assessmentgoal: {
        Row: {
          datecreated: string
          goal_id: number
          id: number
          user_id: string
        }
        Insert: {
          datecreated: string
          goal_id: number
          id?: number
          user_id: string
        }
        Update: {
          datecreated?: string
          goal_id?: number
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessmentgoal_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessmentgoal_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      assessmentmedication: {
        Row: {
          datecreated: string
          id: number
          medication_id: number
          user_id: string
        }
        Insert: {
          datecreated: string
          id?: number
          medication_id: number
          user_id: string
        }
        Update: {
          datecreated?: string
          id?: number
          medication_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessmentmedication_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medication"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessmentmedication_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      assessmentmenstruation: {
        Row: {
          cyclelength: number
          datecreated: string
          id: number
          lastperiodend: string
          lastperiodstart: string
          user_id: string
        }
        Insert: {
          cyclelength: number
          datecreated: string
          id?: number
          lastperiodend: string
          lastperiodstart: string
          user_id: string
        }
        Update: {
          cyclelength?: number
          datecreated?: string
          id?: number
          lastperiodend?: string
          lastperiodstart?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessmentmenstruation_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      assessmentmentalhealthsymptoms: {
        Row: {
          datecreated: string
          id: number
          mentalhealthsymptom_id: number
          user_id: string
        }
        Insert: {
          datecreated: string
          id?: number
          mentalhealthsymptom_id: number
          user_id: string
        }
        Update: {
          datecreated?: string
          id?: number
          mentalhealthsymptom_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessmentmentalhealthsymptoms_mentalhealthsymptom_id_fkey"
            columns: ["mentalhealthsymptom_id"]
            isOneToOne: false
            referencedRelation: "mentalhealthsymptom"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessmentmentalhealthsymptoms_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      assessmentmood: {
        Row: {
          datecreated: string
          id: number
          mood_id: number
          user_id: string
        }
        Insert: {
          datecreated: string
          id?: number
          mood_id: number
          user_id: string
        }
        Update: {
          datecreated?: string
          id?: number
          mood_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessmentmood_mood_id_fkey"
            columns: ["mood_id"]
            isOneToOne: false
            referencedRelation: "moods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessmentmood_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      assessmentphysicaldistress: {
        Row: {
          answer: boolean
          datecreated: string
          id: number
          user_id: string
        }
        Insert: {
          answer: boolean
          datecreated: string
          id?: number
          user_id: string
        }
        Update: {
          answer?: boolean
          datecreated?: string
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessmentphysicaldistress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      assessmentprohelp: {
        Row: {
          answer: boolean
          datecreated: string
          id: number
          user_id: string
        }
        Insert: {
          answer: boolean
          datecreated: string
          id?: number
          user_id: string
        }
        Update: {
          answer?: boolean
          datecreated?: string
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessmentprohelp_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      assessmentsleepquality: {
        Row: {
          datecreated: string
          id: number
          sleepquality_id: number
          user_id: string
        }
        Insert: {
          datecreated: string
          id?: number
          sleepquality_id: number
          user_id: string
        }
        Update: {
          datecreated?: string
          id?: number
          sleepquality_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessmentsleepquality_sleepquality_id_fkey"
            columns: ["sleepquality_id"]
            isOneToOne: false
            referencedRelation: "sleepquality"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessmentsleepquality_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      assessmentstresslevel: {
        Row: {
          datecreated: string
          id: number
          level: number
          user_id: string
        }
        Insert: {
          datecreated: string
          id?: number
          level: number
          user_id: string
        }
        Update: {
          datecreated?: string
          id?: number
          level?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessmentstresslevel_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      assessmenttakingmedication: {
        Row: {
          datecreated: string
          id: number
          takingmedication_id: number
          user_id: string
        }
        Insert: {
          datecreated: string
          id?: number
          takingmedication_id: number
          user_id: string
        }
        Update: {
          datecreated?: string
          id?: number
          takingmedication_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessmenttakingmedication_takingmedication_id_fkey"
            columns: ["takingmedication_id"]
            isOneToOne: false
            referencedRelation: "takingmedication"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessmenttakingmedication_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bodypart: {
        Row: {
          description: string
          id: number
          name: string
        }
        Insert: {
          description: string
          id?: number
          name: string
        }
        Update: {
          description?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      challenge: {
        Row: {
          datecreated: string
          description: string
          id: number
          pictureurl: string
          title: string
        }
        Insert: {
          datecreated?: string
          description: string
          id?: number
          pictureurl: string
          title: string
        }
        Update: {
          datecreated?: string
          description?: string
          id?: number
          pictureurl?: string
          title?: string
        }
        Relationships: []
      }
      challengeworkout: {
        Row: {
          challenge_id: number
          date: string
          id: number
          workout_id: number
        }
        Insert: {
          challenge_id: number
          date?: string
          id?: number
          workout_id: number
        }
        Update: {
          challenge_id?: number
          date?: string
          id?: number
          workout_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "challengeworkout_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenge"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challengeworkout_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workout"
            referencedColumns: ["id"]
          },
        ]
      }
      class: {
        Row: {
          class_id: number
          classdescription: string
          course_id: number
          date: string
          duration: number
          endtime: string
          starttime: string
        }
        Insert: {
          class_id?: number
          classdescription: string
          course_id: number
          date?: string
          duration: number
          endtime: string
          starttime: string
        }
        Update: {
          class_id?: number
          classdescription?: string
          course_id?: number
          date?: string
          duration?: number
          endtime?: string
          starttime?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course"
            referencedColumns: ["course_id"]
          },
        ]
      }
      course: {
        Row: {
          coordinator: string | null
          course_id: number
          coursedescription: string | null
          lecturer: string | null
        }
        Insert: {
          coordinator?: string | null
          course_id?: number
          coursedescription?: string | null
          lecturer?: string | null
        }
        Update: {
          coordinator?: string | null
          course_id?: number
          coursedescription?: string | null
          lecturer?: string | null
        }
        Relationships: []
      }
      dietitian: {
        Row: {
          approvedstatus_id: number
          professionalstatus_id: number
          qualification: string
          user_id: string
          yearsofexperience: number
        }
        Insert: {
          approvedstatus_id: number
          professionalstatus_id: number
          qualification: string
          user_id: string
          yearsofexperience?: number
        }
        Update: {
          approvedstatus_id?: number
          professionalstatus_id?: number
          qualification?: string
          user_id?: string
          yearsofexperience?: number
        }
        Relationships: [
          {
            foreignKeyName: "dietitian_approvedstatus_id_fkey"
            columns: ["approvedstatus_id"]
            isOneToOne: false
            referencedRelation: "approvedstatus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dietitian_professionalstatus_id_fkey"
            columns: ["professionalstatus_id"]
            isOneToOne: false
            referencedRelation: "professionalstatus"
            referencedColumns: ["professionalstatus_id"]
          },
          {
            foreignKeyName: "dietitian_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      dietitianguide: {
        Row: {
          content: string
          datecreated: string
          description: string
          id: number
          pictureurl: string
          title: string
          user_id: string
        }
        Insert: {
          content: string
          datecreated: string
          description: string
          id?: number
          pictureurl: string
          title: string
          user_id: string
        }
        Update: {
          content?: string
          datecreated?: string
          description?: string
          id?: number
          pictureurl?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dietitianguide_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment: {
        Row: {
          description: string
          id: number
          name: string
          pictureurl: string
        }
        Insert: {
          description?: string
          id?: number
          name: string
          pictureurl: string
        }
        Update: {
          description?: string
          id?: number
          name?: string
          pictureurl?: string
        }
        Relationships: []
      }
      exercise: {
        Row: {
          bodypart_id: number
          description: string
          duration: number
          id: number
          name: string
          repititions: number
          sets: number
          weight: number | null
        }
        Insert: {
          bodypart_id: number
          description: string
          duration?: number
          id?: number
          name: string
          repititions?: number
          sets?: number
          weight?: number | null
        }
        Update: {
          bodypart_id?: number
          description?: string
          duration?: number
          id?: number
          name?: string
          repititions?: number
          sets?: number
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_bodypart_id_fkey"
            columns: ["bodypart_id"]
            isOneToOne: false
            referencedRelation: "bodypart"
            referencedColumns: ["id"]
          },
        ]
      }
      exerciseequipment: {
        Row: {
          equipment_id: number
          exercise_id: number
          id: number
        }
        Insert: {
          equipment_id: number
          exercise_id: number
          id?: number
        }
        Update: {
          equipment_id?: number
          exercise_id?: number
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "exerciseequipment_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exerciseequipment_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercise"
            referencedColumns: ["id"]
          },
        ]
      }
      exerciseinstruction: {
        Row: {
          exercise_id: number
          id: number
          instruction: string
        }
        Insert: {
          exercise_id: number
          id?: number
          instruction: string
        }
        Update: {
          exercise_id?: number
          id?: number
          instruction?: string
        }
        Relationships: [
          {
            foreignKeyName: "exerciseinstruction_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercise"
            referencedColumns: ["id"]
          },
        ]
      }
      faq: {
        Row: {
          answer: string
          article_id: number
          faq_id: number
          isactive: boolean
          question: string
        }
        Insert: {
          answer: string
          article_id: number
          faq_id?: number
          isactive?: boolean
          question: string
        }
        Update: {
          answer?: string
          article_id?: number
          faq_id?: number
          isactive?: boolean
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "faq_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "article"
            referencedColumns: ["article_id"]
          },
        ]
      }
      feedback: {
        Row: {
          datecreated: string
          difficulty: string
          id: number
          liked: string
          rating: number
          user_id: string
        }
        Insert: {
          datecreated: string
          difficulty: string
          id?: number
          liked: string
          rating?: number
          user_id: string
        }
        Update: {
          datecreated?: string
          difficulty?: string
          id?: number
          liked?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      follow: {
        Row: {
          datecreated: string
          follower_id: string
          following_id: string
          id: number
        }
        Insert: {
          datecreated?: string
          follower_id: string
          following_id: string
          id?: number
        }
        Update: {
          datecreated?: string
          follower_id?: string
          following_id?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "follow_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      food: {
        Row: {
          food_id: number
          foodcategory_id: number
          name: string
        }
        Insert: {
          food_id?: number
          foodcategory_id: number
          name: string
        }
        Update: {
          food_id?: number
          foodcategory_id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_foodcategory_id_fkey"
            columns: ["foodcategory_id"]
            isOneToOne: false
            referencedRelation: "foodcategory"
            referencedColumns: ["foodcategory_id"]
          },
        ]
      }
      foodcategory: {
        Row: {
          description: string
          foodcategory_id: number
          name: string
        }
        Insert: {
          description: string
          foodcategory_id?: number
          name: string
        }
        Update: {
          description?: string
          foodcategory_id?: number
          name?: string
        }
        Relationships: []
      }
      generalsettings: {
        Row: {
          darkmode: boolean
          id: number
        }
        Insert: {
          darkmode?: boolean
          id?: number
        }
        Update: {
          darkmode?: boolean
          id?: number
        }
        Relationships: []
      }
      goals: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      meal: {
        Row: {
          description: string
          meal_id: number
          mealtype_id: number
          name: string
          pictureurl: string | null
          price: number
        }
        Insert: {
          description: string
          meal_id?: number
          mealtype_id: number
          name: string
          pictureurl?: string | null
          price?: number
        }
        Update: {
          description?: string
          meal_id?: number
          mealtype_id?: number
          name?: string
          pictureurl?: string | null
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "meal_mealtype_id_fkey"
            columns: ["mealtype_id"]
            isOneToOne: false
            referencedRelation: "mealtype"
            referencedColumns: ["mealtype_id"]
          },
        ]
      }
      mealfood: {
        Row: {
          food_id: number
          meal_id: number
          mealfood_id: number
          quantity: number
        }
        Insert: {
          food_id: number
          meal_id: number
          mealfood_id?: number
          quantity: number
        }
        Update: {
          food_id?: number
          meal_id?: number
          mealfood_id?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "mealfood_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "food"
            referencedColumns: ["food_id"]
          },
          {
            foreignKeyName: "mealfood_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meal"
            referencedColumns: ["meal_id"]
          },
        ]
      }
      mealinstruction: {
        Row: {
          instruction: string | null
          meal_id: number
          mealinstruction_id: number
        }
        Insert: {
          instruction?: string | null
          meal_id: number
          mealinstruction_id?: number
        }
        Update: {
          instruction?: string | null
          meal_id?: number
          mealinstruction_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "mealinstruction_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meal"
            referencedColumns: ["meal_id"]
          },
        ]
      }
      mealplan: {
        Row: {
          completed: boolean
          meal_id: number
          mealplan_id: number
          mealtime: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          meal_id: number
          mealplan_id?: number
          mealtime: string
          user_id: string
        }
        Update: {
          completed?: boolean
          meal_id?: number
          mealplan_id?: number
          mealtime?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mealplan_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meal"
            referencedColumns: ["meal_id"]
          },
          {
            foreignKeyName: "mealplan_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      mealtype: {
        Row: {
          mealtype: string
          mealtype_id: number
        }
        Insert: {
          mealtype: string
          mealtype_id?: number
        }
        Update: {
          mealtype?: string
          mealtype_id?: number
        }
        Relationships: []
      }
      medication: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      mentalhealthsymptom: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      message: {
        Row: {
          datecreated: string
          id: number
          isread: boolean
          message: string | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          datecreated?: string
          id?: number
          isread?: boolean
          message?: string | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          datecreated?: string
          id?: number
          isread?: boolean
          message?: string | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      moods: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      notification: {
        Row: {
          datecreated: string
          notification: string | null
          notification_id: number
          user_id: string
        }
        Insert: {
          datecreated: string
          notification?: string | null
          notification_id?: number
          user_id: string
        }
        Update: {
          datecreated?: string
          notification?: string | null
          notification_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notificationsettings: {
        Row: {
          id: number
          pushnotification: boolean
        }
        Insert: {
          id?: number
          pushnotification?: boolean
        }
        Update: {
          id?: number
          pushnotification?: boolean
        }
        Relationships: []
      }
      nutritionalfact: {
        Row: {
          calcium: number
          cholesterol: number
          dietaryfiber: number
          food_id: number
          iron: number
          monounsaturatedfat: number
          nutritionalfact_id: number
          polyunsaturatedfat: number
          potassium: number
          protein: number
          saturatedfat: number
          sodium: number
          sugar: number
          totalcarbs: number
          totalfat: number
          transfat: number
          vitamina: number
          vitaminc: number
        }
        Insert: {
          calcium?: number
          cholesterol?: number
          dietaryfiber?: number
          food_id: number
          iron?: number
          monounsaturatedfat?: number
          nutritionalfact_id?: number
          polyunsaturatedfat?: number
          potassium?: number
          protein?: number
          saturatedfat?: number
          sodium?: number
          sugar?: number
          totalcarbs?: number
          totalfat?: number
          transfat?: number
          vitamina?: number
          vitaminc?: number
        }
        Update: {
          calcium?: number
          cholesterol?: number
          dietaryfiber?: number
          food_id?: number
          iron?: number
          monounsaturatedfat?: number
          nutritionalfact_id?: number
          polyunsaturatedfat?: number
          potassium?: number
          protein?: number
          saturatedfat?: number
          sodium?: number
          sugar?: number
          totalcarbs?: number
          totalfat?: number
          transfat?: number
          vitamina?: number
          vitaminc?: number
        }
        Relationships: [
          {
            foreignKeyName: "nutritionalfact_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "food"
            referencedColumns: ["food_id"]
          },
        ]
      }
      physio: {
        Row: {
          approvedstatus_id: number
          professionalstatus_id: number
          qualification: string
          user_id: string
          yearsofexperience: number
        }
        Insert: {
          approvedstatus_id: number
          professionalstatus_id: number
          qualification: string
          user_id: string
          yearsofexperience?: number
        }
        Update: {
          approvedstatus_id?: number
          professionalstatus_id?: number
          qualification?: string
          user_id?: string
          yearsofexperience?: number
        }
        Relationships: [
          {
            foreignKeyName: "physio_approvedstatus_id_fkey"
            columns: ["approvedstatus_id"]
            isOneToOne: false
            referencedRelation: "approvedstatus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "physio_professionalstatus_id_fkey"
            columns: ["professionalstatus_id"]
            isOneToOne: false
            referencedRelation: "professionalstatus"
            referencedColumns: ["professionalstatus_id"]
          },
          {
            foreignKeyName: "physio_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      physiobooking: {
        Row: {
          datecreated: string
          duration: string
          id: number
        }
        Insert: {
          datecreated: string
          duration?: string
          id?: number
        }
        Update: {
          datecreated?: string
          duration?: string
          id?: number
        }
        Relationships: []
      }
      physioguide: {
        Row: {
          content: string
          datecreated: string
          description: string
          id: number
          pictureurl: string
          title: string
          user_id: string
        }
        Insert: {
          content: string
          datecreated?: string
          description: string
          id?: number
          pictureurl: string
          title: string
          user_id: string
        }
        Update: {
          content?: string
          datecreated?: string
          description?: string
          id?: number
          pictureurl?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "physioguide_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      physiouserbooking: {
        Row: {
          id: number
          physio_id: string
          physiobooking_id: number
          user_id: string
        }
        Insert: {
          id?: number
          physio_id: string
          physiobooking_id: number
          user_id: string
        }
        Update: {
          id?: number
          physio_id?: string
          physiobooking_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "physiouserbooking_physio_id_fkey"
            columns: ["physio_id"]
            isOneToOne: false
            referencedRelation: "physio"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "physiouserbooking_physiobooking_id_fkey"
            columns: ["physiobooking_id"]
            isOneToOne: false
            referencedRelation: "physiobooking"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "physiouserbooking_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      post: {
        Row: {
          author_id: string
          authorname: string
          authorsurname: string
          datecreated: string
          id: number
          likes: number
          post: string
          thread_id: number
        }
        Insert: {
          author_id: string
          authorname: string
          authorsurname: string
          datecreated?: string
          id?: number
          likes?: number
          post: string
          thread_id: number
        }
        Update: {
          author_id?: string
          authorname?: string
          authorsurname?: string
          datecreated?: string
          id?: number
          likes?: number
          post?: string
          thread_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "post_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "thread"
            referencedColumns: ["id"]
          },
        ]
      }
      postlike: {
        Row: {
          id: number
          post_id: number
          user_id: string
        }
        Insert: {
          id?: number
          post_id: number
          user_id: string
        }
        Update: {
          id?: number
          post_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "postlike_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "post"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "postlike_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      privacysettings: {
        Row: {
          id: number
          lastseen: boolean
          publicprofile: boolean
        }
        Insert: {
          id?: number
          lastseen?: boolean
          publicprofile?: boolean
        }
        Update: {
          id?: number
          lastseen?: boolean
          publicprofile?: boolean
        }
        Relationships: []
      }
      professionalstatus: {
        Row: {
          professionalstatus_id: number
          status: string
        }
        Insert: {
          professionalstatus_id?: number
          status: string
        }
        Update: {
          professionalstatus_id?: number
          status?: string
        }
        Relationships: []
      }
      profile: {
        Row: {
          avatarurl: string | null
          biography: string | null
          datecreated: string
          dateofbirth: string | null
          firstname: string | null
          gender: string | null
          lastname: string | null
          profile_id: number
          totalfollowers: number | null
          totalfollowings: number | null
          user_id: string
          username: string | null
        }
        Insert: {
          avatarurl?: string | null
          biography?: string | null
          datecreated?: string
          dateofbirth?: string | null
          firstname?: string | null
          gender?: string | null
          lastname?: string | null
          profile_id?: number
          totalfollowers?: number | null
          totalfollowings?: number | null
          user_id: string
          username?: string | null
        }
        Update: {
          avatarurl?: string | null
          biography?: string | null
          datecreated?: string
          dateofbirth?: string | null
          firstname?: string | null
          gender?: string | null
          lastname?: string | null
          profile_id?: number
          totalfollowers?: number | null
          totalfollowings?: number | null
          user_id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      psychologist: {
        Row: {
          approvedstatus_id: number
          professionalstatus_id: number
          qualification: string
          user_id: string
          yearsofexperience: number
        }
        Insert: {
          approvedstatus_id: number
          professionalstatus_id: number
          qualification: string
          user_id: string
          yearsofexperience?: number
        }
        Update: {
          approvedstatus_id?: number
          professionalstatus_id?: number
          qualification?: string
          user_id?: string
          yearsofexperience?: number
        }
        Relationships: [
          {
            foreignKeyName: "psychologist_approvedstatus_id_fkey"
            columns: ["approvedstatus_id"]
            isOneToOne: false
            referencedRelation: "approvedstatus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "psychologist_professionalstatus_id_fkey"
            columns: ["professionalstatus_id"]
            isOneToOne: false
            referencedRelation: "professionalstatus"
            referencedColumns: ["professionalstatus_id"]
          },
          {
            foreignKeyName: "psychologist_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      psychologistguide: {
        Row: {
          content: string
          datecreated: string
          description: string
          id: number
          pictureurl: string
          title: string
          user_id: string
        }
        Insert: {
          content: string
          datecreated?: string
          description: string
          id?: number
          pictureurl: string
          title: string
          user_id: string
        }
        Update: {
          content?: string
          datecreated?: string
          description?: string
          id?: number
          pictureurl?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "psychologistguide_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      role: {
        Row: {
          description: string | null
          name: string | null
          role_id: number
        }
        Insert: {
          description?: string | null
          name?: string | null
          role_id?: number
        }
        Update: {
          description?: string | null
          name?: string | null
          role_id?: number
        }
        Relationships: []
      }
      schedule: {
        Row: {
          physiobooking_id: number | null
          schedule_id: number
          therapybooking_id: number | null
          user_id: string | null
          workoutprogram_id: number | null
        }
        Insert: {
          physiobooking_id?: number | null
          schedule_id?: number
          therapybooking_id?: number | null
          user_id?: string | null
          workoutprogram_id?: number | null
        }
        Update: {
          physiobooking_id?: number | null
          schedule_id?: number
          therapybooking_id?: number | null
          user_id?: string | null
          workoutprogram_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "schedule_physiobooking_id_fkey"
            columns: ["physiobooking_id"]
            isOneToOne: false
            referencedRelation: "physiobooking"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_therapybooking_id_fkey"
            columns: ["therapybooking_id"]
            isOneToOne: false
            referencedRelation: "therapybooking"
            referencedColumns: ["therapybooking_id"]
          },
          {
            foreignKeyName: "schedule_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_workoutprogram_id_fkey"
            columns: ["workoutprogram_id"]
            isOneToOne: false
            referencedRelation: "workoutprogram"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduleclass: {
        Row: {
          class_id: number
          schedule_id: number
          scheduleclass_id: number
        }
        Insert: {
          class_id: number
          schedule_id: number
          scheduleclass_id?: number
        }
        Update: {
          class_id?: number
          schedule_id?: number
          scheduleclass_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "scheduleclass_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "class"
            referencedColumns: ["class_id"]
          },
          {
            foreignKeyName: "scheduleclass_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "schedule"
            referencedColumns: ["schedule_id"]
          },
        ]
      }
      schedulemealplan: {
        Row: {
          mealplan_id: number
          schedule_id: number
          schedulemealplan_id: number
        }
        Insert: {
          mealplan_id: number
          schedule_id: number
          schedulemealplan_id?: number
        }
        Update: {
          mealplan_id?: number
          schedule_id?: number
          schedulemealplan_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "schedulemealplan_mealplan_id_fkey"
            columns: ["mealplan_id"]
            isOneToOne: false
            referencedRelation: "mealplan"
            referencedColumns: ["mealplan_id"]
          },
          {
            foreignKeyName: "schedulemealplan_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "schedule"
            referencedColumns: ["schedule_id"]
          },
        ]
      }
      securitysettings: {
        Row: {
          id: number
          loginalerts: boolean
          twofactorauth: boolean
        }
        Insert: {
          id?: number
          loginalerts?: boolean
          twofactorauth?: boolean
        }
        Update: {
          id?: number
          loginalerts?: boolean
          twofactorauth?: boolean
        }
        Relationships: []
      }
      sleepquality: {
        Row: {
          hours: string
          id: number
          name: string
        }
        Insert: {
          hours: string
          id?: number
          name: string
        }
        Update: {
          hours?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      tag: {
        Row: {
          datecreated: string
          id: number
          name: string
          totalthreads: number
        }
        Insert: {
          datecreated: string
          id?: number
          name: string
          totalthreads?: number
        }
        Update: {
          datecreated?: string
          id?: number
          name?: string
          totalthreads?: number
        }
        Relationships: []
      }
      takingmedication: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      termcategory: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      terms: {
        Row: {
          category_id: number
          datecreated: string
          dateupdated: string
          description: string
          id: number
          term: string
          title: string
        }
        Insert: {
          category_id: number
          datecreated: string
          dateupdated: string
          description: string
          id?: number
          term: string
          title: string
        }
        Update: {
          category_id?: number
          datecreated?: string
          dateupdated?: string
          description?: string
          id?: number
          term?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "terms_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "termcategory"
            referencedColumns: ["id"]
          },
        ]
      }
      termsandconditions: {
        Row: {
          datecreated: string
          id: number
          user_id: string
        }
        Insert: {
          datecreated: string
          id?: number
          user_id: string
        }
        Update: {
          datecreated?: string
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "termsandconditions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      therapybooking: {
        Row: {
          datecreated: string
          duration: string
          therapybooking_id: number
        }
        Insert: {
          datecreated: string
          duration: string
          therapybooking_id?: number
        }
        Update: {
          datecreated?: string
          duration?: string
          therapybooking_id?: number
        }
        Relationships: []
      }
      therapyuserbooking: {
        Row: {
          psychologist_id: string
          therapybooking_id: number
          therapyuserbooking_id: number
          user_id: string
        }
        Insert: {
          psychologist_id: string
          therapybooking_id: number
          therapyuserbooking_id?: number
          user_id: string
        }
        Update: {
          psychologist_id?: string
          therapybooking_id?: number
          therapyuserbooking_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "therapyuserbooking_psychologist_id_fkey"
            columns: ["psychologist_id"]
            isOneToOne: false
            referencedRelation: "psychologist"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "therapyuserbooking_therapybooking_id_fkey"
            columns: ["therapybooking_id"]
            isOneToOne: false
            referencedRelation: "therapybooking"
            referencedColumns: ["therapybooking_id"]
          },
          {
            foreignKeyName: "therapyuserbooking_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      thread: {
        Row: {
          author_id: string
          authorname: string
          authorsurname: string
          datecreated: string
          id: number
          likes: number
          locked: boolean
          pictureurl: string
          posts: number
          subject: string
          tag_id: number
          title: string
        }
        Insert: {
          author_id: string
          authorname: string
          authorsurname: string
          datecreated?: string
          id?: number
          likes?: number
          locked?: boolean
          pictureurl: string
          posts?: number
          subject: string
          tag_id: number
          title: string
        }
        Update: {
          author_id?: string
          authorname?: string
          authorsurname?: string
          datecreated?: string
          id?: number
          likes?: number
          locked?: boolean
          pictureurl?: string
          posts?: number
          subject?: string
          tag_id?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "thread_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thread_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tag"
            referencedColumns: ["id"]
          },
        ]
      }
      threadlike: {
        Row: {
          id: number
          thread_id: number
          user_id: string
        }
        Insert: {
          id?: number
          thread_id: number
          user_id: string
        }
        Update: {
          id?: number
          thread_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "threadlike_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "thread"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "threadlike_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      trackinggoalcalory: {
        Row: {
          calorycount: number | null
          datecreated: string
          enddate: string
          id: number
          startdate: string
          user_id: string
        }
        Insert: {
          calorycount?: number | null
          datecreated?: string
          enddate: string
          id?: number
          startdate: string
          user_id: string
        }
        Update: {
          calorycount?: number | null
          datecreated?: string
          enddate?: string
          id?: number
          startdate?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trackinggoalcalory_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      trackinggoalsleep: {
        Row: {
          datecreated: string
          enddate: string
          id: number
          sleepcount: number | null
          startdate: string
          user_id: string
        }
        Insert: {
          datecreated?: string
          enddate: string
          id?: number
          sleepcount?: number | null
          startdate: string
          user_id: string
        }
        Update: {
          datecreated?: string
          enddate?: string
          id?: number
          sleepcount?: number | null
          startdate?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trackinggoalsleep_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      trackinggoalsteps: {
        Row: {
          datecreated: string
          enddate: string
          id: number
          startdate: string
          stepcount: number | null
          user_id: string
        }
        Insert: {
          datecreated?: string
          enddate: string
          id?: number
          startdate: string
          stepcount?: number | null
          user_id: string
        }
        Update: {
          datecreated?: string
          enddate?: string
          id?: number
          startdate?: string
          stepcount?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trackinggoalsteps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      trackinggoalwater: {
        Row: {
          datecreated: string
          enddate: string
          id: number
          startdate: string
          user_id: string
          watercount: number | null
        }
        Insert: {
          datecreated?: string
          enddate: string
          id?: number
          startdate: string
          user_id: string
          watercount?: number | null
        }
        Update: {
          datecreated?: string
          enddate?: string
          id?: number
          startdate?: string
          user_id?: string
          watercount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "trackinggoalwater_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      trackinggoalworkout: {
        Row: {
          datecreated: string
          enddate: string
          id: number
          startdate: string
          user_id: string
          workoutcount: number | null
        }
        Insert: {
          datecreated?: string
          enddate: string
          id?: number
          startdate: string
          user_id: string
          workoutcount?: number | null
        }
        Update: {
          datecreated?: string
          enddate?: string
          id?: number
          startdate?: string
          user_id?: string
          workoutcount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "trackinggoalworkout_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      trackingheartrate: {
        Row: {
          datecreated: string
          heartrate: number
          id: number
          user_id: string
        }
        Insert: {
          datecreated: string
          heartrate?: number
          id?: number
          user_id: string
        }
        Update: {
          datecreated?: string
          heartrate?: number
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trackingheartrate_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      trackingmeal: {
        Row: {
          datecreated: string
          id: number
          mealplan_id: number
          user_id: string
        }
        Insert: {
          datecreated?: string
          id?: number
          mealplan_id: number
          user_id: string
        }
        Update: {
          datecreated?: string
          id?: number
          mealplan_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trackingmeal_mealplan_id_fkey"
            columns: ["mealplan_id"]
            isOneToOne: false
            referencedRelation: "mealplan"
            referencedColumns: ["mealplan_id"]
          },
          {
            foreignKeyName: "trackingmeal_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      trackingmenstruation: {
        Row: {
          cycleend: string | null
          cyclelength: number | null
          datecreated: string
          dateupdated: string
          id: number
          periodend: string | null
          periodlength: number | null
          periodstart: string
          user_id: string
        }
        Insert: {
          cycleend?: string | null
          cyclelength?: number | null
          datecreated?: string
          dateupdated?: string
          id?: number
          periodend?: string | null
          periodlength?: number | null
          periodstart: string
          user_id: string
        }
        Update: {
          cycleend?: string | null
          cyclelength?: number | null
          datecreated?: string
          dateupdated?: string
          id?: number
          periodend?: string | null
          periodlength?: number | null
          periodstart?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trackingmenstruation_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      trackingsleep: {
        Row: {
          datecreated: string
          hours: number
          id: number
          user_id: string
        }
        Insert: {
          datecreated: string
          hours?: number
          id?: number
          user_id: string
        }
        Update: {
          datecreated?: string
          hours?: number
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trackingsleep_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      trackingsteps: {
        Row: {
          datecreated: string
          id: number
          steps: number
          user_id: string
        }
        Insert: {
          datecreated: string
          id?: number
          steps?: number
          user_id: string
        }
        Update: {
          datecreated?: string
          id?: number
          steps?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trackingsteps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      trackingtodo: {
        Row: {
          completed: boolean
          datecreated: string
          id: number
          name: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          datecreated?: string
          id?: number
          name: string
          user_id: string
        }
        Update: {
          completed?: boolean
          datecreated?: string
          id?: number
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trackingtodo_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      trackingwater: {
        Row: {
          bottles: number
          datecreated: string
          id: number
          user_id: string
        }
        Insert: {
          bottles?: number
          datecreated: string
          id?: number
          user_id: string
        }
        Update: {
          bottles?: number
          datecreated?: string
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trackingwater_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      trackingworkout: {
        Row: {
          datecreated: string
          id: number
          user_id: string
          workoutprogram_id: number
        }
        Insert: {
          datecreated?: string
          id?: number
          user_id: string
          workoutprogram_id: number
        }
        Update: {
          datecreated?: string
          id?: number
          user_id?: string
          workoutprogram_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "trackingworkout_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trackingworkout_workoutprogram_id_fkey"
            columns: ["workoutprogram_id"]
            isOneToOne: false
            referencedRelation: "workoutprogram"
            referencedColumns: ["id"]
          },
        ]
      }
      usercourse: {
        Row: {
          course_id: number
          datecreated: string
          user_id: string
          usercourse_id: number
        }
        Insert: {
          course_id: number
          datecreated?: string
          user_id: string
          usercourse_id?: number
        }
        Update: {
          course_id?: number
          datecreated?: string
          user_id?: string
          usercourse_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "usercourse_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "usercourse_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      userrole: {
        Row: {
          role_id: number
          user_id: string
          userrole_id: number
        }
        Insert: {
          role_id: number
          user_id: string
          userrole_id?: number
        }
        Update: {
          role_id?: number
          user_id?: string
          userrole_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "userrole_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "role"
            referencedColumns: ["role_id"]
          },
          {
            foreignKeyName: "userrole_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      usersettings: {
        Row: {
          generalsetting_id: number
          id: number
          notificationsetting_id: number
          privacysetting_id: number
          securitysetting_id: number
          user_id: string
        }
        Insert: {
          generalsetting_id: number
          id?: number
          notificationsetting_id: number
          privacysetting_id: number
          securitysetting_id: number
          user_id: string
        }
        Update: {
          generalsetting_id?: number
          id?: number
          notificationsetting_id?: number
          privacysetting_id?: number
          securitysetting_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usersettings_generalsetting_id_fkey"
            columns: ["generalsetting_id"]
            isOneToOne: false
            referencedRelation: "generalsettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usersettings_notificationsetting_id_fkey"
            columns: ["notificationsetting_id"]
            isOneToOne: false
            referencedRelation: "notificationsettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usersettings_privacysetting_id_fkey"
            columns: ["privacysetting_id"]
            isOneToOne: false
            referencedRelation: "privacysettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usersettings_securitysetting_id_fkey"
            columns: ["securitysetting_id"]
            isOneToOne: false
            referencedRelation: "securitysettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usersettings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      workout: {
        Row: {
          datecreated: string
          description: string
          id: number
          name: string
          pictureurl: string
        }
        Insert: {
          datecreated?: string
          description: string
          id?: number
          name: string
          pictureurl: string
        }
        Update: {
          datecreated?: string
          description?: string
          id?: number
          name?: string
          pictureurl?: string
        }
        Relationships: []
      }
      workoutexercise: {
        Row: {
          exercise_id: number
          id: number
          workout_id: number
        }
        Insert: {
          exercise_id: number
          id?: number
          workout_id: number
        }
        Update: {
          exercise_id?: number
          id?: number
          workout_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "workoutexercise_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercise"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workoutexercise_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workout"
            referencedColumns: ["id"]
          },
        ]
      }
      workoutprogram: {
        Row: {
          challengeworkout_id: number | null
          completed: boolean
          date: string
          id: number
          user_id: string
          workout_id: number
        }
        Insert: {
          challengeworkout_id?: number | null
          completed?: boolean
          date?: string
          id?: number
          user_id: string
          workout_id: number
        }
        Update: {
          challengeworkout_id?: number | null
          completed?: boolean
          date?: string
          id?: number
          user_id?: string
          workout_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "workoutprogram_challengeworkout_id_fkey"
            columns: ["challengeworkout_id"]
            isOneToOne: false
            referencedRelation: "challengeworkout"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workoutprogram_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workoutprogram_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workout"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      fn_match_vector: {
        Args: {
          query_embedding: string
          match_threshold: number
          match_count: number
        }
        Returns: {
          id: string
          body: string
          similarity: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
