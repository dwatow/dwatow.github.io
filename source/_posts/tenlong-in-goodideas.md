---
title: 好想工作室裡的天瓏書目 (持續更新)
date: 2018-10-07 13:51:23
tags: [axios, monent, masonry, jquery]
categories: 技術練習
---

<script
  src="https://code.jquery.com/jquery-3.3.1.min.js"
  integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
  crossorigin="anonymous"></script>
<script src="https://unpkg.com/axios/dist/axios.min.js" charset="utf-8"></script>
<script src="https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.19.1/moment.min.js" charset="utf-8"></script>

<style>
#masonry {
  transition: .3s;
}
.book {
  vertical-align: top;
  width: 100%;
  box-sizing: border-box;
  padding: 15px 10px;
  border-radius: 10px;
  display: none;
}

.show {
  display: inline-block;
}

.book:hover {
  background-color: #d7e6ff;
}

.book img {
  width: 80%;
  display: block;
  margin: auto;
  height: auto;
}

.book .isbn {
  font-size: 8px;
}

.book .name {
  font-size: 12px;
}

.book .originPrice {
  text-decoration: line-through;
  font-size: 12px;
}

.book .sellPrice {
  font-size: 14px;
}

.book a {
  display: block;
}

@media screen and (min-width: 720px) {
  .book {
    width: 25%;
  }
}
</style>

# 好想工作室裡的天瓏書目 (持續更新)

<div id="books">Loading...</div>

<script type="text/javascript">
function price (book) {
  if (parseInt(book.originPrice) > parseInt(book.sellPrice)) {
    return `<div class="originPrice">${book.originPrice}元 </div>
    <div class="sellPrice">${book.sellPrice}元 (${Math.floor(book.getDiscount())}折) </div>`
  }
  else {
    return `<div class="sellPrice">${book.sellPrice}元 </div>`
  }
}

function list2masonry(list) {
  return list.map(book => {
    // const isActive = (book.isShow) ? 'show' : '';
    return `<div class="book show">
      <a href="${book.link}">
        <div class="isbn">${book.ISBN}</div>
        <img src="${book.image}" alt="">
        <div class="name">${book.name}</div>
      </a>
        ${price(book)}
    </div>`;
  }).join("");
}

let $grid;

function initMasonry () {
  $grid = $('#masonry').masonry({
    itemSelector: '.book',
    columnWidth: '.book',
    // gutter: 10,
    percentPosition: true
  });
  setTimeout(() => {
    $grid.masonry('layout');
  }, 1500);
}

let books = [];

window.addEventListener('load', e => {
  axios.get('https://bookshelf.goodideas-studio.com/api').then(item => item.data)
  .then(data => {
    document.querySelector('#books').innerHTML = `<span class="latestUpdateDate">最新更新日期${moment(data.updatedAt).format('YYYY-MM-DD')}</span><div id="masonry"></div>`;
    return data.list;
  })
  .then(list => {
    return list.map(book => {
      // book.isShow = true;
      book.discount = parseInt(book.sellPrice) / parseInt(book.originPrice) * 100;
      book.getDiscount = function () {
        if (this.discount.toString().split('').pop() == "0")
          return this.discount / 10;
        else
          return this.discount;
      }
      return book;
    })
  })
  .then(list => {
    books = list;
    render(books);
    initMasonry ();
  });
})

function render (books) {
  document.querySelector('#masonry').innerHTML = `${list2masonry(books)}`;
}

</script>
