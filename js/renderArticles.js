import {convertLongDateToShort} from './dateConversion.js'

let articleSnapshotArray = [];

//!Fetch Data & Print article titles onto page
fetch(
  "https://demo.ghost.io/ghost/api/v3/content/posts/?key=22444f78447824223cefc48062&include=tags,authors"
)
  .then((dataToJson) => dataToJson.json())
  .then((dataFromJson) => {
    dataFromJson.posts.forEach(article => {
      articleSnapshotArray = [...articleSnapshotArray,{
        title: article.title,
        id: article.id,
        date: article.created_at,
        author: article.authors[0].name
      }]
    })
  })
  .then(() => {
    articleSnapshotArray.forEach((article) => {
      article.date = convertLongDateToShort(article);
    });
  })
  .then(injectArticleHtmlIntoSection)
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

function injectArticleHtmlIntoSection() {
  articleSnapshotArray.forEach((article) => {
    const id = article.id;
    const articleContainer = document.createElement("article");
    articleSection.append(articleContainer);
    articleContainer.id = id
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
    articleContainer.innerHTML = articleContent;
    articleNumIncrementer++;
  });
}



function createAndOpenArticleModal(event) {
  const allModals = [...document.querySelectorAll('.modal')]
  if (allModals.length > 0) {
    document.body.removeChild(allModals[0])
    createNewModal(event)
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 250)
  } else {
    createNewModal(event)
  }
  window.addEventListener('keyup', closeModal)
}

function createNewModal(event) {
  const articleID = event.target.getAttribute("data-id")
  const article = articleArray.find(a => a.id === articleID)
  const title = article.title;
  const author = article.authors[0].name;
  const date = article.created_at;
  const headerContent = `
    <h2 class="article_title">${title}</h2>
    <div class="meta-data-container">
      <p class="author">${author}</p>
      <p class="date">${date}</p> 
    </div>
  `
  const content = article.html

  const modal = document.createElement('div')
  modal.classList.add('modal', 'removeElement')

  const articleContent = document.createElement('div')
  modal.append(articleContent)
  articleContent.innerHTML = headerContent + content

  const closeButton = document.createElement('span')
  closeButton.textContent = 'X'
  closeButton.classList.add('close-button')
  closeButton.addEventListener('click', closeModal)
  modal.append(closeButton)

  const backdrop = document.createElement('backdrop')
  document.body.append(backdrop)
  backdrop.classList.add('backdrop', 'removeElement')
  backdrop.addEventListener('click', closeModal)

  document.body.append(modal)
}

function removeModalElementsAfterFade() {
  const removables = [...document.querySelectorAll('.removeElement')]
  const removeElsPromise = new Promise((resolve, reject) => {
    removables.forEach(removable => {
      removable.classList.add('fade-out')
    })
  })
  removeElsPromise
    .then(setTimeout(() => {
      removables.forEach(removable => {
        document.body.removeChild(removable)
      })
    }, 1000))
    .catch(err => console.log(err))
}

function closeModal(event) {
  if (event.key && event.key === 'Escape') {
    removeModalElementsAfterFade();
    return
  }
  if (event.target.classList.contains('backdrop')) {
    removeModalElementsAfterFade();
    return
  }
  if (event.target.classList.contains('close-button')) {
    removeModalElementsAfterFade();
    return
  }
}