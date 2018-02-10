window.fbAsyncInit = function() {
    FB.init({
        appId            : '213697875859331',
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v2.12'
    });
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/zh_TW/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


var fbshareButton = document.querySelector('.fbShareButton');
if (fbshareButton) {
    fbshareButton.addEventListener('click', share2FB(window.location.href));
}

function share2FB (currUrl, currQuote = '') {
    var url = currUrl;
    var quote = currQuote;
    console.log(url, quote);
    return function () {
        console.log('share2FB');
        FB.ui({
          method: 'share',
          mobile_iframe: true,
          href: url,
          quote: quote,
          hashtag: '#Chris技術筆記',
        }, function(response){});
    }
}
