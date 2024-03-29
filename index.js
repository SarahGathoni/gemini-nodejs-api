const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require('express');
const axios = require('axios');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const port = process.env.PORT

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize Google Generative AI with API key from environment variable
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// POST /chat endpoint
app.post('/chat', async (req, res) => {
  try {
    // Extract history and message from request body
    const { history, message } = req.body;
    console.log(history, message);
    
    // Define the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Start a chat session
    const chat = model.startChat(history);
    
    // Send a message to the chat session
    const result = await chat.sendMessage(message)
    const response = result.response;
    
    // Log the response
    console.log(result);
    
    // Send the response text to the client
    res.send(response);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).send("Internal Server Error")
  }
});

// Serve the frontend
app.use('/frontend', async (req, res) => {
  try {
    const response = await axios.get('https://palm2chatbot-4gms.vercel.app/');
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching frontend:', error);
    res.status(500).send('Error fetching frontend');
  }
});

// Start the server

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
