// Source traditions with keys for matching
const interpretationSources = [
  { key: "hinduism", name: "Hinduism (Vedanta)", icon: "book", color: "#FF6B6B" },
  { key: "islam", name: "Islamic Tradition", icon: "moon", color: "#4CAF50" },
  { key: "egyptian", name: "Ancient Egyptian", icon: "user-secret", color: "#FF9800" },
  { key: "taoism", name: "Taoism", icon: "yin-yang", color: "#2196F3" },
  { key: "kabbalah", name: "Judaism (Kabbalah)", icon: "star-of-david", color: "#9C27B0" },
  { key: "jungian", name: "Jungian Psychology", icon: "mask", color: "#607D8B" }
];

// Symbol interpretations by tradition/source
const interpretationsLibrary = {
  mountain: {
    hinduism: {
      text: "In Hindu philosophy, mountains represent spiritual obstacles and the path to enlightenment.",
      reference: "Bhagavad Gita 6:5-6 (Hinduism)"
    },
    taoism: {
      text: "Taoist philosophy views mountains as symbols of steadfastness and inner balance.",
      reference: "Tao Te Ching, Ch. 32 (Taoism)"
    },
    kabbalah: {
      text: "In Kabbalah, mountains represent strength and developing inner discipline.",
      reference: "Zohar I, 224a (Kabbalah)"
    }
  },
  water: {
    hinduism: {
      text: "Water represents emotional awareness and subconscious thoughts.",
      reference: "Bhagavad Gita 6:5-6 (Hinduism)"
    },
    islam: {
      text: "Water symbolizes knowledge and spiritual insight in Islamic dream interpretation.",
      reference: "Ibn Sirin's Ta'bir al-Ru'ya"
    },
    jungian: {
      text: "Water reflects the collective unconscious and emotional undercurrents in your life.",
      reference: "Jungian Archetypes (Collective Unconscious)"
    }
  },
  dog: {
    hinduism: {
      text: "In Hindu tradition, dogs are linked to Bhairava, suggesting divine protection during your journey.",
      reference: "Bhagavad Gita 6:5-6 (Hinduism)"
    },
    egyptian: {
      text: "The jackal-headed Anubis connects dogs to spiritual guidance and support in challenges.",
      reference: "Book of the Dead, Spell 17 (Egyptian)"
    },
    jungian: {
      text: "Dogs represent loyalty to your authentic self during this journey according to Jungian principles.",
      reference: "Jungian Archetypes (Collective Unconscious)"
    }
  }
};

const referencesLibrary = [
  "Bhagavad Gita 2:22 (Hinduism)",
  "Ibn Sirin's Ta'bir al-Ru'ya (Islamic)",
  "Book of the Dead, Spell 17 (Egyptian)",
  "Tao Te Ching, Ch. 32 (Taoism)",
  "Zohar I, 224a (Kabbalah)",
  "Dhammapada 153-154 (Buddhism)",
  "St. John of the Cross, Dark Night of the Soul (Christian)",
  "Vendidad 5:45-46 (Zoroastrianism)",
  "Guru Granth Sahib, Ang 142 (Sikhism)",
  "Freud, S. The Interpretation of Dreams",
  "Jung, C.G. Man and His Symbols",
  "Miller, G.H. 10,000 Dreams Interpreted #7,812"
];

// DOM Elements
const dreamInput = document.getElementById('dream-text');
const interpretBtn = document.getElementById('interpret-btn');
const loader = document.getElementById('loader');
const btnText = document.getElementById('btn-text');
const resultsSection = document.getElementById('results-section');
const interpretationsContainer = document.getElementById('interpretations-container');
const errorMessage = document.getElementById('error-message');

// Symbol extraction from user input
function extractSymbols(text) {
  const detected = [];
  if (/mountain|climb|hill/i.test(text)) detected.push('mountain');
  if (/water|riv[er|e]|lake|sea|rain/i.test(text)) detected.push('water');
  if (/dog|canine|wolf|animal/i.test(text)) detected.push('dog');
  return detected.length ? detected : ['journey', 'challenge', 'companion'];
}

// Generate a random high-level dream meaning
function getRandomMeaning() {
  const meanings = [
    "a period of personal growth and transformation",
    "unresolved emotions seeking your attention",
    "hidden aspects of your personality coming to light",
    "challenges that will lead to important life lessons",
    "a transition phase in your personal relationships"
  ];
  return meanings[Math.floor(Math.random() * meanings.length)];
}

function getRandomReflection() {
  const reflections = [
    "your subconscious processing daily experiences",
    "deep-seated desires seeking expression",
    "unresolved conflicts from your past",
    "your mind preparing for upcoming challenges",
    "creative energies manifesting in symbolic form"
  ];
  return reflections[Math.floor(Math.random() * reflections.length)];
}

function formatInterpretations(dreamText, symbols) {
  const result = {
    overview: {
      content: `Your dream about ${symbols.join(', ')} suggests ${getRandomMeaning()}. This reflects ${getRandomReflection()}.`,
      reference: "DreamBase Synthesis v3.1"
    },
    symbols: []
  };

  symbols.forEach(symbol => {
    let interpretations = [];
    const traditions = interpretationsLibrary[symbol];
    if (traditions) {
      // Pick up to 2 random traditions for the symbol
      const keys = Object.keys(traditions);
      const chosenKeys = [];
      while (chosenKeys.length < 2 && chosenKeys.length < keys.length) {
        const randKey = keys[Math.floor(Math.random() * keys.length)];
        if (!chosenKeys.includes(randKey)) chosenKeys.push(randKey);
      }
      chosenKeys.forEach(traditionKey => {
        const source = interpretationSources.find(src => src.key === traditionKey) || interpretationSources[0];
        const interp = traditions[traditionKey];
        interpretations.push({
          source: source.name,
          icon: source.icon,
          color: source.color,
          text: interp.text,
          reference: interp.reference
        });
      });
    } else {
      // Fallback
      interpretations.push({
        source: "General",
        icon: "book",
        color: "#6a11cb",
        text: `The symbol "${symbol}" represents an important theme in your personal journey.`,
        reference: referencesLibrary[Math.floor(Math.random() * referencesLibrary.length)]
      });
    }
    result.symbols.push({
      symbol: symbol.charAt(0).toUpperCase() + symbol.slice(1),
      interpretations
    });
  });

  return result;
}

function displayInterpretations(data) {
  interpretationsContainer.innerHTML = '';

  // Overview card
  const overviewCard = document.createElement('div');
  overviewCard.className = 'symbol-card';
  overviewCard.innerHTML = `
    <div class="interpretation-text">${data.overview.content}</div>
    <div class="source-reference">${data.overview.reference}</div>
  `;
  interpretationsContainer.appendChild(overviewCard);

  // Symbol interpretations
  data.symbols.forEach((symbolGroup, index) => {
    const section = document.createElement('div');
    section.className = 'symbol-card fade-in';
    section.style.animationDelay = `${index * 0.1}s`;

    const title = document.createElement('div');
    title.className = 'symbol-title';
    title.textContent = symbolGroup.symbol;
    section.appendChild(title);

    symbolGroup.interpretations.forEach(interpretation => {
      const sourceDiv = document.createElement('div');
      sourceDiv.className = 'interpretation-source';

      const icon = document.createElement('div');
      icon.className = 'source-icon';
      icon.style.background = interpretation.color;
      icon.innerHTML = `<i class="fas fa-${interpretation.icon}"></i>`;

      const name = document.createElement('div');
      name.className = 'source-name';
      name.textContent = interpretation.source;

      sourceDiv.appendChild(icon);
      sourceDiv.appendChild(name);
      section.appendChild(sourceDiv);

      const text = document.createElement('div');
      text.className = 'interpretation-text';
      text.textContent = interpretation.text;
      section.appendChild(text);

      const reference = document.createElement('div');
      reference.className = 'source-reference';
      reference.textContent = interpretation.reference;
      section.appendChild(reference);
    });

    interpretationsContainer.appendChild(section);
  });

  resultsSection.style.display = 'block';
}

async function handleInterpretDream() {
  const dreamText = dreamInput.value.trim();

  if (!dreamText) {
    errorMessage.textContent = 'Please describe your dream first';
    errorMessage.style.display = 'block';
    return;
  }

  if (dreamText.split(/\s+/).length < 5) {
    errorMessage.textContent = 'Please describe your dream in more detail (at least 5 words)';
    errorMessage.style.display = 'block';
    return;
  }

  errorMessage.style.display = 'none';
  loader.style.display = 'block';
  btnText.textContent = 'Analyzing Dream...';
  interpretationsContainer.innerHTML = '';
  resultsSection.style.display = 'none';

  try {
    await new Promise(resolve => setTimeout(resolve, 1200));
    const symbols = extractSymbols(dreamText);
    const interpretationData = formatInterpretations(dreamText, symbols);
    displayInterpretations(interpretationData);
  } catch (err) {
    console.error(err);
    errorMessage.textContent = 'An error occurred while interpreting your dream';
    errorMessage.style.display = 'block';
  } finally {
    loader.style.display = 'none';
    btnText.innerHTML = '<i class="fas fa-crystal-ball"></i> Interpret Dream';
  }
}

// Event listeners
interpretBtn.addEventListener('click', handleInterpretDream);
dreamInput.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    handleInterpretDream();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  dreamInput.value = "I was climbing a mountain and encountered a dog near water";
  // Optionally, trigger an initial interpretation:
  // handleInterpretDream();
});
