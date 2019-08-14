---
title: 互動動畫練習
date: 2018-01-31 16:39:00
tags: 
- canvas
- JavaScript
categories: 
- 技術心得
---

# 互動動畫練習

這次，得到了一個關鍵字 "sprite animation"
找到了一篇 [CREATE A SPRITE ANIMATION WITH HTML5 CANVAS AND JAVASCRIPT](http://www.williammalone.com/articles/create-html5-canvas-javascript-sprite-animation/)

經過練習，做出一個小範例。

## 金幣旋轉

<canvas id="coinAnimation" width="44" height="40"></canvas>

<script src="https://dwatow.github.io/spriteAnimation/sprite0.js" charset="utf-8"></script>
<script type="text/javascript">
    const image = new Image();
    image.src = "https://dwatow.github.io/spriteAnimation/coin-sprite-animation-sprite-sheet.png";

    const canvas = document.getElementById("coinAnimation");
    // canvas.width = 40;
    // canvas.height = 40;

    const coin = sprite0({
        context: canvas.getContext("2d"),
        width: 398,
        height: 40,
        image: image,
        totalFrames: 9,
        ticksPerFrame: 2,
        isInfinite: true
    })

    image.addEventListener("load", gameLoop);

    function gameLoop () {
      window.requestAnimationFrame(gameLoop);
      coin.update();
      coin.render();
    }

</script>

## 人物移動

請按鍵盤的方向鍵 ~svg~ ~圖是抓來練習，不是我畫的~

<canvas id="walkingAnimation" width="500" height="500"></canvas>

<script src="https://dwatow.github.io/spriteAnimation/sprite4.js" charset="utf-8"></script>
<script type="text/javascript">
    const walkingImage = new Image();
    walkingImage.src = "https://dwatow.github.io/spriteAnimation/walking-demo.svg";
    const walking_canvas = document.getElementById("walkingAnimation");
    // walking_canvas.width = 40;
    // walking_canvas.height = 40;
    const walking = sprite4({
        context: walking_canvas.getContext("2d"),
        width: 260,
        height: 89,
        image: walkingImage,
        totalFrames: 4,
        ticksPerFrame: 1,
        isInfinite: true,
        moveStep: 10,
    })
    walkingImage.addEventListener("load", walkingRender);

    function walkingRender () {
      walking.update();
      walking.render();
    }

    window.addEventListener('keydown', (e) => {
        // console.log(e.keyCode);
        walking.direct(e.keyCode);
        window.requestAnimationFrame(walkingRender);
    })
    window.addEventListener('keyup', (e) => {
        console.log(e.keyCode);
        walking.stop(e.keyCode);
        walking.render();
    })

    document.addEventListener('keydown', (e) => {
        if (e.keyCode > 36 && e.keyCode < 41) {
            e.preventDefault();
        }
    })
</script>
