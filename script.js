// Symbol interpretations library
const interpretationsLibrary = {
    mountain: [
        "Represents life challenges and obstacles you're facing",
        "Symbolizes spiritual growth and the journey to enlightenment",
        "Indicates a major goal that requires effort to achieve",
        "Suggests you need to gain perspective on a situation"
    ],
    water: [
        "Represents your emotions and subconscious mind",
        "Symbolizes purification, cleansing, and renewal",
        "Indicates the flow of life and adaptability",
        "Suggests deep emotional issues that need attention"
    ],
    dog: [
        "Represents loyalty, friendship, and protection",
        "Symbolizes your instincts and intuition",
        "Indicates a faithful companion or trustworthy ally",
        "Suggests the need for more playfulness in your life"
    ]
};

// References library
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

// Extract symbols from text
function extractSymbols(text) {
    const words = text.toLowerCase().split(/\s+/);
    const symbols = [];
    
    if (/mountain|climb|hill/i.test(text)) symbols.push('mountain');
    if (/water|riv[er|e]|lake|sea|rain/i.test(text)) symbols.push('water');
    if (/dog|canine|wolf|animal/i.test(text)) symbols.push('dog');
    
    return symbols.length ? symbols : ['journey', 'challenge', 'companion'];
}

// Get symbol interpretation
function getSymbolInterpretation(symbol, source) {
    const interpretations = interpretationsLibrary[symbol] || [
        `The ${symbol} represents an important symbol in your personal journey`,
        `This ${symbol} suggests a significant aspect of your subconscious mind`,
        `Encountering a ${symbol} indicates a meaningful life event approaching`
    ];
    return `${interpretations[Math.floor(Math.random() * interpretations.length)]} (${source} perspective).`;
}

// Generate random meaning
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

// Generate random reflection
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

// Format interpretations
function formatInterpretations(dreamText, symbols) {
    const result = {
        overview: {
            content: `Your dream about ${symbols.join(', ')} suggests ${getRandomMeaning()}. This reflects ${getRandomReflection()}.`,
            reference: "DreamBase Synthesis v3.1"
        },
        symbols: []
    };
    
    // Add interpretations for each symbol
    symbols.forEach(symbol => {
        result.symbols.push({
            symbol,
            interpretations: []
        });
        
        // Select random sources for each symbol
        const traditionIndices = new Set();
        while (traditionIndices.size < 2 && traditionIndices.size < interpretationSources.length) {
            traditionIndices.add(Math.floor(Math.random() * interpretationSources.length));
        }
        
        // Add interpretations from different sources
        Array.from(traditionIndices).forEach(index => {
            result.symbols[result.symbols.length - 1].interpretations.push({
                source: interpretationSources[index].name,
                icon: interpretationSources[index].icon,
                color: interpretationSources[index].color,
                text: getSymbolInterpretation(symbol, interpretationSources[index].name),
                reference: referencesLibrary[Math.floor(Math.random() * referencesLibrary.length)]
            });
        });
    });
    
    return result;
}

// Display interpretations
function displayInterpretations(data) {
    interpretationsContainer.innerHTML = '';
    resultsSection.style.display = 'block';
    
    data.symbols.forEach((symbolGroup, index) => {
        const section = document.createElement('div');
        section.className = 'symbol-section fade-in';
        section.style.animationDelay = `${index * 0.1}s`;
        
        const title = document.createElement('div');
        title.className = 'symbol-title';
        title.textContent = symbolGroup.symbol.charAt(0).toUpperCase() + symbolGroup.symbol.slice(1);
        section.appendChild(title);
        
        symbolGroup.interpretations.forEach(interpretation => {
            const card = document.createElement('div');
            card.className = 'interpretation-card';
            
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
            card.appendChild(sourceDiv);
            
            const text = document.createElement('div');
            text.className = 'interpretation-text';
            text.textContent = interpretation.text;
            card.appendChild(text);
            
            const reference = document.createElement('div');
            reference.className = 'source-reference';
            reference.textContent = interpretation.reference;
            card.appendChild(reference);
            
            section.appendChild(card);
        });
        
        interpretationsContainer.appendChild(section);
    });
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Handle dream interpretation
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
    
    try {
        const symbols = extractSymbols(dreamText);
        const interpretationData = formatInterpretations(dreamText, symbols);
        
        interpretationsContainer.innerHTML = `
            <div class="interpretation-card">
                <div class="interpretation-text">${interpretationData.overview.content}</div>
                <div class="source-reference">${interpretationData.overview.reference}</div>
            </div>
        `;
        
        // Add divider
        const divider = document.createElement('div');
        divider.className = 'symbol-title';
        divider.textContent = 'Symbol Interpretations';
        interpretationsContainer.appendChild(divider);
        
        // Add each symbol interpretation
        interpretationData.symbols.forEach((symbolGroup, index) => {
            symbolGroup.interpretations.forEach(interpretation => {
                const card = document.createElement('div');
                card.className = 'interpretation-card fade-in';
                
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
                card.appendChild(sourceDiv);
                
                const text = document.createElement('div');
                text.className = 'interpretation-text';
                text.textContent = interpretation.text;
                card.appendChild(text);
                
                const reference = document.createElement('div');
                reference.className = 'source-reference';
                reference.textContent = interpretation.reference;
                card.appendChild(reference);
                
                interpretationsContainer.appendChild(card);
            });
        });
        
        resultsSection.style.display = 'block';
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
document.getElementById('interpret-btn').addEventListener('click', handleInterpretDream);

// Initialize with sample interpretation
document.addEventListener('DOMContentLoaded', () => {
    dreamInput.value = "I was climbing a mountain and encountered a dog near water";
});
