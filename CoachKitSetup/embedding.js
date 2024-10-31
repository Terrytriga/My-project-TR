import openai from "./openai.js";

export default async function generateEmbedding(content) {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    encoding_format: "float",
    input: content,
  });
  return embedding.data[0].embedding;
}
