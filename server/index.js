const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get("/api/top-headlines", async (req, res) => {
  const country = req.query.country || "in";
  const apiKey = process.env.NEWS_API_KEY;

  try {
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=${country}&pageSize=100&apiKey=${apiKey}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching the articles: ", error);
    res.status(500).json({ error: "Error fetching the articles" });
  }
});

app.get("/api/search", async (req, res) => {
  const query = req.query.q || "Apple";
  const apiKey = process.env.NEWS_API_KEY;

  try {
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=${query}&pageSize=100&page=1&apiKey=${apiKey}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching the articles: ", error);
    res.status(500).json({ error: "Error fetching the articles" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
