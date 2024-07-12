import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

/**
 * Handle POST requests to this route.
 * 
 * @param {Request} req - The incoming request object.
 * @returns {Response} - The response object containing the streamed AI response.
 */
export async function POST(req: Request) {
  // Extract the 'messages' and 'activities' properties from the request body.
  const { messages, activities } = await req.json();
  
  // Create a summary text from the activities.
  const text = "The activities of the week are: " + JSON.stringify(activities);
  
  // Add the summary text as a new user message to the messages array.
  messages.push({ "role": "user", "content": text });

  // Generate a streaming response from the AI model using the openai SDK.
  const result = await streamText({
    model: openai('gpt-3.5-turbo'), // Specify the AI model to use.
    system: `You are a personal trainer, who analyzes the week performance of the user.
     Always answer precisely and based on training theory`, // Provide system instructions for the AI.
    messages // Pass the updated messages array to the AI model.
  });

  // Convert the AI result to a streaming response and return it.
  return result.toAIStreamResponse();
}
