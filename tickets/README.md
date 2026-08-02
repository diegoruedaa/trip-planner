# tickets/

Drop your ticket and booking PDFs here — museum entries, concert tickets, cruise reservations, whatever you're carrying for the trip. This folder is gitignored on purpose: your bookings stay on your machine and never end up in a public repo.

## Linking them

In [`js/data.js`](../js/data.js), add a `ticketFile` field to the relevant stop with the exact filename:

```js
{
  time: '10:30–13:30',
  cat: 'monumento',
  title: 'Museum visit',
  maps: 'Museum name, City',
  ticketFile: 'museum.pdf', // must match tickets/museum.pdf
}
```

Name them however makes sense to you — the only rule is the filename has to match the real file:

```
tickets/museum.pdf
tickets/concert.pdf
tickets/guided-tour.pdf
```

That stop's card picks it up automatically and shows a "View ticket" button.
