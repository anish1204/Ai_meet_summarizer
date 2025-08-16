import { NextRequest, NextResponse } from 'next/server';
import { CohereClient } from 'cohere-ai';

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { transcript, prompt } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }

    const finalPrompt = `You are an assistant that summarizes meeting transcripts.

Instruction: ${prompt}

Transcript:
${transcript}`;

    // ✅ Correct usage for current Cohere SDK
    const response = await cohere.chat({
      model: 'command-r-plus',
      message: finalPrompt,
    });

    // Cohere returns the text directly
    const summary = response.text || '';

    return NextResponse.json({ summary });
  } catch (err: any) {
    console.error('Summarize API error:', err);
    return NextResponse.json({ error: err.message ?? 'Unknown error' }, { status: 500 });
  }
}
