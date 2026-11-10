/* L137 Deliverance Ministry International — interactions */
(function () {
  "use strict";

  var drawer = document.getElementById("drawer");
  var drawerBg = document.querySelector(".drawer-bg");
  var toast = document.getElementById("toast");
  var toastTimer = null;

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 2600);
  }

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add("open");
    if (drawerBg) drawerBg.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove("open");
    if (drawerBg) drawerBg.classList.remove("open");
    document.body.style.overflow = "";
  }

  document.addEventListener("click", function (e) {
    var openEl = e.target.closest("[data-open-drawer]");
    if (openEl) { e.preventDefault(); openDrawer(); return; }

    var closeEl = e.target.closest("[data-close-drawer]");
    if (closeEl) {
      // allow anchor navigation to still happen, just close the drawer
      closeDrawer();
      // don't preventDefault for in-page anchor links inside drawer
      if (closeEl.classList.contains("drawer-bg") || closeEl.classList.contains("icon-btn")) {
        e.preventDefault();
      }
      return;
    }

    // demo tooltips / placeholder links
    var demoEl = e.target.closest("[data-demo]");
    if (demoEl) {
      var href = demoEl.getAttribute("href");
      if (!href || href === "#") {
        e.preventDefault();
        showToast(demoEl.getAttribute("data-demo"));
      }
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeDrawer();
  });

  // forms (prayer request, newsletter)
  document.querySelectorAll("form[data-handle]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var kind = form.getAttribute("data-handle");
      if (kind === "newsletter") {
        showToast("You're subscribed — watch for the weekly word.");
      } else if (kind === "prayer") {
        showToast("Your request has been received. We are praying with you.");
      } else {
        showToast("Thank you.");
      }
      form.reset();
    });
  });

  // active tab/nav highlight on scroll
  var sections = ["top", "sermon", "prayer", "give"];
  var tabLinks = Array.prototype.slice.call(document.querySelectorAll(".tabbar .tab"));
  window.addEventListener("scroll", function () {
    var y = window.scrollY + 120;
    var current = "top";
    sections.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.offsetTop <= y) current = id;
    });
    tabLinks.forEach(function (a) {
      var href = a.getAttribute("href") || "";
      a.classList.toggle("active", href === "#" + current);
    });
  }, { passive: true });
})();
