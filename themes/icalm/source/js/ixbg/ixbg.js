(function() {
    var resizeWidth;
    var resizeHeight;
    function resize() {
        resizeWidth = canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        resizeHeight = canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    }

    //initial canvas
    const canvas = document.querySelector('#ixbg');

    //init window event
    var requestAnimationFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(i) {
            window.setTimeout(i, 1000 / 45)
        }

    var mousePosition = {
        x: null,
        y: null,
        max: 20000
    };

    resize();
    window.onresize = resize;
    window.onmousemove = function(e) {
        e = e || window.event,
        mousePosition.x = e.clientX,
        mousePosition.y = e.clientY
    };

    window.onmouseout = function() {
        mousePosition.x = null,
        mousePosition.y = null
    };

    var random = Math.random;

    //initial position in canvas
    const totalDusts = screen.width/10; // for RWD
    var dusts = []
    for (var indexDusts = 0; indexDusts < totalDusts; indexDusts++) {
        dusts.push({
            x: random() * resizeWidth,
            y: random() * resizeHeight,
            xa: 2 * random() - 1,
            ya: 2 * random() - 1,
            max: 6000
        })
    }

    var ctx = canvas.getContext("2d");
    function draw() {
        ctx.clearRect(0, 0, resizeWidth, resizeHeight);
        var allPoint = [mousePosition].concat(dusts);
        // var allPoint = [...dusts];
        // var v;
        dusts.forEach(function(dust) {
            dust.x += dust.xa,
            dust.y += dust.ya,
            dust.xa *= dust.x > resizeWidth || dust.x < 0 ? -1 : 1,
            dust.ya *= dust.y > resizeHeight || dust.y < 0 ? -1 : 1,
            ctx.fillRect(dust.x - 0.5, dust.y - 0.5, 1, 1);
            allPoint.forEach( (point) => {
                let A;
                const diffX = dust.x - point.x;
                const diffY = dust.y - point.y;
                const hypotenuse = diffX * diffX + diffY * diffY;

                if (dust !== point && //不是 同一個點
                    null !== point.x && null !== point.y //點 有定義
                   ) {

                    if (hypotenuse < point.max)
                     {
                        point === mousePosition && // 滑鼠位置
                        hypotenuse >= point.max / 2 &&
                       (dust.x += 0.03 * diffX, dust.y += 0.03 * diffY), //擠開
                        A = (point.max - hypotenuse) / point.max,

                        ctx.beginPath(),
                        ctx.lineWidth = A / 2,
                        ctx.strokeStyle = "rgba(0,0,0," + (A + 0.2) + ")",
                        ctx.moveTo(dust.x, dust.y),
                        ctx.lineTo(point.x, point.y),
                        ctx.stroke(),
                        ctx.beginPath(),
                           ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI),
                           ctx.fillStyle = "#f8f8f8",
                           ctx.fill(),
                        ctx.stroke()
                     }
                }
            })
            allPoint.splice(allPoint.indexOf(dust), 1)
        })
        requestAnimationFrame(draw)
    }
    draw();
})()
