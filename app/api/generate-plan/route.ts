import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Force the route to be dynamic
export const dynamic = 'force-dynamic';

// Initialize OpenAI with a conditional check for the API key
const apiKey = process.env.OPENAI_API_KEY || 'dummy-key-for-build';
console.log('API Key available:', apiKey !== 'dummy-key-for-build' && apiKey !== undefined && apiKey !== '');

const openai = new OpenAI({
  apiKey: apiKey,
});

export async function POST(request: Request) {
  try {
    // Check if API key is available
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy-key-for-build') {
      console.error('OpenAI API key is not configured or is using the dummy key');
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }
    
    // Test the OpenAI connection with a simple request
    try {
      console.log('Testing OpenAI connection...');
      const testCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Hello, this is a test." }],
        max_tokens: 5
      });
      console.log('OpenAI test successful:', testCompletion.choices[0].message);
    } catch (testError) {
      console.error('OpenAI test request failed:', testError);
      if (testError instanceof Error) {
        console.error('Error message:', testError.message);
        console.error('Error name:', testError.name);
        console.error('Error stack:', testError.stack);
      }
      return NextResponse.json(
        { error: `OpenAI API test failed: ${testError instanceof Error ? testError.message : 'Unknown error'}` },
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

    let trainingPlan, summary;
    
    try {
      console.log('Attempting to generate training plan...');
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
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
      
      console.log('Training plan generation successful');
      trainingPlan = completion.choices[0].message.content;
    } catch (error) {
      console.error('Error generating training plan with OpenAI:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      throw new Error(`Failed to generate training plan: ${error instanceof Error ? error.message : 'Unknown error'}`); 
    }

    // Create a summary of the plan
    try {
      console.log('Attempting to generate summary...');
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
      
      console.log('Summary generation successful');
      summary = summaryCompletion.choices[0].message.content;
    } catch (error) {
      console.error('Error generating summary with OpenAI:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      // If summary generation fails, we'll still return the training plan without a summary
      summary = "Summary generation failed. Please refer to the full training plan.";
    }

    console.log('trainingPlan', trainingPlan);
    console.log('summary', summary);

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
    // Log more detailed information about the error
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    } else {
      console.error('Unknown error type:', typeof error);
    }
    return NextResponse.json(
      { error: 'Failed to generate training plan' },
      { status: 500 }
    );
  }
}