// ... your DOM setup code ...

async function handleInterpretDream() {
  const dreamText = dreamInput.value.trim();

  if (!dreamText) {
    errorMessage.textContent = "Please describe your dream first";
    errorMessage.style.display = "block";
    return;
  }
  if (dreamText.split(/\s+/).length < 5) {
    errorMessage.textContent = "Please describe your dream in more detail (at least 5 words)";
    errorMessage.style.display = "block";
    return;
  }

  errorMessage.style.display = "none";
  loader.style.display = "block";
  btnText.textContent = "Analyzing Dream...";
  interpretationsContainer.innerHTML = "";
  resultsSection.style.display = "none";

  try {
    const response = await fetch("http://localhost:3001/api/interpret", { // change to your backend URL in production!
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dream: dreamText })
    });

    if (!response.ok) throw new Error("API error");
    const result = await response.json();

    // Handle both array and structured responses
    if (Array.isArray(result.interpretations)) {
      // Flat interpretations array (from external API)
      interpretationsContainer.innerHTML = "";
      result.interpretations.forEach((entry, index) => {
        // ... Use your existing card rendering logic ...
      });
      resultsSection.style.display = "block";
    } else {
      // Structured response (from local logic)
      displayInterpretations(result);
    }
  } catch (err) {
    errorMessage.textContent = "An error occurred while interpreting your dream";
    errorMessage.style.display = "block";
  } finally {
    loader.style.display = "none";
    btnText.innerHTML = '<i class="fas fa-crystal-ball"></i> Interpret Dream';
  }
}

// ... rest of your JS and event listeners ...
