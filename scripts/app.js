const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const spinner = document.getElementById("spinner");
const productDetailsContainer = document.getElementById(
  "product-details-container"
);

const showSpinner = (value) => {
  spinner.setAttribute("style", `display: ${value ? "block" : "none"}`);
};

searchBtn.addEventListener("click", (e) => {
  displayPhones(searchInput.value);
});

async function displayPhones(phoneName) {
  const productsDisplay = document.getElementById("products-display");
  productDetailsContainer.textContent = "";
  productsDisplay.textContent = "";

  let phones = [];

  try {
    showSpinner(true);
    phones = await loadPhones(phoneName);
  } catch (error) {
    console.log(error);
  } finally {
    showSpinner(false);
  }

  if (phones.length <= 0) {
    productDetailsContainer.innerHTML = `<h2 class="text-danger text-center">No phone found</h2>`;
    return;
  }

  phones.forEach((phone) => {
    productsDisplay.insertAdjacentHTML(
      "beforeend",

      `<!-- Single Product -->
    <div class="col">
      <div class="card">
        <img src="${phone.image}" class="card-img-top w-50 mx-auto" alt="..." />
        <div class="card-body">
          <h5 class="card-title">${phone.phone_name}</h5>
          <h6 class="card-title">${phone.brand}</h6>
          
          <a href="#" onclick="displayProductDetails('${phone.slug}')" class="btn btn-primary">View details</a>
        </div>
      </div>
    </div>`
    );
  });
}

async function displayProductDetails(id) {
  productDetailsContainer.textContent = "";

  let phone = {};
  try {
    showSpinner(true);
    phone = await loadSinglePhone(id);
  } catch (error) {
    console.log(error);
  } finally {
    showSpinner(false);
  }

  productDetailsContainer.innerHTML = `
    <!-- Single Product -->
      <div class="text-center shadow shadow-lg rounded-3 py-4">
        <h2 class="text-success">Phone Details</h2>
        <img id="details-img" src="${phone.image}" class="w-75" alt="..." />
        <div class="card-body">
          <h3 class="card-title">${phone.name}</h3>
          <h6 class="card-title">${phone.brand}</h6>
          <h6 class="card-title">Release Date: ${
            phone.releaseDate ? phone.releaseDate : "Not found"
          }</h6>

          ${displayMainFeatures(phone.mainFeatures)}

        </div>
      </div>`;
}

// utility functions
function displayMainFeatures(features) {
  let string = "";
  for (const [key, value] of Object.entries(features)) {
    string += `<h6 class="card-title">${key}: ${value}</h6>`;
  }

  return string;
}

async function loadPhones(phoneName) {
  let phones = [];

  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/phones?search=${phoneName}`
    );
    const { data } = await res.json();
    phones = data;
  } catch (error) {
    console.log(error);
  } finally {
    return phones;
  }
}

async function loadSinglePhone(id) {
  let phone = {};

  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/phone/${id}`
    );
    const { data } = await res.json();
    phone = data;
  } catch (error) {
    console.log(error);
  } finally {
    return phone;
  }
}
