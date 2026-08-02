# tickets/

Coloca aquí los PDFs de tus entradas o reservas (museos, conciertos, cruceros, lo que sea). Esta carpeta está en `.gitignore` — los PDFs se quedan solo en tu copia local y nunca se suben al repositorio.

## Cómo enlazarlos

En [`js/data.js`](../js/data.js), añade el campo `ticketFile` a la parada correspondiente con el nombre exacto del archivo:

```js
{
  time: '10:30–13:30',
  cat: 'monumento',
  title: 'Visita al museo',
  maps: 'Nombre del museo, Ciudad',
  ticketFile: 'museo.pdf', // debe coincidir con tickets/museo.pdf
}
```

Ejemplos de nombres (puedes usar los que quieras, solo tienen que coincidir con el archivo real):

```
tickets/museo.pdf
tickets/concierto.pdf
tickets/tour-guiado.pdf
```

La tarjeta de esa parada mostrará automáticamente un botón "Ver entrada" que abre el PDF.
