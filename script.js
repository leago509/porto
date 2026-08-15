import collection from "./collection.js";
import gsap from "gsap";
import SplitText from "gsap/SplitText";

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(SplitText);

  const galleryContainer = document.querySelector(".gallery-container");
  const gallery = document.querySelector(".gallery");
  const titleContainer = document.querySelector(".title-container");

  const cards = [];
  const transformstate = [];

  let currenttitle = null;
  let ispreviewactive = false;
  let istransitioning = false;

  const config = {
    imagecount: 25,
    radius: 275,
    sensitivity: 500,
    effectfalloff: 250,
    cardmoveamount: 50,
    lerpfactor: 0.15,
    ismobile: window.innerWidth < 1000,
  };

  const parallaxstate = {
    target: { x: 0, y: 0, z: 0 },
    current: { x: 0, y: 0, z: 0 },
  };

  // Build gallery cards
  for (let i = 0; i < config.imagecount; i++) {
    const angle = (i / config.imagecount) * Math.PI * 2;
    const x = Math.cos(angle) * config.radius;
    const y = Math.sin(angle) * config.radius;
    const cardindex = i % collection.length;

    const card = document.createElement("div");
    card.className = "card";
    card.dataset.index = i;
    card.dataset.title = collection[cardindex].title;

    const img = document.createElement("img");
    img.src = collection[cardindex].img;
    img.alt = collection[cardindex].title;
    card.appendChild(img);

    gsap.set(card, {
      x,
      y,
      rotation: (angle * 180) / Math.PI + 90,
      transformPerspective: 800,
      transformOrigin: "center center",
    });

    gallery.appendChild(card);
    cards.push(card);

    transformstate.push({
      currentrotation: 0,
      targetrotation: 0,
      currentx: 0,
      targetx: 0,
      currenty: 0,
      targety: 0,
      currentscale: 1,
      targetscale: 1,
      angle,
    });

    card.addEventListener("click", (e) => {
      if (!ispreviewactive && !istransitioning) {
        togglepreview(i);
        e.stopPropagation();
      }
    });
  }

  function togglepreview(index) {
    ispreviewactive = true;
    istransitioning = true;

    const angle = transformstate[index].angle;
    const targetposition = (Math.PI * 3) / 2;
    let rotationradian = targetposition - angle;

    if (rotationradian > Math.PI) rotationradian -= Math.PI * 2;
    else if (rotationradian < -Math.PI) rotationradian += Math.PI * 2;

    transformstate.forEach((state) => {
      state.targetrotation = 0;
      state.targetscale = 1;
      state.currentx = state.targetx = 0;
      state.currenty = state.targety = 0;
      state.currentrotation = 0;
      state.currentscale = 1;
    });

    // Hide all other cards, keep ONLY the selected card visible
    cards.forEach((cardEl, i) => {
      if (i === index) {
        gsap.to(cardEl, {
          opacity: 1,
          duration: 0.5,
          x: config.radius * Math.cos(transformstate[i].angle),
          y: config.radius * Math.sin(transformstate[i].angle),
          rotationY: 0,
          scale: 1,
          ease: "power4.out",
        });
      } else {
        gsap.to(cardEl, {
          opacity: 0, // Fades out non-selected cards
          duration: 0.5,
          ease: "power4.out",
        });
      }
    });

    gsap.to(gallery, {
      scale: 5,
      y: 1300,
      rotation: (rotationradian * 180) / Math.PI + 360,
      duration: 2,
      ease: "power4.inOut",
      onComplete: () => (istransitioning = false),
    });

    gsap.to(parallaxstate.target, {
      x: 0,
      y: 0,
      z: 0,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => {
        gsap.set(galleryContainer, {
          rotateX: parallaxstate.target.x,
          rotateY: parallaxstate.target.y,
          rotateZ: parallaxstate.target.z,
          transformOrigin: "center center",
        });
      },
    });

    const titletext = cards[index].dataset.title;
    if (titleContainer) {
      titleContainer.innerHTML = "";
      const p = document.createElement("p");
      p.textContent = titletext;
      titleContainer.appendChild(p);
      currenttitle = p;

      const split = new SplitText(p, {
        type: "words",
        wordsClass: "word",
      });

      gsap.set(split.words, { y: "125%" });
      gsap.to(split.words, {
        y: "0%",
        duration: 0.75,
        delay: 1.25,
        ease: "power4.out",
        stagger: 0.1,
      });
    }
  }

  function resetgallery() {
    if (istransitioning) return;

    istransitioning = true;

    // Bring all cards back to full opacity
    cards.forEach((cardEl) => {
      gsap.to(cardEl, {
        opacity: 1,
        duration: 1,
        ease: "power4.out",
      });
    });

    if (currenttitle) {
      const words = currenttitle.querySelectorAll(".word");
      gsap.to(words, {
        y: "-125%",
        duration: 0.75,
        delay: 0.5,
        ease: "power4.out",
        stagger: 0.1,
        onComplete: () => {
          if (currenttitle) {
            currenttitle.remove();
            currenttitle = null;
          }
        },
      });
    }

    const viewportwidth = window.innerWidth;
    let galleryscale = 1;
    if (viewportwidth < 768) {
      galleryscale = 0.6;
    } else if (viewportwidth < 1200) {
      galleryscale = 0.8;
    }

    gsap.to(gallery, {
      scale: galleryscale,
      y: 0,
      x: 0,
      rotation: 0,
      duration: 2.5,
      ease: "power4.inOut",
      onComplete: () => {
        ispreviewactive = false;
        istransitioning = false;
        Object.assign(parallaxstate.target, { x: 0, y: 0, z: 0 });
        Object.assign(parallaxstate.current, { x: 0, y: 0, z: 0 });
      },
    });
  }

  function handleresize() {
    const viewportwidth = window.innerWidth;
    config.ismobile = viewportwidth < 1000;
    let galleryscale = 1;
    if (viewportwidth < 768) {
      galleryscale = 0.6;
    } else if (viewportwidth < 1200) {
      galleryscale = 0.8;
    }

    gsap.to(gallery, {
      scale: galleryscale,
    });

    if (!ispreviewactive) {
      parallaxstate.target = { x: 0, y: 0, z: 0 };
      parallaxstate.current = { x: 0, y: 0, z: 0 };

      transformstate.forEach((state) => {
        state.targetrotation = 0;
        state.currentrotation = 0;
        state.targetx = 0;
        state.currentx = 0;
        state.targety = 0;
        state.currenty = 0;
        state.targetscale = 1;
        state.currentscale = 1;
      });
    }
  }

  window.addEventListener("resize", handleresize);
  handleresize();

  document.addEventListener("click", () => {
    if (ispreviewactive && !istransitioning) {
      resetgallery();
    }
  });

  document.addEventListener("mousemove", (e) => {
    if (ispreviewactive || istransitioning || config.ismobile) return;

    const centerx = window.innerWidth / 2;
    const centery = window.innerHeight / 2;
    const percentx = (e.clientX - centerx) / centerx;
    const percenty = (e.clientY - centery) / centery;

    parallaxstate.target.x = percenty * 15;
    parallaxstate.target.y = percentx * 15;
    parallaxstate.target.z = (percentx + percenty) * 5;

    cards.forEach((cardEl, index) => {
      const rect = cardEl.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < config.sensitivity && !config.ismobile) {
        const flipfactor = Math.max(0, 1 - distance / config.effectfalloff);
        const angle = transformstate[index].angle;
        const moveamount = config.cardmoveamount * flipfactor;

        transformstate[index].targetrotation = 180 * flipfactor;
        transformstate[index].targetscale = 1 + 0.3 * flipfactor;
        transformstate[index].targetx = moveamount * Math.cos(angle);
        transformstate[index].targety = moveamount * Math.sin(angle);
      } else {
        transformstate[index].targetrotation = 0;
        transformstate[index].targetx = 0;
        transformstate[index].targety = 0;
        transformstate[index].targetscale = 1;
      }
    });
  });

  function animate() {
    if (!ispreviewactive && !istransitioning) {
      parallaxstate.current.x +=
        (parallaxstate.target.x - parallaxstate.current.x) * config.lerpfactor;
      parallaxstate.current.y +=
        (parallaxstate.target.y - parallaxstate.current.y) * config.lerpfactor;
      parallaxstate.current.z +=
        (parallaxstate.target.z - parallaxstate.current.z) * config.lerpfactor;

      gsap.set(galleryContainer, {
        rotateX: parallaxstate.current.x,
        rotateY: parallaxstate.current.y,
        rotateZ: parallaxstate.current.z,
      });

      cards.forEach((cardEl, index) => {
        const state = transformstate[index];

        state.currentrotation +=
          (state.targetrotation - state.currentrotation) * config.lerpfactor;
        state.currentscale +=
          (state.targetscale - state.currentscale) * config.lerpfactor;
        state.currentx +=
          (state.targetx - state.currentx) * config.lerpfactor;
        state.currenty +=
          (state.targety - state.currenty) * config.lerpfactor;

        const angle = state.angle;
        const x = config.radius * Math.cos(angle);
        const y = config.radius * Math.sin(angle);

        gsap.set(cardEl, {
          x: x + state.currentx,
          y: y + state.currenty,
          rotationY: state.currentrotation,
          scale: state.currentscale,
          rotation: (angle * 180) / Math.PI + 90,
          transformPerspective: 1000,
        });
      });
    }
    requestAnimationFrame(animate);
  }

  animate();
});