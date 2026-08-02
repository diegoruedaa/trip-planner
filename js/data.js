/*
 * data.js — this is where your trip lives.
 * You shouldn't need to touch app.js or style.css for any of this.
 */

// Categories available for each stop's `cat` field.
// `icon` is the emoji shown on the card and in the settings legend.
// Add, remove, or rename categories freely — just make sure every `cat`
// you use on a stop exists here.
const CATEGORIES = {
  comida: { icon: '🍽️', label: 'Food' },
  cafe: { icon: '☕', label: 'Coffee / break' },
  monumento: { icon: '🏛️', label: 'Monument / culture' },
  jardin: { icon: '🌳', label: 'Garden / nature' },
  transporte: { icon: '🚇', label: 'Transport' },
  paseo: { icon: '🚶', label: 'Walk' },
  mirador: { icon: '📷', label: 'Viewpoint / photos' },
  barco: { icon: '🚢', label: 'Boat' },
  hotel: { icon: '🏨', label: 'Accommodation' },
  vuelo: { icon: '✈️', label: 'Flight' },
  equipaje: { icon: '🧳', label: 'Luggage' },
};

const TRIP = {
  // App header.
  eyebrow: 'Trip planner', // small text above the title (e.g. "Couple's trip", "Solo trip")
  name: 'My trip ✈️', // big title; an emoji works fine here
  subtitle: 'Dates · Day-by-day plan', // line under the title (e.g. "June 12–15 · Day-by-day plan")

  // Your accommodation's address or name, so you can reuse it as a Google
  // Maps destination across stops instead of retyping it each time.
  // Leave it empty ('') if you don't need it.
  accommodation: '',

  // One object per day of the trip. The order of this array is the order
  // of the bottom tabs.
  days: [
    {
      id: 1, // unique day identifier (used as the localStorage key for progress)
      color: 'var(--d1)', // day's accent color (style.css defines --d1, --d2, --d3, --de — add more variables if you've got more than 3-4 days)
      bg: 'var(--d1-soft)', // softer version of the color, used for backgrounds
      dateLabel: 'Day 1', // short tab label (e.g. "Fri 12")
      name: 'Example day', // day's name in the panel header
      isoDate: '2026-01-01', // real date, YYYY-MM-DD (triggers the "next stop" banner when it matches today)
      stops: [
        // Each stop takes these fields:
        //   time       (required) — time or range, free text: "09:00" or "09:00–10:30"
        //   cat        (required) — must exist in CATEGORIES
        //   title      (required) — name of the activity
        //   desc       (optional) — extra detail
        //   maps       (optional) — text to search on Google Maps (place name or address)
        //   ticketFile (optional) — filename inside tickets/, e.g. 'concert-ticket.pdf'
        {
          time: '09:00',
          cat: 'vuelo',
          title: 'Example: arrival',
          desc: 'Delete these example stops and add your own',
        },
        {
          time: '10:30–12:00',
          cat: 'monumento',
          title: 'Example: visit with a ticket',
          desc: 'The "maps" field opens Google Maps with this text',
          maps: 'Place name, City',
          ticketFile: 'example-ticket.pdf',
        },
        {
          time: '13:00',
          cat: 'comida',
          title: 'Example: meal',
          maps: 'Restaurant name, City',
        },
      ],
    },
    // Copy the block above to add more days (remember to give each one a distinct `id`).
  ],
};
