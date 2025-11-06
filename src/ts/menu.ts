import gsap from "gsap";

function initMenu() {
  const toggleMenu = document.querySelector<HTMLElement>("#openNav");
  const nav = document.querySelector<HTMLElement>("header nav");
  const navLinks = nav?.querySelectorAll<HTMLAnchorElement>("a") ?? [];

  // Si on ne trouve pas le bouton ou le nav, on ne fait rien
  if (!toggleMenu || !nav) {
    console.warn("[menu.ts] header__button ou header nav introuvable");
  } else {
    const tl = gsap.timeline({ reversed: true });

    tl.from(nav, {
      duration: 0.4,
      ease: "power3.inOut",
      top: "-100%",
    }).from("header nav li", {
      duration: 0.3,
      opacity: 0,
      y: 20,
      ease: "power3.inOut",
      stagger: 0.05,
    });

    function animateIt() {
      tl.reversed() ? tl.play() : tl.reverse();
      toggleMenu?.classList.toggle("active");
      toggleMenu?.setAttribute(
        "aria-expanded",
        toggleMenu.classList.contains("active") ? "true" : "false"
      );
    }

    const mediaQueryList = window.matchMedia("(min-width: 1024px)");

    // Set things up on load
    if (mediaQueryList.matches) {
      tl.pause(1); // nav visible en desktop
    } else {
      toggleMenu.addEventListener("click", animateIt);
      tl.pause(0); // nav caché en mobile
    }

    function toggleStateOnResize(e: MediaQueryListEvent) {
      console.log("Breakpoint of 1024px passed.");

      if (e.matches) {
        // WIDE SCREEN
        toggleMenu?.removeEventListener("click", animateIt);
        tl.pause(1);
        toggleMenu?.classList.remove("active");
        toggleMenu?.setAttribute("aria-expanded", "false");
      } else {
        // NARROW SCREEN
        toggleMenu?.addEventListener("click", animateIt);
        tl.pause(0).reversed(true);
      }
    }

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        const isExpanded = toggleMenu.getAttribute("aria-expanded") === "true";
        if (window.innerWidth < 1024) {
          animateIt(); // referme le menu
        }
      });
    });

    mediaQueryList.addEventListener("change", toggleStateOnResize);
  }
}
document.addEventListener("astro:page-load", initMenu);
