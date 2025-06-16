// Script pour le site vitrine MZC - Version améliorée

document.addEventListener('DOMContentLoaded', function() {
    // Navigation mobile
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.setAttribute('aria-expanded', nav.classList.contains('active'));
        });
    }
    
    // Gestion des liens actifs dans la navigation
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    function setActiveLink() {
        let scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', setActiveLink);
    setActiveLink();
    
    // Animation au défilement
    const fadeElements = document.querySelectorAll('.fade-in');
    
    function checkFade() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('active');
            }
        });
    }
    
    // Vérifier les éléments visibles au chargement
    checkFade();
    
    // Vérifier les éléments visibles au défilement
    window.addEventListener('scroll', checkFade);
    
    // Header réduit au défilement
    const header = document.querySelector('header');
    
    function checkScroll() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', checkScroll);
    
    // Bouton retour en haut
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Smooth scroll pour les ancres avec offset pour le header fixe
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Fermer le menu mobile si ouvert
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });
    
    // Gestion des FAQ
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Fermer toutes les autres réponses
            faqQuestions.forEach(q => {
                if (q !== this) {
                    q.setAttribute('aria-expanded', 'false');
                    q.nextElementSibling.style.maxHeight = null;
                    q.querySelector('.faq-toggle i').className = 'fas fa-chevron-down';
                }
            });
            
            // Basculer l'état actuel
            this.setAttribute('aria-expanded', !isExpanded);
            
            if (!isExpanded) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                this.querySelector('.faq-toggle i').className = 'fas fa-chevron-up';
            } else {
                answer.style.maxHeight = null;
                this.querySelector('.faq-toggle i').className = 'fas fa-chevron-down';
            }
        });
    });
    
    // Validation du formulaire de contact
    const contactForm = document.querySelector('#contact-form');
    
    if (contactForm) {
        // Fonction de validation d'email
        function isValidEmail(email) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }
        
        // Fonction de validation de téléphone
        function isValidPhone(phone) {
            const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
            return re.test(String(phone));
        }
        
        // Validation en temps réel
        const formInputs = contactForm.querySelectorAll('input, textarea, select');
        
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });
            
            input.addEventListener('input', function() {
                if (this.parentElement.classList.contains('error')) {
                    validateInput(this);
                }
            });
        });
        
        function validateInput(input) {
            const formGroup = input.parentElement;
            const errorMessage = formGroup.querySelector('.error-message');
            
            if (input.value.trim() === '' && input.hasAttribute('required')) {
                formGroup.classList.add('error');
                if (errorMessage) {
                    errorMessage.textContent = 'Ce champ est requis';
                }
                return false;
            } else if (input.type === 'email' && !isValidEmail(input.value) && input.value.trim() !== '') {
                formGroup.classList.add('error');
                if (errorMessage) {
                    errorMessage.textContent = 'Veuillez entrer une adresse email valide';
                }
                return false;
            } else if (input.id === 'phone' && !isValidPhone(input.value) && input.value.trim() !== '') {
                formGroup.classList.add('error');
                if (errorMessage) {
                    errorMessage.textContent = 'Veuillez entrer un numéro de téléphone valide';
                }
                return false;
            } else {
                formGroup.classList.remove('error');
                return true;
            }
        }
        
        // Soumission du formulaire
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            
            // Valider tous les champs
            formInputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });
            
            // Vérifier la case à cocher des conditions
            const termsCheckbox = document.querySelector('#terms');
            if (termsCheckbox && !termsCheckbox.checked) {
                const formGroup = termsCheckbox.parentElement;
                formGroup.classList.add('error');
                const errorMessage = formGroup.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.textContent = 'Vous devez accepter les conditions';
                }
                isValid = false;
            }
            
            if (isValid) {
                // Simuler l'envoi du formulaire
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
                
                // Simuler un délai de traitement
                setTimeout(() => {
                    // Supprimer les anciens messages
                    const oldMessages = contactForm.querySelectorAll('.form-message');
                    oldMessages.forEach(msg => msg.remove());
                    
                    // Créer le message de succès
                    const formMessage = document.createElement('div');
                    formMessage.className = 'form-message success';
                    formMessage.innerHTML = '<i class="fas fa-check-circle"></i> Votre message a été envoyé avec succès. Nous vous contacterons bientôt.';
                    
                    contactForm.reset();
                    contactForm.appendChild(formMessage);
                    
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    
                    // Faire disparaître le message après 5 secondes
                    setTimeout(() => {
                        formMessage.style.opacity = '0';
                        setTimeout(() => {
                            formMessage.remove();
                        }, 300);
                    }, 5000);
                }, 1500);
            }
            // Gestion des cookies
            const cookieConsent = document.querySelector('.cookie-consent');
            const acceptCookieBtn = document.querySelector('.btn-cookie-accept');
            const declineCookieBtn = document.querySelector('.btn-cookie-decline');
            
            // Vérifier si l'utilisateur a déjà fait un choix
            const cookieChoice = localStorage.getItem('cookieChoice');
            
            if (!cookieChoice) {
                // Afficher la bannière après un court délai
                setTimeout(() => {
                    cookieConsent.classList.add('active');
                }, 1000);
            }
            
            if (acceptCookieBtn) {
                acceptCookieBtn.addEventListener('click', function() {
                    localStorage.setItem('cookieChoice', 'accepted');
                    cookieConsent.classList.remove('active');
                    
                    // Ici, vous pourriez initialiser des scripts d'analyse ou autres cookies
                    console.log('Cookies acceptés');
                });
            }
            
            if (declineCookieBtn) {
                declineCookieBtn.addEventListener('click', function() {
                    localStorage.setItem('cookieChoice', 'declined');
                    cookieConsent.classList.remove('active');
                    console.log('Cookies refusés');
                });
            }
            
            // Animation des badges de confiance
            const trustBadges = document.querySelectorAll('.trust-badge');
            let delay = 0;
            
            trustBadges.forEach(badge => {
                setTimeout(() => {
                    badge.classList.add('active');
                }, delay);
                delay += 200;
            });
            
            // Amélioration de l'accessibilité
            const focusableElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
            
            focusableElements.forEach(element => {
                element.addEventListener('focus', function() {
                    this.classList.add('focus-visible');
                });
                
                element.addEventListener('blur', function() {
                    this.classList.remove('focus-visible');
                });
            });
            
            // Préchargement des images pour une meilleure performance
            function preloadImages() {
                const images = document.querySelectorAll('img[loading="lazy"]');
                if ('IntersectionObserver' in window) {
                    const imageObserver = new IntersectionObserver((entries, observer) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                const image = entry.target;
                                image.src = image.src; // Force le chargement
                                observer.unobserve(image);
                            }
                        });
                    });
                    
                    images.forEach(image => {
                        imageObserver.observe(image);
                    });
                }
            }
            
            // Appeler la fonction de préchargement
            preloadImages();
        });
    }
});
