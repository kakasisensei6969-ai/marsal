import { Mistral } from '@mistralai/mistralai';

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY || '' });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await client.chat.complete({
      model: "mistral-small-latest",
      messages: messages,
    });

    return new Response(JSON.stringify({ 
      content: response.choices?.[0]?.message.content 
    }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "API Error" }), { status: 500 });
  }
}
