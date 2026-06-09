-- Migration: Add course_path column to profiles for tracking signup reason
-- Run this in your Supabase SQL editor

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS course_path TEXT;
