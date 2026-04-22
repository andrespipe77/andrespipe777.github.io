// Loader
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 1500);
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Scroll reveal
const revealElements = document.querySelectorAll('.servicio-card, .barbero-card, .stat-item, .galeria-item, .info-item');

const revealOnScroll = () => {
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Initial check

// Reservas System
const reservaForm = document.getElementById('reservaForm');
const reservasList = document.getElementById('reservasList');
const misReservasSection = document.getElementById('misReservas');

// Cargar reservas existentes
let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
actualizarListaReservas();

// Set min date to today
const fechaInput = document.getElementById('fecha');
const today = new Date().toISOString().split('T')[0];
fechaInput.setAttribute('min', today);

reservaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const reserva = {
        id: Date.now(),
        nombre: document.getElementById('nombre').value,
        telefono: document.getElementById('telefono').value,
        servicio: document.getElementById('servicio').value,
        servicioTexto: document.getElementById('servicio').options[document.getElementById('servicio').selectedIndex].text,
        barbero: document.getElementById('barbero').value,
        barberoTexto: document.getElementById('barbero').options[document.getElementById('barbero').selectedIndex].text,
        fecha: document.getElementById('fecha').value,
        hora: document.getElementById('hora').value,
        notas: document.getElementById('notas').value
    };
    
    reservas.push(reserva);
    localStorage.setItem('reservas', JSON.stringify(reservas));
    
    // Mostrar confirmación
    mostrarModal(reserva);
    
    // Reset form
    reservaForm.reset();
    
    // Actualizar lista
    actualizarListaReservas();
    
    // Enviar a WhatsApp (simulado - abre chat con mensaje predefinido)
    enviarWhatsApp(reserva);
});

function mostrarModal(reserva) {
    const modal = document.getElementById('modal');
    const modalText = document.getElementById('modalText');
    
    modalText.innerHTML = `
        <strong>${reserva.nombre}</strong>, tu cita ha sido agendada.<br><br>
        <strong>Servicio:</strong> ${reserva.servicioTexto}<br>
        <strong>Barbero:</strong> ${reserva.barberoTexto}<br>
        <strong>Fecha:</strong> ${formatearFecha(reserva.fecha)} a las ${reserva.hora}
    `;
    
    modal.classList.add('active');
}

function cerrarModal() {
    document.getElementById('modal').classList.remove('active');
}

function actualizarListaReservas() {
    if (reservas.length === 0) {
        misReservasSection.style.display = 'none';
        return;
    }
    
    misReservasSection.style.display = 'block';
    reservasList.innerHTML = '';
    
    reservas.forEach(reserva => {
        const item = document.createElement('div');
        item.className = 'reserva-item';
        item.innerHTML = `
            <div class="reserva-info">
                <h4>${reserva.servicioTexto}</h4>
                <p>Con ${reserva.barberoTexto} — ${formatearFecha(reserva.fecha)} a las ${reserva.hora}</p>
            </div>
            <div class="reserva-actions">
                <button class="btn-delete" onclick="eliminarReserva(${reserva.id})">Cancelar</button>
            </div>
        `;
        reservasList.appendChild(item);
    });
}

function eliminarReserva(id) {
    if (confirm('¿Estás seguro de cancelar esta reserva?')) {
        reservas = reservas.filter(r => r.id !== id);
        localStorage.setItem('reservas', JSON.stringify(reservas));
        actualizarListaReservas();
    }
}

function enviarWhatsApp(reserva) {
    const mensaje = `Hola, acabo de agendar una cita en The Blade Society:%0A%0A` +
        `*Nombre:* ${reserva.nombre}%0A` +
        `*Servicio:* ${reserva.servicioTexto}%0A` +
        `*Barbero:* ${reserva.barberoTexto}%0A` +
        `*Fecha:* ${reserva.fecha}%0A` +
        `*Hora:* ${reserva.hora}%0A` +
        `*Teléfono:* ${reserva.telefono}%0A` +
        (reserva.notas ? `*Notas:* ${reserva.notas}` : '');
    
    // Abre WhatsApp con el mensaje (cambia el número por el real)
    window.open(`https://wa.me/3137748902?text=${mensaje}`, '_blank');
}

function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr + 'T00:00:00');
    return fecha.toLocaleDateString('es-MX', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Cerrar modal al hacer click fuera
document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modal')) {
        cerrarModal();
    }
});

// Smooth scroll para navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
