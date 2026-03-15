const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const track = carousel.querySelector('.preview-track');
  const slides = carousel.querySelectorAll('.preview-slide');
  const dots = carousel.querySelectorAll('.preview-dot');
  const prevBtn = carousel.querySelector('[data-prev]');
  const nextBtn = carousel.querySelector('[data-next]');
  let index = 0;

  function update() {
    if (track) {
      track.style.transform = `translateX(-${index * 100}%)`;
    }
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      index = (index - 1 + slides.length) % slides.length;
      update();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      index = (index + 1) % slides.length;
      update();
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      index = i;
      update();
    });
  });

  update();
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

/* MENU ATIVO - HORIZONTAL */
const topLinks = [...document.querySelectorAll('.top-nav a')];
const topSections = [...new Set(
  topLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean)
)];

function clearTopNavActive() {
  topLinks.forEach((link) => link.classList.remove('active'));
}

const topObserver = new IntersectionObserver((entries) => {
  if (window.scrollY < 200) {
    clearTopNavActive();
    return;
  }

  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = `#${entry.target.id}`;
      topLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === id);
      });
    }
  });
}, {
  rootMargin: '-20% 0px -60% 0px',
  threshold: 0.01
});

topSections.forEach((section) => topObserver.observe(section));

window.addEventListener('load', clearTopNavActive);
window.addEventListener('scroll', () => {
  if (window.scrollY < 200) {
    clearTopNavActive();
  }
});

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