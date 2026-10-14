/** Feldbeschreibungen der beiden Formulare (müssen zu src/components/forms passen). */
export const contactForm = {
  subject: 'Quellfrisch – Kontaktanfrage',
  title: 'Neue Kontaktanfrage',
  fields: [
    { name: 'Name', label: 'Name', required: true, max: 200, type: 'text' },
    { name: 'Email', label: 'E-Mail', required: true, max: 254, type: 'email' },
    { name: 'Nachricht', label: 'Anfrage', required: true, max: 5000, type: 'multiline' },
  ],
};

export const applicationForm = {
  subject: 'Quellfrisch – Bewerbung',
  title: 'Neue Bewerbung',
  fields: [
    { name: 'Name', label: 'Name', required: true, max: 200, type: 'text' },
    { name: 'Email', label: 'E-Mail', required: true, max: 254, type: 'email' },
    { name: 'Bewerbung', label: 'Bewerbung', required: true, max: 50, type: 'text', options: ['Praktikum'] },
  ],
};
