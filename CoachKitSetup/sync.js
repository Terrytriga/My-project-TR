import fs from "fs";
import supabase from "./supabase.js";
import generateEmbedding from "./embedding.js";

const syncKnowledge = async () => {
  const folderPath = "./Knowledge";
  // Get all files in the folder
  const fileTitles = fs.readdirSync(folderPath);

  // Get all files in the database
  const databaseFiles = await aiKnowledge();

  const existingFiles = databaseFiles
    .filter((file) => file && file.id)
    .map((file) => file.id);

  // Compare the two arrays to find new files
  const newFiles = fileTitles.filter(
    (title) =>
      !existingFiles.some(
        (existing) => existing.toLowerCase() === title.toLowerCase()
      )
  );

  const newKnowledgePromise = newFiles.map(async (title) => {
    const filePath = `${folderPath}/${title}`;
    const content = fs.readFileSync(filePath, "utf-8");
    const embedding = await generateEmbedding(content);
    return {
      id: title,
      body: content,
      vector: embedding,
    };
  });
  const newKnowledge = await Promise.all(newKnowledgePromise);

  addNewAiKnowledge(newKnowledge);
};

export default syncKnowledge;

async function aiKnowledge() {
  const { data, error } = await supabase.from("aiknowledge").select("*");
  if (error) {
    console.log(error);
  }
  return data;
}
async function addNewAiKnowledge(knowledge) {
  if (knowledge.length === 0) return;
  const { error } = await supabase.from("aiknowledge").insert(knowledge);
  if (error) {
    return console.log(error);
  }
}
