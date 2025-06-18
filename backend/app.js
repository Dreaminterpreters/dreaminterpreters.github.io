// Cloudflare Worker: Dream Interpreter API
export default {
    async fetch(request, env, ctx) {
        if (request.method !== "POST") {
            return new Response(JSON.stringify({
                error: "Only POST requests allowed"
            }), {
                status: 405,
                headers: { "Content-Type": "application/json" }
            });
        }

        let data;
        try {
            data = await request.json();
        } catch (e) {
            return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const { dream } = data;
        if (!dream || typeof dream !== "string" || dream.trim().length < 5) {
            return new Response(JSON.stringify({ error: "Dream text must be at least 5 characters" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Basic symbol extraction (replace with more robust logic or call backend API)
        const lowerDream = dream.toLowerCase();
        const symbols = [];
        if (/mountain|climb|hill/.test(lowerDream)) symbols.push('mountain');
        if (/water|river|sea|lake|rain/.test(lowerDream)) symbols.push('water');
        if (/dog|canine|wolf|animal/.test(lowerDream)) symbols.push('dog');
        if (symbols.length === 0) symbols.push('journey', 'challenge', 'companion');

        // Example: hardcoded interpretations (replace with Supabase or backend API fetch)
        const lookup = {
            mountain: {
                symbol: "mountain",
                source: "Hinduism",
                icon: "book",
                color: "#FF6B6B",
                interpretation: "In Hindu philosophy, mountains represent spiritual obstacles and the path to enlightenment.",
                reference: "Bhagavad Gita 6:5-6 (Hinduism)"
            },
            water: {
                symbol: "water",
                source: "Islamic Tradition",
                icon: "moon",
                color: "#4CAF50",
                interpretation: "Water symbolizes knowledge and spiritual insight during difficult times.",
                reference: "Ibn Sirin's Ta'bir al-Ru'ya"
            },
            dog: {
                symbol: "dog",
                source: "Jungian Psychology",
                icon: "mask",
                color: "#607D8B",
                interpretation: "Dogs represent loyalty to your authentic self according to Jungian psychology principles.",
                reference: "Jungian Archetypes (Collective Unconscious)"
            },
            journey: {
                symbol: "journey",
                source: "General Symbolism",
                icon: "road",
                color: "#6a11cb",
                interpretation: "A journey in dreams often reflects your life's path and personal growth.",
                reference: "Modern Dream Studies"
            },
            challenge: {
                symbol: "challenge",
                source: "General Symbolism",
                icon: "bolt",
                color: "#2575fc",
                interpretation: "Challenges in dreams may represent obstacles you are currently facing.",
                reference: "Modern Dream Studies"
            },
            companion: {
                symbol: "companion",
                source: "General Symbolism",
                icon: "user-friends",
                color: "#ff6b6b",
                interpretation: "A companion in dreams reflects support systems or relationships in your waking life.",
                reference: "Modern Dream Studies"
            }
        };

        const interpretations = symbols
            .filter((sym) => lookup[sym])
            .map((sym) => lookup[sym]);

        return new Response(JSON.stringify(interpretations), {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
    }
};
