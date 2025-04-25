const api = axios.create({
  baseURL: "https://rickandmortyapi.com/api",
});

// Buscar total de uma funcionalidade
async function getTotalByFeature(feature) {
  try {
    const result = await api.get(`/${feature}`);

    return result.data.info.count;
  } catch (error) {
    console.log(error);
  }
}

// Listagem dos personagens de acordo com a página selecionada
async function listCharactersByPage(page = 1) {
  try {
    const result = await api.get("/character", {
      params: { page },
    });

    return {
      nextPage: result.data.info.next,
      prevPage: result.data.info.prev,
      charactersList: result.data.results,
    };
  } catch (error) {
    console.log(error);
  }
}

// Buscar o nome de um episódio de acordo com a URL fornecida
async function getEpisodeDataFromURL(url) {
  try {
    const result = await api.get(url);

    return result.data.name;
  } catch (error) {
    console.log(error);
  }
}
