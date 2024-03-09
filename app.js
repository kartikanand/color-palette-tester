function syncInputs(hexInput, colorInput) {
  hexInput.addEventListener("input", () => {
    if (/^#[0-9A-F]{6}$/i.test(hexInput.value)) {
      colorInput.value = hexInput.value;
    }
  });

  colorInput.addEventListener("input", () => {
    hexInput.value = colorInput.value;
  });
}

function createColorInput(parent) {
  // Create the div element
  const paletteColorDiv = document.createElement("div");
  paletteColorDiv.className = "palette-color";

  // Set the innerHTML of the div to include the inputs and button
  paletteColorDiv.innerHTML = `
    <input type="text" class="js-hex" placeholder="#000000" />
    <input type="color" class="js-color" />
    <button type="button" class="js-remove-palette-color">X</button>
  `;

  // Find the button within the newly created div and add click event listener
  const button = paletteColorDiv.querySelector(".js-remove-palette-color");
  button.onclick = function () {
    paletteColorDiv.remove();
  };

  const hexInput = paletteColorDiv.querySelector(".js-hex");
  const colorInput = paletteColorDiv.querySelector(".js-color");
  syncInputs(hexInput, colorInput);

  // Append the div to the specified parent element
  parent.appendChild(paletteColorDiv);
}

function init() {
  const paletteContainer = document.querySelector(".palette-container");
  for (let i = 1; i <= 5; i++) {
    createColorInput(paletteContainer);
  }

  document
    .getElementById("test-palette")
    .addEventListener("click", performAnalysis);

  document.getElementById("add-palette").addEventListener("click", () => {
    createColorInput(paletteContainer);
  });

  function performAnalysis() {
    const colors = [];
    const hexInputs = document.querySelectorAll(".js-hex");

    for (const hexInput of hexInputs) {
      const colorValue = hexInput.value;
      if (colorValue && colorValue.length > 0) {
        colors.push(colorValue);
      }
    }

    const permutations = getPermutations(colors);
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
