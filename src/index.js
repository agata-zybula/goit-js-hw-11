import Notiflix from 'notiflix';
import axios from 'axios';
import '../css/styles.css';
import simpleLightbox from 'simplelightbox';

const input = document.querySelector('[name="searchQuery"]');
const form = document.querySelector(".search-form");
const gallery = document.querySelector(".gallery");
const searchButton = document.querySelector('button[type="submit"]');
const buttonLoadMore = document.querySelector(".load-more");

const dataFromApi = {
  key: '33342692-93cb2143ae3f15ce293414fc6', // twój unikalny klucz dostępu do API - dostepny po zarejestrowaniu sie
  image_type: 'photo', // typ obrazka.Chcemy tylko zdjęć, dlatego określ wartość photo.
  orientation: 'horizontal', // orientacja zdjęcia. Określ wartość horizontal.
  safesearch: 'true', // weryfikacja wieku. Określ wartość true.
  lang: 'en', // en jako wartosc default, nie trzeba pisac. jezyk wyszukiwania
  per_page: 20 // Determine the number of results per page. Accepted values: 3 - 200 Default: 20
};

const { key, image_type, orientation, safesearch, lang, per_page } = dataFromApi;

async function fetchImages(name, page) {
    const urlApi = `https://pixabay.com/api/?key=${key}&q=${name}&image_type=${image_type}&orientation=${orientation}&safe_search=${safesearch}&lang=${lang}&per_page=${per_page}&page=${page}`;
    try {
        const response = await axios.get(urlApi);
        console.log(response);
        const images = response.data.hits;
        console.log(images);

        gallery.innerHTML = '';
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
            )
        };
        showImages();

         if (images.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    } catch (error) {
        console.error(error);
    }
}


form.addEventListener('submit', (e) => {
    let page = 1;
   fetchImages(input.value.trim(), page);
});

searchButton.addEventListener('click', fetchImages);

buttonLoadMore.addEventListener('click', (e) => {
    let page += 1;
    fetchImages(input.value.trim(), page);
});


//   gallery.insertAdjacentHTML('beforeend', resp.data.hits.map(
//             el =>
//               `<div class="photo-card"><li><img class="img-style" src="${el.webformatURL} alt="${el.tags}" loading="lazy" /><div class="info"><p class="info-item">
//       <b>Likes: </b>${el.likes}
//     </p><p class="info-item">
//       <b>Views: </b>${el.views}
//     </p> <p class="info-item">
//       <b>Comments: </b>${el.comments}
//     </p><p class="info-item">
//       <b>Downloads: </b>${el.downloads}
//     </p></div></div>`
//           ))
//           .join('')