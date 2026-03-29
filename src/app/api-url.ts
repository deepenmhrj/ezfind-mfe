import { environment } from '../environments/environment';

function trimTrailingSlash(value: string): string {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

export function getApiUrl(): string {
  const configured = environment.apiUrl.trim();
  if (configured) {
    return trimTrailingSlash(configured);
  }

  if (typeof window === 'undefined') {
    return '';
  }

  const { protocol, hostname, port } = window.location;
  if (port === '4200') {
    return `${protocol}//${hostname}:3000`;
  }

  return '';
}
