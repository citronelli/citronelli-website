import { applicationForm } from './_lib/forms.js';
import { createFormHandler } from './_lib/mail.js';

/** POST /api/application – Bewerbung per Resend an citronelli@quell-frisch.de */
export default createFormHandler(applicationForm);
