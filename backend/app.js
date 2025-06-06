const express = require("express");
const fetch = require("node-fetch"); // v2 or compatible fetch polyfill
const cors = require("cors");

// --- CONFIGURATION ---
const USE_EXTERNAL_API = true; // set to false to use only local logic
const EXTERNAL_API_URL = "https://api.deepseek.com/v1/dream";
const EXTERNAL_API_KEY = process.env.DEEPSEEK_API_KEY; // Set in your environment

const app = express();
app.use(cors());
app.use(express.json());

// --- Local AI/Symbolic interpretation logic ---
const interpretationSources = [ /* ...same array as your frontend... */ ];
const symbolInterpretations = { /* ...same object as your frontend... */ };

// Symbol extraction and formatting logic (same as above)
function extractSymbols(text) {
  const words = text.toLowerCase().split(/\s+/);
  const detected = [];
  if (/mountain|climb|hill/i.test(text)) detected.push("mountain");
  if (/water|riv[er|e]|lake|sea|rain/i.test(text)) detected.push("water");
  if (/dog|canine|wolf|animal/i.test(text)) detected.push("dog");
  return detected.length ? detected : ["journey", "challenge", "companion"];
}

function getRandomMeaning(symbols) {
  const meanings = [
    "This dream suggests a period of personal growth and transformation.",
    "Your dream reveals emotional themes that need attention.",
    "You're facing symbolic challenges related to your relationships.",
    "Hidden aspects of your personality are emerging through this dream."
  ];
  return meanings[Math.floor(Math.random() * meanings.length)];
}

function formatInterpretations(dreamText, symbols) {
  const result = {
    overview: {
      text: `Your dream about ${symbols.join(', ')} suggests ${getRandomMeaning(symbols)}. This reflects your current life situation.`,
      reference: "DreamBase AI v3.1"
    },
    symbols: []
  };

  symbols.forEach(symbol => {
    const traditionKeys = Object.keys(symbolInterpretations[symbol] || {});
    if (traditionKeys.length === 0) {
      result.symbols.push({
        symbol: symbol.charAt(0).toUpperCase() + symbol.slice(1),
        interpretations: [{
          source: "General",
          icon: "book",
          color: "#6a11cb",
          text: `The ${symbol} represents an important theme in your personal journey.`,
          reference: "DreamBase AI v3.1"
        }]
      });
      return;
    }
    const traditionKey = traditionKeys[Math.floor(Math.random() * traditionKeys.length)];
    const traditionData = symbolInterpretations[symbol][traditionKey];
    const source = interpretationSources.find(src => src.key === traditionKey) || {
      icon: "book",
      color: "#6a11cb",
      name: traditionKey.charAt(0).toUpperCase() + traditionKey.slice(1)
    };
    result.symbols.push({
      symbol: symbol.charAt(0).toUpperCase() + symbol.slice(1),
      interpretations: [{
        source: source.name,
        icon: source.icon,
        color: source.color,
        text: traditionData.text,
        reference: traditionData.reference
      }]
    });
  });

  return result;
}

// --- Main API endpoint ---
app.post("/api/interpret", async (req, res) => {
  const dreamText = (req.body.dream || "").trim();

  if (!dreamText || dreamText.split(/\s+/).length < 5) {
    return res.status(400).json({ error: "Please describe your dream in more detail (at least 5 words)" });
  }

  // If configured, try external API
  if (USE_EXTERNAL_API && EXTERNAL_API_KEY) {
    try {
      const apiResponse = await fetch(EXTERNAL_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${EXTERNAL_API_KEY}`
        },
        body: JSON.stringify({ dream: dreamText })
      });

      if (apiResponse.ok) {
        const result = await apiResponse.json();
        // If result is a flat array of interpretations, return as-is
        if (Array.isArray(result.interpretations)) {
          return res.json({ interpretations: result.interpretations });
        }
        // Otherwise, handle custom structure
        return res.json(result);
      }
    } catch (err) {
      // Fall through to local logic
      console.warn("External API call failed, falling back to local logic.", err);
    }
  }

  // Local AI (symbolic) logic fallback
  const symbols = extractSymbols(dreamText);
  const interpretationData = formatInterpretations(dreamText, symbols);
  res.json(interpretationData);
});

// --- Serve static files (optional) ---
// app.use(express.static("public")); // If you want to serve your front-end from the same server

// --- Start server ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Dream interpreter backend running on port ${PORT}`);
});
