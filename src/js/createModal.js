import { closeModal } from './closeModal.js'
import { convertLongDateToShort } from './dateConversion.js'

export function createNewModal(event) {
    const articleID = event.target.getAttribute("data-id")
    let loadedArticle;
    fetch('https://demo.ghost.io/ghost/api/v3/content/posts/?key=22444f78447824223cefc48062&include=tags,authors')
      .then(data => data.json())
      .then(json => json.posts)
      .then(array => array.find(a => a.id === articleID))
      .then(object => {
        loadedArticle = {
          title: object.title,
          id: object.id,
          date: object.created_at,
          author: object.authors[0].name,
          content: object.html
        }
      })
      //!Fix the conversion function to take in the correct property name (not date, but created_at) instead.
      .then(() => {
        return loadedArticle.date = convertLongDateToShort(loadedArticle)
      })
      .then(() => {
        const title = loadedArticle.title;
        const author = loadedArticle.author
        const date = loadedArticle.date
        const content = loadedArticle.content
        const headerContent = `
          <h2 class="article_title">${title}</h2>
          <div class="meta-data-container">
            <p class="author">${author}</p>
            <p class="date">${date}</p> 
          </div>
        `
      
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
      
        loadedArticle = {}
      })
      .catch(err => console.log(err))
  }