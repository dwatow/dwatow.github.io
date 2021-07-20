(function () {
  var resizeWidth;
  var resizeHeight;

  //initial canvas
  const canvas = document.querySelector('#ixbg');
  const sidebar = document.querySelector('.SideBar');
  canvas.width = sidebar.offsetWidth
  canvas.height = sidebar.offsetHeight

  //init window event
  const requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (i) {
      window.setTimeout(i, 1000 / 45)
    }


  function resize () {
    resizeWidth = canvas.width;// = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    resizeHeight = canvas.height;// = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  }
  window.onresize = resize;
  resize();

  const mousePosition = {
    x: null,
    y: null,
    max: 100
  };
  window.onmousemove = function (e) {
    e = e || window.event,
      mousePosition.x = e.pageX,
      mousePosition.y = e.pageY
  };

  window.onmouseout = function () {
    mousePosition.x = null;
    mousePosition.y = null;
  };

  //initial position in canvas
  const totalDusts = screen.width / 60; // for RWD
  console.log(totalDusts);

  const dusts = Array(Math.floor(totalDusts)).fill(0).map(() => ({
    x: Math.random() * resizeWidth,
    y: Math.random() * resizeHeight,
    xa: 2 * Math.random() - 1,
    ya: 2 * Math.random() - 1,
    max: 20
  }))
  console.log('dusts', dusts.length);

  const ctx = canvas.getContext("2d");

  function update () {
    dusts.forEach(dust => {
      // 自動飄浮
      dust.x += dust.xa;
      dust.y += dust.ya;

      // 邊界碰撞
      dust.xa *= dust.x > resizeWidth || dust.x < 0 ? -1 : 1;
      dust.ya *= dust.y > resizeHeight || dust.y < 0 ? -1 : 1;


      if (mousePosition.x != null && mousePosition.y != null) {
        const diffX = dust.x - mousePosition.x;
        const diffY = dust.y - mousePosition.y;
        const distanceMousePointToDust = Math.sqrt(diffX * diffX + diffY * diffY);
        dust.distanceMousePointToDust = distanceMousePointToDust;
        if (distanceMousePointToDust < mousePosition.max) {
          // 引力場大小
          dust.x -= 0.03 * diffX; // 引力
          dust.y -= 0.03 * diffY; // 引力
        }
        dust.rate = (mousePosition.max - distanceMousePointToDust) / mousePosition.max;
      }
      else {
        dust.rate = 0.5;
      }
    })
  }
  function draw () {
    // clean all
    ctx.clearRect(0, 0, resizeWidth, resizeHeight);

    dusts.forEach((dust, index) => {
      ctx.fillRect(dust.x - 0.5, dust.y - 0.5, 1, 1);

      ctx.beginPath();
      if (mousePosition.x != null && mousePosition.y != null) {
        ctx.moveTo(mousePosition.x, mousePosition.y);
        if (dust.distanceMousePointToDust < mousePosition.max) {
          ctx.lineTo(dust.x, dust.y);
        }
      }

      ctx.lineWidth = dust.rate / 2;
      ctx.strokeStyle = "rgba(0,0,0, " + dust.rate + 0.5 + ")";
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(dust.x, dust.y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#fff";
      ctx.stroke()
    })
    requestAnimationFrame(() => {
      setTimeout(update, 1)
      draw()
    });
  }
  // setTimeout(update, 100);
  update()
  draw();
})()
