

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "vector" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."create_user_settings"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  privacy_setting_id INT;
  general_setting_id INT;
  notification_setting_id INT;
  security_setting_id INT;
BEGIN
  -- Insert default settings into each settings table and capture the IDs
  INSERT INTO PrivacySettings (LastSeen, PublicProfile) VALUES (false, false) RETURNING id INTO privacy_setting_id;
  INSERT INTO GeneralSettings (DarkMode) VALUES (false) RETURNING id INTO general_setting_id;
  INSERT INTO NotificationSettings (PushNotification) VALUES (false) RETURNING id INTO notification_setting_id;
  INSERT INTO SecuritySettings (TwoFactorAuth, LoginAlerts) VALUES (false, false) RETURNING id INTO security_setting_id;

  -- Insert into UserSettings using the newly created setting IDs
  INSERT INTO UserSettings (User_ID, PrivacySetting_ID, GeneralSetting_ID, NotificationSetting_ID, SecuritySetting_ID)
  VALUES (NEW.id, privacy_setting_id, general_setting_id, notification_setting_id, security_setting_id);

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."create_user_settings"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."fn_match_vector"("query_embedding" "extensions"."vector", "match_threshold" double precision, "match_count" integer) RETURNS TABLE("id" "text", "body" "text", "similarity" double precision)
    LANGUAGE "sql"
    AS $$
  select 
  aiknowledge.id,
  aiknowledge.body,
  1 - (aiknowledge.vector <#> query_embedding) as similarity
  from aiknowledge
  where aiknowledge.vector <#> query_embedding < 1 - match_threshold
  order by aiknowledge.vector <#> query_embedding asc
  limit least(match_count, 200);
$$;


ALTER FUNCTION "public"."fn_match_vector"("query_embedding" "extensions"."vector", "match_threshold" double precision, "match_count" integer) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."aidata" (
    "aidata_id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "airesponsetemplate_id" integer NOT NULL,
    "step_data" "text",
    "calory_data" "text",
    "water_data" "text",
    "sleep_data" "text",
    "heartrate_data" "text"
);


ALTER TABLE "public"."aidata" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."aidata_aidata_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."aidata_aidata_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."aidata_aidata_id_seq" OWNED BY "public"."aidata"."aidata_id";



CREATE TABLE IF NOT EXISTS "public"."aiknowledge" (
    "id" "text" NOT NULL,
    "vector" "extensions"."vector" NOT NULL,
    "body" "text" NOT NULL,
    "datecreated" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."aiknowledge" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."airesponse" (
    "airesponse_id" integer NOT NULL,
    "aidata_id" integer,
    "reponse" "text" NOT NULL
);


ALTER TABLE "public"."airesponse" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."airesponse_airesponse_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."airesponse_airesponse_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."airesponse_airesponse_id_seq" OWNED BY "public"."airesponse"."airesponse_id";



CREATE TABLE IF NOT EXISTS "public"."airesponsetemplate" (
    "airesponsetemplate_id" integer NOT NULL,
    "template" "text" NOT NULL,
    "datecreated" timestamp without time zone NOT NULL,
    "dateupdated" timestamp without time zone
);


ALTER TABLE "public"."airesponsetemplate" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."airesponsetemplate_airesponsetemplate_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."airesponsetemplate_airesponsetemplate_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."airesponsetemplate_airesponsetemplate_id_seq" OWNED BY "public"."airesponsetemplate"."airesponsetemplate_id";



CREATE TABLE IF NOT EXISTS "public"."approvedstatus" (
    "id" integer NOT NULL,
    "status" character varying(255) NOT NULL
);


ALTER TABLE "public"."approvedstatus" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."approvedstatus_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."approvedstatus_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."approvedstatus_id_seq" OWNED BY "public"."approvedstatus"."id";



CREATE TABLE IF NOT EXISTS "public"."article" (
    "article_id" integer NOT NULL,
    "articlecategory_id" integer NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "datecreated" timestamp without time zone NOT NULL,
    "dateupdated" timestamp without time zone NOT NULL
);


ALTER TABLE "public"."article" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."article_article_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."article_article_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."article_article_id_seq" OWNED BY "public"."article"."article_id";



CREATE TABLE IF NOT EXISTS "public"."articlecategory" (
    "articlecategory_id" integer NOT NULL,
    "name" "text" NOT NULL
);


ALTER TABLE "public"."articlecategory" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."articlecategory_articlecategory_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."articlecategory_articlecategory_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."articlecategory_articlecategory_id_seq" OWNED BY "public"."articlecategory"."articlecategory_id";



CREATE TABLE IF NOT EXISTS "public"."assessmentbmi" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "weight" real NOT NULL,
    "height" real NOT NULL,
    "datecreated" "date" NOT NULL
);


ALTER TABLE "public"."assessmentbmi" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."assessmentbmi_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."assessmentbmi_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."assessmentbmi_id_seq" OWNED BY "public"."assessmentbmi"."id";



CREATE TABLE IF NOT EXISTS "public"."assessmentgoal" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "goal_id" integer NOT NULL,
    "datecreated" "date" NOT NULL
);


ALTER TABLE "public"."assessmentgoal" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."assessmentgoal_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."assessmentgoal_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."assessmentgoal_id_seq" OWNED BY "public"."assessmentgoal"."id";



CREATE TABLE IF NOT EXISTS "public"."assessmentmedication" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "medication_id" integer NOT NULL,
    "datecreated" "date" NOT NULL
);


ALTER TABLE "public"."assessmentmedication" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."assessmentmedication_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."assessmentmedication_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."assessmentmedication_id_seq" OWNED BY "public"."assessmentmedication"."id";



CREATE TABLE IF NOT EXISTS "public"."assessmentmenstruation" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "lastperiodstart" "date" NOT NULL,
    "lastperiodend" "date" NOT NULL,
    "cyclelength" integer NOT NULL,
    "datecreated" "date" NOT NULL
);


ALTER TABLE "public"."assessmentmenstruation" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."assessmentmenstruation_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."assessmentmenstruation_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."assessmentmenstruation_id_seq" OWNED BY "public"."assessmentmenstruation"."id";



CREATE TABLE IF NOT EXISTS "public"."assessmentmentalhealthsymptoms" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "mentalhealthsymptom_id" integer NOT NULL,
    "datecreated" "date" NOT NULL
);


ALTER TABLE "public"."assessmentmentalhealthsymptoms" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."assessmentmentalhealthsymptoms_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."assessmentmentalhealthsymptoms_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."assessmentmentalhealthsymptoms_id_seq" OWNED BY "public"."assessmentmentalhealthsymptoms"."id";



CREATE TABLE IF NOT EXISTS "public"."assessmentmood" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "mood_id" integer NOT NULL,
    "datecreated" "date" NOT NULL
);


ALTER TABLE "public"."assessmentmood" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."assessmentmood_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."assessmentmood_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."assessmentmood_id_seq" OWNED BY "public"."assessmentmood"."id";



CREATE TABLE IF NOT EXISTS "public"."assessmentphysicaldistress" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "answer" boolean NOT NULL,
    "datecreated" "date" NOT NULL
);


ALTER TABLE "public"."assessmentphysicaldistress" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."assessmentphysicaldistress_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."assessmentphysicaldistress_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."assessmentphysicaldistress_id_seq" OWNED BY "public"."assessmentphysicaldistress"."id";



CREATE TABLE IF NOT EXISTS "public"."assessmentprohelp" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "answer" boolean NOT NULL,
    "datecreated" "date" NOT NULL
);


ALTER TABLE "public"."assessmentprohelp" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."assessmentprohelp_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."assessmentprohelp_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."assessmentprohelp_id_seq" OWNED BY "public"."assessmentprohelp"."id";



CREATE TABLE IF NOT EXISTS "public"."assessmentsleepquality" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "sleepquality_id" integer NOT NULL,
    "datecreated" "date" NOT NULL
);


ALTER TABLE "public"."assessmentsleepquality" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."assessmentsleepquality_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."assessmentsleepquality_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."assessmentsleepquality_id_seq" OWNED BY "public"."assessmentsleepquality"."id";



CREATE TABLE IF NOT EXISTS "public"."assessmentstresslevel" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "level" integer NOT NULL,
    "datecreated" "date" NOT NULL
);


ALTER TABLE "public"."assessmentstresslevel" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."assessmentstresslevel_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."assessmentstresslevel_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."assessmentstresslevel_id_seq" OWNED BY "public"."assessmentstresslevel"."id";



CREATE TABLE IF NOT EXISTS "public"."assessmenttakingmedication" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "takingmedication_id" integer NOT NULL,
    "datecreated" "date" NOT NULL
);


ALTER TABLE "public"."assessmenttakingmedication" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."assessmenttakingmedication_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."assessmenttakingmedication_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."assessmenttakingmedication_id_seq" OWNED BY "public"."assessmenttakingmedication"."id";



CREATE TABLE IF NOT EXISTS "public"."bodypart" (
    "id" integer NOT NULL,
    "name" character varying(255) NOT NULL,
    "description" "text" NOT NULL
);


ALTER TABLE "public"."bodypart" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."bodypart_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."bodypart_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."bodypart_id_seq" OWNED BY "public"."bodypart"."id";



CREATE TABLE IF NOT EXISTS "public"."challenge" (
    "id" integer NOT NULL,
    "title" character varying(50) NOT NULL,
    "description" character varying(255) NOT NULL,
    "pictureurl" "text" NOT NULL,
    "datecreated" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."challenge" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."challenge_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."challenge_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."challenge_id_seq" OWNED BY "public"."challenge"."id";



CREATE TABLE IF NOT EXISTS "public"."challengeworkout" (
    "id" integer NOT NULL,
    "workout_id" integer NOT NULL,
    "challenge_id" integer NOT NULL,
    "date" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."challengeworkout" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."challengeworkout_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."challengeworkout_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."challengeworkout_id_seq" OWNED BY "public"."challengeworkout"."id";



CREATE TABLE IF NOT EXISTS "public"."class" (
    "class_id" integer NOT NULL,
    "course_id" integer NOT NULL,
    "classdescription" character varying(255) NOT NULL,
    "duration" integer NOT NULL,
    "starttime" time without time zone NOT NULL,
    "endtime" time without time zone NOT NULL,
    "date" "date" DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."class" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."class_class_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."class_class_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."class_class_id_seq" OWNED BY "public"."class"."class_id";



CREATE TABLE IF NOT EXISTS "public"."course" (
    "course_id" integer NOT NULL,
    "coursedescription" character varying(255),
    "coordinator" character varying(255),
    "lecturer" character varying(255)
);


ALTER TABLE "public"."course" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."course_course_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."course_course_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."course_course_id_seq" OWNED BY "public"."course"."course_id";



CREATE TABLE IF NOT EXISTS "public"."dietitian" (
    "user_id" "uuid" NOT NULL,
    "professionalstatus_id" integer NOT NULL,
    "approvedstatus_id" integer NOT NULL,
    "qualification" character varying(255) NOT NULL,
    "yearsofexperience" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."dietitian" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."dietitianguide" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "datecreated" timestamp without time zone NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "content" "text" NOT NULL,
    "pictureurl" "text" NOT NULL
);


ALTER TABLE "public"."dietitianguide" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."dietitianguide_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."dietitianguide_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."dietitianguide_id_seq" OWNED BY "public"."dietitianguide"."id";



CREATE TABLE IF NOT EXISTS "public"."equipment" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL,
    "description" "text" DEFAULT "now"() NOT NULL,
    "pictureurl" "text" NOT NULL
);


ALTER TABLE "public"."equipment" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."equipment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."equipment_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."equipment_id_seq" OWNED BY "public"."equipment"."id";



CREATE TABLE IF NOT EXISTS "public"."exercise" (
    "id" integer NOT NULL,
    "bodypart_id" integer NOT NULL,
    "name" character varying(255) NOT NULL,
    "description" "text" NOT NULL,
    "sets" integer DEFAULT 1 NOT NULL,
    "repititions" integer DEFAULT 1 NOT NULL,
    "duration" integer DEFAULT 0 NOT NULL,
    "weight" integer
);


ALTER TABLE "public"."exercise" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."exercise_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."exercise_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."exercise_id_seq" OWNED BY "public"."exercise"."id";



CREATE TABLE IF NOT EXISTS "public"."exerciseequipment" (
    "id" integer NOT NULL,
    "exercise_id" integer NOT NULL,
    "equipment_id" integer NOT NULL
);


ALTER TABLE "public"."exerciseequipment" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."exerciseequipment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."exerciseequipment_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."exerciseequipment_id_seq" OWNED BY "public"."exerciseequipment"."id";



CREATE TABLE IF NOT EXISTS "public"."exerciseinstruction" (
    "id" integer NOT NULL,
    "exercise_id" integer NOT NULL,
    "instruction" "text" NOT NULL
);


ALTER TABLE "public"."exerciseinstruction" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."exerciseinstruction_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."exerciseinstruction_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."exerciseinstruction_id_seq" OWNED BY "public"."exerciseinstruction"."id";



CREATE TABLE IF NOT EXISTS "public"."faq" (
    "faq_id" integer NOT NULL,
    "article_id" integer NOT NULL,
    "question" "text" NOT NULL,
    "answer" "text" NOT NULL,
    "isactive" boolean DEFAULT true NOT NULL
);


ALTER TABLE "public"."faq" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."faq_faq_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."faq_faq_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."faq_faq_id_seq" OWNED BY "public"."faq"."faq_id";



CREATE TABLE IF NOT EXISTS "public"."feedback" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "rating" real DEFAULT 0 NOT NULL,
    "difficulty" "text" NOT NULL,
    "liked" "text" NOT NULL,
    "datecreated" timestamp without time zone NOT NULL
);


ALTER TABLE "public"."feedback" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."feedback_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."feedback_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."feedback_id_seq" OWNED BY "public"."feedback"."id";



CREATE TABLE IF NOT EXISTS "public"."follow" (
    "id" integer NOT NULL,
    "following_id" "uuid" NOT NULL,
    "follower_id" "uuid" NOT NULL,
    "datecreated" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."follow" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."follow_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."follow_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."follow_id_seq" OWNED BY "public"."follow"."id";



CREATE TABLE IF NOT EXISTS "public"."food" (
    "food_id" integer NOT NULL,
    "foodcategory_id" integer NOT NULL,
    "name" character varying(255) NOT NULL
);


ALTER TABLE "public"."food" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."food_food_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."food_food_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."food_food_id_seq" OWNED BY "public"."food"."food_id";



CREATE TABLE IF NOT EXISTS "public"."foodcategory" (
    "foodcategory_id" integer NOT NULL,
    "name" character varying(255) NOT NULL,
    "description" character varying(255) NOT NULL
);


ALTER TABLE "public"."foodcategory" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."foodcategory_foodcategory_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."foodcategory_foodcategory_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."foodcategory_foodcategory_id_seq" OWNED BY "public"."foodcategory"."foodcategory_id";



CREATE TABLE IF NOT EXISTS "public"."generalsettings" (
    "id" integer NOT NULL,
    "darkmode" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."generalsettings" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."generalsettings_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."generalsettings_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."generalsettings_id_seq" OWNED BY "public"."generalsettings"."id";



CREATE TABLE IF NOT EXISTS "public"."goals" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL
);


ALTER TABLE "public"."goals" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."goals_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."goals_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."goals_id_seq" OWNED BY "public"."goals"."id";



CREATE TABLE IF NOT EXISTS "public"."meal" (
    "meal_id" integer NOT NULL,
    "mealtype_id" integer NOT NULL,
    "name" character varying(255) NOT NULL,
    "description" character varying(255) NOT NULL,
    "pictureurl" "text",
    "price" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."meal" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."meal_meal_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."meal_meal_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."meal_meal_id_seq" OWNED BY "public"."meal"."meal_id";



CREATE TABLE IF NOT EXISTS "public"."mealfood" (
    "mealfood_id" integer NOT NULL,
    "meal_id" integer NOT NULL,
    "food_id" integer NOT NULL,
    "quantity" integer NOT NULL
);


ALTER TABLE "public"."mealfood" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."mealfood_mealfood_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."mealfood_mealfood_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."mealfood_mealfood_id_seq" OWNED BY "public"."mealfood"."mealfood_id";



CREATE TABLE IF NOT EXISTS "public"."mealinstruction" (
    "mealinstruction_id" integer NOT NULL,
    "meal_id" integer NOT NULL,
    "instruction" "text"
);


ALTER TABLE "public"."mealinstruction" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."mealinstruction_mealinstruction_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."mealinstruction_mealinstruction_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."mealinstruction_mealinstruction_id_seq" OWNED BY "public"."mealinstruction"."mealinstruction_id";



CREATE TABLE IF NOT EXISTS "public"."mealplan" (
    "mealplan_id" integer NOT NULL,
    "meal_id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "mealtime" timestamp without time zone NOT NULL,
    "completed" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."mealplan" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."mealplan_mealplan_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."mealplan_mealplan_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."mealplan_mealplan_id_seq" OWNED BY "public"."mealplan"."mealplan_id";



CREATE TABLE IF NOT EXISTS "public"."mealtype" (
    "mealtype_id" integer NOT NULL,
    "mealtype" character varying(255) NOT NULL
);


ALTER TABLE "public"."mealtype" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."mealtype_mealtype_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."mealtype_mealtype_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."mealtype_mealtype_id_seq" OWNED BY "public"."mealtype"."mealtype_id";



CREATE TABLE IF NOT EXISTS "public"."medication" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL
);


ALTER TABLE "public"."medication" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."medication_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."medication_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."medication_id_seq" OWNED BY "public"."medication"."id";



CREATE TABLE IF NOT EXISTS "public"."mentalhealthsymptom" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL
);


ALTER TABLE "public"."mentalhealthsymptom" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."mentalhealthsymptom_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."mentalhealthsymptom_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."mentalhealthsymptom_id_seq" OWNED BY "public"."mentalhealthsymptom"."id";



CREATE TABLE IF NOT EXISTS "public"."message" (
    "id" integer NOT NULL,
    "sender_id" "uuid" NOT NULL,
    "receiver_id" "uuid" NOT NULL,
    "message" "text",
    "isread" boolean DEFAULT false NOT NULL,
    "datecreated" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."message" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."message_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."message_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."message_id_seq" OWNED BY "public"."message"."id";



CREATE TABLE IF NOT EXISTS "public"."moods" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL
);


ALTER TABLE "public"."moods" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."moods_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."moods_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."moods_id_seq" OWNED BY "public"."moods"."id";



CREATE TABLE IF NOT EXISTS "public"."notification" (
    "notification_id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "notification" character varying(255),
    "datecreated" timestamp without time zone NOT NULL
);


ALTER TABLE "public"."notification" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."notification_notification_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."notification_notification_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."notification_notification_id_seq" OWNED BY "public"."notification"."notification_id";



CREATE TABLE IF NOT EXISTS "public"."notificationsettings" (
    "id" integer NOT NULL,
    "pushnotification" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."notificationsettings" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."notificationsettings_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."notificationsettings_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."notificationsettings_id_seq" OWNED BY "public"."notificationsettings"."id";



CREATE TABLE IF NOT EXISTS "public"."nutritionalfact" (
    "nutritionalfact_id" integer NOT NULL,
    "food_id" integer NOT NULL,
    "totalcarbs" integer DEFAULT 0 NOT NULL,
    "calcium" integer DEFAULT 0 NOT NULL,
    "cholesterol" integer DEFAULT 0 NOT NULL,
    "dietaryfiber" integer DEFAULT 0 NOT NULL,
    "saturatedfat" integer DEFAULT 0 NOT NULL,
    "polyunsaturatedfat" integer DEFAULT 0 NOT NULL,
    "monounsaturatedfat" integer DEFAULT 0 NOT NULL,
    "transfat" integer DEFAULT 0 NOT NULL,
    "totalfat" integer DEFAULT 0 NOT NULL,
    "iron" integer DEFAULT 0 NOT NULL,
    "potassium" integer DEFAULT 0 NOT NULL,
    "protein" integer DEFAULT 0 NOT NULL,
    "sugar" integer DEFAULT 0 NOT NULL,
    "sodium" integer DEFAULT 0 NOT NULL,
    "vitamina" integer DEFAULT 0 NOT NULL,
    "vitaminc" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."nutritionalfact" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."nutritionalfact_nutritionalfact_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."nutritionalfact_nutritionalfact_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."nutritionalfact_nutritionalfact_id_seq" OWNED BY "public"."nutritionalfact"."nutritionalfact_id";



CREATE TABLE IF NOT EXISTS "public"."physio" (
    "user_id" "uuid" NOT NULL,
    "professionalstatus_id" integer NOT NULL,
    "approvedstatus_id" integer NOT NULL,
    "qualification" character varying(255) NOT NULL,
    "yearsofexperience" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."physio" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."physiobooking" (
    "id" integer NOT NULL,
    "datecreated" timestamp without time zone NOT NULL,
    "duration" time without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."physiobooking" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."physiobooking_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."physiobooking_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."physiobooking_id_seq" OWNED BY "public"."physiobooking"."id";



CREATE TABLE IF NOT EXISTS "public"."physioguide" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "datecreated" timestamp without time zone DEFAULT "now"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "content" "text" NOT NULL,
    "pictureurl" "text" NOT NULL
);


ALTER TABLE "public"."physioguide" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."physioguide_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."physioguide_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."physioguide_id_seq" OWNED BY "public"."physioguide"."id";



CREATE TABLE IF NOT EXISTS "public"."physiouserbooking" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "physio_id" "uuid" NOT NULL,
    "physiobooking_id" integer NOT NULL
);


ALTER TABLE "public"."physiouserbooking" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."physiouserbooking_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."physiouserbooking_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."physiouserbooking_id_seq" OWNED BY "public"."physiouserbooking"."id";



CREATE TABLE IF NOT EXISTS "public"."post" (
    "id" integer NOT NULL,
    "thread_id" integer NOT NULL,
    "author_id" "uuid" NOT NULL,
    "authorname" "text" NOT NULL,
    "authorsurname" "text" NOT NULL,
    "post" "text" NOT NULL,
    "likes" integer DEFAULT 0 NOT NULL,
    "datecreated" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."post" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."post_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."post_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."post_id_seq" OWNED BY "public"."post"."id";



CREATE TABLE IF NOT EXISTS "public"."postlike" (
    "id" integer NOT NULL,
    "post_id" integer NOT NULL,
    "user_id" "uuid" NOT NULL
);


ALTER TABLE "public"."postlike" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."postlike_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."postlike_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."postlike_id_seq" OWNED BY "public"."postlike"."id";



CREATE TABLE IF NOT EXISTS "public"."privacysettings" (
    "id" integer NOT NULL,
    "lastseen" boolean DEFAULT false NOT NULL,
    "publicprofile" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."privacysettings" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."privacysettings_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."privacysettings_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."privacysettings_id_seq" OWNED BY "public"."privacysettings"."id";



CREATE TABLE IF NOT EXISTS "public"."professionalstatus" (
    "professionalstatus_id" integer NOT NULL,
    "status" character varying(255) NOT NULL
);


ALTER TABLE "public"."professionalstatus" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."professionalstatus_professionalstatus_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."professionalstatus_professionalstatus_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."professionalstatus_professionalstatus_id_seq" OWNED BY "public"."professionalstatus"."professionalstatus_id";



CREATE TABLE IF NOT EXISTS "public"."profile" (
    "profile_id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "username" character varying(255),
    "gender" character varying(20),
    "firstname" character varying(255),
    "lastname" character varying(255),
    "avatarurl" "text",
    "biography" "text",
    "dateofbirth" timestamp without time zone,
    "totalfollowings" integer DEFAULT 0,
    "totalfollowers" integer DEFAULT 0,
    "datecreated" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."profile" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."profile_profile_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."profile_profile_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."profile_profile_id_seq" OWNED BY "public"."profile"."profile_id";



CREATE TABLE IF NOT EXISTS "public"."psychologist" (
    "user_id" "uuid" NOT NULL,
    "professionalstatus_id" integer NOT NULL,
    "approvedstatus_id" integer NOT NULL,
    "qualification" character varying(255) NOT NULL,
    "yearsofexperience" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."psychologist" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."psychologistguide" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "datecreated" timestamp without time zone DEFAULT "now"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "content" "text" NOT NULL,
    "pictureurl" "text" NOT NULL
);


ALTER TABLE "public"."psychologistguide" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."psychologistguide_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."psychologistguide_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."psychologistguide_id_seq" OWNED BY "public"."psychologistguide"."id";



CREATE TABLE IF NOT EXISTS "public"."role" (
    "role_id" integer NOT NULL,
    "name" character varying(255),
    "description" character varying(255)
);


ALTER TABLE "public"."role" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."role_role_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."role_role_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."role_role_id_seq" OWNED BY "public"."role"."role_id";



CREATE TABLE IF NOT EXISTS "public"."schedule" (
    "schedule_id" integer NOT NULL,
    "user_id" "uuid",
    "workoutprogram_id" integer,
    "physiobooking_id" integer,
    "therapybooking_id" integer
);


ALTER TABLE "public"."schedule" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."schedule_schedule_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."schedule_schedule_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."schedule_schedule_id_seq" OWNED BY "public"."schedule"."schedule_id";



CREATE TABLE IF NOT EXISTS "public"."scheduleclass" (
    "scheduleclass_id" integer NOT NULL,
    "class_id" integer NOT NULL,
    "schedule_id" integer NOT NULL
);


ALTER TABLE "public"."scheduleclass" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."scheduleclass_scheduleclass_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."scheduleclass_scheduleclass_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."scheduleclass_scheduleclass_id_seq" OWNED BY "public"."scheduleclass"."scheduleclass_id";



CREATE TABLE IF NOT EXISTS "public"."schedulemealplan" (
    "schedulemealplan_id" integer NOT NULL,
    "mealplan_id" integer NOT NULL,
    "schedule_id" integer NOT NULL
);


ALTER TABLE "public"."schedulemealplan" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."schedulemealplan_schedulemealplan_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."schedulemealplan_schedulemealplan_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."schedulemealplan_schedulemealplan_id_seq" OWNED BY "public"."schedulemealplan"."schedulemealplan_id";



CREATE TABLE IF NOT EXISTS "public"."securitysettings" (
    "id" integer NOT NULL,
    "twofactorauth" boolean DEFAULT false NOT NULL,
    "loginalerts" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."securitysettings" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."securitysettings_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."securitysettings_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."securitysettings_id_seq" OWNED BY "public"."securitysettings"."id";



CREATE TABLE IF NOT EXISTS "public"."sleepquality" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL,
    "hours" "text" NOT NULL
);


ALTER TABLE "public"."sleepquality" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."sleepquality_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."sleepquality_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."sleepquality_id_seq" OWNED BY "public"."sleepquality"."id";



CREATE TABLE IF NOT EXISTS "public"."tag" (
    "id" integer NOT NULL,
    "name" character varying(255) NOT NULL,
    "datecreated" timestamp without time zone NOT NULL,
    "totalthreads" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."tag" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."tag_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."tag_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."tag_id_seq" OWNED BY "public"."tag"."id";



CREATE TABLE IF NOT EXISTS "public"."takingmedication" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL
);


ALTER TABLE "public"."takingmedication" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."takingmedication_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."takingmedication_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."takingmedication_id_seq" OWNED BY "public"."takingmedication"."id";



CREATE TABLE IF NOT EXISTS "public"."termcategory" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL
);


ALTER TABLE "public"."termcategory" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."termcategory_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."termcategory_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."termcategory_id_seq" OWNED BY "public"."termcategory"."id";



CREATE TABLE IF NOT EXISTS "public"."terms" (
    "id" integer NOT NULL,
    "category_id" integer NOT NULL,
    "title" character varying(255) NOT NULL,
    "description" "text" NOT NULL,
    "term" "text" NOT NULL,
    "datecreated" timestamp without time zone NOT NULL,
    "dateupdated" timestamp without time zone NOT NULL
);


ALTER TABLE "public"."terms" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."terms_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."terms_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."terms_id_seq" OWNED BY "public"."terms"."id";



CREATE TABLE IF NOT EXISTS "public"."termsandconditions" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "datecreated" timestamp without time zone NOT NULL
);


ALTER TABLE "public"."termsandconditions" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."termsandconditions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."termsandconditions_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."termsandconditions_id_seq" OWNED BY "public"."termsandconditions"."id";



CREATE TABLE IF NOT EXISTS "public"."therapybooking" (
    "therapybooking_id" integer NOT NULL,
    "datecreated" timestamp without time zone NOT NULL,
    "duration" time without time zone NOT NULL
);


ALTER TABLE "public"."therapybooking" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."therapybooking_therapybooking_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."therapybooking_therapybooking_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."therapybooking_therapybooking_id_seq" OWNED BY "public"."therapybooking"."therapybooking_id";



CREATE TABLE IF NOT EXISTS "public"."therapyuserbooking" (
    "therapyuserbooking_id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "psychologist_id" "uuid" NOT NULL,
    "therapybooking_id" integer NOT NULL
);


ALTER TABLE "public"."therapyuserbooking" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."therapyuserbooking_therapyuserbooking_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."therapyuserbooking_therapyuserbooking_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."therapyuserbooking_therapyuserbooking_id_seq" OWNED BY "public"."therapyuserbooking"."therapyuserbooking_id";



CREATE TABLE IF NOT EXISTS "public"."thread" (
    "id" integer NOT NULL,
    "tag_id" integer NOT NULL,
    "author_id" "uuid" NOT NULL,
    "authorname" "text" NOT NULL,
    "authorsurname" "text" NOT NULL,
    "title" character varying(50) NOT NULL,
    "subject" character varying(200) NOT NULL,
    "locked" boolean DEFAULT false NOT NULL,
    "pictureurl" "text" NOT NULL,
    "likes" integer DEFAULT 0 NOT NULL,
    "posts" integer DEFAULT 0 NOT NULL,
    "datecreated" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."thread" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."thread_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."thread_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."thread_id_seq" OWNED BY "public"."thread"."id";



CREATE TABLE IF NOT EXISTS "public"."threadlike" (
    "id" integer NOT NULL,
    "thread_id" integer NOT NULL,
    "user_id" "uuid" NOT NULL
);


ALTER TABLE "public"."threadlike" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."threadlike_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."threadlike_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."threadlike_id_seq" OWNED BY "public"."threadlike"."id";



CREATE TABLE IF NOT EXISTS "public"."trackinggoalcalory" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "calorycount" integer,
    "startdate" "date" NOT NULL,
    "enddate" "date" NOT NULL,
    "datecreated" "date" DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."trackinggoalcalory" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."trackinggoalcalory_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."trackinggoalcalory_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."trackinggoalcalory_id_seq" OWNED BY "public"."trackinggoalcalory"."id";



CREATE TABLE IF NOT EXISTS "public"."trackinggoalsleep" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "sleepcount" integer,
    "startdate" "date" NOT NULL,
    "enddate" "date" NOT NULL,
    "datecreated" "date" DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."trackinggoalsleep" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."trackinggoalsleep_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."trackinggoalsleep_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."trackinggoalsleep_id_seq" OWNED BY "public"."trackinggoalsleep"."id";



CREATE TABLE IF NOT EXISTS "public"."trackinggoalsteps" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "stepcount" integer,
    "startdate" "date" NOT NULL,
    "enddate" "date" NOT NULL,
    "datecreated" "date" DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."trackinggoalsteps" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."trackinggoalsteps_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."trackinggoalsteps_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."trackinggoalsteps_id_seq" OWNED BY "public"."trackinggoalsteps"."id";



CREATE TABLE IF NOT EXISTS "public"."trackinggoalwater" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "watercount" integer,
    "startdate" "date" NOT NULL,
    "enddate" "date" NOT NULL,
    "datecreated" "date" DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."trackinggoalwater" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."trackinggoalwater_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."trackinggoalwater_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."trackinggoalwater_id_seq" OWNED BY "public"."trackinggoalwater"."id";



CREATE TABLE IF NOT EXISTS "public"."trackinggoalworkout" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "workoutcount" integer,
    "startdate" "date" NOT NULL,
    "enddate" "date" NOT NULL,
    "datecreated" "date" DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."trackinggoalworkout" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."trackinggoalworkout_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."trackinggoalworkout_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."trackinggoalworkout_id_seq" OWNED BY "public"."trackinggoalworkout"."id";



CREATE TABLE IF NOT EXISTS "public"."trackingheartrate" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "heartrate" integer DEFAULT 0 NOT NULL,
    "datecreated" "date" NOT NULL
);


ALTER TABLE "public"."trackingheartrate" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."trackingheartrate_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."trackingheartrate_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."trackingheartrate_id_seq" OWNED BY "public"."trackingheartrate"."id";



CREATE TABLE IF NOT EXISTS "public"."trackingmeal" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "mealplan_id" integer NOT NULL,
    "datecreated" "date" DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."trackingmeal" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."trackingmeal_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."trackingmeal_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."trackingmeal_id_seq" OWNED BY "public"."trackingmeal"."id";



CREATE TABLE IF NOT EXISTS "public"."trackingmenstruation" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "periodstart" "date" NOT NULL,
    "periodend" "date",
    "periodlength" integer,
    "cycleend" "date",
    "cyclelength" integer,
    "datecreated" "date" DEFAULT "now"() NOT NULL,
    "dateupdated" "date" DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."trackingmenstruation" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."trackingmenstruation_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."trackingmenstruation_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."trackingmenstruation_id_seq" OWNED BY "public"."trackingmenstruation"."id";



CREATE TABLE IF NOT EXISTS "public"."trackingsleep" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "hours" integer DEFAULT 0 NOT NULL,
    "datecreated" "date" NOT NULL
);


ALTER TABLE "public"."trackingsleep" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."trackingsleep_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."trackingsleep_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."trackingsleep_id_seq" OWNED BY "public"."trackingsleep"."id";



CREATE TABLE IF NOT EXISTS "public"."trackingsteps" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "steps" integer DEFAULT 0 NOT NULL,
    "datecreated" "date" NOT NULL
);


ALTER TABLE "public"."trackingsteps" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."trackingsteps_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."trackingsteps_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."trackingsteps_id_seq" OWNED BY "public"."trackingsteps"."id";



CREATE TABLE IF NOT EXISTS "public"."trackingtodo" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "completed" boolean DEFAULT false NOT NULL,
    "datecreated" "date" DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."trackingtodo" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."trackingtodo_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."trackingtodo_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."trackingtodo_id_seq" OWNED BY "public"."trackingtodo"."id";



CREATE TABLE IF NOT EXISTS "public"."trackingwater" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "bottles" integer DEFAULT 0 NOT NULL,
    "datecreated" timestamp without time zone NOT NULL
);


ALTER TABLE "public"."trackingwater" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."trackingwater_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."trackingwater_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."trackingwater_id_seq" OWNED BY "public"."trackingwater"."id";



CREATE TABLE IF NOT EXISTS "public"."trackingworkout" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "workoutprogram_id" integer NOT NULL,
    "datecreated" "date" DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."trackingworkout" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."trackingworkout_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."trackingworkout_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."trackingworkout_id_seq" OWNED BY "public"."trackingworkout"."id";



CREATE TABLE IF NOT EXISTS "public"."usercourse" (
    "usercourse_id" integer NOT NULL,
    "course_id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "datecreated" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."usercourse" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."usercourse_usercourse_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."usercourse_usercourse_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."usercourse_usercourse_id_seq" OWNED BY "public"."usercourse"."usercourse_id";



CREATE TABLE IF NOT EXISTS "public"."userrole" (
    "userrole_id" integer NOT NULL,
    "role_id" integer NOT NULL,
    "user_id" "uuid" NOT NULL
);


ALTER TABLE "public"."userrole" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."userrole_userrole_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."userrole_userrole_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."userrole_userrole_id_seq" OWNED BY "public"."userrole"."userrole_id";



CREATE TABLE IF NOT EXISTS "public"."usersettings" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "privacysetting_id" integer NOT NULL,
    "generalsetting_id" integer NOT NULL,
    "notificationsetting_id" integer NOT NULL,
    "securitysetting_id" integer NOT NULL
);


ALTER TABLE "public"."usersettings" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."usersettings_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."usersettings_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."usersettings_id_seq" OWNED BY "public"."usersettings"."id";



CREATE TABLE IF NOT EXISTS "public"."workout" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "pictureurl" "text" NOT NULL,
    "datecreated" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."workout" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."workout_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."workout_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."workout_id_seq" OWNED BY "public"."workout"."id";



CREATE TABLE IF NOT EXISTS "public"."workoutexercise" (
    "id" integer NOT NULL,
    "exercise_id" integer NOT NULL,
    "workout_id" integer NOT NULL
);


ALTER TABLE "public"."workoutexercise" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."workoutexercise_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."workoutexercise_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."workoutexercise_id_seq" OWNED BY "public"."workoutexercise"."id";



CREATE TABLE IF NOT EXISTS "public"."workoutprogram" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "workout_id" integer NOT NULL,
    "date" "date" DEFAULT "now"() NOT NULL,
    "challengeworkout_id" integer,
    "completed" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."workoutprogram" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."workoutprogram_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."workoutprogram_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."workoutprogram_id_seq" OWNED BY "public"."workoutprogram"."id";



ALTER TABLE ONLY "public"."aidata" ALTER COLUMN "aidata_id" SET DEFAULT "nextval"('"public"."aidata_aidata_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."airesponse" ALTER COLUMN "airesponse_id" SET DEFAULT "nextval"('"public"."airesponse_airesponse_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."airesponsetemplate" ALTER COLUMN "airesponsetemplate_id" SET DEFAULT "nextval"('"public"."airesponsetemplate_airesponsetemplate_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."approvedstatus" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."approvedstatus_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."article" ALTER COLUMN "article_id" SET DEFAULT "nextval"('"public"."article_article_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."articlecategory" ALTER COLUMN "articlecategory_id" SET DEFAULT "nextval"('"public"."articlecategory_articlecategory_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."assessmentbmi" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."assessmentbmi_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."assessmentgoal" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."assessmentgoal_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."assessmentmedication" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."assessmentmedication_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."assessmentmenstruation" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."assessmentmenstruation_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."assessmentmentalhealthsymptoms" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."assessmentmentalhealthsymptoms_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."assessmentmood" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."assessmentmood_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."assessmentphysicaldistress" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."assessmentphysicaldistress_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."assessmentprohelp" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."assessmentprohelp_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."assessmentsleepquality" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."assessmentsleepquality_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."assessmentstresslevel" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."assessmentstresslevel_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."assessmenttakingmedication" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."assessmenttakingmedication_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."bodypart" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."bodypart_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."challenge" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."challenge_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."challengeworkout" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."challengeworkout_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."class" ALTER COLUMN "class_id" SET DEFAULT "nextval"('"public"."class_class_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."course" ALTER COLUMN "course_id" SET DEFAULT "nextval"('"public"."course_course_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."dietitianguide" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."dietitianguide_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."equipment" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."equipment_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."exercise" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."exercise_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."exerciseequipment" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."exerciseequipment_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."exerciseinstruction" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."exerciseinstruction_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."faq" ALTER COLUMN "faq_id" SET DEFAULT "nextval"('"public"."faq_faq_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."feedback" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."feedback_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."follow" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."follow_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."food" ALTER COLUMN "food_id" SET DEFAULT "nextval"('"public"."food_food_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."foodcategory" ALTER COLUMN "foodcategory_id" SET DEFAULT "nextval"('"public"."foodcategory_foodcategory_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."generalsettings" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."generalsettings_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."goals" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."goals_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."meal" ALTER COLUMN "meal_id" SET DEFAULT "nextval"('"public"."meal_meal_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."mealfood" ALTER COLUMN "mealfood_id" SET DEFAULT "nextval"('"public"."mealfood_mealfood_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."mealinstruction" ALTER COLUMN "mealinstruction_id" SET DEFAULT "nextval"('"public"."mealinstruction_mealinstruction_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."mealplan" ALTER COLUMN "mealplan_id" SET DEFAULT "nextval"('"public"."mealplan_mealplan_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."mealtype" ALTER COLUMN "mealtype_id" SET DEFAULT "nextval"('"public"."mealtype_mealtype_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."medication" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."medication_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."mentalhealthsymptom" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."mentalhealthsymptom_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."message" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."message_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."moods" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."moods_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."notification" ALTER COLUMN "notification_id" SET DEFAULT "nextval"('"public"."notification_notification_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."notificationsettings" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."notificationsettings_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."nutritionalfact" ALTER COLUMN "nutritionalfact_id" SET DEFAULT "nextval"('"public"."nutritionalfact_nutritionalfact_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."physiobooking" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."physiobooking_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."physioguide" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."physioguide_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."physiouserbooking" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."physiouserbooking_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."post" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."post_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."postlike" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."postlike_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."privacysettings" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."privacysettings_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."professionalstatus" ALTER COLUMN "professionalstatus_id" SET DEFAULT "nextval"('"public"."professionalstatus_professionalstatus_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."profile" ALTER COLUMN "profile_id" SET DEFAULT "nextval"('"public"."profile_profile_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."psychologistguide" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."psychologistguide_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."role" ALTER COLUMN "role_id" SET DEFAULT "nextval"('"public"."role_role_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."schedule" ALTER COLUMN "schedule_id" SET DEFAULT "nextval"('"public"."schedule_schedule_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."scheduleclass" ALTER COLUMN "scheduleclass_id" SET DEFAULT "nextval"('"public"."scheduleclass_scheduleclass_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."schedulemealplan" ALTER COLUMN "schedulemealplan_id" SET DEFAULT "nextval"('"public"."schedulemealplan_schedulemealplan_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."securitysettings" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."securitysettings_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."sleepquality" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."sleepquality_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."tag" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."tag_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."takingmedication" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."takingmedication_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."termcategory" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."termcategory_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."terms" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."terms_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."termsandconditions" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."termsandconditions_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."therapybooking" ALTER COLUMN "therapybooking_id" SET DEFAULT "nextval"('"public"."therapybooking_therapybooking_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."therapyuserbooking" ALTER COLUMN "therapyuserbooking_id" SET DEFAULT "nextval"('"public"."therapyuserbooking_therapyuserbooking_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."thread" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."thread_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."threadlike" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."threadlike_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."trackinggoalcalory" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."trackinggoalcalory_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."trackinggoalsleep" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."trackinggoalsleep_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."trackinggoalsteps" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."trackinggoalsteps_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."trackinggoalwater" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."trackinggoalwater_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."trackinggoalworkout" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."trackinggoalworkout_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."trackingheartrate" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."trackingheartrate_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."trackingmeal" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."trackingmeal_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."trackingmenstruation" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."trackingmenstruation_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."trackingsleep" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."trackingsleep_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."trackingsteps" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."trackingsteps_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."trackingtodo" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."trackingtodo_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."trackingwater" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."trackingwater_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."trackingworkout" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."trackingworkout_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."usercourse" ALTER COLUMN "usercourse_id" SET DEFAULT "nextval"('"public"."usercourse_usercourse_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."userrole" ALTER COLUMN "userrole_id" SET DEFAULT "nextval"('"public"."userrole_userrole_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."usersettings" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."usersettings_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."workout" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."workout_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."workoutexercise" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."workoutexercise_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."workoutprogram" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."workoutprogram_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."aidata"
    ADD CONSTRAINT "aidata_pkey" PRIMARY KEY ("aidata_id");



ALTER TABLE ONLY "public"."aiknowledge"
    ADD CONSTRAINT "aiknowledge_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."airesponse"
    ADD CONSTRAINT "airesponse_pkey" PRIMARY KEY ("airesponse_id");



ALTER TABLE ONLY "public"."airesponsetemplate"
    ADD CONSTRAINT "airesponsetemplate_pkey" PRIMARY KEY ("airesponsetemplate_id");



ALTER TABLE ONLY "public"."approvedstatus"
    ADD CONSTRAINT "approvedstatus_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."article"
    ADD CONSTRAINT "article_pkey" PRIMARY KEY ("article_id");



ALTER TABLE ONLY "public"."articlecategory"
    ADD CONSTRAINT "articlecategory_pkey" PRIMARY KEY ("articlecategory_id");



ALTER TABLE ONLY "public"."assessmentbmi"
    ADD CONSTRAINT "assessmentbmi_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."assessmentgoal"
    ADD CONSTRAINT "assessmentgoal_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."assessmentmedication"
    ADD CONSTRAINT "assessmentmedication_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."assessmentmenstruation"
    ADD CONSTRAINT "assessmentmenstruation_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."assessmentmentalhealthsymptoms"
    ADD CONSTRAINT "assessmentmentalhealthsymptoms_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."assessmentmood"
    ADD CONSTRAINT "assessmentmood_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."assessmentphysicaldistress"
    ADD CONSTRAINT "assessmentphysicaldistress_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."assessmentprohelp"
    ADD CONSTRAINT "assessmentprohelp_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."assessmentsleepquality"
    ADD CONSTRAINT "assessmentsleepquality_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."assessmentstresslevel"
    ADD CONSTRAINT "assessmentstresslevel_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."assessmenttakingmedication"
    ADD CONSTRAINT "assessmenttakingmedication_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bodypart"
    ADD CONSTRAINT "bodypart_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."challenge"
    ADD CONSTRAINT "challenge_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."challengeworkout"
    ADD CONSTRAINT "challengeworkout_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."class"
    ADD CONSTRAINT "class_pkey" PRIMARY KEY ("class_id");



ALTER TABLE ONLY "public"."course"
    ADD CONSTRAINT "course_pkey" PRIMARY KEY ("course_id");



ALTER TABLE ONLY "public"."dietitian"
    ADD CONSTRAINT "dietitian_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."dietitianguide"
    ADD CONSTRAINT "dietitianguide_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."equipment"
    ADD CONSTRAINT "equipment_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."exercise"
    ADD CONSTRAINT "exercise_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."exerciseequipment"
    ADD CONSTRAINT "exerciseequipment_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."exerciseinstruction"
    ADD CONSTRAINT "exerciseinstruction_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."faq"
    ADD CONSTRAINT "faq_pkey" PRIMARY KEY ("faq_id");



ALTER TABLE ONLY "public"."feedback"
    ADD CONSTRAINT "feedback_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."follow"
    ADD CONSTRAINT "follow_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."food"
    ADD CONSTRAINT "food_pkey" PRIMARY KEY ("food_id");



ALTER TABLE ONLY "public"."foodcategory"
    ADD CONSTRAINT "foodcategory_pkey" PRIMARY KEY ("foodcategory_id");



ALTER TABLE ONLY "public"."generalsettings"
    ADD CONSTRAINT "generalsettings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."goals"
    ADD CONSTRAINT "goals_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."meal"
    ADD CONSTRAINT "meal_pkey" PRIMARY KEY ("meal_id");



ALTER TABLE ONLY "public"."mealfood"
    ADD CONSTRAINT "mealfood_pkey" PRIMARY KEY ("mealfood_id");



ALTER TABLE ONLY "public"."mealinstruction"
    ADD CONSTRAINT "mealinstruction_pkey" PRIMARY KEY ("mealinstruction_id");



ALTER TABLE ONLY "public"."mealplan"
    ADD CONSTRAINT "mealplan_pkey" PRIMARY KEY ("mealplan_id");



ALTER TABLE ONLY "public"."mealtype"
    ADD CONSTRAINT "mealtype_pkey" PRIMARY KEY ("mealtype_id");



ALTER TABLE ONLY "public"."medication"
    ADD CONSTRAINT "medication_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mentalhealthsymptom"
    ADD CONSTRAINT "mentalhealthsymptom_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."message"
    ADD CONSTRAINT "message_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."moods"
    ADD CONSTRAINT "moods_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notification"
    ADD CONSTRAINT "notification_pkey" PRIMARY KEY ("notification_id");



ALTER TABLE ONLY "public"."notificationsettings"
    ADD CONSTRAINT "notificationsettings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."nutritionalfact"
    ADD CONSTRAINT "nutritionalfact_pkey" PRIMARY KEY ("nutritionalfact_id");



ALTER TABLE ONLY "public"."physio"
    ADD CONSTRAINT "physio_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."physiobooking"
    ADD CONSTRAINT "physiobooking_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."physioguide"
    ADD CONSTRAINT "physioguide_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."physiouserbooking"
    ADD CONSTRAINT "physiouserbooking_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."post"
    ADD CONSTRAINT "post_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."postlike"
    ADD CONSTRAINT "postlike_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."privacysettings"
    ADD CONSTRAINT "privacysettings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."professionalstatus"
    ADD CONSTRAINT "professionalstatus_pkey" PRIMARY KEY ("professionalstatus_id");



ALTER TABLE ONLY "public"."profile"
    ADD CONSTRAINT "profile_pkey" PRIMARY KEY ("profile_id");



ALTER TABLE ONLY "public"."psychologist"
    ADD CONSTRAINT "psychologist_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."psychologistguide"
    ADD CONSTRAINT "psychologistguide_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."role"
    ADD CONSTRAINT "role_pkey" PRIMARY KEY ("role_id");



ALTER TABLE ONLY "public"."schedule"
    ADD CONSTRAINT "schedule_pkey" PRIMARY KEY ("schedule_id");



ALTER TABLE ONLY "public"."scheduleclass"
    ADD CONSTRAINT "scheduleclass_pkey" PRIMARY KEY ("scheduleclass_id");



ALTER TABLE ONLY "public"."schedulemealplan"
    ADD CONSTRAINT "schedulemealplan_pkey" PRIMARY KEY ("schedulemealplan_id");



ALTER TABLE ONLY "public"."securitysettings"
    ADD CONSTRAINT "securitysettings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sleepquality"
    ADD CONSTRAINT "sleepquality_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tag"
    ADD CONSTRAINT "tag_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."takingmedication"
    ADD CONSTRAINT "takingmedication_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."termcategory"
    ADD CONSTRAINT "termcategory_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."terms"
    ADD CONSTRAINT "terms_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."termsandconditions"
    ADD CONSTRAINT "termsandconditions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."therapybooking"
    ADD CONSTRAINT "therapybooking_pkey" PRIMARY KEY ("therapybooking_id");



ALTER TABLE ONLY "public"."therapyuserbooking"
    ADD CONSTRAINT "therapyuserbooking_pkey" PRIMARY KEY ("therapyuserbooking_id");



ALTER TABLE ONLY "public"."thread"
    ADD CONSTRAINT "thread_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."threadlike"
    ADD CONSTRAINT "threadlike_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trackinggoalcalory"
    ADD CONSTRAINT "trackinggoalcalory_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trackinggoalsleep"
    ADD CONSTRAINT "trackinggoalsleep_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trackinggoalsteps"
    ADD CONSTRAINT "trackinggoalsteps_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trackinggoalwater"
    ADD CONSTRAINT "trackinggoalwater_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trackinggoalworkout"
    ADD CONSTRAINT "trackinggoalworkout_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trackingheartrate"
    ADD CONSTRAINT "trackingheartrate_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trackingmeal"
    ADD CONSTRAINT "trackingmeal_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trackingmenstruation"
    ADD CONSTRAINT "trackingmenstruation_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trackingsleep"
    ADD CONSTRAINT "trackingsleep_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trackingsteps"
    ADD CONSTRAINT "trackingsteps_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trackingtodo"
    ADD CONSTRAINT "trackingtodo_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trackingwater"
    ADD CONSTRAINT "trackingwater_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trackingworkout"
    ADD CONSTRAINT "trackingworkout_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."postlike"
    ADD CONSTRAINT "unique_user_post_like" UNIQUE ("post_id", "user_id");



ALTER TABLE ONLY "public"."threadlike"
    ADD CONSTRAINT "unique_user_thread_like" UNIQUE ("thread_id", "user_id");



ALTER TABLE ONLY "public"."usercourse"
    ADD CONSTRAINT "usercourse_pkey" PRIMARY KEY ("usercourse_id");



ALTER TABLE ONLY "public"."userrole"
    ADD CONSTRAINT "userrole_pkey" PRIMARY KEY ("userrole_id");



ALTER TABLE ONLY "public"."usersettings"
    ADD CONSTRAINT "usersettings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workout"
    ADD CONSTRAINT "workout_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workoutexercise"
    ADD CONSTRAINT "workoutexercise_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workoutprogram"
    ADD CONSTRAINT "workoutprogram_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."aidata"
    ADD CONSTRAINT "aidata_airesponsetemplate_id_fkey" FOREIGN KEY ("airesponsetemplate_id") REFERENCES "public"."airesponsetemplate"("airesponsetemplate_id");



ALTER TABLE ONLY "public"."aidata"
    ADD CONSTRAINT "aidata_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."airesponse"
    ADD CONSTRAINT "airesponse_aidata_id_fkey" FOREIGN KEY ("aidata_id") REFERENCES "public"."aidata"("aidata_id");



ALTER TABLE ONLY "public"."article"
    ADD CONSTRAINT "article_articlecategory_id_fkey" FOREIGN KEY ("articlecategory_id") REFERENCES "public"."articlecategory"("articlecategory_id");



ALTER TABLE ONLY "public"."assessmentbmi"
    ADD CONSTRAINT "assessmentbmi_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."assessmentgoal"
    ADD CONSTRAINT "assessmentgoal_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "public"."goals"("id");



ALTER TABLE ONLY "public"."assessmentgoal"
    ADD CONSTRAINT "assessmentgoal_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."assessmentmedication"
    ADD CONSTRAINT "assessmentmedication_medication_id_fkey" FOREIGN KEY ("medication_id") REFERENCES "public"."medication"("id");



ALTER TABLE ONLY "public"."assessmentmedication"
    ADD CONSTRAINT "assessmentmedication_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."assessmentmenstruation"
    ADD CONSTRAINT "assessmentmenstruation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."assessmentmentalhealthsymptoms"
    ADD CONSTRAINT "assessmentmentalhealthsymptoms_mentalhealthsymptom_id_fkey" FOREIGN KEY ("mentalhealthsymptom_id") REFERENCES "public"."mentalhealthsymptom"("id");



ALTER TABLE ONLY "public"."assessmentmentalhealthsymptoms"
    ADD CONSTRAINT "assessmentmentalhealthsymptoms_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."assessmentmood"
    ADD CONSTRAINT "assessmentmood_mood_id_fkey" FOREIGN KEY ("mood_id") REFERENCES "public"."moods"("id");



ALTER TABLE ONLY "public"."assessmentmood"
    ADD CONSTRAINT "assessmentmood_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."assessmentphysicaldistress"
    ADD CONSTRAINT "assessmentphysicaldistress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."assessmentprohelp"
    ADD CONSTRAINT "assessmentprohelp_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."assessmentsleepquality"
    ADD CONSTRAINT "assessmentsleepquality_sleepquality_id_fkey" FOREIGN KEY ("sleepquality_id") REFERENCES "public"."sleepquality"("id");



ALTER TABLE ONLY "public"."assessmentsleepquality"
    ADD CONSTRAINT "assessmentsleepquality_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."assessmentstresslevel"
    ADD CONSTRAINT "assessmentstresslevel_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."assessmenttakingmedication"
    ADD CONSTRAINT "assessmenttakingmedication_takingmedication_id_fkey" FOREIGN KEY ("takingmedication_id") REFERENCES "public"."takingmedication"("id");



ALTER TABLE ONLY "public"."assessmenttakingmedication"
    ADD CONSTRAINT "assessmenttakingmedication_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."challengeworkout"
    ADD CONSTRAINT "challengeworkout_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenge"("id");



ALTER TABLE ONLY "public"."challengeworkout"
    ADD CONSTRAINT "challengeworkout_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "public"."workout"("id");



ALTER TABLE ONLY "public"."class"
    ADD CONSTRAINT "class_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."course"("course_id");



ALTER TABLE ONLY "public"."dietitian"
    ADD CONSTRAINT "dietitian_approvedstatus_id_fkey" FOREIGN KEY ("approvedstatus_id") REFERENCES "public"."approvedstatus"("id");



ALTER TABLE ONLY "public"."dietitian"
    ADD CONSTRAINT "dietitian_professionalstatus_id_fkey" FOREIGN KEY ("professionalstatus_id") REFERENCES "public"."professionalstatus"("professionalstatus_id");



ALTER TABLE ONLY "public"."dietitian"
    ADD CONSTRAINT "dietitian_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."dietitianguide"
    ADD CONSTRAINT "dietitianguide_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."exercise"
    ADD CONSTRAINT "exercise_bodypart_id_fkey" FOREIGN KEY ("bodypart_id") REFERENCES "public"."bodypart"("id");



ALTER TABLE ONLY "public"."exerciseequipment"
    ADD CONSTRAINT "exerciseequipment_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id");



ALTER TABLE ONLY "public"."exerciseequipment"
    ADD CONSTRAINT "exerciseequipment_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercise"("id");



ALTER TABLE ONLY "public"."exerciseinstruction"
    ADD CONSTRAINT "exerciseinstruction_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercise"("id");



ALTER TABLE ONLY "public"."faq"
    ADD CONSTRAINT "faq_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "public"."article"("article_id");



ALTER TABLE ONLY "public"."feedback"
    ADD CONSTRAINT "feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."follow"
    ADD CONSTRAINT "follow_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."follow"
    ADD CONSTRAINT "follow_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."food"
    ADD CONSTRAINT "food_foodcategory_id_fkey" FOREIGN KEY ("foodcategory_id") REFERENCES "public"."foodcategory"("foodcategory_id");



ALTER TABLE ONLY "public"."meal"
    ADD CONSTRAINT "meal_mealtype_id_fkey" FOREIGN KEY ("mealtype_id") REFERENCES "public"."mealtype"("mealtype_id");



ALTER TABLE ONLY "public"."mealfood"
    ADD CONSTRAINT "mealfood_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "public"."food"("food_id");



ALTER TABLE ONLY "public"."mealfood"
    ADD CONSTRAINT "mealfood_meal_id_fkey" FOREIGN KEY ("meal_id") REFERENCES "public"."meal"("meal_id");



ALTER TABLE ONLY "public"."mealinstruction"
    ADD CONSTRAINT "mealinstruction_meal_id_fkey" FOREIGN KEY ("meal_id") REFERENCES "public"."meal"("meal_id");



ALTER TABLE ONLY "public"."mealplan"
    ADD CONSTRAINT "mealplan_meal_id_fkey" FOREIGN KEY ("meal_id") REFERENCES "public"."meal"("meal_id");



ALTER TABLE ONLY "public"."mealplan"
    ADD CONSTRAINT "mealplan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."message"
    ADD CONSTRAINT "message_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."message"
    ADD CONSTRAINT "message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."notification"
    ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."nutritionalfact"
    ADD CONSTRAINT "nutritionalfact_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "public"."food"("food_id");



ALTER TABLE ONLY "public"."physio"
    ADD CONSTRAINT "physio_approvedstatus_id_fkey" FOREIGN KEY ("approvedstatus_id") REFERENCES "public"."approvedstatus"("id");



ALTER TABLE ONLY "public"."physio"
    ADD CONSTRAINT "physio_professionalstatus_id_fkey" FOREIGN KEY ("professionalstatus_id") REFERENCES "public"."professionalstatus"("professionalstatus_id");



ALTER TABLE ONLY "public"."physio"
    ADD CONSTRAINT "physio_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."physioguide"
    ADD CONSTRAINT "physioguide_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."physiouserbooking"
    ADD CONSTRAINT "physiouserbooking_physio_id_fkey" FOREIGN KEY ("physio_id") REFERENCES "public"."physio"("user_id");



ALTER TABLE ONLY "public"."physiouserbooking"
    ADD CONSTRAINT "physiouserbooking_physiobooking_id_fkey" FOREIGN KEY ("physiobooking_id") REFERENCES "public"."physiobooking"("id");



ALTER TABLE ONLY "public"."physiouserbooking"
    ADD CONSTRAINT "physiouserbooking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post"
    ADD CONSTRAINT "post_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."post"
    ADD CONSTRAINT "post_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "public"."thread"("id");



ALTER TABLE ONLY "public"."postlike"
    ADD CONSTRAINT "postlike_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id");



ALTER TABLE ONLY "public"."postlike"
    ADD CONSTRAINT "postlike_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."profile"
    ADD CONSTRAINT "profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."psychologist"
    ADD CONSTRAINT "psychologist_approvedstatus_id_fkey" FOREIGN KEY ("approvedstatus_id") REFERENCES "public"."approvedstatus"("id");



ALTER TABLE ONLY "public"."psychologist"
    ADD CONSTRAINT "psychologist_professionalstatus_id_fkey" FOREIGN KEY ("professionalstatus_id") REFERENCES "public"."professionalstatus"("professionalstatus_id");



ALTER TABLE ONLY "public"."psychologist"
    ADD CONSTRAINT "psychologist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."psychologistguide"
    ADD CONSTRAINT "psychologistguide_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schedule"
    ADD CONSTRAINT "schedule_physiobooking_id_fkey" FOREIGN KEY ("physiobooking_id") REFERENCES "public"."physiobooking"("id");



ALTER TABLE ONLY "public"."schedule"
    ADD CONSTRAINT "schedule_therapybooking_id_fkey" FOREIGN KEY ("therapybooking_id") REFERENCES "public"."therapybooking"("therapybooking_id");



ALTER TABLE ONLY "public"."schedule"
    ADD CONSTRAINT "schedule_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schedule"
    ADD CONSTRAINT "schedule_workoutprogram_id_fkey" FOREIGN KEY ("workoutprogram_id") REFERENCES "public"."workoutprogram"("id");



ALTER TABLE ONLY "public"."scheduleclass"
    ADD CONSTRAINT "scheduleclass_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "public"."class"("class_id");



ALTER TABLE ONLY "public"."scheduleclass"
    ADD CONSTRAINT "scheduleclass_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "public"."schedule"("schedule_id");



ALTER TABLE ONLY "public"."schedulemealplan"
    ADD CONSTRAINT "schedulemealplan_mealplan_id_fkey" FOREIGN KEY ("mealplan_id") REFERENCES "public"."mealplan"("mealplan_id");



ALTER TABLE ONLY "public"."schedulemealplan"
    ADD CONSTRAINT "schedulemealplan_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "public"."schedule"("schedule_id");



ALTER TABLE ONLY "public"."terms"
    ADD CONSTRAINT "terms_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."termcategory"("id");



ALTER TABLE ONLY "public"."termsandconditions"
    ADD CONSTRAINT "termsandconditions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."therapyuserbooking"
    ADD CONSTRAINT "therapyuserbooking_psychologist_id_fkey" FOREIGN KEY ("psychologist_id") REFERENCES "public"."psychologist"("user_id");



ALTER TABLE ONLY "public"."therapyuserbooking"
    ADD CONSTRAINT "therapyuserbooking_therapybooking_id_fkey" FOREIGN KEY ("therapybooking_id") REFERENCES "public"."therapybooking"("therapybooking_id");



ALTER TABLE ONLY "public"."therapyuserbooking"
    ADD CONSTRAINT "therapyuserbooking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."thread"
    ADD CONSTRAINT "thread_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."thread"
    ADD CONSTRAINT "thread_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."tag"("id");



ALTER TABLE ONLY "public"."threadlike"
    ADD CONSTRAINT "threadlike_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "public"."thread"("id");



ALTER TABLE ONLY "public"."threadlike"
    ADD CONSTRAINT "threadlike_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."trackinggoalcalory"
    ADD CONSTRAINT "trackinggoalcalory_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trackinggoalsleep"
    ADD CONSTRAINT "trackinggoalsleep_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trackinggoalsteps"
    ADD CONSTRAINT "trackinggoalsteps_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trackinggoalwater"
    ADD CONSTRAINT "trackinggoalwater_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trackinggoalworkout"
    ADD CONSTRAINT "trackinggoalworkout_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trackingheartrate"
    ADD CONSTRAINT "trackingheartrate_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trackingmeal"
    ADD CONSTRAINT "trackingmeal_mealplan_id_fkey" FOREIGN KEY ("mealplan_id") REFERENCES "public"."mealplan"("mealplan_id");



ALTER TABLE ONLY "public"."trackingmeal"
    ADD CONSTRAINT "trackingmeal_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trackingmenstruation"
    ADD CONSTRAINT "trackingmenstruation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trackingsleep"
    ADD CONSTRAINT "trackingsleep_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trackingsteps"
    ADD CONSTRAINT "trackingsteps_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trackingtodo"
    ADD CONSTRAINT "trackingtodo_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trackingwater"
    ADD CONSTRAINT "trackingwater_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trackingworkout"
    ADD CONSTRAINT "trackingworkout_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trackingworkout"
    ADD CONSTRAINT "trackingworkout_workoutprogram_id_fkey" FOREIGN KEY ("workoutprogram_id") REFERENCES "public"."workoutprogram"("id");



ALTER TABLE ONLY "public"."usercourse"
    ADD CONSTRAINT "usercourse_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."course"("course_id");



ALTER TABLE ONLY "public"."usercourse"
    ADD CONSTRAINT "usercourse_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."userrole"
    ADD CONSTRAINT "userrole_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."role"("role_id");



ALTER TABLE ONLY "public"."userrole"
    ADD CONSTRAINT "userrole_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."usersettings"
    ADD CONSTRAINT "usersettings_generalsetting_id_fkey" FOREIGN KEY ("generalsetting_id") REFERENCES "public"."generalsettings"("id");



ALTER TABLE ONLY "public"."usersettings"
    ADD CONSTRAINT "usersettings_notificationsetting_id_fkey" FOREIGN KEY ("notificationsetting_id") REFERENCES "public"."notificationsettings"("id");



ALTER TABLE ONLY "public"."usersettings"
    ADD CONSTRAINT "usersettings_privacysetting_id_fkey" FOREIGN KEY ("privacysetting_id") REFERENCES "public"."privacysettings"("id");



ALTER TABLE ONLY "public"."usersettings"
    ADD CONSTRAINT "usersettings_securitysetting_id_fkey" FOREIGN KEY ("securitysetting_id") REFERENCES "public"."securitysettings"("id");



ALTER TABLE ONLY "public"."usersettings"
    ADD CONSTRAINT "usersettings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workoutexercise"
    ADD CONSTRAINT "workoutexercise_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercise"("id");



ALTER TABLE ONLY "public"."workoutexercise"
    ADD CONSTRAINT "workoutexercise_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "public"."workout"("id");



ALTER TABLE ONLY "public"."workoutprogram"
    ADD CONSTRAINT "workoutprogram_challengeworkout_id_fkey" FOREIGN KEY ("challengeworkout_id") REFERENCES "public"."challengeworkout"("id");



ALTER TABLE ONLY "public"."workoutprogram"
    ADD CONSTRAINT "workoutprogram_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workoutprogram"
    ADD CONSTRAINT "workoutprogram_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "public"."workout"("id");





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






























































































































































































































































































































































































































































































































GRANT ALL ON FUNCTION "public"."create_user_settings"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_user_settings"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_user_settings"() TO "service_role";

































GRANT ALL ON TABLE "public"."aidata" TO "anon";
GRANT ALL ON TABLE "public"."aidata" TO "authenticated";
GRANT ALL ON TABLE "public"."aidata" TO "service_role";



GRANT ALL ON SEQUENCE "public"."aidata_aidata_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."aidata_aidata_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."aidata_aidata_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."aiknowledge" TO "anon";
GRANT ALL ON TABLE "public"."aiknowledge" TO "authenticated";
GRANT ALL ON TABLE "public"."aiknowledge" TO "service_role";



GRANT ALL ON TABLE "public"."airesponse" TO "anon";
GRANT ALL ON TABLE "public"."airesponse" TO "authenticated";
GRANT ALL ON TABLE "public"."airesponse" TO "service_role";



GRANT ALL ON SEQUENCE "public"."airesponse_airesponse_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."airesponse_airesponse_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."airesponse_airesponse_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."airesponsetemplate" TO "anon";
GRANT ALL ON TABLE "public"."airesponsetemplate" TO "authenticated";
GRANT ALL ON TABLE "public"."airesponsetemplate" TO "service_role";



GRANT ALL ON SEQUENCE "public"."airesponsetemplate_airesponsetemplate_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."airesponsetemplate_airesponsetemplate_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."airesponsetemplate_airesponsetemplate_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."approvedstatus" TO "anon";
GRANT ALL ON TABLE "public"."approvedstatus" TO "authenticated";
GRANT ALL ON TABLE "public"."approvedstatus" TO "service_role";



GRANT ALL ON SEQUENCE "public"."approvedstatus_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."approvedstatus_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."approvedstatus_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."article" TO "anon";
GRANT ALL ON TABLE "public"."article" TO "authenticated";
GRANT ALL ON TABLE "public"."article" TO "service_role";



GRANT ALL ON SEQUENCE "public"."article_article_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."article_article_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."article_article_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."articlecategory" TO "anon";
GRANT ALL ON TABLE "public"."articlecategory" TO "authenticated";
GRANT ALL ON TABLE "public"."articlecategory" TO "service_role";



GRANT ALL ON SEQUENCE "public"."articlecategory_articlecategory_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."articlecategory_articlecategory_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."articlecategory_articlecategory_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."assessmentbmi" TO "anon";
GRANT ALL ON TABLE "public"."assessmentbmi" TO "authenticated";
GRANT ALL ON TABLE "public"."assessmentbmi" TO "service_role";



GRANT ALL ON SEQUENCE "public"."assessmentbmi_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."assessmentbmi_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."assessmentbmi_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."assessmentgoal" TO "anon";
GRANT ALL ON TABLE "public"."assessmentgoal" TO "authenticated";
GRANT ALL ON TABLE "public"."assessmentgoal" TO "service_role";



GRANT ALL ON SEQUENCE "public"."assessmentgoal_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."assessmentgoal_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."assessmentgoal_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."assessmentmedication" TO "anon";
GRANT ALL ON TABLE "public"."assessmentmedication" TO "authenticated";
GRANT ALL ON TABLE "public"."assessmentmedication" TO "service_role";



GRANT ALL ON SEQUENCE "public"."assessmentmedication_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."assessmentmedication_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."assessmentmedication_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."assessmentmenstruation" TO "anon";
GRANT ALL ON TABLE "public"."assessmentmenstruation" TO "authenticated";
GRANT ALL ON TABLE "public"."assessmentmenstruation" TO "service_role";



GRANT ALL ON SEQUENCE "public"."assessmentmenstruation_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."assessmentmenstruation_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."assessmentmenstruation_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."assessmentmentalhealthsymptoms" TO "anon";
GRANT ALL ON TABLE "public"."assessmentmentalhealthsymptoms" TO "authenticated";
GRANT ALL ON TABLE "public"."assessmentmentalhealthsymptoms" TO "service_role";



GRANT ALL ON SEQUENCE "public"."assessmentmentalhealthsymptoms_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."assessmentmentalhealthsymptoms_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."assessmentmentalhealthsymptoms_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."assessmentmood" TO "anon";
GRANT ALL ON TABLE "public"."assessmentmood" TO "authenticated";
GRANT ALL ON TABLE "public"."assessmentmood" TO "service_role";



GRANT ALL ON SEQUENCE "public"."assessmentmood_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."assessmentmood_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."assessmentmood_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."assessmentphysicaldistress" TO "anon";
GRANT ALL ON TABLE "public"."assessmentphysicaldistress" TO "authenticated";
GRANT ALL ON TABLE "public"."assessmentphysicaldistress" TO "service_role";



GRANT ALL ON SEQUENCE "public"."assessmentphysicaldistress_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."assessmentphysicaldistress_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."assessmentphysicaldistress_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."assessmentprohelp" TO "anon";
GRANT ALL ON TABLE "public"."assessmentprohelp" TO "authenticated";
GRANT ALL ON TABLE "public"."assessmentprohelp" TO "service_role";



GRANT ALL ON SEQUENCE "public"."assessmentprohelp_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."assessmentprohelp_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."assessmentprohelp_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."assessmentsleepquality" TO "anon";
GRANT ALL ON TABLE "public"."assessmentsleepquality" TO "authenticated";
GRANT ALL ON TABLE "public"."assessmentsleepquality" TO "service_role";



GRANT ALL ON SEQUENCE "public"."assessmentsleepquality_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."assessmentsleepquality_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."assessmentsleepquality_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."assessmentstresslevel" TO "anon";
GRANT ALL ON TABLE "public"."assessmentstresslevel" TO "authenticated";
GRANT ALL ON TABLE "public"."assessmentstresslevel" TO "service_role";



GRANT ALL ON SEQUENCE "public"."assessmentstresslevel_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."assessmentstresslevel_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."assessmentstresslevel_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."assessmenttakingmedication" TO "anon";
GRANT ALL ON TABLE "public"."assessmenttakingmedication" TO "authenticated";
GRANT ALL ON TABLE "public"."assessmenttakingmedication" TO "service_role";



GRANT ALL ON SEQUENCE "public"."assessmenttakingmedication_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."assessmenttakingmedication_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."assessmenttakingmedication_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."bodypart" TO "anon";
GRANT ALL ON TABLE "public"."bodypart" TO "authenticated";
GRANT ALL ON TABLE "public"."bodypart" TO "service_role";



GRANT ALL ON SEQUENCE "public"."bodypart_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."bodypart_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."bodypart_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."challenge" TO "anon";
GRANT ALL ON TABLE "public"."challenge" TO "authenticated";
GRANT ALL ON TABLE "public"."challenge" TO "service_role";



GRANT ALL ON SEQUENCE "public"."challenge_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."challenge_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."challenge_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."challengeworkout" TO "anon";
GRANT ALL ON TABLE "public"."challengeworkout" TO "authenticated";
GRANT ALL ON TABLE "public"."challengeworkout" TO "service_role";



GRANT ALL ON SEQUENCE "public"."challengeworkout_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."challengeworkout_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."challengeworkout_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."class" TO "anon";
GRANT ALL ON TABLE "public"."class" TO "authenticated";
GRANT ALL ON TABLE "public"."class" TO "service_role";



GRANT ALL ON SEQUENCE "public"."class_class_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."class_class_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."class_class_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."course" TO "anon";
GRANT ALL ON TABLE "public"."course" TO "authenticated";
GRANT ALL ON TABLE "public"."course" TO "service_role";



GRANT ALL ON SEQUENCE "public"."course_course_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."course_course_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."course_course_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."dietitian" TO "anon";
GRANT ALL ON TABLE "public"."dietitian" TO "authenticated";
GRANT ALL ON TABLE "public"."dietitian" TO "service_role";



GRANT ALL ON TABLE "public"."dietitianguide" TO "anon";
GRANT ALL ON TABLE "public"."dietitianguide" TO "authenticated";
GRANT ALL ON TABLE "public"."dietitianguide" TO "service_role";



GRANT ALL ON SEQUENCE "public"."dietitianguide_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."dietitianguide_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."dietitianguide_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."equipment" TO "anon";
GRANT ALL ON TABLE "public"."equipment" TO "authenticated";
GRANT ALL ON TABLE "public"."equipment" TO "service_role";



GRANT ALL ON SEQUENCE "public"."equipment_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."equipment_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."equipment_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."exercise" TO "anon";
GRANT ALL ON TABLE "public"."exercise" TO "authenticated";
GRANT ALL ON TABLE "public"."exercise" TO "service_role";



GRANT ALL ON SEQUENCE "public"."exercise_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."exercise_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."exercise_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."exerciseequipment" TO "anon";
GRANT ALL ON TABLE "public"."exerciseequipment" TO "authenticated";
GRANT ALL ON TABLE "public"."exerciseequipment" TO "service_role";



GRANT ALL ON SEQUENCE "public"."exerciseequipment_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."exerciseequipment_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."exerciseequipment_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."exerciseinstruction" TO "anon";
GRANT ALL ON TABLE "public"."exerciseinstruction" TO "authenticated";
GRANT ALL ON TABLE "public"."exerciseinstruction" TO "service_role";



GRANT ALL ON SEQUENCE "public"."exerciseinstruction_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."exerciseinstruction_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."exerciseinstruction_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."faq" TO "anon";
GRANT ALL ON TABLE "public"."faq" TO "authenticated";
GRANT ALL ON TABLE "public"."faq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."faq_faq_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."faq_faq_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."faq_faq_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."feedback" TO "anon";
GRANT ALL ON TABLE "public"."feedback" TO "authenticated";
GRANT ALL ON TABLE "public"."feedback" TO "service_role";



GRANT ALL ON SEQUENCE "public"."feedback_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."feedback_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."feedback_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."follow" TO "anon";
GRANT ALL ON TABLE "public"."follow" TO "authenticated";
GRANT ALL ON TABLE "public"."follow" TO "service_role";



GRANT ALL ON SEQUENCE "public"."follow_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."follow_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."follow_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."food" TO "anon";
GRANT ALL ON TABLE "public"."food" TO "authenticated";
GRANT ALL ON TABLE "public"."food" TO "service_role";



GRANT ALL ON SEQUENCE "public"."food_food_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."food_food_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."food_food_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."foodcategory" TO "anon";
GRANT ALL ON TABLE "public"."foodcategory" TO "authenticated";
GRANT ALL ON TABLE "public"."foodcategory" TO "service_role";



GRANT ALL ON SEQUENCE "public"."foodcategory_foodcategory_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."foodcategory_foodcategory_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."foodcategory_foodcategory_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."generalsettings" TO "anon";
GRANT ALL ON TABLE "public"."generalsettings" TO "authenticated";
GRANT ALL ON TABLE "public"."generalsettings" TO "service_role";



GRANT ALL ON SEQUENCE "public"."generalsettings_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."generalsettings_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."generalsettings_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."goals" TO "anon";
GRANT ALL ON TABLE "public"."goals" TO "authenticated";
GRANT ALL ON TABLE "public"."goals" TO "service_role";



GRANT ALL ON SEQUENCE "public"."goals_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."goals_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."goals_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."meal" TO "anon";
GRANT ALL ON TABLE "public"."meal" TO "authenticated";
GRANT ALL ON TABLE "public"."meal" TO "service_role";



GRANT ALL ON SEQUENCE "public"."meal_meal_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."meal_meal_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."meal_meal_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."mealfood" TO "anon";
GRANT ALL ON TABLE "public"."mealfood" TO "authenticated";
GRANT ALL ON TABLE "public"."mealfood" TO "service_role";



GRANT ALL ON SEQUENCE "public"."mealfood_mealfood_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."mealfood_mealfood_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."mealfood_mealfood_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."mealinstruction" TO "anon";
GRANT ALL ON TABLE "public"."mealinstruction" TO "authenticated";
GRANT ALL ON TABLE "public"."mealinstruction" TO "service_role";



GRANT ALL ON SEQUENCE "public"."mealinstruction_mealinstruction_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."mealinstruction_mealinstruction_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."mealinstruction_mealinstruction_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."mealplan" TO "anon";
GRANT ALL ON TABLE "public"."mealplan" TO "authenticated";
GRANT ALL ON TABLE "public"."mealplan" TO "service_role";



GRANT ALL ON SEQUENCE "public"."mealplan_mealplan_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."mealplan_mealplan_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."mealplan_mealplan_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."mealtype" TO "anon";
GRANT ALL ON TABLE "public"."mealtype" TO "authenticated";
GRANT ALL ON TABLE "public"."mealtype" TO "service_role";



GRANT ALL ON SEQUENCE "public"."mealtype_mealtype_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."mealtype_mealtype_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."mealtype_mealtype_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."medication" TO "anon";
GRANT ALL ON TABLE "public"."medication" TO "authenticated";
GRANT ALL ON TABLE "public"."medication" TO "service_role";



GRANT ALL ON SEQUENCE "public"."medication_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."medication_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."medication_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."mentalhealthsymptom" TO "anon";
GRANT ALL ON TABLE "public"."mentalhealthsymptom" TO "authenticated";
GRANT ALL ON TABLE "public"."mentalhealthsymptom" TO "service_role";



GRANT ALL ON SEQUENCE "public"."mentalhealthsymptom_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."mentalhealthsymptom_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."mentalhealthsymptom_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."message" TO "anon";
GRANT ALL ON TABLE "public"."message" TO "authenticated";
GRANT ALL ON TABLE "public"."message" TO "service_role";



GRANT ALL ON SEQUENCE "public"."message_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."message_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."message_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."moods" TO "anon";
GRANT ALL ON TABLE "public"."moods" TO "authenticated";
GRANT ALL ON TABLE "public"."moods" TO "service_role";



GRANT ALL ON SEQUENCE "public"."moods_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."moods_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."moods_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."notification" TO "anon";
GRANT ALL ON TABLE "public"."notification" TO "authenticated";
GRANT ALL ON TABLE "public"."notification" TO "service_role";



GRANT ALL ON SEQUENCE "public"."notification_notification_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."notification_notification_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."notification_notification_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."notificationsettings" TO "anon";
GRANT ALL ON TABLE "public"."notificationsettings" TO "authenticated";
GRANT ALL ON TABLE "public"."notificationsettings" TO "service_role";



GRANT ALL ON SEQUENCE "public"."notificationsettings_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."notificationsettings_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."notificationsettings_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."nutritionalfact" TO "anon";
GRANT ALL ON TABLE "public"."nutritionalfact" TO "authenticated";
GRANT ALL ON TABLE "public"."nutritionalfact" TO "service_role";



GRANT ALL ON SEQUENCE "public"."nutritionalfact_nutritionalfact_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."nutritionalfact_nutritionalfact_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."nutritionalfact_nutritionalfact_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."physio" TO "anon";
GRANT ALL ON TABLE "public"."physio" TO "authenticated";
GRANT ALL ON TABLE "public"."physio" TO "service_role";



GRANT ALL ON TABLE "public"."physiobooking" TO "anon";
GRANT ALL ON TABLE "public"."physiobooking" TO "authenticated";
GRANT ALL ON TABLE "public"."physiobooking" TO "service_role";



GRANT ALL ON SEQUENCE "public"."physiobooking_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."physiobooking_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."physiobooking_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."physioguide" TO "anon";
GRANT ALL ON TABLE "public"."physioguide" TO "authenticated";
GRANT ALL ON TABLE "public"."physioguide" TO "service_role";



GRANT ALL ON SEQUENCE "public"."physioguide_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."physioguide_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."physioguide_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."physiouserbooking" TO "anon";
GRANT ALL ON TABLE "public"."physiouserbooking" TO "authenticated";
GRANT ALL ON TABLE "public"."physiouserbooking" TO "service_role";



GRANT ALL ON SEQUENCE "public"."physiouserbooking_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."physiouserbooking_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."physiouserbooking_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."post" TO "anon";
GRANT ALL ON TABLE "public"."post" TO "authenticated";
GRANT ALL ON TABLE "public"."post" TO "service_role";



GRANT ALL ON SEQUENCE "public"."post_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."post_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."post_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."postlike" TO "anon";
GRANT ALL ON TABLE "public"."postlike" TO "authenticated";
GRANT ALL ON TABLE "public"."postlike" TO "service_role";



GRANT ALL ON SEQUENCE "public"."postlike_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."postlike_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."postlike_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."privacysettings" TO "anon";
GRANT ALL ON TABLE "public"."privacysettings" TO "authenticated";
GRANT ALL ON TABLE "public"."privacysettings" TO "service_role";



GRANT ALL ON SEQUENCE "public"."privacysettings_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."privacysettings_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."privacysettings_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."professionalstatus" TO "anon";
GRANT ALL ON TABLE "public"."professionalstatus" TO "authenticated";
GRANT ALL ON TABLE "public"."professionalstatus" TO "service_role";



GRANT ALL ON SEQUENCE "public"."professionalstatus_professionalstatus_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."professionalstatus_professionalstatus_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."professionalstatus_professionalstatus_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."profile" TO "anon";
GRANT ALL ON TABLE "public"."profile" TO "authenticated";
GRANT ALL ON TABLE "public"."profile" TO "service_role";



GRANT ALL ON SEQUENCE "public"."profile_profile_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."profile_profile_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."profile_profile_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."psychologist" TO "anon";
GRANT ALL ON TABLE "public"."psychologist" TO "authenticated";
GRANT ALL ON TABLE "public"."psychologist" TO "service_role";



GRANT ALL ON TABLE "public"."psychologistguide" TO "anon";
GRANT ALL ON TABLE "public"."psychologistguide" TO "authenticated";
GRANT ALL ON TABLE "public"."psychologistguide" TO "service_role";



GRANT ALL ON SEQUENCE "public"."psychologistguide_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."psychologistguide_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."psychologistguide_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."role" TO "anon";
GRANT ALL ON TABLE "public"."role" TO "authenticated";
GRANT ALL ON TABLE "public"."role" TO "service_role";



GRANT ALL ON SEQUENCE "public"."role_role_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."role_role_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."role_role_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."schedule" TO "anon";
GRANT ALL ON TABLE "public"."schedule" TO "authenticated";
GRANT ALL ON TABLE "public"."schedule" TO "service_role";



GRANT ALL ON SEQUENCE "public"."schedule_schedule_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."schedule_schedule_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."schedule_schedule_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."scheduleclass" TO "anon";
GRANT ALL ON TABLE "public"."scheduleclass" TO "authenticated";
GRANT ALL ON TABLE "public"."scheduleclass" TO "service_role";



GRANT ALL ON SEQUENCE "public"."scheduleclass_scheduleclass_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."scheduleclass_scheduleclass_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."scheduleclass_scheduleclass_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."schedulemealplan" TO "anon";
GRANT ALL ON TABLE "public"."schedulemealplan" TO "authenticated";
GRANT ALL ON TABLE "public"."schedulemealplan" TO "service_role";



GRANT ALL ON SEQUENCE "public"."schedulemealplan_schedulemealplan_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."schedulemealplan_schedulemealplan_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."schedulemealplan_schedulemealplan_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."securitysettings" TO "anon";
GRANT ALL ON TABLE "public"."securitysettings" TO "authenticated";
GRANT ALL ON TABLE "public"."securitysettings" TO "service_role";



GRANT ALL ON SEQUENCE "public"."securitysettings_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."securitysettings_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."securitysettings_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."sleepquality" TO "anon";
GRANT ALL ON TABLE "public"."sleepquality" TO "authenticated";
GRANT ALL ON TABLE "public"."sleepquality" TO "service_role";



GRANT ALL ON SEQUENCE "public"."sleepquality_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."sleepquality_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."sleepquality_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."tag" TO "anon";
GRANT ALL ON TABLE "public"."tag" TO "authenticated";
GRANT ALL ON TABLE "public"."tag" TO "service_role";



GRANT ALL ON SEQUENCE "public"."tag_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."tag_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."tag_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."takingmedication" TO "anon";
GRANT ALL ON TABLE "public"."takingmedication" TO "authenticated";
GRANT ALL ON TABLE "public"."takingmedication" TO "service_role";



GRANT ALL ON SEQUENCE "public"."takingmedication_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."takingmedication_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."takingmedication_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."termcategory" TO "anon";
GRANT ALL ON TABLE "public"."termcategory" TO "authenticated";
GRANT ALL ON TABLE "public"."termcategory" TO "service_role";



GRANT ALL ON SEQUENCE "public"."termcategory_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."termcategory_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."termcategory_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."terms" TO "anon";
GRANT ALL ON TABLE "public"."terms" TO "authenticated";
GRANT ALL ON TABLE "public"."terms" TO "service_role";



GRANT ALL ON SEQUENCE "public"."terms_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."terms_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."terms_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."termsandconditions" TO "anon";
GRANT ALL ON TABLE "public"."termsandconditions" TO "authenticated";
GRANT ALL ON TABLE "public"."termsandconditions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."termsandconditions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."termsandconditions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."termsandconditions_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."therapybooking" TO "anon";
GRANT ALL ON TABLE "public"."therapybooking" TO "authenticated";
GRANT ALL ON TABLE "public"."therapybooking" TO "service_role";



GRANT ALL ON SEQUENCE "public"."therapybooking_therapybooking_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."therapybooking_therapybooking_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."therapybooking_therapybooking_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."therapyuserbooking" TO "anon";
GRANT ALL ON TABLE "public"."therapyuserbooking" TO "authenticated";
GRANT ALL ON TABLE "public"."therapyuserbooking" TO "service_role";



GRANT ALL ON SEQUENCE "public"."therapyuserbooking_therapyuserbooking_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."therapyuserbooking_therapyuserbooking_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."therapyuserbooking_therapyuserbooking_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."thread" TO "anon";
GRANT ALL ON TABLE "public"."thread" TO "authenticated";
GRANT ALL ON TABLE "public"."thread" TO "service_role";



GRANT ALL ON SEQUENCE "public"."thread_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."thread_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."thread_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."threadlike" TO "anon";
GRANT ALL ON TABLE "public"."threadlike" TO "authenticated";
GRANT ALL ON TABLE "public"."threadlike" TO "service_role";



GRANT ALL ON SEQUENCE "public"."threadlike_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."threadlike_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."threadlike_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."trackinggoalcalory" TO "anon";
GRANT ALL ON TABLE "public"."trackinggoalcalory" TO "authenticated";
GRANT ALL ON TABLE "public"."trackinggoalcalory" TO "service_role";



GRANT ALL ON SEQUENCE "public"."trackinggoalcalory_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."trackinggoalcalory_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."trackinggoalcalory_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."trackinggoalsleep" TO "anon";
GRANT ALL ON TABLE "public"."trackinggoalsleep" TO "authenticated";
GRANT ALL ON TABLE "public"."trackinggoalsleep" TO "service_role";



GRANT ALL ON SEQUENCE "public"."trackinggoalsleep_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."trackinggoalsleep_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."trackinggoalsleep_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."trackinggoalsteps" TO "anon";
GRANT ALL ON TABLE "public"."trackinggoalsteps" TO "authenticated";
GRANT ALL ON TABLE "public"."trackinggoalsteps" TO "service_role";



GRANT ALL ON SEQUENCE "public"."trackinggoalsteps_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."trackinggoalsteps_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."trackinggoalsteps_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."trackinggoalwater" TO "anon";
GRANT ALL ON TABLE "public"."trackinggoalwater" TO "authenticated";
GRANT ALL ON TABLE "public"."trackinggoalwater" TO "service_role";



GRANT ALL ON SEQUENCE "public"."trackinggoalwater_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."trackinggoalwater_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."trackinggoalwater_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."trackinggoalworkout" TO "anon";
GRANT ALL ON TABLE "public"."trackinggoalworkout" TO "authenticated";
GRANT ALL ON TABLE "public"."trackinggoalworkout" TO "service_role";



GRANT ALL ON SEQUENCE "public"."trackinggoalworkout_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."trackinggoalworkout_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."trackinggoalworkout_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."trackingheartrate" TO "anon";
GRANT ALL ON TABLE "public"."trackingheartrate" TO "authenticated";
GRANT ALL ON TABLE "public"."trackingheartrate" TO "service_role";



GRANT ALL ON SEQUENCE "public"."trackingheartrate_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."trackingheartrate_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."trackingheartrate_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."trackingmeal" TO "anon";
GRANT ALL ON TABLE "public"."trackingmeal" TO "authenticated";
GRANT ALL ON TABLE "public"."trackingmeal" TO "service_role";



GRANT ALL ON SEQUENCE "public"."trackingmeal_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."trackingmeal_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."trackingmeal_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."trackingmenstruation" TO "anon";
GRANT ALL ON TABLE "public"."trackingmenstruation" TO "authenticated";
GRANT ALL ON TABLE "public"."trackingmenstruation" TO "service_role";



GRANT ALL ON SEQUENCE "public"."trackingmenstruation_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."trackingmenstruation_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."trackingmenstruation_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."trackingsleep" TO "anon";
GRANT ALL ON TABLE "public"."trackingsleep" TO "authenticated";
GRANT ALL ON TABLE "public"."trackingsleep" TO "service_role";



GRANT ALL ON SEQUENCE "public"."trackingsleep_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."trackingsleep_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."trackingsleep_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."trackingsteps" TO "anon";
GRANT ALL ON TABLE "public"."trackingsteps" TO "authenticated";
GRANT ALL ON TABLE "public"."trackingsteps" TO "service_role";



GRANT ALL ON SEQUENCE "public"."trackingsteps_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."trackingsteps_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."trackingsteps_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."trackingtodo" TO "anon";
GRANT ALL ON TABLE "public"."trackingtodo" TO "authenticated";
GRANT ALL ON TABLE "public"."trackingtodo" TO "service_role";



GRANT ALL ON SEQUENCE "public"."trackingtodo_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."trackingtodo_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."trackingtodo_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."trackingwater" TO "anon";
GRANT ALL ON TABLE "public"."trackingwater" TO "authenticated";
GRANT ALL ON TABLE "public"."trackingwater" TO "service_role";



GRANT ALL ON SEQUENCE "public"."trackingwater_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."trackingwater_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."trackingwater_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."trackingworkout" TO "anon";
GRANT ALL ON TABLE "public"."trackingworkout" TO "authenticated";
GRANT ALL ON TABLE "public"."trackingworkout" TO "service_role";



GRANT ALL ON SEQUENCE "public"."trackingworkout_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."trackingworkout_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."trackingworkout_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."usercourse" TO "anon";
GRANT ALL ON TABLE "public"."usercourse" TO "authenticated";
GRANT ALL ON TABLE "public"."usercourse" TO "service_role";



GRANT ALL ON SEQUENCE "public"."usercourse_usercourse_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."usercourse_usercourse_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."usercourse_usercourse_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."userrole" TO "anon";
GRANT ALL ON TABLE "public"."userrole" TO "authenticated";
GRANT ALL ON TABLE "public"."userrole" TO "service_role";



GRANT ALL ON SEQUENCE "public"."userrole_userrole_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."userrole_userrole_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."userrole_userrole_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."usersettings" TO "anon";
GRANT ALL ON TABLE "public"."usersettings" TO "authenticated";
GRANT ALL ON TABLE "public"."usersettings" TO "service_role";



GRANT ALL ON SEQUENCE "public"."usersettings_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."usersettings_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."usersettings_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."workout" TO "anon";
GRANT ALL ON TABLE "public"."workout" TO "authenticated";
GRANT ALL ON TABLE "public"."workout" TO "service_role";



GRANT ALL ON SEQUENCE "public"."workout_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."workout_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."workout_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."workoutexercise" TO "anon";
GRANT ALL ON TABLE "public"."workoutexercise" TO "authenticated";
GRANT ALL ON TABLE "public"."workoutexercise" TO "service_role";



GRANT ALL ON SEQUENCE "public"."workoutexercise_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."workoutexercise_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."workoutexercise_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."workoutprogram" TO "anon";
GRANT ALL ON TABLE "public"."workoutprogram" TO "authenticated";
GRANT ALL ON TABLE "public"."workoutprogram" TO "service_role";



GRANT ALL ON SEQUENCE "public"."workoutprogram_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."workoutprogram_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."workoutprogram_id_seq" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
