// Language switch: English by default, ?lang=zh or the stored choice selects Chinese.
(function () {
  const root = document.documentElement;
  const buttons = document.querySelectorAll("[data-set-lang]");

  function readStored() {
    try {
      return localStorage.getItem("lang");
    } catch (error) {
      return null;
    }
  }

  function store(lang) {
    try {
      localStorage.setItem("lang", lang);
    } catch (error) {
      // Private windows can block storage; the switch still works for this page view.
    }
  }

  function setLang(lang) {
    root.lang = lang === "zh" ? "zh-CN" : "en";
    document.title = lang === "zh" ? "沙之洲" : "Zhizhou Sha";
    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.setLang === lang));
    });
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      setLang(button.dataset.setLang);
      store(button.dataset.setLang);
    });
  });

  const requested = new URLSearchParams(window.location.search).get("lang");
  setLang(requested === "zh" || requested === "en" ? requested : readStored() || "en");
})();

// Page outline: built from the section headings, highlights the section being read.
(function () {
  const list = document.querySelector(".page-toc-list");
  const toc = document.querySelector(".page-toc");
  if (!list || !toc) return;

  const headings = document.querySelectorAll(toc.dataset.headingSelector || "main h2");
  if (headings.length < 2) {
    toc.style.display = "none";
    return;
  }

  const links = new Map();
  headings.forEach((heading) => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = "#" + heading.id;
    link.innerHTML = heading.innerHTML;
    item.appendChild(link);
    list.appendChild(item);
    links.set(heading, link);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => link.classList.remove("is-active"));
        links.get(entry.target).classList.add("is-active");
      });
    },
    { rootMargin: "-20% 0px -70% 0px" }
  );
  headings.forEach((heading) => observer.observe(heading));
})();
