document.addEventListener('DOMContentLoaded', () => {

    // 0. Motore Menu Hamburger
    const hamburger = document.querySelector('.hamburger');
    const nav = document.getElementById('main-nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
            nav.classList.toggle('active');
        });

        // Chiude il menu quando si clicca su un link (utile su mobile)
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.setAttribute('aria-expanded', 'false');
                nav.classList.remove('active');
            });
        });
    }


    // 1. Gestione delle animazioni allo scroll (Motore Intersection Observer)
    const elements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15
    });

    elements.forEach(el => observer.observe(el));


    // 2. Motore Slider Galleria Avanzato (Generazione Dinamica via JSON)
    const track = document.querySelector('.slider-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (track && prevBtn && nextBtn) {

        // Legge il file generato da Python per sapere quante foto ci sono realmente
        fetch('img/gallery-data.json')
            .then(response => {
                if (!response.ok) throw new Error("File di configurazione galleria non trovato");
                return response.json();
            })
            .then(data => {
                const totalImages = data.totalImages;
                if (totalImages > 0) {
                    inizializzaSlider(totalImages);
                } else {
                    document.querySelector('.gallery').style.display = 'none';
                }
            })
            .catch(error => {
                console.error("Attenzione: Impossibile mappare la galleria. Dettaglio:", error);
            });
    }

    function inizializzaSlider(totalImages) {
        // Iniezione controllata delle immagini nel tracciato
        for (let i = 1; i <= totalImages; i++) {
            const img = document.createElement('img');
            img.src = `img/galleria/bitter-${i}.jpg`;
            img.alt = `Foto Galleria ${i}`;
            img.loading = 'lazy';
            track.appendChild(img);
        }

        const imgs = document.querySelectorAll('.slider-track img');
        let currentIndex = 0;

        function getVisibleCards() {
            if (window.innerWidth <= 600) return 1;
            if (window.innerWidth <= 1024) return 2;
            return 4;
        }

        function updateSlider() {
            if (imgs.length === 0) return;
            const imgWidth = imgs[0].getBoundingClientRect().width;
            const gap = 20;
            const amountToMove = currentIndex * (imgWidth + gap);
            track.style.transform = `translateX(-${amountToMove}px)`;
        }

        // Controlli di movimento
        nextBtn.addEventListener('click', () => {
            const visibleCards = getVisibleCards();
            const maxIndex = imgs.length - visibleCards;

            if (currentIndex < maxIndex) {
                currentIndex = Math.min(currentIndex + visibleCards, maxIndex);
            } else {
                currentIndex = 0;
            }
            updateSlider();
        });

        prevBtn.addEventListener('click', () => {
            const visibleCards = getVisibleCards();
            const maxIndex = imgs.length - visibleCards;

            if (currentIndex > 0) {
                currentIndex = Math.max(currentIndex - visibleCards, 0);
            } else {
                currentIndex = maxIndex;
            }
            updateSlider();
        });

        window.addEventListener('resize', () => {
            const maxIndex = imgs.length - getVisibleCards();
            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }
            updateSlider();
        });

        // Primo rendering
        updateSlider();
    }


    // 3. Logica di invio WhatsApp (Senza blocchi di giorni/orari)
    document.getElementById('wa-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const nome = document.getElementById('wa-nome').value;
        const persone = document.getElementById('wa-persone').value;
        const dataInput = document.getElementById('wa-data').value;
        const orario = document.getElementById('wa-orario').value;

        // Costruzione messaggio
        const messaggio = `Ciao, sono ${nome}. Vorrei prenotare un tavolo per ${persone} persone il giorno ${dataInput} alle ore ${orario}.`;
        const url = `https://wa.me/393288870675?text=${encodeURIComponent(messaggio)}`;

        window.open(url, '_blank');
    });

    // Funzione per mostrare il pop-up personalizzato
    function showCustomAlert(title, message) {
        const alertBox = document.getElementById('custom-alert');
        document.getElementById('alert-title').innerText = title;
        document.getElementById('alert-message').innerText = message;
        alertBox.style.display = 'flex';
    }

    // Chiusura pop-up
    document.getElementById('close-alert').addEventListener('click', () => {
        document.getElementById('custom-alert').style.display = 'none';
    });

});