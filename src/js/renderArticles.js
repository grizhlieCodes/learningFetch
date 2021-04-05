import { convertLongDateToShort } from './dateConversion.js'
import { closeModal } from './closeModal.js'
import {createNewModal} from './createModal.js'


//:Array storing main article data, see below object
let allArticles = [];
fetch(
  "https://demo.ghost.io/ghost/api/v3/content/posts/?key=22444f78447824223cefc48062&include=tags,authors"
)
  .then((fetchToJson) => fetchToJson.json())
  .then((json) => {
    json.posts.forEach(article => {
      allArticles = [...allArticles, {
        title: article.title,
        id: article.id,
        date: article.created_at,
        author: article.authors[0].name
      }]
    })
  })
  .then(() => {
    allArticles.forEach((article) => {
      article.date = convertLongDateToShort(article);
    });
  })
  .then(addArticlesHtmlToSection)
  .then(() => {
    const onclickArray = [...document.querySelectorAll('.article_title')]
    onclickArray.forEach(article => {
      article.addEventListener("click", createAndOpenArticleModal)
    })
  })
  .catch((err) => console.log(err));

let articleSection = document.createElement("section");
function createSectionForHtmlInject() {
  articleSection.classList.add('articles')
  document.body.append(articleSection);
}

createSectionForHtmlInject();

let articleNumIncrementer = 1;

function addArticlesHtmlToSection() {
  allArticles.forEach((article) => {
    const id = article.id;
    const articleElement = document.createElement("article");
    articleSection.append(articleElement);
    articleElement.id = id
    const title = article.title;
    const author = article.author;
    const date = article.date;
    const articleContent = `
        <h2 class="article_title article-no-${articleNumIncrementer}" data-id="${id}">${title}</h2>
        <div class="meta-data-container">
          <p class="author">${author}</p>
          <p class="date">${date}</p> 
        </div>
        `;
    articleElement.innerHTML = articleContent;
    articleNumIncrementer++;
  });
}



function createAndOpenArticleModal(event) {
  const currentModal = [...document.querySelectorAll('.modal')]
  if (currentModal.length && currentModal.length > 0) {
    document.body.removeChild(currentModal[0])
    createNewModal(event)
  } else {
    createNewModal(event)
  }
  setTimeout(() => {
    window.scrollTo(0, 0)
  }, 250)

  window.addEventListener('keyup', closeModal)
}








