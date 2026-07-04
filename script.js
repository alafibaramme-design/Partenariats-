/**
 * PARTNER - JavaScript
 * Gestion du menu overlay, scroll fluide, validation formulaire,
 * et animations au scroll
 */

// ============================================
// MENU OVERLAY & NAVIGATION
// ============================================

const menuBtn = document.getElementById('menuBtn');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const navOverlay = document.getElementById('navOverlay');
const navLinks = document.querySelectorAll('.nav-overlay__link');

// Ouvrir le menu
menuBtn.addEventListener('click', () => {
    navOverlay.classList.add('active');
    menuBtn.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// Fermer le menu
const closeMenu = () => {
    navOverlay.classList.remove('active');
    menuBtn.classList.remove('active');
    document.body.style.overflow = '';
};

closeMenuBtn.addEventListener('click', closeMenu);

// Fermer le menu au clic sur un lien
navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Fermer le menu au clic en dehors
navOverlay.addEventListener('click', (e) => {
    if (e.target === navOverlay) {
        closeMenu();
    }
});

// ============================================
// SCROLL FLUIDE (déjà géré par scroll-behavior en CSS)
// mais on peut ajouter du comportement supplémentaire si nécessaire
// ============================================

// Smooth scroll pour les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ============================================
// FORM VALIDATION & SUBMISSION
// ============================================

const contactForm = document.getElementById('contactForm');

// Validation du formulaire
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Récupérer les champs
    const companyName = document.getElementById('company_name').value.trim();
    const contactName = document.getElementById('contact_name').value.trim();
    const email = document.getElementById('email').value.trim();
    const partnershipType = document.getElementById('partnership_type').value.trim();
    const message = document.getElementById('message').value.trim();

    // Validation basique
    if (!companyName || !contactName || !email || !partnershipType || !message) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
    }

    // Validation email (regex simple)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Veuillez entrer une adresse email valide.');
        return;
    }

    // Construire le corps du message pour mailto
    const subject = `Demande de partenariat - ${companyName}`;
    const body = `
Nom de la marque / entreprise : ${companyName}
Nom du contact : ${contactName}
Email : ${email}
Téléphone : ${document.getElementById('phone').value.trim() || 'Non fourni'}
Type de partenariat : ${partnershipType}
Budget estimé : ${document.getElementById('budget').value.trim() || 'Non spécifié'}

Message / Projet :
${message}

---
Message envoyé via le formulaire Partner
`.trim();

    // Encodage pour mailto
    const mailtoLink = `mailto:ulprobuzness@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Ouvrir le client email
    window.location.href = mailtoLink;

    // Alternative : intégration Formspree (décommentez si vous utilisez Formspree)
    // submitFormspree(companyName, contactName, email, partnershipType, message);

    // Réinitialiser le formulaire après envoi (l'utilisateur verra son client email)
    setTimeout(() => {
        contactForm.reset();
        alert('Merci ! Votre demande va être traitée dans les 48h.');
    }, 500);
});

// ============================================
// INTERSECTION OBSERVER - ANIMATIONS AU SCROLL
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            // Optionnel : arrêter d'observer après l'animation
            // observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observer les éléments à animer
const animatedElements = document.querySelectorAll(
    '.format-card, .stat-box, .portfolio-item, .pricing-card, .testimonial'
);

animatedElements.forEach(el => {
    observer.observe(el);
});

// ============================================
// SCROLL EVENT - HEADER BEHAVIOR
// ============================================

let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Ajouter une ombre au header lors du scroll
    if (scrollTop > 50) {
        header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = 'none';
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// ============================================
// ALTERNATIVE : FORMSPREE INTEGRATION
// (Décommentez et utilisez si vous préférez Formspree à mailto)
// ============================================

/*
async function submitFormspree(companyName, contactName, email, partnershipType, message) {
    const phone = document.getElementById('phone').value.trim();
    const budget = document.getElementById('budget').value.trim();

    const formData = new FormData();
    formData.append('company_name', companyName);
    formData.append('contact_name', contactName);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('partnership_type', partnershipType);
    formData.append('budget', budget);
    formData.append('message', message);

    try {
        const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            alert('Merci ! Votre demande a été envoyée avec succès. Vous recevrez une réponse dans les 48h.');
            contactForm.reset();
        } else {
            alert('Une erreur est survenue. Veuillez réessayer.');
        }
    } catch (error) {
        console.error('Erreur lors de l\'envoi du formulaire:', error);
        alert('Une erreur est survenue. Veuillez réessayer.');
    }
}
*/

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Affiche/cache un élément avec animation
 */
function toggleElement(element, show) {
    if (show) {
        element.style.display = '';
        element.offsetHeight; // Trigger reflow
        element.classList.add('fade-in');
    } else {
        element.classList.remove('fade-in');
        setTimeout(() => {
            element.style.display = 'none';
        }, 300);
    }
}

/**
 * Scroll vers un élément
 */
function scrollToElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ============================================
// INIT
// ============================================

console.log('✓ Partner Site - JavaScript loaded');
console.log('✓ Menu navigation actif');
console.log('✓ Form validation actif');
console.log('✓ Animations scroll actives');
