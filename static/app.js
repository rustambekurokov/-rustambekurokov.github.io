/* The only script on the site: sections below the fold fade in as they arrive.
   It is written so it cannot hide content it fails to reveal — the hidden state is
   added here, per element, and only to elements that are currently off-screen. With
   the script blocked, slow, or broken, every section is simply visible. */
(function () {
  var start = function () {
    var targets = document.querySelectorAll(".reveal");
    if (!targets.length) return;
    if (!("IntersectionObserver" in window)) return;

    var reveal = function (el) {
      el.classList.remove("pending");
      el.classList.add("seen");
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });

    var fold = window.innerHeight * 0.92;
    for (var i = 0; i < targets.length; i++) {
      var el = targets[i];
      if (el.getBoundingClientRect().top <= fold) continue; // already on screen: leave it be
      el.classList.add("pending");
      observer.observe(el);
    }

    // A belt-and-braces timer: if anything is still pending a few seconds later —
    // an observer that never fires, a browser quirk — show it anyway.
    window.setTimeout(function () {
      var stuck = document.querySelectorAll(".reveal.pending");
      for (var j = 0; j < stuck.length; j++) reveal(stuck[j]);
    }, 4000);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
