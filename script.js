// DOM Elements
const dreamInput = document.getElementById('dream-text');
const interpretBtn = document.getElementById('interpret-btn');
const loader = document.getElementById('loader');
const btnText = document.getElementById('btn-text');
const resultsSection = document.getElementById('results-section');
const interpretationsContainer = document.getElementById('interpretations-container');
const errorMessage = document.getElementById('error-message');

// Display interpretations in the DOM
function displayInterpretations(data) {
  interpretationsContainer.innerHTML = '';

  if (!data || data.length === 0) {
    interpretationsContainer.innerHTML = `
      <div class="no-results fade-in">
        No interpretations found for your dream symbols.
      </div>
    `;
    resultsSection.style.display = 'block';
    return;
  }

  data.forEach((entry, index) => {
    const section = document.createElement('div');
    section.className = 'symbol-card fade-in';
    section.style.animationDelay = `${index * 0.1}s`;

    const title = document.createElement('div');
    title.className = 'symbol-title';
    title.textContent = entry.symbol || 'Symbol';
    section.appendChild(title);

    const sourceDiv = document.createElement('div');
    sourceDiv.className = 'interpretation-source';

    const icon = document.createElement('div');
    icon.className = 'source-icon';
    icon.style.background = entry.color || '#6a11cb';
    icon.innerHTML = `<i class="fas fa-${entry.icon || 'book'}"></i>`;

    const name = document.createElement('div');
    name.className = 'source-name';
    name.textContent = entry.source || 'Source';

    sourceDiv.appendChild(icon);
    sourceDiv.appendChild(name);
    section.appendChild(sourceDiv);

    const text = document.createElement('div');
    text.className = 'interpretation-text';
    text.textContent = entry.text;
    section.appendChild(text);

    if (entry.reference) {
      const reference = document.createElement('div');
      reference.className = 'source-reference';
      reference.textContent = entry.reference;
      section.appendChild(reference);
    }

    interpretationsContainer.appendChild(section);
  });

  resultsSection.style.display = 'block';
}

// Main handler for interpreting dream
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
    // --- SEND THE DREAM TO YOUR API HERE ---
    const response = await fetch(' sk-e27228439d134b719c8e0f8624e89fa2', {
      method: 'POST', // or 'GET' if that's what your API needs
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer YOUR_API_KEY' // Uncomment if needed
      },
      body: JSON.stringify({ dream: dreamText }) // Adjust to your API's expected input
    });

    if (!response.ok) throw new Error('API error');
    const apiResult = await response.json();

    // Adjust this line if your API returns the data under a different key
    displayInterpretations(apiResult.interpretations || apiResult);

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
});
