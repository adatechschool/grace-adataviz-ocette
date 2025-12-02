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
    for (let i = 0; i < data.results.length; i++) {
      const liste = document.createElement("li");
      liste.innerHTML = `
      <img src="${data.results[i].thumb_url}" />
      <h2>${data.results[i].name}</h2> <p>${data.results[i].desc1} ${data.results[i].desc2}</p>`;
      div.appendChild(liste);
    }
  } catch (error) {
    console.log(error);
  }
}

fetchApi();
