// Direct wa.me link (not a third-party shortener) so the destination is
// transparent and doesn't depend on an external redirect service.
export const whatsAppUrl = (text: string) => 'https://wa.me/923139999039?text=' + encodeURIComponent(text);

export const WHATSAPP_URL = whatsAppUrl(
  'Assalam-o-Alaikum, I found Baraka Events through your website and would like to discuss my event.'
);
