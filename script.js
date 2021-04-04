let articleArray = [];

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
  .then(articlesHtml)
  .catch((err) => console.log(err));

let articles = document.createElement("section");
articles.classList.add('articles')
document.body.append(articles);
let articleNumber = 1;

function articlesHtml() {
  articleArray.forEach((article) => {
    console.log(article.title);
    const articleContainer = document.createElement("article");
    articles.append(articleContainer);
    const title = article.title;
    const author = article.authors[0].name;
    const date = article.created_at;
    const articleContent = `
        <h2 class="article_title article-no-${articleNumber}">${title}</h2>
        <div class="meta-data-container">
          <p class="author">${author}</p>
          <p class="date">${date}</p> 
        </div>
        `;

    articleContainer.innerHTML = articleContent;

    articleNumber++;
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
