document.addEventListener('DOMContentLoaded', () => {

    // 1. Resaltar enlace activo en el menú de navegación
    const links = document.querySelectorAll('.navega-link');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    links.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPath || (href === 'index.html' && currentPath === '')) {
            link.classList.add('active');
        }
    });

    // 2. Alternar menú hamburguesa
    const toggleButton = document.querySelector('.navega-toggle');
    const navContainer = document.querySelector('.navega-container');
    if (toggleButton && navContainer) {
        if (window.innerWidth > 768) {
            navContainer.classList.add('active');
        }
        toggleButton.addEventListener('click', () => {
            navContainer.classList.toggle('active');
            toggleButton.classList.toggle('active');
        });
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                navContainer.classList.add('active');
            } else {
                navContainer.classList.remove('active');
                toggleButton.classList.remove('active');
            }
        });
    }

    // 3. Submenús en móvil (has-submenu)
    document.querySelectorAll('.has-submenu').forEach(item => {
        item.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                this.classList.toggle('open');
            }
        });
    });

    // 4. Filtros y animación para las secciones de equipos
    // CORRECCIÓN: animateEquipo ya no depende del viewport, activa todas las tarjetas visibles
    const animateEquipo = (miembros) => {
        miembros.forEach((miembro, index) => {
            if (miembro.style.display !== 'none') {
                setTimeout(() => {
                    miembro.classList.add('visible');
                }, index * 150);
            }
        });
    };

    const filtrarEquipo = (container, categoria) => {
        const miembros = container.querySelectorAll('.equipo-miembro');
        miembros.forEach(miembro => {
            const miembroCategoria = miembro.getAttribute('data-categoria');
            if (categoria === 'todos' || miembroCategoria === categoria) {
                miembro.style.display = 'block';
                miembro.classList.remove('visible');
            } else {
                miembro.style.display = 'none';
                miembro.classList.remove('visible');
            }
        });
        animateEquipo(miembros);
    };

    // Configurar filtros para Nosotros
    const nosotrosContainer = document.querySelector('.nosotros-equipo');
    if (nosotrosContainer) {
        const filtroBotones = nosotrosContainer.querySelectorAll('.equipo-filtros .filtro-boton');
        filtroBotones.forEach(boton => {
            boton.addEventListener('click', () => {
                filtroBotones.forEach(btn => btn.classList.remove('active'));
                boton.classList.add('active');
                const categoria = boton.getAttribute('data-categoria');
                filtrarEquipo(nosotrosContainer, categoria);
            });
        });
        filtrarEquipo(nosotrosContainer, 'todos');
    }

    // Configurar filtros para Servicios
    const secciones = [
        { id: 'ingenieria', clase: 'equipo-filtros-ingenieria' },
        { id: 'abogados', clase: 'equipo-filtros-abogados' },
        { id: 'inteligencia-artificial', clase: 'equipo-filtros-ia' }
    ];

    secciones.forEach(seccion => {
        const container = document.getElementById(seccion.id);
        if (container) {
            const filtroBotones = container.querySelectorAll(`.${seccion.clase} .filtro-boton`);
            filtroBotones.forEach(boton => {
                boton.addEventListener('click', () => {
                    filtroBotones.forEach(btn => btn.classList.remove('active'));
                    boton.classList.add('active');
                    const categoria = boton.getAttribute('data-categoria');
                    filtrarEquipo(container, categoria);
                });
            });
            filtrarEquipo(container, 'todos');
        }
    });

    // 5. Modal para información adicional
    const modal = document.getElementById('equipo-modal');
    const modalNombre = document.getElementById('modal-nombre');
    const modalCargo = document.getElementById('modal-cargo');
    const modalDescripcion = document.getElementById('modal-descripcion');
    const modalEnlace = document.getElementById('modal-enlace');
    const closeModal = document.querySelector('.modal-close');

    if (modal && modalNombre && modalCargo && modalDescripcion && closeModal) {
        const equipoMiembros = document.querySelectorAll('.equipo-miembro');
        equipoMiembros.forEach(miembro => {
            miembro.addEventListener('click', () => {
                const nombre = miembro.querySelector('h4').textContent;
                const cargo = miembro.querySelector('.cargo').textContent;
                const descripcion = miembro.querySelector('p:not(.cargo)').textContent;
                modalNombre.textContent = nombre;
                modalCargo.textContent = cargo;
                modalDescripcion.textContent = descripcion;
                modalEnlace.href = '#';
                modal.style.display = 'flex';
            });
        });

        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // 6. Validación del formulario de contacto
    const contactoForm = document.getElementById('contacto-form');
    const formMensaje = document.getElementById('form-mensaje');
    if (contactoForm && formMensaje) {
        contactoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.getElementById('nombre').value.trim();
            const correo = document.getElementById('correo').value.trim();
            const mensaje = document.getElementById('mensaje').value.trim();

            if (nombre === '' || correo === '' || mensaje === '') {
                formMensaje.textContent = 'Por favor, complete todos los campos obligatorios.';
                formMensaje.classList.remove('exito');
                formMensaje.classList.add('error');
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
                formMensaje.textContent = 'Por favor, ingrese un correo electrónico válido.';
                formMensaje.classList.remove('exito');
                formMensaje.classList.add('error');
                return;
            }

            formMensaje.textContent = '¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.';
            formMensaje.classList.remove('error');
            formMensaje.classList.add('exito');
            contactoForm.reset();
        });
    }

    // 7. Google Maps
    const mapContainer = document.getElementById('map');
    if (mapContainer && typeof google !== 'undefined') {
        const oficina = { lat: -12.0553057, lng: -77.0375333 };
        const map = new google.maps.Map(mapContainer, {
            center: oficina,
            zoom: 15,
            mapId: 'DEMO_MAP_ID'
        });

        const marker = new google.maps.marker.AdvancedMarkerElement({
            map: map,
            position: oficina,
            title: 'RICALDI HOLDING GROUP',
            content: new google.maps.marker.PinElement({
                glyph: '',
                background: '#00aaff',
                borderColor: '#333',
                glyphColor: 'white'
            }).element
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="font-family: Arial, sans-serif; padding: 10px;">
                    <h3>RICALDI HOLDING GROUP</h3>
                    <p>Av. Principal 123, Lima, Perú</p>
                    <p><strong>Teléfono:</strong> +51 959 682 334</p>
                    <p><strong>Correo:</strong> contacto@ricaldiholdinggroup.com</p>
                </div>
            `
        });

        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });

        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer({
            map: map,
            suppressMarkers: true
        });

        const calcularRutaBtn = document.getElementById('calcular-ruta');
        const origenInput = document.getElementById('origen');
        if (calcularRutaBtn && origenInput) {
            calcularRutaBtn.addEventListener('click', () => {
                const origen = origenInput.value.trim();
                if (origen === '') {
                    alert('Por favor, ingrese una ubicación de origen.');
                    return;
                }
                directionsService.route({
                    origin: origen,
                    destination: 'Av. Principal 123, Lima, Perú',
                    travelMode: google.maps.TravelMode.DRIVING
                }, (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK) {
                        directionsRenderer.setDirections(result);
                    } else {
                        alert('No se pudo calcular la ruta: ' + status);
                    }
                });
            });
        }
    }

    // 8. Carrusel de servicios
    const carruselTrack = document.querySelector('.carrusel-track');
    const carruselBtns = document.querySelectorAll('.carrusel-btn');
    const carruselDots = document.querySelectorAll('.dot');

    if (carruselTrack && carruselDots.length > 0) {
        let currentSlide = 0;
        const slideWidth = 320;

        function updateCarousel() {
            carruselTrack.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
            carruselDots.forEach(dot => dot.classList.remove('active'));
            if (carruselDots[currentSlide]) carruselDots[currentSlide].classList.add('active');
        }

        carruselBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('prev')) {
                    currentSlide = (currentSlide > 0) ? currentSlide - 1 : carruselDots.length - 1;
                } else {
                    currentSlide = (currentSlide < carruselDots.length - 1) ? currentSlide + 1 : 0;
                }
                updateCarousel();
            });
        });

        carruselDots.forEach(dot => {
            dot.addEventListener('click', () => {
                currentSlide = parseInt(dot.dataset.slide);
                updateCarousel();
            });
        });
    }

    // 9. Animaciones al hacer scroll (IntersectionObserver)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.servicios-destacados, .sobre-nosotros, .contacto-rapido').forEach(section => {
        observer.observe(section);
    });

});
