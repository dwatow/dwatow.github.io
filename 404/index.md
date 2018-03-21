---
title: 你要找的頁面還沒有出現
date: 2017-06-15 13:08:19
permalink: /404.html
---

# 404!!!你要找的頁面還沒有出現

那就看我幾行code吧!!

## 一開始，學了C++。

```c++
#include <iostream>

using namespace std;

int main() {
  cout << "404!!你要找的頁面還沒有出現!!" << endl;
}
```

## 學了物件導向....

```c++
#include <iostream>
#include <string>

using namespace std;

class page {
  string m_Message;
public:
  page(const string& content):m_Message(content) {
  }

  string Content() const {
    return m_Message;
  }
};

int main() {
  page p404("404!!你要找的頁面還沒有出現!!");
  cout << p404.Content() << endl;
}
```

## 學了Design Pattern...

```c++
#include <iostream>
#include <map>
#include <string>

using namespace std;

class Page;
class Page404;

template<typename T> Page* PageConstructorPtr(const string& m_StatusCode)
{ return new T(m_StatusCode); }

//Factory
class Factory {
  typedef Page*(*PageConstructor)(const string&);
  map<string, PageConstructor> m_PagesMap;
public:
  Factory() {
    m_PagesMap["page404"] = &PageConstructorPtr<Page404>;
  }

  Page* CreatePage(const string& StatusCode, const string& Message) {
    PageConstructor pc = m_PagesMap[StatusCode];
    Page* object = pc(Message);
    return object;
  }
};

//objects
class Page {
public:
  virtual string Content() const = 0;
};

class Page404 : public Page {
  const string m_Str;
  string m_Message;
public:
  Page404(const string& Content):m_Str("404!!"), m_Message(Content){}
  string Content() const {
    return m_Str + m_Message;
  }
};

//main program
int main() {
  Factory factory;
  Page * p404 = factory.CreatePage("page404", "你要找的頁面還沒有出現!!");
  cout << p404->Content() << endl;
}
```

## 學前端

學 Javascript

```js
console.log("404!!你要找的頁面還沒有出現!!");
```
