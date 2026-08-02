# Trip Planner

Plantilla de planning de viaje día a día: timeline con checklist de progreso, gastos compartidos, modo oscuro automático/manual, enlaces directos a Google Maps y funcionamiento offline como PWA instalable. JS vanilla, sin frameworks ni build step — abre `index.html` y ya está.

![Screenshot de Trip Planner](docs/screenshot.png)

> 🔗 Demo en vivo: `<!-- añade aquí tu URL de GitHub Pages / Netlify / Vercel una vez lo despliegues -->`

## Cómo generar el screenshot/GIF de arriba

1. Abre la app en el navegador (ver [Cómo correrlo en local](#cómo-correrlo-en-local)) con las DevTools en modo responsive (iPhone o similar).
2. Screenshot: `Cmd+Shift+4` (macOS) sobre la ventana, o el botón de captura de las propias DevTools ("Capture screenshot" en el menú de comandos, `Cmd+Shift+P`).
3. GIF: graba con QuickTime (`Archivo → Nueva grabación de pantalla`) y conviértelo con [gifski](https://gif.ski/) o `ffmpeg -i grabacion.mov -vf "fps=12,scale=480:-1" salida.gif`.
4. Guarda el resultado en `docs/screenshot.png` (o `.gif`) y actualiza la ruta de arriba si usas otro nombre.

## Stack

- HTML + CSS + JavaScript vanilla, sin dependencias ni build step.
- `localStorage` para persistir progreso, gastos y preferencias.
- Web App Manifest + Service Worker para instalación y uso offline (PWA).
- Fuentes de Google Fonts (Fraunces + Manrope) cargadas por `<link>`.

## Cómo correrlo en local

No hace falta ni `npm install`. Basta con servir la carpeta con cualquier servidor estático (necesario para que el service worker funcione; abrir `index.html` directamente con `file://` también funciona para todo excepto el SW):

```bash
cd trip-planner
python3 -m http.server 8000
# o: npx serve .
```

Abre `http://localhost:8000`.

## Cómo editar `data.js` para tu propio viaje

Todo el contenido del viaje vive en [`js/data.js`](js/data.js). No hace falta tocar `app.js` ni `style.css`.

**1. Cabecera** (`TRIP.eyebrow`, `TRIP.name`, `TRIP.subtitle`, `TRIP.accommodation`): textos que se muestran arriba de la app y dirección de tu alojamiento (opcional, para reutilizarla como destino de Maps en varias paradas).

**2. Días** (`TRIP.days`): un objeto por día, con:

| Campo | Obligatorio | Descripción |
|---|---|---|
| `id` | sí | identificador único del día (se usa para guardar el progreso) |
| `color` / `bg` | sí | color de acento; usa las variables `--d1`, `--d2`, `--d3`, `--de` de `style.css` o añade las tuyas |
| `dateLabel` | sí | etiqueta corta en la pestaña, ej. `"Vie 12"` |
| `name` | sí | nombre del día en la cabecera del panel |
| `isoDate` | sí | fecha real `YYYY-MM-DD`; activa el banner "siguiente parada" cuando coincide con hoy |
| `stops` | sí | array de paradas del día |

**3. Paradas** (cada elemento de `stops`):

| Campo | Obligatorio | Descripción |
|---|---|---|
| `time` | sí | hora o rango, texto libre: `"09:00"` o `"09:00–10:30"` |
| `cat` | sí | debe existir en `CATEGORIES` (ver abajo) |
| `title` | sí | nombre de la actividad |
| `desc` | no | detalle adicional |
| `maps` | no | texto a buscar en Google Maps (nombre de sitio o dirección) — genera automáticamente los botones "Ver en Maps" y "Cómo llegar" |
| `ticketFile` | no | nombre de archivo dentro de `tickets/` — genera el botón "Ver entrada" (ver [Cómo añadir tus tickets](#cómo-añadir-tus-tickets)) |

**4. Categorías** (`CATEGORIES`): objeto `{ clave: { icon, label } }`. Puedes añadir, quitar o renombrar categorías; cada `cat` que uses en una parada debe existir aquí.

## Cómo añadir tus tickets

La carpeta [`tickets/`](tickets/) está en `.gitignore` — pon ahí tus PDFs de entradas/reservas reales, y nunca se subirán al repo. Instrucciones completas en [`tickets/README.md`](tickets/README.md).

## Accesibilidad

- Checkboxes, interruptores y botones de icono llevan `aria-label`/`aria-checked`.
- Los checkboxes de cada parada son navegables por teclado (`Tab` + `Enter`/`Espacio`).
- El modal de ajustes se cierra con `Escape`.
- Contraste comprobado en modo claro y oscuro (texto secundario ajustado para cumplir WCAG AA).

## Licencia

MIT — ver [LICENSE](LICENSE).
