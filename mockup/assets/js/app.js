/* =========================================================
   72h Aktionszentrale – Mockup-Interaktionen
   Reines Vanilla-JS, keine externen Abhängigkeiten.
   ========================================================= */

(function () {
  "use strict";

  /**
   * Sidebar: aktiven Eintrag anhand des Dateinamens markieren.
   */
  function highlightActiveNav() {
    var current = window.location.pathname.split("/").pop() || "index.html";
    var links = document.querySelectorAll(".sidebar__link");
    links.forEach(function (link) {
      var href = link.getAttribute("href");
      if (!href) return;
      if (href === current) {
        link.classList.add("is-active");
      } else {
        link.classList.remove("is-active");
      }
    });
  }

  /**
   * Tabs: Schaltflächen mit data-tab schalten Panels mit passender data-panel.
   */
  function initTabs() {
    var groups = document.querySelectorAll("[data-tabs]");
    groups.forEach(function (group) {
      var buttons = group.querySelectorAll(".tabs__btn");
      var panelHost =
        document.querySelector(group.getAttribute("data-tabs-target")) ||
        group.parentElement;
      buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          var target = btn.getAttribute("data-tab");
          buttons.forEach(function (b) {
            b.classList.toggle("is-active", b === btn);
          });
          if (!panelHost) return;
          var panels = panelHost.querySelectorAll(".tab-panel");
          panels.forEach(function (panel) {
            panel.classList.toggle(
              "is-active",
              panel.getAttribute("data-panel") === target
            );
          });
        });
      });
    });
  }

  /**
   * Admin-Navigation: Panels per data-admin-target wechseln.
   */
  function initAdminNav() {
    var navItems = document.querySelectorAll("[data-admin-target]");
    var panels = document.querySelectorAll("[data-admin-panel]");
    if (!navItems.length || !panels.length) return;

    navItems.forEach(function (item) {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        var target = item.getAttribute("data-admin-target");
        navItems.forEach(function (n) {
          n.classList.toggle("is-active", n === item);
        });
        panels.forEach(function (panel) {
          panel.style.display =
            panel.getAttribute("data-admin-panel") === target ? "block" : "none";
        });
      });
    });
  }

  /**
   * Tabellenfilter / Suche: einfache lokale Filterung anhand sichtbarer Felder.
   */
  function initTableFilters() {
    var forms = document.querySelectorAll("[data-filter]");
    forms.forEach(function (form) {
      var tableSel = form.getAttribute("data-filter");
      var table = document.querySelector(tableSel);
      if (!table) return;

      var fields = form.querySelectorAll("input, select");
      fields.forEach(function (field) {
        field.addEventListener("input", applyFilters);
        field.addEventListener("change", applyFilters);
      });

      function applyFilters() {
        var rows = table.querySelectorAll("tbody tr");
        var search = (form.querySelector("[data-filter-search]") || {}).value;
        var bereich = (form.querySelector("[data-filter-bereich]") || {}).value;
        var typ = (form.querySelector("[data-filter-typ]") || {}).value;
        var status = (form.querySelector("[data-filter-status]") || {}).value;
        var prio = (form.querySelector("[data-filter-prio]") || {}).value;

        rows.forEach(function (row) {
          var hayParts = [];
          row.querySelectorAll("[data-cell]").forEach(function (cell) {
            hayParts.push(cell.textContent.trim().toLowerCase());
          });
          var hay = hayParts.join(" | ");
          var rowBereich = (row.getAttribute("data-bereich") || "").toLowerCase();
          var rowTyp = (row.getAttribute("data-typ") || "").toLowerCase();
          var rowStatus = (row.getAttribute("data-status") || "").toLowerCase();
          var rowPrio = (row.getAttribute("data-prio") || "").toLowerCase();

          var ok = true;
          if (search && hay.indexOf(search.toLowerCase()) === -1) ok = false;
          if (bereich && bereich !== "alle" && rowBereich !== bereich.toLowerCase())
            ok = false;
          if (typ && typ !== "alle" && rowTyp !== typ.toLowerCase()) ok = false;
          if (status && status !== "alle" && rowStatus !== status.toLowerCase())
            ok = false;
          if (prio && prio !== "alle" && rowPrio !== prio.toLowerCase()) ok = false;

          row.style.display = ok ? "" : "none";
        });
      }
    });
  }

  /**
   * Vorgangs-Schlüssel im Fließtext automatisch in Badges umwandeln.
   * Schlüsselformat: 5 Großbuchstaben/Ziffern, Bindestrich, eine oder mehr Ziffern.
   * Nur innerhalb von Elementen mit [data-autolink].
   */
  function autolinkIssueKeys() {
    var hosts = document.querySelectorAll("[data-autolink]");
    if (!hosts.length) return;
    var keyRegex = /\b([A-Z0-9]{5}-\d+)\b/g;

    hosts.forEach(function (host) {
      walk(host);
    });

    function walk(node) {
      var children = Array.from(node.childNodes);
      children.forEach(function (child) {
        if (child.nodeType === Node.TEXT_NODE) {
          if (keyRegex.test(child.nodeValue)) {
            keyRegex.lastIndex = 0;
            var span = document.createElement("span");
            span.innerHTML = child.nodeValue.replace(
              keyRegex,
              function (match) {
                return (
                  '<a class="issue-key" href="vorgang-detail.html" title="Vorgang ' +
                  match +
                  ' öffnen">' +
                  match +
                  "</a>"
                );
              }
            );
            child.parentNode.replaceChild(span, child);
          }
        } else if (
          child.nodeType === Node.ELEMENT_NODE &&
          !child.classList.contains("issue-key") &&
          child.tagName !== "A"
        ) {
          walk(child);
        }
      });
    }
  }

  /**
   * Klick-Handler für Karten/Reihen, die per data-link verlinkt sind.
   */
  function initRowLinks() {
    document.querySelectorAll("[data-link]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        var tag = (e.target.tagName || "").toLowerCase();
        if (tag === "a" || tag === "button" || tag === "input") return;
        var href = el.getAttribute("data-link");
        if (href) window.location.href = href;
      });
    });
  }

  /**
   * Sehr einfaches Mockup-Verhalten: „Kommentar senden" leert das Feld.
   */
  function initCommentMock() {
    document.querySelectorAll("[data-comment-form]").forEach(function (form) {
      var btn = form.querySelector("button");
      var ta = form.querySelector("textarea");
      if (!btn || !ta) return;
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        if (!ta.value.trim()) return;
        ta.value = "";
        btn.textContent = "Gespeichert ✓";
        setTimeout(function () {
          btn.textContent = "Kommentar senden";
        }, 1200);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    highlightActiveNav();
    initTabs();
    initAdminNav();
    initTableFilters();
    autolinkIssueKeys();
    initRowLinks();
    initCommentMock();
  });
})();
