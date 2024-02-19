function syncInputs(hexId, colorId) {
  const hexInput = document.getElementById(hexId);
  const colorInput = document.getElementById(colorId);

  hexInput.addEventListener("input", () => {
    if (/^#[0-9A-F]{6}$/i.test(hexInput.value)) {
      colorInput.value = hexInput.value;
    }
  });

  colorInput.addEventListener("input", () => {
    hexInput.value = colorInput.value;
  });
}

function init() {
  for (let i = 1; i <= 6; i++) {
    syncInputs(`hex${i}`, `color${i}`);
  }

  document
    .getElementById("test-palette")
    .addEventListener("click", performAnalysis);

  function performAnalysis() {
    let colors = [];
    for (let i = 1; i <= 6; i++) {
      const colorValue = document.getElementById(`hex${i}`).value;
      if (colorValue && colorValue.length > 0) {
        colors.push(colorValue);
      }
    }
    let permutations = getPermutations(colors);
    displayResults(permutations);
  }

  function getPermutations(colors) {
    let results = [];
    for (let i = 0; i < colors.length; i++) {
      for (let j = 0; j < colors.length; j++) {
        if (i !== j) {
          let contrastRatio = calculateContrast(colors[i], colors[j]);
          results.push({
            pair: [colors[i], colors[j]],
            contrast: contrastRatio,
          });
        }
      }
    }

    return results;
  }

  function calculateContrast(color1, color2) {
    const color1Object = new Color(color1);
    const color2Object = new Color(color2);
    const contrast = color1Object.contrastWCAG21(color2Object);

    return contrast;
  }

  function displayResults(permutations) {
    let resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = ""; // Clear previous results

    permutations.forEach((permutation) => {
      let exampleDiv = document.createElement("div");
      exampleDiv.style.backgroundColor = permutation.pair[0];
      exampleDiv.style.color = permutation.pair[1];
      exampleDiv.style.padding = "10px";
      exampleDiv.style.margin = "10px 0";
      exampleDiv.style.border = "1px solid #000";
      exampleDiv.style.display = "flex";
      exampleDiv.style.alignItems = "center";
      exampleDiv.style.justifyContent = "space-between";

      let textSpan = document.createElement("span");
      textSpan.textContent = `Example Text`;

      let contrastBox = document.createElement("div");
      contrastBox.textContent = `Contrast: ${permutation.contrast.toFixed(2)}`;
      contrastBox.style.padding = "5px 10px";
      contrastBox.style.borderRadius = "5px";
      // Set box color based on contrast value
      if (permutation.contrast >= 4.5) {
        contrastBox.style.backgroundColor = "green";
      } else {
        contrastBox.style.backgroundColor = "red";
      }
      contrastBox.style.color = "white";

      exampleDiv.appendChild(textSpan);
      exampleDiv.appendChild(contrastBox);
      resultsDiv.appendChild(exampleDiv);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  init();
});
