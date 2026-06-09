-- Migration: Add ab_variant column to profiles for tracking A/B test variant
-- Run this in your Supabase SQL editor

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ab_variant TEXT;
