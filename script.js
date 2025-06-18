// dream-app.js — Frontend logic for Dream Interpreter app (using Vercel backend API)

// --- CONFIGURATION ---
const API_BASE = ""; // If frontend is served from same domain as backend, leave blank. Else, e.g. "https://your-project.vercel.app"
const DREAM_INTERPRET_ENDPOINT = `${API_BASE}/api/dreams/interpret`;
const REGISTER_ENDPOINT = `${API_BASE}/api/auth/register`;
const LOGIN_ENDPOINT = `${API_BASE}/api/auth/login`;
const DREAM_HISTORY_ENDPOINT = `${API_BASE}/api/dreams/history`;

// --- DOM ELEMENTS ---
const dreamInput = document.getElementById('dream-text');
const interpretBtn = document.getElementById('interpret-btn');
const loader = document.getElementById('loader');
const btnText = document.getElementById('btn-text');
const resultsSection = document.getElementById('results-section');
const interpretationsContainer = document.getElementById('interpretations-container');
const errorMessage = document.getElementById('error-message');

// For auth modals (implement your own modals or use prompt for simplicity)
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');
const userStatus = document.getElementById('user-status');

// --- Auth Utilities ---
function saveToken(token) {
    localStorage.setItem('dream_token', token);
}
function getToken() {
    return localStorage.getItem('dream_token');
}
function clearToken() {
    localStorage.removeItem('dream_token');
}
function isLoggedIn() {
    return !!getToken();
}

// --- UI Helper Functions ---
function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.style.display = 'block';
}
function clearError() {
    errorMessage.style.display = 'none';
}
function showLoader() {
    loader.style.display = 'block';
    btnText.textContent = "Analyzing Dream...";
}
function hideLoader() {
    loader.style.display = 'none';
    btnText.innerHTML = '<i class="fas fa-crystal-ball"></i> Interpret Dream';
}
function showResultsSection() {
    resultsSection.style.display = 'block';
}
function clearInterpretations() {
    interpretationsContainer.innerHTML = '';
}

// --- Main Dream Interpretation Handler ---
async function handleInterpretDream() {
    const dreamText = dreamInput.value.trim();

    if (!dreamText) {
        showError('Please describe your dream first');
        return;
    }
    if (dreamText.split(/\s+/).length < 5) {
        showError('Please describe your dream in more detail (at least 5 words)');
        return;
    }
    clearError();
    showLoader();

    try {
        const response = await fetch(DREAM_INTERPRET_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(isLoggedIn() ? { "Authorization": `Bearer ${getToken()}` } : {})
            },
            body: JSON.stringify({ dream: dreamText })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || "Failed to interpret dream");
        }

        const apiResult = await response.json();
        clearInterpretations();
        displayInterpretations(formatInterpretations(apiResult));
    } catch (err) {
        showError(err.message || 'An error occurred while interpreting your dream');
    } finally {
        hideLoader();
    }
}

// --- Format and Display Interpretations ---
function formatInterpretations(data) {
    // Assumes backend returns array of { symbol, interpretations: [{ source, icon, color, text, reference }] }
    // If backend returns flat array, adapt as needed
    if (Array.isArray(data) && data.length && data[0].interpretations) {
        return data;
    }
    // fallback: wrap flat list
    return data.map(item => ({
        symbol: item.symbol,
        interpretations: [{
            source: item.source,
            icon: item.icon,
            color: item.color,
            text: item.interpretation,
            reference: item.reference
        }]
    }));
}

function displayInterpretations(data) {
    clearInterpretations();
    showResultsSection();

    if (!data.length) {
        interpretationsContainer.innerHTML = '<div class="no-results fade-in">No interpretations found for your dream.</div>';
        return;
    }

    data.forEach(symbolGroup => {
        symbolGroup.interpretations.forEach(interpretation => {
            const card = document.createElement('div');
            card.className = 'symbol-card fade-in';

            const sourceDiv = document.createElement('div');
            sourceDiv.className = 'interpretation-source';

            const icon = document.createElement('div');
            icon.className = 'source-icon';
            icon.style.background = interpretation.color || '#6a11cb';
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

            if (interpretation.reference) {
                const reference = document.createElement('div');
                reference.className = 'source-reference';
                reference.textContent = interpretation.reference;
                card.appendChild(reference);
            }

            interpretationsContainer.appendChild(card);
        });
    });

    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// --- Dream History Handler ---
async function fetchDreamHistory() {
    if (!isLoggedIn()) return;

    try {
        const response = await fetch(DREAM_HISTORY_ENDPOINT, {
            headers: {
                "Authorization": `Bearer ${getToken()}`
            }
        });
        if (!response.ok) {
            throw new Error("Could not fetch dream history");
        }
        const { dreams } = await response.json();
        // You can add code to display dream history as you wish
        // e.g., renderDreamHistory(dreams);
    } catch (err) {
        // Optionally show a message to the user
        // showError("Problem loading dream history");
    }
}

// --- Auth: Register, Login, Logout ---
async function handleRegister(email, password, name) {
    try {
        const res = await fetch(REGISTER_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, name })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Registration failed");
        saveToken(data.token);
        updateUserStatus();
        // Optionally show success message
    } catch (err) {
        showError(err.message);
    }
}

async function handleLogin(email, password) {
    try {
        const res = await fetch(LOGIN_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Login failed");
        saveToken(data.token);
        updateUserStatus();
    } catch (err) {
        showError(err.message);
    }
}

function handleLogout() {
    clearToken();
    updateUserStatus();
}

// --- UI Auth Integration ---
function updateUserStatus() {
    if (userStatus) {
        userStatus.style.display = isLoggedIn() ? "inline" : "none";
        userStatus.textContent = isLoggedIn() ? "Logged in" : "Not logged in";
    }
    if (loginBtn) loginBtn.style.display = isLoggedIn() ? "none" : "inline";
    if (registerBtn) registerBtn.style.display = isLoggedIn() ? "none" : "inline";
    if (logoutBtn) logoutBtn.style.display = isLoggedIn() ? "inline" : "none";
}

// --- Event Listeners ---
interpretBtn.addEventListener('click', handleInterpretDream);

if (loginBtn) loginBtn.addEventListener('click', () => {
    // Replace with your modal or form logic
    const email = prompt("Email:");
    const password = prompt("Password:");
    handleLogin(email, password);
});
if (registerBtn) registerBtn.addEventListener('click', () => {
    const name = prompt("Name:");
    const email = prompt("Email:");
    const password = prompt("Password:");
    handleRegister(email, password, name);
});
if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

// --- Initialization ---
window.onload = () => {
    dreamInput.focus();
    updateUserStatus();
    if (isLoggedIn()) {
        fetchDreamHistory();
    }
};
