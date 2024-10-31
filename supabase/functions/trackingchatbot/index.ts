// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import OpenAI from "https://deno.land/x/openai@v4.58.1/mod.ts";

const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") });

const buildFullPrompt = (tracking: string, trackingData: string) => {
  const prompt_boilerplate =
    "Provide a detailed and well-explained answer to the user's query based on the relevant information from the given context.";
  const trackingType = `Tracking Type: ${tracking}`;
  const knowledge_query = `Data: ${trackingData}`;
  const final_answer = "Answer:";

  return `${prompt_boilerplate}\n${trackingType}\n${knowledge_query}\n${final_answer}`;
};

const completion = async (prompt: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "This chatbot processes structured JSON data to perform advanced analytics and provide detailed insights. It can interpret complex datasets, identify trends, and deliver actionable recommendations. It is capable of summarizing data, highlighting key patterns, and generating visualizations when needed. The bot is designed to provide accurate, concise, and context-aware responses based on the analysis of the provided JSON data. It supports a variety of data formats and can handle both statistical and trend-based inquiries.",
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
    const { tracking, trackingData } = await req.json();

    const full_prompt = buildFullPrompt(tracking, trackingData);
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
