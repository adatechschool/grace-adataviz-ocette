import "./style.css";

let offset = 0;
const limit = 20;
const div = document.getElementById("app");

/* fonction pour nettoyer les textes */
function cleanText(str) {
  if (!str) return "";
  return str.replace(/\.([^\s])/g, ". $1").trim();
}

/* création du DOM */
function createSearchBar() {
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

  return searchInput;
}

function createListContainer() {
  const listContainer = document.createElement("ul");
  listContainer.id = "list";
  div.appendChild(listContainer);
  return listContainer;
}

function createLoadMoreButton() {
  const loadMoreBtn = document.createElement("button");
  loadMoreBtn.id = "loadMoreBtn";
  loadMoreBtn.textContent = "Charger plus";
  loadMoreBtn.className = "load-more";
  div.appendChild(loadMoreBtn);
  return loadMoreBtn;
}

/* fonction affichage des données */
function createListItem(item) {
  const li = document.createElement("li");

  const desc1 = cleanText(item.desc1);
  const extraText = [
    cleanText(item.desc2),
    cleanText(item.desc3),
    cleanText(item.desc4),
    cleanText(item.desc5),
  ]
    .filter((t) => t)
    .join(" ");

  li.innerHTML = `
    <img class="portrait" src="${item.thumb_url}" />
    <h2>${item.name}</h2>
    <p>${desc1}</p>
  `;

  if (extraText.length > 0) {
    const span = document.createElement("span");
    span.className = "more hidden";
    span.textContent = " " + extraText;
    li.querySelector("p").appendChild(span);

    const btn = document.createElement("button");
    btn.textContent = "Voir plus";
    btn.addEventListener("click", () => {
      const hidden = span.classList.toggle("hidden");
      btn.textContent = hidden ? "Voir plus" : "Voir moins";
    });

    li.appendChild(btn);
  }

  return li;
}

/* fonction fetch API */
async function fetchApi(listContainer, loadMoreBtn) {
  try {
    const response = await fetch(
      `https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/femmes-illustres-a-paris-portraits/records?limit=${limit}&offset=${offset}`
    );
    const data = await response.json();

    data.results.forEach((item) => {
      const li = createListItem(item);
      listContainer.appendChild(li);
    });

    if (!loadMoreBtn && data.results.length === limit) {
      const btn = createLoadMoreButton();
      btn.addEventListener("click", () => {
        offset += limit;
        fetchApi(listContainer, btn);
      });
    }

    if (data.results.length < limit) {
      const btn = document.getElementById("loadMoreBtn");
      if (btn) btn.remove();
    }
  } catch (error) {
    div.innerHTML = "<p>Impossible de charger les données.</p>";
    console.error(error);
  }
}

/* fonction barre de recherche */
function setupSearch(searchInput, listContainer) {
  searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();
    const items = listContainer.querySelectorAll("li");

    items.forEach((item) => {
      const name = item.querySelector("h2").textContent.toLowerCase();
      item.style.display = name.includes(value) ? "block" : "none";
    });
  });
}

/* fonction qui initialise  */
function initialisation() {
  const searchInput = createSearchBar();
  const listContainer = createListContainer();
  setupSearch(searchInput, listContainer);
  fetchApi(listContainer, null);
}

initialisation();
