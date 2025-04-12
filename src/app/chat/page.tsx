'use client';
import React, { useState, useRef, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import { useHealth } from '@/context/HealthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

// Message types
type MessageType = 'user' | 'assistant';

interface Message {
  id: string;
  type: MessageType;
  text: string;
  timestamp: Date;
}

const ChatAssistant = () => {
  const { healthGoal, healthPlan, dailyLogs, isOnboarded } = useHealth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Redirect to goal setup if not onboarded
  useEffect(() => {
      // Add welcome message
      setTimeout(() => {
        const welcomeMessage = {
          id: Date.now().toString(),
          type: 'assistant' as MessageType,
          text: `Hello! I'm your health assistant. Based on your ${healthGoal} goal, how can I help you today? You can ask me about your health plan, nutrition advice, or any health-related questions.`,
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
      }, 500);
  }, [isOnboarded, router, healthGoal]);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate AI response (in a real app, this would be a call to an API)
    setTimeout(() => {
      const aiResponse = generateAIResponse(input);
      const assistantMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        text: aiResponse,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  // Function to generate mock AI responses based on user input
  const generateAIResponse = (question: string): string => {
    const questionLower = question.toLowerCase();
    
    // Check for diet-related questions
    if (questionLower.includes('eat') || questionLower.includes('food') || questionLower.includes('meal') || questionLower.includes('diet')) {
      if (healthGoal === 'Lose weight') {
        return "Based on your weight loss goal, focus on high-protein, low-carb meals. Include lean proteins like chicken, fish, and tofu. Incorporate plenty of vegetables and limit refined carbs. Try to eat smaller portions and avoid sugary snacks between meals.";
      } else if (healthGoal === 'Gain muscle') {
        return "For muscle gain, prioritize protein intake (1.6-2g per kg of body weight) and ensure you're in a slight caloric surplus. Include lean proteins with each meal, complex carbs for energy, and don't forget healthy fats. Post-workout nutrition is particularly important - aim for protein and carbs within 30 minutes after training.";
      } else {
        return "For balanced nutrition, try to include a variety of foods in your diet: lean proteins, whole grains, healthy fats, and plenty of fruits and vegetables. Based on your health plan, I recommend eating regular meals and staying hydrated throughout the day.";
      }
    }
    
    // Check for sleep-related questions
    if (questionLower.includes('sleep') || questionLower.includes('tired') || questionLower.includes('rest') || questionLower.includes('insomnia')) {
      if (healthGoal === 'Improve sleep') {
        return "To improve sleep quality, maintain a consistent sleep schedule (even on weekends). Create a relaxing bedtime routine and avoid screens 1 hour before bed. Keep your bedroom cool, dark, and quiet. Limit caffeine after noon and avoid heavy meals before bedtime. If you're still having issues after 2 weeks of good sleep hygiene, consider consulting a healthcare provider.";
      } else {
        return "Quality sleep is crucial for overall health. Aim for 7-8 hours of sleep per night. Establish a regular sleep schedule and create a restful environment. Limit screen time before bed and avoid caffeine in the afternoon. If you consistently feel tired despite getting enough sleep, consider tracking your sleep patterns or consulting with a healthcare provider.";
      }
    }
    
    // Check for exercise-related questions
    if (questionLower.includes('exercise') || questionLower.includes('workout') || questionLower.includes('training') || questionLower.includes('cardio') || questionLower.includes('strength')) {
      if (healthGoal === 'Lose weight') {
        return "For weight loss, combine cardio and strength training. Aim for 150-300 minutes of moderate-intensity cardio per week (like brisk walking, cycling, or swimming) and include 2-3 strength training sessions. High-intensity interval training (HIIT) can be particularly effective for calorie burning. Remember that consistency is more important than intensity when starting out.";
      } else if (healthGoal === 'Gain muscle') {
        return "For muscle building, focus on progressive overload in your strength training. Train each major muscle group 2-3 times per week with adequate recovery between sessions. Compound exercises like squats, deadlifts, bench press, and rows should form the foundation of your program. Gradually increase weight or reps as you get stronger.";
      } else {
        return "Regular physical activity is essential for health. Aim for at least 150 minutes of moderate exercise per week. Include both cardio and strength training in your routine. Find activities you enjoy to help maintain consistency. Remember to start gradually if you're new to exercise and always warm up properly before working out.";
      }
    }
    
    // Check for stress-related questions
    if (questionLower.includes('stress') || questionLower.includes('anxiety') || questionLower.includes('relax') || questionLower.includes('mental health')) {
      if (healthGoal === 'Manage stress') {
        return "For stress management, practice deep breathing exercises daily - try the 4-7-8 technique (inhale for 4 seconds, hold for 7, exhale for 8). Regular meditation, even just 5-10 minutes daily, can significantly reduce stress levels. Physical activity helps release tension, and getting enough sleep is crucial for emotional regulation. Consider limiting news and social media if they trigger anxiety.";
      } else {
        return "Managing stress is important for overall health. Try incorporating stress-reduction techniques like deep breathing, meditation, or yoga into your daily routine. Regular physical activity can help reduce stress levels. Ensure you're getting enough sleep and consider limiting time spent on digital devices. If stress is significantly impacting your life, consider speaking with a healthcare provider.";
      }
    }
    
    // Default response if no specific topic is detected
    return "That's a great question! To give you the most accurate advice based on your personal health goals and history, I'd need more information. Could you provide more details or ask a more specific question about your health plan or goals?";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="bg-white p-4 rounded-b-3xl shadow-md">
        <NavBar />
      </div>
      
      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">Health Assistant</CardTitle>
            <CardDescription>
              Ask questions about your health plan, nutrition, exercise, or wellness tips
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto px-4 pb-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.type === 'user' 
                        ? 'bg-brandOrange text-white' 
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {format(message.timestamp, 'h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-800 rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          
          <CardFooter className="pt-4 border-t">
            <form 
              className="w-full flex space-x-2" 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your health question..."
                className="flex-1"
              />
              <Button 
                type="submit" 
                className="bg-brandOrange hover:bg-brandOrange/90"
                disabled={!input.trim() || isTyping}
              >
                Send
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ChatAssistant;