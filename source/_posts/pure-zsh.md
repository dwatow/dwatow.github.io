---
title: zsh 真正簡單設定 (無 iTern2, 無 oh-my-zsh)
date: 2020-06-17 09:39:25
tags:
- zsh
- shell
categories:
- macOS
---
# zsh 真正簡單設定 (無 iTern2, 無 oh-my-zsh)

## 起因

因為 bash 不被新版的 Mac 當作預設的 shell 了。
要改 zsh 當作預設的 shell[^mac]，所以要改變是未來的趨勢。

[^mac]: [在 Mac 上使用 zsh 做為預設 shell](https://support.apple.com/zh-tw/HT208050)

但是我又不想要改得花枝招展，想要一保 bash 的樸素。所以特別花時間找文件來看看要怎麼設定可以把 zsh 設定得和 bash 一樣。

## 我原本的 bash 長這樣

![](https://i.imgur.com/Qy1dV5P.png)

那個長得像 IP 的 31-154-12-102 我也想知道為什麼叫這名字，原本它應該是主機名稱，一個我訂的名字，不知道他怎麼變這樣了。QQ

它的組成

- `31-154-12-102`: 應該是主機名稱的名稱
- `~/Desktop`: 是以 HOME 起跳的完整路徑
- `chris`: 使用者名稱

然後，顏色簡單配一下就好。

這就是我們的目標。

## 不容易的原因，改很大的分享很好找。

隨便找都一堆改 oh-my-zsh 或者要我裝 iTerm2 的文章。
就不想裝這麼多東西。

就堅持著這樣的信念，找到了一個系列文章 - [Moving to zsh](https://scriptingosx.com/2019/06/moving-to-zsh/)
作者一樣是 Mac 的使用者，也是一樣的原因出了這一系列的文章。建議有機會詳讀。

這一系列的其中一篇[Moving to zsh, part 6 – Customizing the zsh Prompt](https://scriptingosx.com/2019/07/moving-to-zsh-06-customizing-the-zsh-prompt/) 正是介紹外觀的客制化設定。而且確定沒有叫我安裝任何多餘的東西。 讚

在你的 `.zshrc` 文件中，新增

```shell
PROMPT='你的設定'
```

- `PROMPT`: 代表 `bash` 的 `export PATH`
- `'你的設定'`: 設定的值必須要是字串格式

### 顏色的設定

**查色碼**

設定之前，先看一下這個顏色的色碼，等一下的設定要從這裡查 Xterm Number 欄位

- [顏色查碼](https://jonasjacek.github.io/colors/)

**設定顏色**

```shell
%F{2}%m%f
```

- `%F{色碼}`: 用來設定某個顏色的開始
- `%f`: 用來設定成預設的樣式，也可以說是設定好的顏色結束。
- `%m`: 主機名稱，在此只是示範夾在顏色中間的東西

**特殊符號**[^Visual-effects]

[^Visual-effects]: [zsh: 13 Prompt Expansion, 13.2.5 Visual effects](http://zsh.sourceforge.net/Doc/Release/Prompt-Expansion.html#Visual-effects)

- `%m`: 主機名稱
- `%~`: 以 HOME 為起點的完整路徑表示
- `%n`: 使用者名稱

我自己設定好，長這樣

![](https://i.imgur.com/zyrZ46x.png)

```shell
PROMPT='%F{2}%m%f:%F{30}%~%f %F{184}%n%f $'
```
## 最後，我的 zsh 長這樣

除了上面的設定，我還想斷行怎辦？
出乎意料的簡單，只要在設定文章上斷行，就可以了，不用任何特殊符號

![](https://i.imgur.com/pAexCer.png)

![](https://i.imgur.com/2OzZweZ.png)

## 設定 git branch[^git]

[^git]: [Add Git branch information to your ZSH prompt](https://www.themoderncoder.com/add-git-branch-information-to-your-zsh-prompt/)

直接看結果和註解

```shell=
# Load version control information
autoload -Uz vcs_info
precmd() { vcs_info }

# Format the vcs_info_msg_0_ variable
zstyle ':vcs_info:git:*' formats '%F{1}(%b)%f'

# Set up the prompt (with git branch name)
setopt PROMPT_SUBST
```

再把

```shell
PROMPT='%F{2}%m%f:%F{30}%~%f
%F{184}%n%f $ '
```

加上 ` ${vcs_info_msg_0_} `

```shell
PROMPT='%F{2}%m%f:%F{30}%~%f ${vcs_info_msg_0_}
%F{184}%n%f $ '
```

## 靠右對齊

靠右有兩種方式

1. 使用 `RPROMPT` 可以直接在你的 shell 提示結束那一行顯示在右邊 (就是游標停下來的右邊)
2. 自己算，如果像我想要兩行的提示，那麼第一行的右邊就是要自己計算空白有幾個，再印出文字

在此分享一個第 2 個的函式做法(寫得很好讀)[^align-right]

[^align-right]: [zsh在ps1中右對齊](https://zh.it-reply.net/q/zsh%E5%9C%A8ps1%E4%B8%AD%E5%8F%B3%E5%B0%8D%E9%BD%8A-7516)

```shell
PROMPT="$(fill-line "$top_left" "$top_right")"$'\n'$bottom_left
RPROMPT=$bottom_right
```

會顯示

```shell
~/code/foo                    master
% █                            11:51
```

可以發現它有一個 `fill-line` 函數

```shell=
function fill-line() {
  emulate -L zsh
  local left_len=$(prompt-length $1)
  local right_len=$(prompt-length $2 9999)
  local pad_len=$((COLUMNS - left_len - right_len - ${ZLE_RPROMPT_INDENT:-1}))
  if (( pad_len < 1 )); then
    # Not enough space for the right part. Drop it.
    echo -E - ${1}
  else
    local pad=${(pl.$pad_len.. .)}  # pad_len spaces
    echo -E - ${1}${pad}${2}
  fi
}
```

而這之中又引用了一個 `prompt-length` 函數

```shell
function prompt-length() {
  emulate -L zsh
  local COLUMNS=${2:-$COLUMNS}
  local -i x y=$#1 m
  if (( y )); then
    while (( ${${(%):-$1%$y(l.1.0)}[-1]} )); do
      x=y
      (( y *= 2 ));
    done
    local xy
    while (( y > x + 1 )); do
      m=$(( x + (y - x) / 2 ))
      typeset ${${(%):-$1%$m(l.x.y)}[-1]}=$m
    done
  fi
  echo $x
}
```

兩個都貼上去，就可以直接使用 `fill-line` 囉，函數的參數由空白分開

最後，我的 terminal 變成這樣

```shell
RPROMPT='${vcs_info_msg_0_}'
PROMPT='$(fill-line %F{2}%m%f:%F{30}%~%f  %*)
%F{184}%n%f $ '
```

![](https://i.imgur.com/tVbTmkF.png)

## 電源顯示

再附上電源的指示，最後的版本長這樣。

![](https://i.imgur.com/K0k5nGD.png)

## 後記

記錄一些選擇性的設定，或其實寫得很完整，但這次沒用上的文章

- [(安裝 nvm)Node.js 環境設定-for mac - Salt - Medium](https://medium.com/@toumasaya/node-js-%E7%92%B0%E5%A2%83%E8%A8%AD%E5%AE%9A-for-mac-a2628836feaf)
- 命令自動補完: `autoload -Uz compinit && compinit`
  - [(Docker 指令補完) Docker ZSH autocomplete and denter on MacOS — Easy tutorial](https://medium.com/@MicoDer/docker-zsh-autocomplete-and-denter-on-macos-easy-tutorial-630c46836652)
  ```shell
  $ ln -s /Applications/Docker.app/Contents/Resources/etc/docker.zsh-completion /usr/local/share/zsh/site-functions/_docker
  $ ln -s /Applications/Docker.app/Contents/Resources/etc/docker-compose.zsh-completion /usr/local/share/zsh/site-functions/_docker-compose
  $ ln -s /Applications/Docker.app/Contents/Resources/etc/docker-machine.zsh-completion /usr/local/share/zsh/site-functions/_docker-machine
  ```
  - [(不用官網的，用 oh-my-zsh) Heroku cli complete ](https://github.com/DengPingFan/oh-my-zsh/blob/master/plugins/heroku/_heroku)
- [Zsh(簡中設定教學)](https://wiki.archlinux.org/index.php/Zsh_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87))
- [電源指示(oh-my-zsh)](https://github.com/DengPingFan/oh-my-zsh/blob/master/plugins/battery/battery.plugin.zsh)

### 附上我的完整版設定

```shell
# Add RVM to PATH for scripting. Make sure this is the last PATH variable change.
export PATH="$PATH:$HOME/.rvm/bin"

## for nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm

## autocomplete
# autoload -Uz compinit && compinit

## 選單補全，用 tab 移動選擇
zstyle ':completion:*' menu select

# setopt completealiases

# Load version control information
autoload -Uz vcs_info
precmd() { vcs_info }

# Format the vcs_info_msg_0_ variable
zstyle ':vcs_info:git:*' formats ' %F{1}%b%f'

# Set up the prompt (with git branch name)
setopt PROMPT_SUBST

# 靠右上的提示
# 因為要自己計算剩下的長度還可以怎麼用才可以對齊右邊
function prompt-length() {
  emulate -L zsh
  local COLUMNS=${2:-$COLUMNS}
  local -i x y=$#1 m
  if (( y )); then
    while (( ${${(%):-$1%$y(l.1.0)}[-1]} )); do
      x=y
      (( y *= 2 ));
    done
    local xy
    while (( y > x + 1 )); do
      m=$(( x + (y - x) / 2 ))
      typeset ${${(%):-$1%$m(l.x.y)}[-1]}=$m
    done
  fi
  echo $x
}
# 所以滿一行中間要空白
function fill-line() {
  emulate -L zsh
  local left_len=$(prompt-length $1)
  local right_len=$(prompt-length $2 9999)
  local pad_len=$((COLUMNS - left_len - right_len - ${ZLE_RPROMPT_INDENT:-1}))
  if (( pad_len < 1 )); then
    # Not enough space for the right part. Drop it.
    echo -E - ${1}
  else
    local pad=${(pl.$pad_len.. .)}  # pad_len spaces
    echo -E - ${1}${pad}${2}
  fi
}

# Docker
fpath=(~/.zsh/completion $fpath)
autoload -Uz compinit && compinit -i
# exec $SHELL -l


## battery
function battery_pct() {
  local smart_battery_status="$(ioreg -rc "AppleSmartBattery")"
  typeset -F maxcapacity=$(echo $smart_battery_status | grep '^.*"MaxCapacity"\ =\ ' | sed -e 's/^.*"MaxCapacity"\ =\ //')
  typeset -F currentcapacity=$(echo $smart_battery_status | grep '^.*"CurrentCapacity"\ =\ ' | sed -e 's/^.*CurrentCapacity"\ =\ //')
  integer i=$(((currentcapacity/maxcapacity) * 100))
  echo $i
}

function plugged_in() {
  [ $(ioreg -rc AppleSmartBattery | grep -c '^.*"ExternalConnected"\ =\ Yes') -eq 1 ]
}

function battery_pct_remaining() {
  if plugged_in ; then
    echo "External Power"
  else
    battery_pct
  fi
}

function battery_pct_prompt () {
  if [[ $(ioreg -rc AppleSmartBattery | grep -c '^.*"ExternalConnected"\ =\ No') -eq 1 ]] ; then
    b=$(battery_pct_remaining)
    if [ $b -gt 50 ] ; then
      color='green'
    elif [ $b -gt 20 ] ; then
      color='yellow'
    else
      color='red'
    fi
    echo "⚡%F{$color}$(battery_pct_remaining)%% %f"
  else
    echo "⚡%F{green}∞ %f"
  fi
}

# output
RPROMPT='${vcs_info_msg_0_}'
PROMPT='$(fill-line %F{2}%m%f:%F{30}%~%f  %*$(battery_pct_prompt))
%F{184}%n%f $ '
```
