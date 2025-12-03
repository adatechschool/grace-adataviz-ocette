import "./style.css";

//https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/femmes-illustres-a-paris-portraits/records?limit=20

async function fetchApi() {
  try {
    const response = await fetch(
      "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/femmes-illustres-a-paris-portraits/records?limit=20"
    );
    const data = await response.json();
    console.log(data);
    //return data;

    const div = document.getElementById("app");

    // Conteneur de la barre de recherche
    const searchContainer = document.createElement("div");
    searchContainer.className = "search-container";
    div.appendChild(searchContainer);

    // Création de la barre de recherche
    const searchInput = document.createElement("input");
    searchInput.type = "search";
    searchInput.placeholder = "Rechercher un nom";
    searchInput.id = "searchBar";
    searchInput.ariaLabel = "Rechercher un nom parmi le contenu du site.";
    searchContainer.appendChild(searchInput);

    // Bouton barre de recherche
    const searchBtn = document.createElement("button");
    searchBtn.textContent = "Rechercher";
    searchContainer.appendChild(searchBtn);

    // Ajoute un espace après les points si nécessaire
    function cleanText(str) {
      if (!str) return "";
      return str.replace(/\.([^\s])/g, ". $1").trim();
    }

    for (let i = 0; i < data.results.length; i++) {
      const liste = document.createElement("li");
      // Nettoyage et assemblage du texte supplémentaire
      const extraText = [
        cleanText(data.results[i].desc2),
        cleanText(data.results[i].desc3),
        cleanText(data.results[i].desc4),
      ]
        .filter((t) => t.length > 0) // retire les vides
        .join(" "); // espace entre chaque bloc

      liste.innerHTML = `
      <img class="portrait" src="${data.results[i].thumb_url}" />
      <h2>${data.results[i].name}</h2>
      <p>${data.results[i].desc1}</p>
      `;

      // Si du texte additionnel existe, on l’ajoute
      if (extraText.length > 0) {
        const extraSpan = document.createElement("span");
        extraSpan.className = "more hidden";
        extraSpan.textContent = extraText;

        const paragraph = liste.querySelector("p");
        paragraph.appendChild(extraSpan);

        // Ajouter le bouton "Voir plus"
        const btn = document.createElement("button");
        btn.textContent = "Voir plus";
        liste.appendChild(btn);

        btn.addEventListener("click", () => {
          if (extraSpan.classList.contains("hidden")) {
            extraSpan.classList.remove("hidden");
            btn.textContent = "Voir moins";
          } else {
            extraSpan.classList.add("hidden");
            btn.textContent = "Voir plus";
          }
        });
      }

      div.appendChild(liste);
    }
  } catch (error) {
    console.log(error);
  }
}

fetchApi();
