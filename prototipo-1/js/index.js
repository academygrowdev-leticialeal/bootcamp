document.addEventListener("DOMContentLoaded", main);

async function main() {
  loadMainContent(1);
  renderFooterData();
}

async function loadMainContent(page) {
  const result = await listCharactersByPage(page);

  const characters = [...result.charactersList];

  for (const character of characters) {
    const lastEpisodeUrl = character.episode[character.episode.length - 1];

    const episodeName = await getEpisodeDataFromURL(lastEpisodeUrl);

    character.episode = {
      url: lastEpisodeUrl,
      name: episodeName,
    };
  }

  renderCharactersList(characters);
  renderPagination(result.prevPage, result.nextPage);
}

function renderCharactersList(characters) {
  const row = document.getElementById("list-characters");
  row.innerHTML = "";

  for (const character of characters) {
    const card = `
            <div class="card mb-3 card-character">
                <div class="row g-0">
                    <div class="col-12 col-md-5">
                        <div class="object-fit-fill border rounded h-100">
                            <img src="${character.image}"
                                class="w-100 h-100 rounded" alt="Foto do Personagem ${
                                  character.name
                                }">
                        </div>
                    </div>
                    <div class="col-12 col-md-7">
                        <div class="card-body fw-bolder">
                            <h5 class="card-title">${character.name}</h5>

                            <p class="card-text">
                                <small>
                                    <i id="circle-status" class="bi bi-circle-fill text-${
                                      mapStatus(character.status).color
                                    }"></i>
                                    <span>${
                                      mapStatus(character.status).text
                                    } - ${mapSpecie(character.species)}</span>
                                </small>
                            </p>


                            <p class="card-text">
                                <small class="text-secondary">Última localização conhecida:</small><br>
                                <small>${character.location.name}</small>
                            </p>

                            <p class="card-text">
                                <small class="text-secondary">Visto a última vez em:</small><br>
                                <small>${character.episode.name}</small>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;

    const col = document.createElement("div");
    col.classList.add("col-12", "col-md-6");

    col.innerHTML = card;
    row.appendChild(col);
  }
}

async function renderFooterData() {
  const totalCharacters = await getTotalByFeature("character");
  const totalLocations = await getTotalByFeature("location");
  const totalEpisodes = await getTotalByFeature("episode");

  const spanTotalCharacters = document.getElementById("total-characters");
  spanTotalCharacters.innerText = totalCharacters;

  const spanTotalLocations = document.getElementById("total-locations");
  spanTotalLocations.innerText = totalLocations;

  const spanTotalEpisodes = document.getElementById("total-episodes");
  spanTotalEpisodes.innerText = totalEpisodes;

  const spanDevName = document.getElementById("dev-name");
  spanDevName.innerText = "Leticia Leal";

  const spanCurrentYear = document.getElementById("current-year");
  spanCurrentYear.innerText = new Date().getFullYear();
}

function renderPagination(prevPage, nextPage) {
  const prevPageNumber = !prevPage ? 0 : prevPage.split("?page=")[1];
  const nextPageNumber = !nextPage ? 0 : nextPage.split("?page=")[1];

  const nav = document.getElementById("pagination");
  nav.innerHTML = "";
  const ul = document.createElement("ul");
  ul.classList.add("pagination", "justify-content-center");

  // BTN Prev
  const liPrevPage = document.createElement("li");
  liPrevPage.classList.add("page-item");

  if (!prevPage) {
    liPrevPage.classList.add("disabled");
  }

  const buttonPrev = document.createElement("button");
  buttonPrev.setAttribute("type", "button");
  buttonPrev.classList.add("page-link");
  buttonPrev.innerText = "Anterior";
  buttonPrev.addEventListener("click", () => loadMainContent(prevPageNumber));

  liPrevPage.appendChild(buttonPrev);

  // BTN Next
  const liNextPage = document.createElement("li");
  liPrevPage.classList.add("page-item");

  if (!nextPage) {
    liNextPage.classList.add("disabled");
  }

  const buttonNext = document.createElement("button");
  buttonNext.setAttribute("type", "button");
  buttonNext.classList.add("page-link");
  buttonNext.innerText = "Próxima";
  buttonNext.addEventListener("click", () => loadMainContent(nextPageNumber));

  liNextPage.appendChild(buttonNext);

  ul.appendChild(liPrevPage);
  ul.appendChild(liNextPage);

  nav.appendChild(ul);
}

function mapStatus(characterStatus) {
  switch (characterStatus) {
    case "Alive":
      return {
        color: "success",
        text: "Vivo",
      };
    case "Dead":
      return {
        color: "danger",
        text: "Morto",
      };
    default:
      return {
        color: "secondary",
        text: "Desconhecida",
      };
  }
}

function mapSpecie(characterSpecie) {
  switch (characterSpecie) {
    case "Human":
      return "Humano";
    case "Alien":
      return "Alien";
    case "Robot":
      return "Robô";
    default:
      return `Outro (${characterSpecie})`;
  }
}
