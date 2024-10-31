import generateEmbedding from "./embedding.js";
import supabase from "./supabase.js";
import openai from "./openai.js";

export const prompt = async (message) => {
  const vector = await generateEmbedding(message);

  const { data, error } = await supabase.rpc("fn_match_vector", {
    query_embedding: vector,
    match_threshold: 0.75,
    match_count: 1,
  });
  if (error) return;
  const full_prompt = buildFullPrompt(message, data[0].body);
  const answer = await completion(full_prompt);
  console.log(answer);
};

const completion = async (prompt) => {
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
  console.log(response.choices[0]);
  return response.choices[0];
};

const buildFullPrompt = (query, context) => {
  const prompt_boilerplate =
    "Answer the question posed in the user query section using the provided context.";
  const user_query = `User Query: ${query}`;
  const knowledge_query = `context: ${context}`;
  const final_answer = "Answer:";

  return `${prompt_boilerplate}\n${user_query}\n${knowledge_query}\n${final_answer}`;
};
