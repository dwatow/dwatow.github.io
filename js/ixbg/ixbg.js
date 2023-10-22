const ixbg = (function () {
  //initial canvas
  const canvas = document.querySelector("#ixbg");
  const sidebar = document.querySelector(".SideBar");
  canvas.width = sidebar.offsetWidth;
  canvas.height = sidebar.offsetHeight;

  //init window event
  const requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (i) {
      window.setTimeout(i, 1000 / 45);
    };

  var resizeWidth;
  var resizeHeight;
  function resize() {
    resizeWidth = canvas.width; // = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    resizeHeight = canvas.height; // = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  }
  window.onresize = resize;
  resize();

  const mousePosition = {
    x: null,
    y: null,
    max: 100,
  };
  window.onmousemove = function (e) {
    (e = e || window.event),
      (mousePosition.x = e.pageX),
      (mousePosition.y = e.pageY);
  };

  window.onmouseout = function () {
    mousePosition.x = null;
    mousePosition.y = null;
  };

  //initial position in canvas
  const totalDusts = screen.height / 50; // for RWD
  // console.log(totalDusts);

  function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const dusts = Array(Math.floor(totalDusts))
    .fill(0)
    .map(() => {
      const z = getRandom(5, 25);
      // console.log(z);
      return {
        x: Math.random() * resizeWidth,
        y: Math.random() * resizeHeight,
        inertia_x: 2 * Math.random() - 1,
        inertia_y: 2 * Math.random() - 1,
        radius: z,
        max: 20,
      };
    });
  // console.log("dusts", dusts.length);

  const ctx = canvas.getContext("2d");

  function update() {
    dusts.forEach((dust) => {
      // 自動飄浮
      dust.x += dust.inertia_x;
      dust.y += dust.inertia_y;

      // 邊界碰撞
      dust.inertia_x *= dust.x > resizeWidth || dust.x < 0 ? -1 : 1;
      dust.inertia_y *= dust.y > resizeHeight || dust.y < 0 ? -1 : 1;

      if (mousePosition.x != null && mousePosition.y != null) {
        const diffX = dust.x - mousePosition.x;
        const diffY = dust.y - mousePosition.y;
        const distanceMousePointToDust = Math.sqrt(
          diffX * diffX + diffY * diffY
        );
        dust.distanceMousePointToDust = distanceMousePointToDust;
        if (distanceMousePointToDust < mousePosition.max) {
          // 引力場大小
          dust.x -= 0.03 * diffX; // 引力
          dust.y -= 0.03 * diffY; // 引力
        }
        dust.rate =
          (mousePosition.max - distanceMousePointToDust) / mousePosition.max;
      } else {
        dust.rate = 0.5;
      }
    });
  }
  function draw() {
    // clean all
    ctx.clearRect(0, 0, resizeWidth, resizeHeight);

    // console.log("dusts", dusts);
    dusts.forEach((dust) => {
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
      // ctx.strokeStyle = "rgb(255,255,255)";

      if (!navigator.userAgent.includes('Firefox')) {
        // firefox 會變慢
        ctx.filter = `blur(${Math.abs(dust.radius / 5 - 3)}px)`;
      }
      ctx.arc(dust.x, dust.y, dust.radius, 0, 2 * Math.PI);
      ctx.lineWidth = Math.abs(dust.radius / 5 - 4);
      ctx.fillStyle = "lightgray";
      // ctx.fill();
      ctx.stroke();
    });
    if (runAnimation) {
      requestAnimationFrame(() => {
        setTimeout(update)
        draw();
      }); 
    }
  } 

  // setTimeout(() => {
  // }, 30);
  let runAnimation = true;
  setTimeout(update)
  draw();
  return {
    start: () => {
      runAnimation = true;
      setTimeout(update)
      draw();
    },
    stop: () => {
      runAnimation = false;
    }
  }
})();
