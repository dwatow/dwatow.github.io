---
title: 好想工作室裡的天瓏書目 (持續更新)
date: 2018-10-07 13:51:23
tags:
- axios
- monent
- "vue-masonry"
- vuejs
categories:
- 技術練習
---

<style>
.book {
  padding: 10px 15px;
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
    /* width: 25%; */
    /* flex: 1 1 25%; */
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
<script src="https://unpkg.com/axios/dist/axios.min.js" charset="utf-8"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.19.1/moment.min.js" charset="utf-8"></script>
<!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/masonry/4.0.0/masonry.pkgd.min.js"></script> -->
<script src="https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.js"></script>
<!-- <script src="https://unpkg.com/vue-masonry@0.11.3/dist/vue-masonry-plugin-window.js"></script> -->
<script src="https://unpkg.com/vue-masonry-css"></script>
<!-- <script src="https://unpkg.com/vue-masonry-css"></script> -->

# 好想工作室裡的天瓏書目 (持續更新)

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
      <input type="text" id="filterByName" v-model="filterName"><br />
      <label for="filterDiscount">至少打幾折</label>
      <input type="number" id="filterByDiscount" max="100" min="0" step="1" v-model.number="filterDiscount"><br />
    </div>
    <div class="latestUpdateDate">最新更新日期: {{updateDate}}</div>
    {{ message }}
    <div class="totalBooks">{{'有' + books.length + '本'}}</div>
    <div >
      <masonry
        :cols="{default: 4, 720: 2}"
        :gutter="0"
      >
        <onebook :data="onebook" v-for="onebook in showBooks" :key="onebook.isbn" @load="layoutMasonry"></onebook>
      </masonry>
    </div>
  </div>
</div>
{% endraw %}

<script type="text/javascript">

const onebook = {
  props: ['data'],
  template: `{% raw %}
    <div class="book">
      <a :href="data.link" target="_blank">
        <div class="name">{{data.name}}</div>
        <img :src="data.image" alt="" @load="$emit('load')">
        <div class="price">
          <div class="isbn">{{data.ISBN}}</div>
          <span class="originPrice" v-show="data.is_sell">{{data.originPrice + '元'}}</span>
          <span v-show="data.is_sell">{{ '(' + discount + '折)' }}</span>
          <div class="sellPrice">{{data.sellPrice + '元'}}</div>
        </div>
      </a>
    </div>
    {% endraw %}`,
  computed: {
    discount() {
      return Math.floor(this.data.discount)
    }
  }
}
//------------------------------------------------------------------------------

var app = new Vue({
  el: '#app',
  components: {
    'onebook': onebook
  },
  data: {
    message: 'Loading...',
    updateDate: null,
    books: [],
    filterName: '',
    filterDiscount: 100,
    totalShowBooks: 10,
  },
  watch: {
    filterName() {
      this.totalShowBooks = 10;
    }
  },
  created () {
    document.addEventListener('scroll', this.debounce(this.infiniteLoading.bind(this), 20, false));

    axios.get('https://bookshelf.goodideas-studio.com/api').then(item => {
      return item.data
    })
    .then(data => {
      this.updateDate = moment(data.updatedAt * 1000).format('YYYY-MM-DD')
      return data.list.filter(book => !!book.image);
    })
    .then(list => list.reverse())
    .then(list => {
      const only_one_list = [...list.reduce((m, book) => {
        m.set(book.image, book)
        return m
      }, new Map()).values()]

      this.books = only_one_list.map(book => {
        console.log("book", book)
        const origin_price = parseInt((book.originPrice || book.sellPrice).split(",").join(""));
        const sell_price = parseInt(book.sellPrice.split(",").join(""));

        book.discount = sell_price / origin_price * 100;
        book.ISBN = book.ISBN.split('?').shift();
        book.is_sell = origin_price > sell_price
        return book;
      })

      this.message = ''; // cancel loading...
    })
  },
  methods: {
    test(...e){
      console.log(...e)
    },
    debounce(func, wait = 20, immediate = true) {
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
    },
    layoutMasonry () {
      console.log("loading")
      if (typeof this.$redrawVueMasonry === 'function') {
        setTimeout(() => {
          console.log("this.$redrawVueMasonry()", this.$redrawVueMasonry)
          this.$redrawVueMasonry("masonry-container");
        }, 20)
      }
    },
    infiniteLoading (e) {
      const currTotal = !this.totalShowBooks || this.totalShowBooks;
      const maxTotal = !this.books || this.books.length;

      const currScroll = document.documentElement.scrollTop;
      const maxScroll = document.documentElement.scrollHeight;
      if (currTotal < maxTotal && Math.abs(maxScroll - currScroll) < 2000) {
        this.totalShowBooks += 10;
      }
    }
  },
  computed: {
    showBooks () {
      return !this.books ? [] : this.books
        .filter(item => item.discount <= this.filterDiscount)
        .filter(item => item.name.toLowerCase().includes(this.filterName.toLowerCase()))
        .slice(0, this.totalShowBooks);
    }
  }
})
</script>
