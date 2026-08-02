/*
 * data.js — edita este archivo con tu propio viaje.
 * No hace falta tocar app.js ni style.css para nada de lo de abajo.
 */

// Categorías disponibles para el campo `cat` de cada parada.
// `icon` es el emoji que se muestra en la tarjeta y en la leyenda de ajustes.
// Puedes añadir, quitar o renombrar categorías; solo asegúrate de que cada
// `cat` que uses en tus paradas exista aquí.
const CATEGORIES = {
  comida: { icon: '🍽️', label: 'Comida' },
  cafe: { icon: '☕', label: 'Café / descanso' },
  monumento: { icon: '🏛️', label: 'Monumento / cultura' },
  jardin: { icon: '🌳', label: 'Jardín / naturaleza' },
  transporte: { icon: '🚇', label: 'Transporte' },
  paseo: { icon: '🚶', label: 'Paseo' },
  mirador: { icon: '📷', label: 'Mirador / fotos' },
  barco: { icon: '🚢', label: 'Barco' },
  hotel: { icon: '🏨', label: 'Alojamiento' },
  vuelo: { icon: '✈️', label: 'Vuelo' },
  equipaje: { icon: '🧳', label: 'Equipaje' },
};

const TRIP = {
  // Cabecera de la app.
  eyebrow: 'Trip planner', // texto pequeño encima del título (ej. "Viaje de pareja", "Ruta en solitario")
  name: 'Mi viaje ✈️', // título grande; puedes añadir un emoji
  subtitle: 'Fechas · Planning día a día', // línea bajo el título (ej. "12 – 15 junio · Planning día a día")

  // Dirección o nombre de tu alojamiento, para reutilizarlo como destino de
  // Google Maps en varias paradas sin repetir la dirección a mano.
  // Déjalo vacío ('') si no lo necesitas.
  accommodation: '',

  // Un objeto por día del viaje. El orden de este array es el orden de las
  // pestañas inferiores.
  days: [
    {
      id: 1, // identificador único del día (se usa para guardar el progreso en localStorage)
      color: 'var(--d1)', // color de acento del día (hay --d1, --d2, --d3 y --de definidos en style.css; añade más variables si tienes más de 3-4 días)
      bg: 'var(--d1-soft)', // versión suave del color, para fondos
      dateLabel: 'Día 1', // etiqueta corta en la pestaña (ej. "Vie 12")
      name: 'Ejemplo de día', // nombre del día en la cabecera del panel
      isoDate: '2026-01-01', // fecha real en formato YYYY-MM-DD (activa el banner "siguiente parada" cuando coincide con hoy)
      stops: [
        // Cada parada admite estos campos:
        //   time       (obligatorio) — hora o rango, texto libre: "09:00" o "09:00–10:30"
        //   cat        (obligatorio) — debe existir en CATEGORIES
        //   title      (obligatorio) — nombre de la actividad
        //   desc       (opcional)    — detalle adicional
        //   maps       (opcional)    — texto a buscar en Google Maps (nombre de sitio o dirección)
        //   ticketFile (opcional)    — nombre de archivo dentro de tickets/, ej. 'concert-ticket.pdf'
        {
          time: '09:00',
          cat: 'vuelo',
          title: 'Ejemplo: llegada',
          desc: 'Borra estas paradas de ejemplo y añade las tuyas',
        },
        {
          time: '10:30–12:00',
          cat: 'monumento',
          title: 'Ejemplo: visita con entrada',
          desc: 'El campo "maps" abre Google Maps con este texto',
          maps: 'Nombre del sitio, Ciudad',
          ticketFile: 'example-ticket.pdf',
        },
        {
          time: '13:00',
          cat: 'comida',
          title: 'Ejemplo: comida',
          maps: 'Nombre del restaurante, Ciudad',
        },
      ],
    },
    // 👉 Copia el bloque de arriba para añadir más días (recuerda usar un `id` distinto en cada uno).
  ],
};
