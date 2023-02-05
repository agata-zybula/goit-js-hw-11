import Notiflix from 'notiflix';
import axios from 'axios';
import '../css/styles.css';
import simpleLightbox from 'simplelightbox';

const input = document.querySelector('[name="searchQuery"]');
const gallery = document.querySelector('.gallery');
const searchButton = document.querySelector('button[type="submit"]');
const buttonLoadMore = document.querySelector('.load-more');

const dataFromApi = {
  key: '33342692-93cb2143ae3f15ce293414fc6', // twój unikalny klucz dostępu do API - dostepny po zarejestrowaniu sie
  image_type: 'photo', // typ obrazka.Chcemy tylko zdjęć, dlatego określ wartość photo.
  orientation: 'horizontal', // orientacja zdjęcia. Określ wartość horizontal.
  safesearch: 'true', // weryfikacja wieku. Określ wartość true.
  lang: 'en', // en jako wartosc default, nie trzeba pisac. jezyk wyszukiwania
  per_page: 40 // Determine the number of results per page. Accepted values: 3 - 200 Default: 20
};

const { key, image_type, orientation, safesearch, lang, per_page } =
  dataFromApi;

let currentPage = 1;

async function fetchImages(name, currentPage) {
  const urlApi = `https://pixabay.com/api/?key=${key}&q=${name}&image_type=${image_type}&orientation=${orientation}&safe_search=${safesearch}&lang=${lang}&per_page=${per_page}&page=${currentPage}`;
  try {
    const response = await axios.get(urlApi);
    console.log(response);
      const images = response.data.hits;
    console.log(images);
    gallery.innerHTML = '';
    buttonLoadMore.classList.add('hidden');
    function showImages() {
      gallery.insertAdjacentHTML(
        'beforeend',
        images
          .map(
            el => `<div class="photo-card">
         <img src="${el.webformatURL} alt="${el.tags}" loading="lazy"/> 
         <div class="info">
         <p class="info-item">
         <b>Likes: ${el.likes}</b></p>
         <p class="info-item">
         <b>Views: ${el.views}</b></p>
         <p class="info-item">
         <b>Comments: ${el.comments}</b></p>
        <p class="info-item">
         <b>Downloads: ${el.downloads}</b></p></div></div>`
          )
              .join('')
        );

          Notiflix.Notify.info(`Hooray! We found ${response.data.totalHits} images.`);
    }

    if (images.length === 0 || input.value === '') {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    showImages();
      buttonLoadMore.classList.remove('hidden');
      buttonLoadMore.classList.add('button-on-load');
      if (images.length > 500) {
          buttonLoadMore.classList.add('hidden');
          buttonLoadMore.classList.remove('button-on-load');
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
        );
      return;
    }
  } catch (error) {
    console.error(error);
  }
}

searchButton.addEventListener('click', e => {
  e.preventDefault();
  currentPage = 1;
  fetchImages(input.value.trim(), currentPage);
});

buttonLoadMore.addEventListener('click', e => {
  currentPage += 1;
  fetchImages(input.value.trim(), currentPage);
});
