export const productService = {
  search,
};

const fetchUrl = 'https://edamam-food-and-grocery-database.p.rapidapi.com/parser';

function search(query) {
  const requestOptions = {
    method: 'GET',
    headers: {
      "x-rapidapi-host": "edamam-food-and-grocery-database.p.rapidapi.com",
      "x-rapidapi-key": "089bcd87famshe0a9f2e5e5f81adp1e2aadjsnbe6cb46b7c88"
    },
  };

  return fetch(fetchUrl + `?ingr=${query}`, requestOptions)
    .then(response => {
      return response;
    })
    .catch(err => {
      return err;
    })
}
