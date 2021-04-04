let articleArray = [];


//!Fetch Data & Print article titles onto page
fetch(
  "https://demo.ghost.io/ghost/api/v3/content/posts/?key=22444f78447824223cefc48062&include=tags,authors"
)
  .then((dataToJson) => dataToJson.json())
  .then((dataFromJson) => {
    articleArray = [...articleArray, ...dataFromJson.posts];
  })
  .then(() => {
    articleArray.forEach((article) => {
      article.created_at = convertLongDateToShort(article);
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
  articleArray.forEach((article) => {
    const id = article.id;
    const articleContainer = document.createElement("article");
    articleSection.append(articleContainer);
    articleContainer.id = id
    const title = article.title;
    const author = article.authors[0].name;
    const date = article.created_at;
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

function convertLongDateToShort(object) {
  let date = object.created_at;
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  let day = date.substring(8, 10);
  let month = months[parseInt(date.substring(5, 7), 10) - 1].substring(0, 3);
  let year = date.substring(0, 4);
  return `${day}, ${month}, ${year}`;
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

let fadeIn = []

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

  fadeIn = [backdrop, modal]
}

// function animateModalIn(){
//   setTimeout(() => {
//     fadeIn.forEach(element => {
//       element.classList.add('fade-in')
//     })
//   },250)
// }

// animateModalIn()

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
    console.log(`Removed the element with ${event.key}`)
    removeModalElementsAfterFade();
    return
  }

  if (event.target.classList.contains('backdrop')) {
    console.log(`Removed the element with ${event.target}`)
    removeModalElementsAfterFade();
    return
  }

  if (event.target.classList.contains('close-button')) {
    console.log(`Removed the element with ${event.target}`)
    removeModalElementsAfterFade();
    return
  }
}