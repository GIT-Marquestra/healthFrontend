"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
type HealthGoal = 'Lose weight' | 'Improve sleep' | 'Gain muscle' | 'Manage stress' | '';

interface UserProfile {
  age: number | null;
  weight: number | null;
  gender: 'male' | 'female' | 'other' | '';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very active' | '';
  symptoms: string[];
}

interface HealthPlan {
  waterIntake: string;
  sleepHours: string;
  exercise: string;
  meals: string[];
  tips: string[];
}

interface DailyLog {
  date: string;
  mood: number;
  sleepHours: number;
  waterConsumed: number;
  meals: string[];
  exercise: string;
  exerciseDuration: number;
  symptoms: string[];
  stressLevel: number;
}

interface FeedbackEntry {
  date: string;
  adherence: string;
  suggestions: string[];
  motivation: string;
}

interface HealthContextType {
  healthGoal: HealthGoal;
  setHealthGoal: (goal: HealthGoal) => void;
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  healthPlan: HealthPlan | null;
  setHealthPlan: (plan: HealthPlan) => void;
  dailyLogs: DailyLog[];
  addDailyLog: (log: DailyLog) => void;
  feedback: FeedbackEntry[];
  addFeedback: (entry: FeedbackEntry) => void;
  isOnboarded: boolean;
  completeOnboarding: () => void;
}

// Default values
const defaultUserProfile: UserProfile = {
  age: null,
  weight: null,
  gender: '',
  activityLevel: '',
  symptoms: [],
};

const defaultHealthPlan: HealthPlan = {
  waterIntake: '0',
  sleepHours: '0',
  exercise: '',
  meals: [],
  tips: [],
};

// Create context
const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // States
  const [healthGoal, setHealthGoal] = useState<HealthGoal>('');
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile);
  const [healthPlan, setHealthPlan] = useState<HealthPlan | null>(null);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [isOnboarded, setIsOnboarded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    // Check if we're in the browser environment before accessing localStorage
    if (typeof window !== 'undefined') {
      const storedGoal = localStorage.getItem('healthGoal');
      if (storedGoal) setHealthGoal(storedGoal as HealthGoal);
      
      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) setUserProfile(JSON.parse(storedProfile));
      
      const storedPlan = localStorage.getItem('healthPlan');
      if (storedPlan) setHealthPlan(JSON.parse(storedPlan));
      
      const storedLogs = localStorage.getItem('dailyLogs');
      if (storedLogs) setDailyLogs(JSON.parse(storedLogs));
      
      const storedFeedback = localStorage.getItem('feedback');
      if (storedFeedback) setFeedback(JSON.parse(storedFeedback));
      
      const onboardingComplete = localStorage.getItem('isOnboarded') === 'true';
      setIsOnboarded(onboardingComplete);
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    // Check if we're in the browser environment before accessing localStorage
    if (typeof window !== 'undefined') {
      if (healthGoal) localStorage.setItem('healthGoal', healthGoal);
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
      if (healthPlan) localStorage.setItem('healthPlan', JSON.stringify(healthPlan));
      localStorage.setItem('dailyLogs', JSON.stringify(dailyLogs));
      localStorage.setItem('feedback', JSON.stringify(feedback));
      localStorage.setItem('isOnboarded', isOnboarded.toString());
    }
  }, [healthGoal, userProfile, healthPlan, dailyLogs, feedback, isOnboarded]);

  // Add a daily log
  const addDailyLog = (log: DailyLog) => {
    setDailyLogs(prev => [...prev, log]);
  };

  // Add feedback
  const addFeedback = (entry: FeedbackEntry) => {
    setFeedback(prev => [...prev, entry]);
  };

  // Complete onboarding
  const completeOnboarding = () => {
    setIsOnboarded(true);
  };

  return (
    <HealthContext.Provider
      value={{
        healthGoal,
        setHealthGoal,
        userProfile,
        setUserProfile,
        healthPlan,
        setHealthPlan,
        dailyLogs,
        addDailyLog,
        feedback,
        addFeedback,
        isOnboarded,
        completeOnboarding
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

// Custom hook to use the health context
export const useHealth = (): HealthContextType => {
  const context = useContext(HealthContext);
  if (context === undefined) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};