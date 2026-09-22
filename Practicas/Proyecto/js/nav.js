/**
 * nav.js - MARCA-style Header Navigation
 * Handles: scroll compact state, teams bar drag-scroll + wheel scroll, dropdown interactions, keyboard accessibility
 */
(function () {
  'use strict';

  /* ── Scroll: toggle compact nav ──────────────────────────── */
  var SCROLL_THRESHOLD = 80;
  var ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        document.body.classList.toggle('scrolled', window.scrollY > SCROLL_THRESHOLD);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Teams bar drag-to-scroll and mouse wheel ──────────────── */
  var teamsEl = document.getElementById('teamsScroll');
  if (teamsEl) {
    var isDown = false, startX = 0, scrollLeftPos = 0;

    teamsEl.addEventListener('mousedown', function (e) {
      isDown = true;
      teamsEl.classList.add('dragging');
      startX = e.pageX - teamsEl.offsetLeft;
      scrollLeftPos = teamsEl.scrollLeft;
    });

    ['mouseup', 'mouseleave'].forEach(function (evt) {
      teamsEl.addEventListener(evt, function () {
        isDown = false;
        teamsEl.classList.remove('dragging');
      });
    });

    teamsEl.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - teamsEl.offsetLeft;
      teamsEl.scrollLeft = scrollLeftPos - (x - startX) * 1.8;
    });

    teamsEl.addEventListener('wheel', function (e) {
      if (e.deltaY !== 0) {
        e.preventDefault();
        teamsEl.scrollLeft += e.deltaY;
      }
    }, { passive: false });
  }

  /* ── Main Nav Dropdowns (Mega Menu & Simple Dropdowns) ───── */
  var navItemsWithDropdown = document.querySelectorAll('.ni:has(.dropdown-panel), .ni:has(.simple-panel)');
  
  // Fallback for browsers that don't support :has selector
  if (!navItemsWithDropdown.length) {
    var allNi = document.querySelectorAll('.ni');
    navItemsWithDropdown = Array.prototype.filter.call(allNi, function (item) {
      return item.querySelector('.dropdown-panel, .simple-panel') !== null;
    });
  }

  navItemsWithDropdown.forEach(function (item) {
    var link = item.querySelector('.nl');
    if (!link) return;

    // Click/tap toggle
    link.addEventListener('click', function (e) {
      // If it's a clickable link with actual destination, let it navigate, unless it has a dropdown
      var isOpen = item.classList.contains('open');
      navItemsWithDropdown.forEach(function (other) {
        if (other !== item) other.classList.remove('open');
      });
      item.classList.toggle('open', !isOpen);
    });

    // Hover UX on desktop
    item.addEventListener('mouseenter', function () {
      item.classList.add('open');
    });

    item.addEventListener('mouseleave', function () {
      item.classList.remove('open');
    });
  });

  // Close nav dropdowns when clicking outside
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.ni')) {
      navItemsWithDropdown.forEach(function (item) {
        item.classList.remove('open');
      });
    }
  });

  /* ── Keyboard: close open dropdown on Escape ──────────────── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      navItemsWithDropdown.forEach(function (item) {
        item.classList.remove('open');
      });
      if (document.activeElement) {
        document.activeElement.blur();
      }
    }
  });

}());
