/**
 * In-memory session manager for administrative access.
 * Persists during active tab navigation, but resets upon page refresh or tab close.
 */

let adminAuthenticated = false;
let auditoriaAuthenticated = false;

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((callback) => {
    try {
      callback();
    } catch (e) {
      console.error('Error in admin session listener:', e);
    }
  });
}

/**
 * Returns whether the administrator password has been validated in the current tab session.
 */
export function isAdminSessionAuthenticated(): boolean {
  return adminAuthenticated;
}

/**
 * Sets the administrator authentication state.
 */
export function setAdminSessionAuthenticated(value: boolean): void {
  adminAuthenticated = value;
  notify();
}

/**
 * Returns whether the auditoria technical password has been validated in the current tab session.
 */
export function isAuditoriaSessionAuthenticated(): boolean {
  return auditoriaAuthenticated;
}

/**
 * Sets the auditoria technical authentication state.
 */
export function setAuditoriaSessionAuthenticated(value: boolean): void {
  auditoriaAuthenticated = value;
  notify();
}

/**
 * Subscribes to authentication state changes.
 */
export function subscribeAdminSession(callback: Listener): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}
