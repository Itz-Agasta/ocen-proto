import { groq } from '@ai-sdk/groq';
import { streamText, UIMessage, convertToModelMessages } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: groq('openai/gpt-oss-20b'),
    messages: convertToModelMessages(messages),
    system: "You are Ocean Data Assistant, an AI assistant that helps users find information about oceanographic data, Argo floats, and related topics. Provide accurate and concise answers based on the user's questions. If you don't know the answer, it's okay to say you don't know. Always speak in english.",
  });
  console.log(result.text);
  return result.toUIMessageStreamResponse();
}