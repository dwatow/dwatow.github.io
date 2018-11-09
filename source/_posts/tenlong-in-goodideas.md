---
title: 好想工作室裡的天瓏書目 (持續更新)
date: 2018-10-07 13:51:23
tags: [axios, monent, "vue-masonry", vuejs]
categories: 技術練習
---

# 好想工作室裡的天瓏書目 (持續更新)

<script src="https://unpkg.com/axios/dist/axios.min.js" charset="utf-8"></script>
<script src="https://unpkg.com/vue-masonry@0.11.3/dist/vue-masonry-plugin-window.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.19.1/moment.min.js" charset="utf-8"></script>
<script src="https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.js"></script>

<style>
#masonry-container {
  transition: .3s;
}
.book {
  vertical-align: top;
  width: 100%;
  box-sizing: border-box;
  padding: 20px 10px;
  border-radius: 10px;
  display: inline-block;
  position: absolute;
  top: 100%;
}

.book:hover {
  background-color: #d7e6ff;
}

.book img {
  width: 40%;
  height: auto;
}

.book .price, .book img {
  display: inline-block;
  vertical-align: bottom;
}

.book .isbn {
  font-size: 8px;
}

.book .name {
  font-size: 14px;
}

.book .originPrice {
  text-decoration: line-through;
  font-size: 12px;
}

.book .sellPrice {
  font-size: 20px;
  padding-bottom: 10px;
}

.book a {
  display: block;
}

.totalBooks {
  position: absolute;
  right: 0;
  bottom: 100%;
}

input {
  outline: none;
  border: solid 1px #C0C0C0;
  border-radius: 5px;
  padding: 2px 3px;
}

input:invalid {
  color: red;
}

@media screen and (min-width: 720px) {
  .book {
    width: 25%;
  }

  .book img {
    width: 80%;
    height: auto;
    display: block;
    margin: auto;
  }

  .book .price {
    display: block;
  }
}
</style>

- [書單 API](https://bookshelf.goodideas-studio.com/api)
- [許願表單](https://goo.gl/forms/9A7LYHhkJiQ6JnN33)
- [現有許願書單](https://goo.gl/7PqNcD)
- [天瓏書局](https://www.tenlong.com.tw/)

## 找找你要的書

{% raw %}

<div id="app">
  <div id="books">
    <div>
      <label for="filterName"><b>書名</b></label>
      <input type="text" id="filterByName" v-model="myName"><br />
      <label for="filterDiscount">至少打幾折</label>
      <input type="number" id="filterByDiscount" step="1" v-model.number="myDiscount"><br />
    </div>
    <span class="latestUpdateDate">最新更新日期: {{updateDate}}</span>
    {{ message }}
    <div v-masonry transition-duration=".3s" item-selector=".book" column-width=".book" class="masonry-container">
      <books :total-pre-page="show" :abooks="books | byName(filterName) | byDiscount(filterDiscount)"></books>
    </div>
  </div>
</div>
{% endraw %}

<script type="text/javascript">

function debounce(func, wait = 20, immediate = true) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

document.addEventListener('scroll', debounce(infiniteLoading, 20, false));

function infiniteLoading (e) {
  const currTotal = !app.$data.show || app.$data.show;
  const maxTotal = !app.$data.books || app.$data.books.length;

  const currScroll = document.documentElement.scrollTop;
  const maxScroll = document.documentElement.scrollHeight;
  if (currTotal < maxTotal && Math.abs(maxScroll - currScroll) < 2000) {
    app.$data.show += 10;
  }
}

var VueMasonryPlugin = window["vue-masonry-plugin"].VueMasonryPlugin
Vue.use(VueMasonryPlugin)


Vue.component('books', {
  props: ['abooks', 'total-pre-page'],
  template: `<div>
  {% raw %}
    <span class="totalBooks">{{'有' + totalBooks + '本'}}</span>
    <div v-for="abook in showBooks" :key="abook.isbn" class="book">
      <a :href="abook.link" target="_blank">
        <div class="name">{{abook.name}}</div>
        <img :src="abook.image" alt="" @load="layoutMasonry()">
        <div class="price">
          <div class="isbn">{{abook.ISBN}}</div>
          <span class="originPrice" v-show="isSell(abook)">{{abook.originPrice + '元'}}</span>
          <span v-show="isSell(abook)">{{ '(' + getDiscount(abook) + '折)' }}</span>
          <div class="sellPrice">{{abook.sellPrice + '元'}}</div>
        </div>
      </a>
    </div>
    {% endraw %}
  </div>`,
  methods: {
    getDiscount (currbook) {
      let discount = currbook.discount;
      if (currbook.discount.toString().split('').pop() == "0")
        discount /= 10;

      return Math.floor(discount)
    },
    isSell (currbook) {
      return parseInt(currbook.originPrice) > parseInt(currbook.sellPrice)
    },
    layoutMasonry () {
      if (typeof this.$redrawVueMasonry === 'function') {
        this.$redrawVueMasonry()
      }
    }
  },
  computed: {
    showBooks () {
      return !this.abooks ? [] : this.abooks.slice(0, this.totalPrePage)
    },
    totalBooks () {
      return !this.abooks ? 0 : this.abooks.length
    }
  }
})
//------------------------------------------------------------------------------
var app = new Vue({
  el: '#app',
  data: {
    message: 'Loading...',
    updateDate: null,
    books: null,
    filterName: null,
    filterDiscount: null,
    show: 10
  },
  created () {
    axios.get('https://bookshelf.goodideas-studio.com/api').then(item => item.data)
    .then(data => {
      this.updateDate = moment(data.updatedAt*1000).format('YYYY-MM-DD')
      return data.list;
    })
    .then(list => list.reverse())
    .then(list => {
      const m = new Map();
      list.forEach(book => {
        m.set(book.ISBN, book)
      })
      const listOnlyOne = []
      for (let [ key, val ] of m.entries())
        listOnlyOne.push(m.get(key))

      this.books = listOnlyOne.map(book => {
        book.discount = parseInt(book.sellPrice) / parseInt(book.originPrice || book.sellPrice) * 100;
        return book;
      })
      this.message = '';
    })
  },
  computed: {
    myName: {
      get: function () {
        return this.filterName;
      },
      set: function (name) {
        this.show = 10;
        this.filterName = name;
      }
    },
    myDiscount: {
      get: function() {
        if (this.filterDiscount >= 100) {
          this.filterDiscount = 100;
          return 100;
        }
        else if (this.filterDiscount < 0) {
          this.filterDiscount = 1;
          return discount * -1;
        }
        else {
          return this.filterDiscount;
        }
      },
      set: function(discount) {
        this.show = 10;
        if (typeof discount !== 'number')
          this.filterDiscount = 1;
        else
          this.filterDiscount = discount;
      }
    }
  },
  filters: {
    byName (books, name) {
      if (!!books && !!name )
        return books.filter(item => item.name.toLowerCase().includes(name.toLowerCase()));
      else
        return books;
    },
    byDiscount (books, discount) {
      if (!!books && !!discount )
        return books.filter(item => {
          const currDiscount = item.discount < 10 ? item.discount*10 : item.discount;
          const filterDiscount = discount < 10 ? discount*10 : discount;
          return parseInt(currDiscount) <= filterDiscount;
        })
      else
        return books
    }
  }
})
</script>
