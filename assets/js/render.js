/* ════════════════════════════════════════════════════════════════════
   render.js
   --------------------------------------------------------------------
   Legge i dati definiti nei file data/*.js (window.PAPERS, window.TALKS, ...)
   e li inserisce nelle pagine. NON serve modificare questo file per
   aggiornare i contenuti: basta modificare i file in data/.

   Riproduce esattamente la struttura HTML originale (stesse classi
   Mobirise) così lo stile resta identico.
   ════════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* --- piccolo helper: costruisce la lista di link "A, B, C." ------- */
  function renderLinks(links) {
    if (!links || !links.length) return "";
    var parts = links.map(function (l) {
      return '<a href="' + l.url + '" class="text-primary" target="_blank">' + l.label + "</a>";
    });
    return parts.join(", ") + ".";
  }

  /* --- una voce bibliografica (preprint o paper) -------------------- */
  function paperItem(item) {
    var journal = item.journal
      ? "<em>" + item.journal + "</em><br>"
      : "";
    return '' +
      '<div class="row justify-content-left item features-without-image mt-0 mb-5 active">' +
        '<div class="col-12 col-md-12 col-lg-3">' +
          '<h5 class="mbr-card-title mbr-fonts-style mt-0 mb-3 display-7">' +
            "<strong>" + item.year + " [" + item.id + "]</strong>" +
          "</h5>" +
        "</div>" +
        '<div class="col-md-12 col-lg item-wrapper">' +
          '<p class="mbr-text mbr-fonts-style mt-0 mb-0 display-7">' +
            item.authors + "<br>" +
            "<strong>" + item.title + "</strong><br>" +
            journal +
            renderLinks(item.links) +
          "</p>" +
        "</div>" +
      "</div>";
  }

  /* --- renderizza preprint e papers su research.html ---------------- */
  function renderPapers() {
    var pre = document.getElementById("preprints-list");
    if (pre && window.PREPRINTS) {
      pre.innerHTML = window.PREPRINTS.map(paperItem).join("");
    }
    var pap = document.getElementById("papers-list");
    if (pap && window.PAPERS) {
      pap.innerHTML = window.PAPERS.map(paperItem).join("");
    }
  }

  /* --- renderizza i talk su activities.html ------------------------- */
  /* Mostra i primi TALKS_VISIBLE interventi; i più vecchi compaiono     */
  /* solo cliccando il pulsante "Show earlier talks".                    */
  var TALKS_VISIBLE = 7;

  function talkItem(t) {
    var note = t.note ? ", " + t.note : "";
    return '<ul><li>' +
      '<strong style="font-size: 1.4rem;">' + t.year + ", " + t.event + "</strong> " +
      t.venue + note + "." +
      "</li></ul>";
  }

  function renderTalks() {
    var el = document.getElementById("talks-list");
    if (!el || !window.TALKS) return;

    var visible = window.TALKS.slice(0, TALKS_VISIBLE);
    var hidden = window.TALKS.slice(TALKS_VISIBLE);

    var html = '<div class="talks-visible">' +
      visible.map(talkItem).join("\n") + "</div>";

    if (hidden.length > 0) {
      html += '<div class="talks-hidden" id="talks-hidden" hidden>' +
        hidden.map(talkItem).join("\n") + "</div>" +
        '<div class="talks-toggle-wrap">' +
          '<button type="button" id="talks-toggle-btn" class="talks-toggle-btn"' +
          ' aria-expanded="false" aria-controls="talks-hidden">' +
            "Show " + hidden.length + " earlier talks \u25BE" +
          "</button>" +
        "</div>";
    }

    el.innerHTML = html;

    var btn = document.getElementById("talks-toggle-btn");
    if (btn) {
      btn.addEventListener("click", function () {
        var box = document.getElementById("talks-hidden");
        var isHidden = box.hasAttribute("hidden");
        if (isHidden) {
          box.removeAttribute("hidden");
          btn.setAttribute("aria-expanded", "true");
          btn.innerHTML = "Hide earlier talks \u25B4";
        } else {
          box.setAttribute("hidden", "");
          btn.setAttribute("aria-expanded", "false");
          btn.innerHTML = "Show " + hidden.length + " earlier talks \u25BE";
        }
      });
    }
  }

  /* --- renderizza visiting su activities.html ----------------------- */
  function renderVisiting() {
    var el = document.getElementById("visiting-list");
    if (!el || !window.VISITING) return;

    var items = window.VISITING.map(function (v) {
      var collab = v.collaborator
        ? ", collaboration with " +
          '<a href="' + v.collaboratorUrl + '" class="text-black" target="_blank">' +
          v.collaborator + "</a>"
        : "";
      return "<li><strong>" + v.institution + ", " + v.year + collab +
        ", </strong>" + v.description + "</li>";
    });

    el.innerHTML = "<ul>" + items.join("") + "</ul>";
  }

  /* --- renderizza organization su activities.html ------------------- */
  function renderOrganization() {
    var el = document.getElementById("organization-list");
    if (!el || !window.ORGANIZATION) return;

    var items = window.ORGANIZATION.map(function (o) {
      var ev = o.eventUrl
        ? '<a href="' + o.eventUrl + '" class="text-black" target="_blank">"' + o.event + '"</a>'
        : '"' + o.event + '"';
      return "<li><strong>" + o.role + " " + ev + ",</strong> " +
        o.venue + ", " + o.date + ".</li>";
    });

    el.innerHTML = "<ul>" + items.join("") + "</ul>";
  }

  /* --- renderizza teaching su teaching.html ------------------------- */
  function renderTeaching() {
    var el = document.getElementById("teaching-list");
    if (!el || !window.TEACHING) return;

    var rows = window.TEACHING.map(function (t) {
      return '' +
        '<div class="row justify-content-center item features-without-image mb-5">' +
          '<div class="col-12 col-lg-2">' +
            '<h5 class="mbr-card-title mbr-fonts-style mt-0 mb-3 display-7">' + t.period + "</h5>" +
          "</div>" +
          '<div class="col-12 col-lg">' +
            '<h6 class="mbr-card-subtitle mbr-fonts-style mt-0 mb-3 display-7"><strong>' +
              t.course + "</strong></h6>" +
          "</div>" +
          '<div class="col-md-12 col-lg-7 item-wrapper">' +
            '<p class="mbr-text mbr-fonts-style mt-0 mb-0 display-7">' +
              t.role + "<br><em>" + t.program + "</em></p>" +
          "</div>" +
        "</div>";
    });

    el.innerHTML = rows.join("");
  }

  /* --- avvio -------------------------------------------------------- */
  function init() {
    renderPapers();
    renderTalks();
    renderVisiting();
    renderOrganization();
    renderTeaching();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
