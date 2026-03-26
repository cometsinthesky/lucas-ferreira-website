const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const track = carousel.querySelector('.preview-track');
  const slides = carousel.querySelectorAll('.preview-slide, .preview-slide-fit');
  const dots = carousel.querySelectorAll('.preview-dot');
  const gallery = carousel.querySelector('.gallery-preview');
  let index = 0;

  function update() {
    if (track) {
      track.style.transform = `translateX(-${index * 100}%)`;
    }
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  }

  function goPrev() {
    index = (index - 1 + slides.length) % slides.length;
    update();
  }

  function goNext() {
    index = (index + 1) % slides.length;
    update();
  }

  if (gallery && slides.length > 1) {
    const prevEdge = document.createElement('button');
    prevEdge.type = 'button';
    prevEdge.className = 'preview-edge preview-edge-prev';
    prevEdge.setAttribute('aria-label', 'Imagem anterior');

    const nextEdge = document.createElement('button');
    nextEdge.type = 'button';
    nextEdge.className = 'preview-edge preview-edge-next';
    nextEdge.setAttribute('aria-label', 'Próxima imagem');

    prevEdge.addEventListener('click', goPrev);
    nextEdge.addEventListener('click', goNext);

    gallery.append(prevEdge, nextEdge);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      index = i;
      update();
    });
  });

  update();
});

const lightbox = document.createElement('div');
lightbox.className = 'image-lightbox';
lightbox.innerHTML = `
  <div class="image-lightbox__inner">
    <img class="image-lightbox__image" alt="Preview ampliado da imagem">
    <div class="image-lightbox__caption"></div>
  </div>
`;
document.body.appendChild(lightbox);

const lightboxImage = lightbox.querySelector('.image-lightbox__image');
const lightboxCaption = lightbox.querySelector('.image-lightbox__caption');

function closeLightbox() {
  lightbox.classList.remove('is-open');
  document.body.classList.remove('lightbox-open');
}

function openLightbox(src, alt) {
  lightboxImage.src = src;
  lightboxImage.alt = alt || 'Imagem ampliada';
  lightboxCaption.textContent = alt || '';
  lightbox.classList.add('is-open');
  document.body.classList.add('lightbox-open');
}

document.querySelectorAll('[data-lightbox]').forEach((img) => {
  img.addEventListener('click', () => {
    if (lightbox.classList.contains('is-open') && lightboxImage.src === img.src) {
      closeLightbox();
      return;
    }
    openLightbox(img.src, img.alt);
  });
});

lightbox.addEventListener('click', closeLightbox);
lightboxImage.addEventListener('click', closeLightbox);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
});

/* MENU ATIVO - LATERAL */
const sideLinks = [...document.querySelectorAll('.side-nav a')];
const sideSections = [...new Set(
  sideLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean)
)];

const sideObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = `#${entry.target.id}`;
      sideLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === id);
      });
    }
  });
}, {
  rootMargin: '-20% 0px -60% 0px',
  threshold: 0.01
});

sideSections.forEach((section) => sideObserver.observe(section));

/* TOPBAR APARECE APENAS NA BORDA SUPERIOR */
const topbar = document.querySelector('.topbar');

if (topbar) {
  const hoverZone = document.createElement('div');
  hoverZone.className = 'topbar-hover-zone';
  document.body.appendChild(hoverZone);

  let hideTimer = null;

  function showTopbar() {
    clearTimeout(hideTimer);
    topbar.classList.add('is-revealed');
  }

  function hideTopbar() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      if (window.innerWidth > 820) {
        topbar.classList.remove('is-revealed');
      }
    }, 120);
  }

  if (window.innerWidth > 820) {
    topbar.classList.remove('is-revealed');
  }

  hoverZone.addEventListener('mouseenter', showTopbar);
  topbar.addEventListener('mouseenter', showTopbar);

  hoverZone.addEventListener('mouseleave', hideTopbar);
  topbar.addEventListener('mouseleave', hideTopbar);

  window.addEventListener('resize', () => {
    clearTimeout(hideTimer);
    if (window.innerWidth <= 820) {
      topbar.classList.add('is-revealed');
    } else {
      topbar.classList.remove('is-revealed');
    }
  });
}

const EMAILJS_SERVICE_ID = 'service_w7iqsyt';
const EMAILJS_REPLY_TEMPLATE_ID = 'resposta-email';
const EMAILJS_CONTACT_TEMPLATE_ID = 'contato';
const EMAILJS_PUBLIC_KEY = '97zWXKY1NC04EBPSw';

window.addEventListener('DOMContentLoaded', () => {
  const emailStatus = document.getElementById('emailStatus');
  const emailForm = document.getElementById('emailForm');

  if (!emailForm || !window.emailjs) return;

  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

  emailForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = emailForm.querySelector('button[type="submit"]');
    const userName = document.getElementById('user_name').value.trim();
    const userEmail = document.getElementById('user_email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    const commonParams = {
      userName: userName,
      userEmail: userEmail,
      subject: subject,
      message: message
    };

    const contactParams = {
      ...commonParams,
      to_email: 'lucasferreiraunb@gmail.com',
      reply_to: userEmail
    };

    const replyParams = {
      ...commonParams,
      to_email: userEmail,
      reply_to: 'lucasferreiraunb@gmail.com'
    };

    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';

    if (emailStatus) {
      emailStatus.style.display = 'none';
      emailStatus.textContent = '';
    }

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_CONTACT_TEMPLATE_ID,
        contactParams
      );

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_REPLY_TEMPLATE_ID,
        replyParams
      );

      if (emailStatus) {
        emailStatus.style.display = 'block';
        emailStatus.textContent = 'Mensagem enviada com sucesso.';
        emailStatus.className = 'note success';
      }

      emailForm.reset();
    } catch (error) {
      console.error('EmailJS error:', error);

      if (emailStatus) {
        emailStatus.style.display = 'block';
        emailStatus.textContent = 'Erro ao enviar. Verifique a configuração dos templates no EmailJS.';
        emailStatus.className = 'note';
      }
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Enviar';
    }
  });
});