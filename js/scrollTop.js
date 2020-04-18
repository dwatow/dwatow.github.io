(() => {
  console.log('scrolltop');
  
  document.querySelectorAll('.toc-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const header = document.querySelector(decodeURIComponent(link.hash));
      scrollTo(header.offsetTop, 550);
    })
  })

  function scrollTo (to, duration) {
    const element = document.documentElement;
    var start = element.scrollTop,
      change = to - start,
      currentTime = 0,
      increment = 20;

    var animateScroll = function () {
      
      currentTime += increment;
      var val = parseInt(Math.easeInOutQuad(currentTime, start, change, duration));
      console.log(val.toFixed(4));
      element.scrollTop = val;
      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };
    animateScroll();
  }

  //t = current time
  //b = start value
  //c = change in value
  //d = duration
  Math.easeInOutQuad = function (t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  };
})()