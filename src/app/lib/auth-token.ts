export function getEmailFromIdToken(idToken: string): string | null {
  try {
    const parts = idToken.split('.');
    if (parts.length < 2) return null;
    const payloadJson = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payloadJson.email || payloadJson['cognito:username'] || null;
  } catch {
    return null;
  }
}