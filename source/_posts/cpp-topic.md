---
title: cpp-topic
date: 2023-10-12 16:36:19
tags:
- cpp
categories:
- 讀技術書
---

# C++ 的面試題

原由，由於之前服務的公司，要我出 C++ 考題，又覺得我沒有資格參加面試新人的環節。
所以我就出了我當時覺得一定可以找到很厲害的人的題目。

所以面試者寫完題目都會拿給我看，依我的印象，面試者最多都寫不到三題，而且沒有一個人寫對。
最近在整理 mail 剛好看到，就拿出來笑一下，反正已經是五六年前的事了......

多年之後，才明白面試題目不可以出這些，太難了。
對於這段時間沒有通過面試的 C++ 工程師們，只能說...~~，算你們好運~~。

## 題目

### 1. `++i` 和 `i++` 哪個快？

有寫過覆寫運算子或有研究到組合語言[^++]的開發者會這樣回答。

> `++i` 快！因為覆寫運算子時，程式會這樣寫
> 
> `++i`:  //加完i，回傳i
> 
> ```cpp
> i = i + 1;
> return i;
> ```
> 
> `i++`:  //回傳i，再加i
> 
> ```cpp
> int j = i
> i = i+1;
> return j;
> ```
> 因為回傳必定在程式語言的最後一步，所以要先暫存加完的結果。

[^++]: [c/c++ 語言的 前++ 與 後++](https://descent-incoming.blogspot.com/2015/07/cc.html)

另外還有另一個也算是正解 [^++2]

> `i++` 和 `++i` 速度是一樣的
> 被編譯成 Machine code 後，組語的指令數相同，對應的 op code 也相同，因此速度一樣。

[^++2]: [淺談「++i」與「i++」](https://rickbsr.medium.com/%E6%B7%BA%E8%AB%87-i-%E8%88%87-i-57621c3f5abd)

兩者答案都可以

### 2. 這列程式有什麼錯誤？

```cpp
#include <map>
#include <string>
#include <list>
 
void DoSomething()
{
  std::map<std::string, std::list<std::string>>  filter;   //  <-- 這一列
}
```

如果有注意過 `cout` 運算子的人，並且對其運算子進行覆寫，應該就會有印象 `>>` 是一個運算子。

> `>>`，中間要空白
> `std::map<std::string, std::list<std::string> >  filter;`

### 3. 對於單純的get與set屬性，哪個介面設計得好？為什麼？(Set與Get各選一個)

```cpp
class CompanyEmployeesList
{
private
    Employee cv_Employee;
     //...
public:
           Employee GetEmployee(int m_EmployeeNumber);
           Employee GetEmployee(int m_EmployeeNumber) const;
     const Employee GetEmployee(int m_EmployeeNumber);
     const Employee GetEmployee(int m_EmployeeNumber) const;

           Employee GetEmployee(const int m_EmployeeNumber);
           Employee GetEmployee(const int m_EmployeeNumber) const;
     const Employee GetEmployee(const int m_EmployeeNumber);
     const Employee GetEmployee(const int m_EmployeeNumber) const;

           Employee GetEmployee(const int& m_EmployeeNumber);
           Employee GetEmployee(const int& m_EmployeeNumber) const;
     const Employee GetEmployee(const int& m_EmployeeNumber);
     const Employee GetEmployee(const int& m_EmployeeNumber) const;

     void SetEmployee(int m_EmployeeNumber, Employee m_Employee);
     void SetEmployee(const int& m_EmployeeNumber, Employee m_Employee);
     void SetEmployee(int m_EmployeeNumber, const Employee& m_Employee);
     void SetEmployee(const int& m_EmployeeNumber, const Employee& m_Employee);
};
```

> 對於單純只是要存取屬性，選以下這兩個介面是最好的，也是限制最多的。
> 
> ```cpp=1
> class CompanyEmployeesList
> {
> private
>     Employee cv_Employee;
>     //...
> public:
>      const Employee GetEmployee(const int& m_EmployeeNumber) const;
> ```
> 
> Get是一個唯讀的 function，所有的值在此 function 皆不會改變。
> 回傳值是一個唯讀的物件副本。
> 
> ```cpp=8
     > void SetEmployee(const int& m_EmployeeNumber, const Employee& m_Employee);
> };
> ```
> 傳入的參數是唯讀的 refreance，傳入 refreance 是該物件實體，不像副本還要花時間 copy 一份，而傳入設定成 const 則表示不可修改。
> 所以，以這種方式傳入參數，是速度快又保證不會被修改的方式。

### 4. 實作捕捉建構子與解構子的exception

```cpp
class foo{
    int i;
    char c;
public:
    foo();  //建構子
    ~foo(); //解構子
};
```

提示：
一般而言，建構子是這樣寫

```cpp
foo::foo()
:i(0), c(''){  // <-- 建構初始列: 屬性初始化

}
```

> 建構子的exception
> 
> ```cpp
> foo::foo()
> try:i(0), c(''){  <-- 建構初始列
>     
> }catch(...)
> {    }
> ```
> 
> 解構子不可以有exception！！
> 如果答對，可以問「為什麼」
> 
> 因為解構式exception
> 
> 1. 是預測中的exception，就會跳過釋放記憶體的code
> 2. 是無法預測中的exception 就會關掉程式。 
> 又因為exception導致的解構，又讓情況更無法預測。所以在標準函式庫中，保證解構不拋異常

### 5. 哪個做法比較好？為什麼？

`#define k 5` vs `const int k = 5;`

> `const int k = 5;` 較好
>
> ```cpp
> #define a1 1
> #define a2 2
> #define a3 3
> #define a4 4
> #define a5 5
> ```
> 和
> ```cpp
> enum A {a1, a2, a3, a4, a5};
> ```
> 之間也是 `enum A {a1, a2, a3, a4, a5};` 比較好
>  
> 因為編譯器可以幫你檢查型別。
> 

6. 去掉重覆的元素

```cpp
std::vector<int> intv;
intv.push(5);
intv.push(5);
intv.push(5);
intv.push(5);
intv.push(5);
```

> ```cpp
> std::set<int> ints(intv.begin(), intv.end());
> intv.clear();
> intv.insert(ints.begin(), ints.end();
> ```
> (做法很多，換容器這種做法，這是我覺得最省事的做法)

### 7. 下面這個C++程式是否有問題

是/否

若有問題，請回答為什麼，並請試寫一個標準C++的版本

```cpp
#include <stdio.h>

void main()
{
  printf("%d\n", 3);
}
```

> 1. C++ 標準函式庫的 `#include` 檔案，不會有 .h 的副檔名。要在 C++ 使用 C 函式庫要寫 `#include <cstdio>`
> 2. main 要用 `int` 的回傳值，這是 UNIX like 作業系統要求。
> 3. 不一定要有 `return 0;` (後來的 complier 會幫你 `return 0;`) 但標準還是需要加上 `return 0;`
>
> 標準的寫法
> ```cpp
> #include <iostream>
>  
> int main()
> {
>     std::cout << 3 << std::endl;
>     return 0;
> }
> ```
