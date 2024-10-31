// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import OpenAI from "https://deno.land/x/openai@v4.58.1/mod.ts";

const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") });

async function generateEmbedding(content: string) {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    encoding_format: "float",
    input: content,
  });
  return embedding.data[0].embedding;
}

const buildFullPrompt = (query: string, context: string) => {
  const prompt_boilerplate =
    "Answer the question posed in the user query section using the provided context.";
  const user_query = `User Query: ${query}`;
  const knowledge_query = `context: ${context}`;
  const final_answer = "Answer:";

  return `${prompt_boilerplate}\n${user_query}\n${knowledge_query}\n${final_answer}`;
};

const completion = async (prompt: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a helpful chatbot for the ProFit fitness app.",
      },
      { role: "user", content: prompt },
    ],
  });
  return response.choices[0];
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    const authHeader = req.headers.get("Authorization")!;
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );
    const vector = await generateEmbedding(message);
    const { data: vectorData, error: vectorError } = await supabase.rpc(
      "fn_match_vector",
      {
        query_embedding: vector,
        match_threshold: 0.75,
        match_count: 1,
      }
    );
    if (vectorError) return;
    const full_prompt = buildFullPrompt(message, vectorData[0].body);
    const answer = await completion(full_prompt);
    const data = {
      answer,
    };

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/chatbot' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
