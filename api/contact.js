import { contactForm } from './_lib/forms.js';
import { createFormHandler } from './_lib/mail.js';

/** POST /api/contact – Kontaktanfrage per Resend an citronelli@quell-frisch.de */
export default createFormHandler(contactForm);
