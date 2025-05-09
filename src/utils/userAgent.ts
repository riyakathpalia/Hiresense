import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

export function ensureGuestId() {
  let guestId = Cookies.get('guestId');

  if (!guestId) {
    guestId = uuidv4();
    Cookies.set('guestId', guestId, {
      expires: 30, // Expires in 30 days
      path: '/',
    });
  }

  return guestId;
}
