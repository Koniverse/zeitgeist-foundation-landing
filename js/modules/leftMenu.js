const $ = require('jquery');

const $leftMenu = $('ul.left-menu');
const trackingAnchors = ['#about', '#grants', '#research'];


const enableHighlight = ($item) => {
  $item.addClass('text-[2.8125rem] text-white');
  $item.removeClass('text-[2.125rem] text-secondary');
  $item.find('img').removeClass('hidden');
  $item.find('span').addClass('text-white-shadow');
}

const removeHighlight = ($item) => {
  $item.removeClass('text-[2.8125rem] text-white');
  $item.addClass('text-[2.125rem] text-secondary');
  $item.find('img').addClass('hidden');
  $item.find('span').removeClass('text-white-shadow');
}

const removeHighlightForAllItems = () => {
  $leftMenu.find('li > a.flex').each(function () {
    removeHighlight($(this))
  });
}

const highlightItem = (hashName) => {
  removeHighlightForAllItems();
  enableHighlight($leftMenu.find("li > a[href=\"" + hashName + "\"]"))
}

function locationHashChanged() {
  let hash = location.hash;
  if (trackingAnchors.indexOf(hash) > -1) {
    highlightItem(hash);
  }
}

const trackingScrollTops = trackingAnchors.reduce((rs, section) => {
  rs[section] = $(section).offset().top + $(section).outerHeight() - 200
  return rs;
}, {});

const startHighlightScrollTop = $(trackingAnchors[0]).offset().top - 200;

let currentAnchor = '';
const highlightItemBasedOnScrollTop = function (e) {
  const location = window.location;
  const currentScrollTop = $(document).scrollTop();

  if (currentScrollTop <= startHighlightScrollTop) {
    if (currentAnchor !== '') {
      currentAnchor = '';
      window.history.replaceState({}, '', location.origin + location.pathname)
      removeHighlightForAllItems();
    }
    return;
  }

  for (let section of trackingAnchors) {
    if (currentScrollTop <= trackingScrollTops[section]) {
      if (currentAnchor !== section) {
        currentAnchor = section
        window.history.replaceState({}, '', location.origin + location.pathname + currentAnchor)
        highlightItem(currentAnchor);
      }
      return;
    }
  }
}

module.exports = () => {
  window.addEventListener("hashchange", locationHashChanged, false);
  document.addEventListener('scroll', highlightItemBasedOnScrollTop, false);

  locationHashChanged();
}
