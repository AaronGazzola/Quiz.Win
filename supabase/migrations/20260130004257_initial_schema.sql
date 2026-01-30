CREATE TYPE user_role AS ENUM ('user', 'admin', 'super-admin');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE character_class AS ENUM ('wizard', 'brute', 'assassin');
CREATE TYPE genre_type AS ENUM ('cyberpunk', 'fantasy');
CREATE TYPE achievement_type AS ENUM ('quest_complete', 'level_up', 'perfect_quiz');
CREATE TYPE item_type AS ENUM ('weapon', 'armor', 'potion', 'scroll');
CREATE TYPE content_type AS ENUM ('quiz_set', 'character', 'story');
CREATE TYPE vote_type AS ENUM ('upvote', 'downvote');
CREATE TYPE flag_reason AS ENUM ('inappropriate', 'spam', 'offensive', 'other');
CREATE TYPE flag_status AS ENUM ('pending', 'reviewed', 'dismissed');
CREATE TYPE mod_action AS ENUM ('approve', 'remove', 'warn', 'ban');
CREATE TYPE activity_type AS ENUM ('creation', 'achievement', 'completion');

CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  username TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  quiz_preferences JSONB DEFAULT '{}',
  adventure_preferences JSONB DEFAULT '{}',
  privacy_settings JSONB DEFAULT '{}',
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  UNIQUE (username)
);

CREATE TABLE public.quiz_sets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  approval_status approval_status NOT NULL DEFAULT 'pending',
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE public.quiz_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_set_id UUID NOT NULL,
  user_id UUID NOT NULL,
  question_text TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  incorrect_answers TEXT[] NOT NULL,
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE public.quiz_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  quiz_set_id UUID NOT NULL,
  character_id UUID,
  correct_count INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL,
  completion_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE public.characters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  class_type character_class NOT NULL,
  genre_type genre_type NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  health INTEGER NOT NULL DEFAULT 100,
  experience INTEGER NOT NULL DEFAULT 0,
  appearance JSONB,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE public.character_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL,
  user_id UUID NOT NULL,
  achievement_type achievement_type NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  metadata JSONB
);

CREATE TABLE public.character_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL,
  user_id UUID NOT NULL,
  item_type item_type NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  acquired_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  metadata JSONB
);

CREATE TABLE public.adventure_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL,
  user_id UUID NOT NULL,
  current_story_id UUID,
  progress_state JSONB,
  quiz_performance JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE public.adventure_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  story_text TEXT NOT NULL,
  genre_type genre_type NOT NULL,
  choices JSONB,
  requirements JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE public.content_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content_type content_type NOT NULL,
  content_id UUID NOT NULL,
  vote_type vote_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, content_type, content_id)
);

CREATE TABLE public.content_flags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content_type content_type NOT NULL,
  content_id UUID NOT NULL,
  flag_reason flag_reason NOT NULL,
  flag_status flag_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE public.moderation_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL,
  target_user_id UUID NOT NULL,
  action_type mod_action NOT NULL,
  reason TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE public.community_activity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activity_type activity_type NOT NULL,
  content_type content_type,
  content_id UUID,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adventure_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adventure_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_activity ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT (SELECT role FROM public.profiles WHERE user_id = auth.uid()) IN ('admin', 'super-admin');
$$;

CREATE POLICY "profiles_select_anon"
  ON public.profiles
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "profiles_select_authenticated"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "profiles_select_admin"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "profiles_insert_authenticated"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profiles_insert_admin"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "profiles_update_authenticated"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profiles_update_admin"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "profiles_delete_authenticated"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "profiles_delete_admin"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "quiz_sets_select_anon"
  ON public.quiz_sets
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "quiz_sets_select_authenticated"
  ON public.quiz_sets
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "quiz_sets_select_admin"
  ON public.quiz_sets
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "quiz_sets_insert_authenticated"
  ON public.quiz_sets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "quiz_sets_insert_admin"
  ON public.quiz_sets
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "quiz_sets_update_authenticated"
  ON public.quiz_sets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "quiz_sets_update_admin"
  ON public.quiz_sets
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "quiz_sets_delete_authenticated"
  ON public.quiz_sets
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "quiz_sets_delete_admin"
  ON public.quiz_sets
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "quiz_questions_select_anon"
  ON public.quiz_questions
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "quiz_questions_select_authenticated"
  ON public.quiz_questions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "quiz_questions_select_admin"
  ON public.quiz_questions
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "quiz_questions_insert_authenticated"
  ON public.quiz_questions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "quiz_questions_insert_admin"
  ON public.quiz_questions
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "quiz_questions_update_authenticated"
  ON public.quiz_questions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "quiz_questions_update_admin"
  ON public.quiz_questions
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "quiz_questions_delete_authenticated"
  ON public.quiz_questions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "quiz_questions_delete_admin"
  ON public.quiz_questions
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "quiz_attempts_select_anon"
  ON public.quiz_attempts
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "quiz_attempts_select_authenticated"
  ON public.quiz_attempts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "quiz_attempts_select_admin"
  ON public.quiz_attempts
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "quiz_attempts_insert_authenticated"
  ON public.quiz_attempts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "quiz_attempts_insert_admin"
  ON public.quiz_attempts
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "quiz_attempts_update_authenticated"
  ON public.quiz_attempts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "quiz_attempts_update_admin"
  ON public.quiz_attempts
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "quiz_attempts_delete_authenticated"
  ON public.quiz_attempts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "quiz_attempts_delete_admin"
  ON public.quiz_attempts
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "characters_select_anon"
  ON public.characters
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "characters_select_authenticated"
  ON public.characters
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "characters_select_admin"
  ON public.characters
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "characters_insert_authenticated"
  ON public.characters
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "characters_insert_admin"
  ON public.characters
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "characters_update_authenticated"
  ON public.characters
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "characters_update_admin"
  ON public.characters
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "characters_delete_authenticated"
  ON public.characters
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "characters_delete_admin"
  ON public.characters
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "character_achievements_select_anon"
  ON public.character_achievements
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "character_achievements_select_authenticated"
  ON public.character_achievements
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "character_achievements_select_admin"
  ON public.character_achievements
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "character_achievements_insert_authenticated"
  ON public.character_achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "character_achievements_insert_admin"
  ON public.character_achievements
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "character_achievements_update_authenticated"
  ON public.character_achievements
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "character_achievements_update_admin"
  ON public.character_achievements
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "character_achievements_delete_authenticated"
  ON public.character_achievements
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "character_achievements_delete_admin"
  ON public.character_achievements
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "character_inventory_select_anon"
  ON public.character_inventory
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "character_inventory_select_authenticated"
  ON public.character_inventory
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "character_inventory_select_admin"
  ON public.character_inventory
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "character_inventory_insert_authenticated"
  ON public.character_inventory
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "character_inventory_insert_admin"
  ON public.character_inventory
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "character_inventory_update_authenticated"
  ON public.character_inventory
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "character_inventory_update_admin"
  ON public.character_inventory
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "character_inventory_delete_authenticated"
  ON public.character_inventory
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "character_inventory_delete_admin"
  ON public.character_inventory
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "adventure_progress_select_anon"
  ON public.adventure_progress
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "adventure_progress_select_authenticated"
  ON public.adventure_progress
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "adventure_progress_select_admin"
  ON public.adventure_progress
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "adventure_progress_insert_authenticated"
  ON public.adventure_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "adventure_progress_insert_admin"
  ON public.adventure_progress
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "adventure_progress_update_authenticated"
  ON public.adventure_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "adventure_progress_update_admin"
  ON public.adventure_progress
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "adventure_progress_delete_authenticated"
  ON public.adventure_progress
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "adventure_progress_delete_admin"
  ON public.adventure_progress
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "adventure_stories_select_anon"
  ON public.adventure_stories
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "adventure_stories_select_authenticated"
  ON public.adventure_stories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "adventure_stories_select_admin"
  ON public.adventure_stories
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "adventure_stories_insert_admin"
  ON public.adventure_stories
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "adventure_stories_update_admin"
  ON public.adventure_stories
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "adventure_stories_delete_admin"
  ON public.adventure_stories
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "content_votes_select_anon"
  ON public.content_votes
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "content_votes_select_authenticated"
  ON public.content_votes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "content_votes_select_admin"
  ON public.content_votes
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "content_votes_insert_authenticated"
  ON public.content_votes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "content_votes_insert_admin"
  ON public.content_votes
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "content_votes_update_authenticated"
  ON public.content_votes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "content_votes_update_admin"
  ON public.content_votes
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "content_votes_delete_authenticated"
  ON public.content_votes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "content_votes_delete_admin"
  ON public.content_votes
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "content_flags_select_anon"
  ON public.content_flags
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "content_flags_select_authenticated"
  ON public.content_flags
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "content_flags_select_admin"
  ON public.content_flags
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "content_flags_insert_authenticated"
  ON public.content_flags
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "content_flags_insert_admin"
  ON public.content_flags
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "content_flags_update_authenticated"
  ON public.content_flags
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "content_flags_update_admin"
  ON public.content_flags
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "content_flags_delete_authenticated"
  ON public.content_flags
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "content_flags_delete_admin"
  ON public.content_flags
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "moderation_actions_select_anon"
  ON public.moderation_actions
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "moderation_actions_select_authenticated"
  ON public.moderation_actions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "moderation_actions_select_admin"
  ON public.moderation_actions
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "moderation_actions_insert_admin"
  ON public.moderation_actions
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "moderation_actions_update_admin"
  ON public.moderation_actions
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "moderation_actions_delete_admin"
  ON public.moderation_actions
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "community_activity_select_anon"
  ON public.community_activity
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "community_activity_select_authenticated"
  ON public.community_activity
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "community_activity_select_admin"
  ON public.community_activity
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "community_activity_insert_authenticated"
  ON public.community_activity
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "community_activity_insert_admin"
  ON public.community_activity
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "community_activity_update_authenticated"
  ON public.community_activity
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "community_activity_update_admin"
  ON public.community_activity
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "community_activity_delete_authenticated"
  ON public.community_activity
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "community_activity_delete_admin"
  ON public.community_activity
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));
