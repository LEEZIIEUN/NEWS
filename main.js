let news = [];
let url;
let menus = document.querySelectorAll(".menus button");
let page = 1;
let totalArticles = 0;
let totalArticle;
menus.forEach(menu=>menu.addEventListener("click",(event)=>getNewsByTopic(event)));

const getNews = async () => {
  try {
    url.searchParams.set('page', page);
    let response = await fetch(url);
    let data = await response.json();
    if (response.status == "200") {
      if (data.totalResults == 0){
        throw new Error("검색된 결과가 존재하지 않습니다.");
      }
      
      news = data.articles;
      totalArticles = Math.ceil(data.totalResults / 10);
      totalArticle = Number(data.totalResults);
      render();
      pagenation();
    } else {
      if (data.code == "parametersMissing") {
        throw new Error("검색어를 입력해주세요.");
      }
      throw new Error(data.message);
    }
  
  } catch(error) {
    errorRender(error.message);
  }
}

const getLatesNews = async ()=>{
  url = new URL(`https://newsapi.org/v2/top-headlines?country=KR&pageSize=10&apiKey=9f64600250b94455827a0e1525602a6a`)
  getNews();
}

const getNewsByTopic = async (event) => {
  let category = event.target.textContent.toLowerCase();
  url = new URL(`https://newsapi.org/v2/top-headlines?country=KR&category=${category}&pageSize=10&apiKey=9f64600250b94455827a0e1525602a6a`)
  getNews();
}

const getNewsByKeyword = async ()=>{
  let keyword = document.getElementById("search-input").value;
  url = new URL(`https://newsapi.org/v2/everything?q=${keyword}&pageSize=10&apiKey=9f64600250b94455827a0e1525602a6a`)
  getNews();
}

const render = () => {
  let newsHTML = '';
  newsHTML = news.map(news=>{
    return `<div class="row news">
    <div class="col-lg-4">
      <img class="news-img-size" src="${news.urlToImage}" alt="배경이미지">
    </div>
    <div class="col-lg-8">
      <h2>${news.title.split(' - ')[0]}</h2>
      <p>${news.description}</p>
      <div>${news.title.split(' - ')[1]} / ${news.publishedAt}</div>
    </div>
  </div>`
  }).join('');
  document.getElementById("news-board").innerHTML = newsHTML;
};

const errorRender = (message) => {
  let errorHTML = `<div class="alert alert-danger text-center" role="alert">${message}
</div>`;

document.getElementById("news-board").innerHTML = errorHTML;
};

const pagenation = () => {
  console.log(totalArticle);
  let pagenationHTML = '';
  let pageGroup = Math.ceil(page/5);
  let last;
  (totalArticle < 41)?last = Math.ceil(totalArticle/10):last = pageGroup* 5;
  console.log(last)
  let first;
  (last < 5)? first = last - (last - 1) : first = last - 4;

  console.log(pageGroup, first, last)

  if (first >= 6) {
    pagenationHTML = `<li class="page-item" onclick="pageClick(1)">
                        <a class="page-link" href='#js-bottom'>&lt;&lt;</a>
                      </li>
                      <li class="page-item" onclick="pageClick(${page - 1})">
                        <a class="page-link" href='#js-bottom'>&lt;</a>
                      </li>`;
  }
  for (let i = first; i <= last; i++) {
    pagenationHTML += `<li class="page-item ${i == page ? "active" : ""}" >
                        <a class="page-link" href='#js-bottom' onclick="pageClick(${i})" >${i}</a>
                       </li>`;
  }

  if (last < totalArticle) {
    pagenationHTML += `<li class="page-item" onclick="pageClick(${page + 1})">
                        <a  class="page-link" href='#js-program-detail-bottom'>&gt;</a>
                       </li>
                       <li class="page-item" onclick="pageClick(${totalArticle})">
                        <a class="page-link" href='#js-bottom'>&gt;&gt;</a>
                       </li>`;
  }
  document.querySelector(".pagination").innerHTML = pagenationHTML;
}

const pageClick = (pageNum) => {
  page = pageNum;
  getNews();
};

let searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", getNewsByKeyword);

getLatesNews();