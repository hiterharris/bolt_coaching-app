import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI with a conditional check for the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
});

export async function POST(request: Request) {
  try {
    // Check if API key is available
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy-key-for-build') {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    
    const {
      name,
      age,
      experienceLevel,
      primaryEvent,
      secondaryEvents,
      personalBests,
      programLength,
      trainingDays,
      goals,
      injuries,
      additionalInfo,
    } = body;

    // Validate required fields
    if (!name || !age || !experienceLevel || !primaryEvent || !programLength || !trainingDays || !goals) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create a prompt for OpenAI
    const prompt = `
      Create a detailed ${programLength}-week track and field training plan for ${name}, who is ${age} years old with ${experienceLevel} experience level.
      
      Primary event: ${primaryEvent}
      ${secondaryEvents ? `Secondary events: ${secondaryEvents}` : ''}
      ${personalBests ? `Personal bests: ${personalBests}` : ''}
      Training days per week: ${trainingDays}
      Goals: ${goals}
      ${injuries ? `Injuries/limitations: ${injuries}` : ''}
      ${additionalInfo ? `Additional information: ${additionalInfo}` : ''}
      
      The training plan should include:
      
      1. A brief overview of the training philosophy and approach
      2. Weekly breakdown with specific workouts for each training day
      3. Periodization structure (preparation, competition, etc.)
      4. Specific exercises tailored to the athlete's events
      5. Recovery and injury prevention strategies
      6. Progression metrics to track improvement
      
      Format the plan in a clear, structured way with markdown formatting.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert track and field coach with decades of experience training athletes at all levels. You create detailed, personalized training plans based on an athlete's specific needs, events, and goals."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const trainingPlan = completion.choices[0].message.content;

    // Create a summary of the plan
    const summaryPrompt = `
      Create a brief summary (3-5 bullet points) of the following training plan:
      
      ${trainingPlan}
    `;

    const summaryCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert track and field coach. Create a concise summary of the training plan."
        },
        {
          role: "user",
          content: summaryPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const summary = summaryCompletion.choices[0].message.content;

    return NextResponse.json({
      name,
      age,
      experienceLevel,
      primaryEvent,
      programLength,
      trainingDays,
      goals,
      plan: trainingPlan,
      summary,
    });
  } catch (error) {
    console.error('Error generating training plan:', error);
    return NextResponse.json(
      { error: 'Failed to generate training plan' },
      { status: 500 }
    );
  }
}