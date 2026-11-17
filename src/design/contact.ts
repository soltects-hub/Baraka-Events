import { WHATSAPP_URL } from '../lib/whatsapp';
import { seoConfig } from '../seo/seoConfig';

/** Contact details for the prototype, from the same sources as the live site. */
export const whatsappHref = WHATSAPP_URL;
export const phoneDisplay = seoConfig.organization.contact.telephone;
export const telHref = `tel:${phoneDisplay.replace(/\s/g, '')}`;
