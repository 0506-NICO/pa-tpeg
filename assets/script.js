// Think Plan Execute Global Inc — shared behavior

document.addEventListener("DOMContentLoaded", () => {
  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => nav.classList.remove("open"))
    );
  }

  // Blueprint diagram: cycle the active node to suggest a plan being traced
  const nodes = document.querySelectorAll(".blueprint .bp-node");
  if (nodes.length) {
    let i = 0;
    setInterval(() => {
      nodes.forEach((n) => n.classList.remove("active"));
      nodes[i % nodes.length].classList.add("active");
      i++;
    }, 1400);
  }

  // Donate page — Zeffy (primary, zero platform fees) with Stripe as backup.
  //
  // ZEFFY SETUP (do this once she's verified on zeffy.com):
  //   1. Build the donation form in her Zeffy dashboard.
  //   2. Dashboard → Campaigns → her form → Edit → "Share my form" → Iframe embed.
  //   3. Paste that embed URL below as ZEFFY_FORM_URL.
  //   4. (Optional) Also paste the plain hosted-page link as ZEFFY_HOSTED_URL —
  //      used as a "open in new tab" fallback button above the iframe.
  // Leave both blank and the donate page will keep showing the "not connected yet" notice.
  const ZEFFY_FORM_URL = ""; // leave blank for now — the embed URL is different from the page link above
const ZEFFY_HOSTED_URL = "https://www.zeffy.com/en-US/donation-form/donate-to-change-lives-22642";

  const zeffyStatus = document.getElementById("zeffy-status");
  const zeffyEmbedContainer = document.getElementById("zeffy-embed-container");
  const zeffyIframe = document.getElementById("zeffy-iframe");
  const zeffyHostedLink = document.getElementById("zeffy-hosted-link");

  if (zeffyStatus) {
    if (ZEFFY_FORM_URL) {
      zeffyIframe.setAttribute("src", ZEFFY_FORM_URL);
      zeffyEmbedContainer.style.display = "block";
      zeffyStatus.classList.remove("show");
    } else if (ZEFFY_HOSTED_URL) {
      zeffyHostedLink.setAttribute("href", ZEFFY_HOSTED_URL);
      zeffyHostedLink.style.display = "inline-flex";
      zeffyStatus.classList.remove("show");
    }
    // If neither is set, the "not connected yet" notice already in the HTML stays visible.
  }

  // Donation buttons — Stripe Payment Links (backup option).
  // Fill in each real Payment Link URL from your Stripe Dashboard
  // (Payment Links → New) then this whole block just works, no code changes needed.
  const STRIPE_PAYMENT_LINKS = {
    "tier-25": "", // e.g. "https://buy.stripe.com/xxxxxxxxxxxx"
    "tier-75": "",
    "tier-250": "",
    "custom": "", // create this one with "let customer choose amount" enabled in Stripe
  };

  document.querySelectorAll("[data-stripe-link]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const key = btn.dataset.stripeLink;
      const url = STRIPE_PAYMENT_LINKS[key];
      if (!url) {
        e.preventDefault();
        alert(
          "This donation link isn't connected yet. Add the Stripe Payment Link URL for '" +
            key +
            "' in assets/script.js."
        );
        return;
      }
      btn.setAttribute("href", url);
    });
  });

  // Contact form — mailto fallback (no backend on this quick build)
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Honeypot: real visitors never fill this hidden field — bots often do.
      const hp = document.getElementById("hp-field");
      if (hp && hp.value.trim() !== "") return;

      const name = document.getElementById("c-name").value.trim();
      const email = document.getElementById("c-email").value.trim();
      const message = document.getElementById("c-message").value.trim();
      const status = document.getElementById("contact-status");

      if (!name || !email || !message) {
        status.textContent = "Fill in every field before sending.";
        status.classList.add("show", "err");
        return;
      }

      const subject = encodeURIComponent("Website contact — " + name);
      const body = encodeURIComponent(message + "\n\n— " + name + " (" + email + ")");
      window.location.href = `mailto:info@thinkplanexecuteglobal.org?subject=${subject}&body=${body}`;

      status.textContent = "Opening your email app to send this message…";
      status.classList.remove("err");
      status.classList.add("show", "ok");
    });
  }

  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
