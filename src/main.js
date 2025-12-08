import "./style.css";

//https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/femmes-illustres-a-paris-portraits/records?limit=20

// Fonction principale
async function fetchApi() {
  try {
    const response = await fetch(
      "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/femmes-illustres-a-paris-portraits/records?limit=20"
    );
    const data = await response.json();
    console.log(data);
    //return data;

    const div = document.getElementById("app");

    /* ------------------------------
            Barre de recherche
    ------------------------------ */
    const searchContainer = document.createElement("div");
    searchContainer.className = "search-container";

    const wrapper = document.createElement("div");
    wrapper.className = "search-wrapper";

    const icon = document.createElement("span");
    icon.className = "icon";
    icon.textContent = "🔍";

    const searchInput = document.createElement("input");
    searchInput.type = "search";
    searchInput.placeholder = "Rechercher un nom";
    searchInput.id = "searchBar";

    wrapper.appendChild(icon);
    wrapper.appendChild(searchInput);
    searchContainer.appendChild(wrapper);
    div.appendChild(searchContainer);

    // Ajoute un espace après les points si nécessaire
    function cleanText(str) {
      if (!str) return "";
      return str.replace(/\.([^\s])/g, ". $1").trim();
    }

    /* ------------------------------
              Liste de cards
    ------------------------------ */

    const listContainer = document.createElement("ul");
    div.appendChild(listContainer);

    /* Bouton "charger plus" */
    const loadMoreBtn = document.createElement("button");
    loadMoreBtn.textContent = "Charger plus";
    loadMoreBtn.className = "load-more";
    div.appendChild(loadMoreBtn);

    data.results.forEach((item) => {
      const desc1 = cleanText(item.desc1);
      const extraText = [
        cleanText(item.desc2),
        cleanText(item.desc3),
        cleanText(item.desc4),
        cleanText(item.desc5),
      ]
        .filter((t) => t)
        .join(" ");

      const li = document.createElement("li");

      li.innerHTML = `
        <img class="portrait" src="${item.thumb_url}" />
        <h2>${item.name}</h2>
        <p>${desc1}</p>
        `;

      if (extraText.length > 0) {
        const extraSpan = document.createElement("span");
        extraSpan.className = "more hidden";
        extraSpan.textContent = " " + extraText;

        li.querySelector("p").appendChild(extraSpan);

        const btn = document.createElement("button");
        btn.textContent = "Voir plus";

        btn.addEventListener("click", () => {
          const hidden = extraSpan.classList.toggle("hidden");
          btn.textContent = hidden ? "Voir plus" : "Voir moins";
        });
        li.appendChild(btn);
      }
      listContainer.appendChild(li);
    });

    searchInput.addEventListener("input", () => {
      const searchValue = searchInput.value.toLowerCase();
      const items = listContainer.querySelectorAll("li");

      items.forEach((item) => {
        const name = item.querySelector("h2").textContent.toLowerCase();
        item.style.display = name.includes(searchValue) ? "block" : "none";
      });
    });
  } catch (error) {
    console.log(error);
  }
}

fetchApi();
