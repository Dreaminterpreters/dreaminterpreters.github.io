import { type NextRequest, NextResponse } from "next/server"

const DREAM_SYMBOLS = {
  snake: {
    keywords: ["snake", "serpent", "cobra", "python"],
    meaning: "Transformation, healing, wisdom, or hidden fears. Represents renewal and spiritual awakening."
  },
  dragon: {
    keywords: ["dragon", "drake"],
    meaning: "Ultimate power, cosmic energy, and transformation. Symbol of wisdom and imperial strength."
  },
  water: {
    keywords: ["water", "ocean", "sea", "river", "swimming", "drowning"],
    meaning: "Emotions, unconscious mind, purification, and life flow. Represents spiritual cleansing."
  },
  flying: {
    keywords: ["flying", "flight", "soaring", "floating"],
    meaning: "Freedom, transcendence, spiritual elevation. Desire to rise above limitations."
  },
  death: {
    keywords: ["death", "dying", "dead", "funeral"],
    meaning: "Transformation and rebirth. End of one phase, beginning of another. Spiritual renewal."
  }
}

export async function POST(request: NextRequest) {
  try {
    const { dream } = await request.json()
    
    if (!dream || dream.length < 10) {
      return NextResponse.json({ error: "Please provide a detailed dream description" }, { status: 400 })
    }

    const dreamLower = dream.toLowerCase()
    const foundSymbols = []

    for (const [symbol, data] of Object.entries(DREAM_SYMBOLS)) {
      for (const keyword of data.keywords) {
        if (dreamLower.includes(keyword)) {
          foundSymbols.push({ symbol, meaning: data.meaning })
          break
        }
      }
    }

    return NextResponse.json({
      success: true,
      symbols: foundSymbols,
      interpretation: foundSymbols.length > 0 
        ? `Your dream contains powerful symbols: ${foundSymbols.map(s => s.symbol).join(', ')}. ${foundSymbols[0]?.meaning}`
        : "Your dream contains unique personal symbols. Focus on the emotions and personal meanings."
    })
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
