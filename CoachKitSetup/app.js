import syncKnowledge from "./sync.js";
import express from "express";
import bodyParser from "body-parser";
import { prompt } from "./prompt.js";
import cors from "cors";

const app = express();

app.use(cors());
//Gets the information of the body of the request
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/Sync", async (req, res) => {
  try {
    await syncKnowledge(); // Ensure syncKnowledge is awaited if it's asynchronous
    res.json({ message: "Knowledge synced successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error syncing knowledge", details: error });
  }
});

// Message endpoint to handle requests from the Expo app
app.post("/message", async (req, res) => {
  try {
    const userMessage = req.body.message;
    console.log(userMessage);
    const responseMessage = await prompt(userMessage);
    res.json({ response: responseMessage });
  } catch (error) {
    console.error("Error during message processing:", error);
    res.status(500).json({ error: "Error processing message", details: error });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
//https://www.youtube.com/watch?v=BgrSLXwydvc
