import { GoogleGenerativeAI, GenerateContentRequest, Content } from '@google/generative-ai';
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from 'ai';

const apikey = "AIzaSyC6h14AfnZKQ-yIj05BhlI9UQU5iT_IJ5M";
const genAI = new GoogleGenerativeAI(apikey || '');

export const runtime = 'edge';

export async function POST(req: Request): Promise<StreamingTextResponse> {
  const { messages } = await req.json();
  const role = `
  You are a medical advisor AI, capable of addressing both physical and mental health concerns. 
  Respond to medical questions, including mental health issues like stress and anxiety, with evidence-based information.
  
  Always include a disclaimer that your advice should not replace professional medical or psychological consultation.
  
  If you are unsure about any medical or mental health advice, refer to established guidelines and recent peer-reviewed research.
  
  Provide your response in a clear, empathetic manner, using bullet points where appropriate.
  
  If the query is not related to physical or mental health, politely inform the user that you can only assist with medical and mental health inquiries.
  `;

  const buildGoogleGenAIPrompt = (messages: Message[]): GenerateContentRequest => ({
    contents: messages
      .filter(message => message.role === 'user' || message.role === 'assistant')
      .map(message => ({
        role: message.role === 'user' ? 'user' : 'model',
        parts: [
          message.role === 'assistant' ? { text: message.content }
          : { text: `${role}\n\nUser query: ${message.content}` }
        ]
      }) as Content),
  });

  const geminiStream = await genAI
    .getGenerativeModel({ model: 'gemini-pro' })
    .generateContentStream(buildGoogleGenAIPrompt(messages));

  const stream = GoogleGenerativeAIStream(geminiStream);

  return new StreamingTextResponse(stream);
}