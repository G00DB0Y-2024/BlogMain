function normalizeSlashes(value = '') {
  return String(value).replace(/\\/g, '/');
}

function stripLeadingSlashes(value = '') {
  return normalizeSlashes(value).replace(/^\/+/, '');
}

function encodePathSegments(pathname = '') {
  return stripLeadingSlashes(pathname)
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

function joinPath(...parts) {
  return normalizeSlashes(parts.filter(Boolean).join('/')).replace(/\/+/g, '/');
}

function dirname(pathname = '') {
  const normalized = stripLeadingSlashes(pathname);
  const index = normalized.lastIndexOf('/');
  return index >= 0 ? normalized.slice(0, index) : '';
}

function basename(pathname = '') {
  const normalized = stripLeadingSlashes(pathname);
  const index = normalized.lastIndexOf('/');
  return index >= 0 ? normalized.slice(index + 1) : normalized;
}

function removeExtension(filename = '') {
  return filename.replace(/\.[^.]+$/, '');
}

function safeDecodeURIComponent(value = '') {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function isExternalUrl(value = '') {
  return /^(?:[a-zA-Z][a-zA-Z\d+.-]*:|\/\/)/.test(value);
}

function isHashLink(value = '') {
  return value.startsWith('#');
}

function isDataUrl(value = '') {
  return /^data:/i.test(value);
}

function isMailTo(value = '') {
  return /^mailto:/i.test(value);
}

function isAnchoredOrExternal(value = '') {
  return isExternalUrl(value) || isHashLink(value) || isDataUrl(value) || isMailTo(value);
}

function siteBaseUrl() {
  return new URL('./', window.location.href);
}

function resolveFromSite(relativePath) {
  return new URL(encodePathSegments(relativePath), siteBaseUrl()).toString();
}

function resolveAssetUrl(markdownPath, reference) {
  const original = String(reference || '').trim();
  if (!original || isAnchoredOrExternal(original)) {
    return original;
  }

  const cleanPath = original.split('#')[0].split('?')[0];
  if (/^\//.test(cleanPath)) {
    return new URL(encodePathSegments(cleanPath), siteBaseUrl()).toString();
  }

  const mdDir = dirname(markdownPath);
  const target = joinPath(mdDir, safeDecodeURIComponent(cleanPath));
  return new URL(encodePathSegments(target), siteBaseUrl()).toString();
}

function resolveMarkdownLink(markdownPath, reference) {
  const original = String(reference || '').trim();
  if (!original || isAnchoredOrExternal(original)) {
    return original;
  }

  const cleanPath = original.split('#')[0].split('?')[0];
  const mdDir = dirname(markdownPath);
  const target = joinPath(mdDir, safeDecodeURIComponent(cleanPath));
  return stripLeadingSlashes(normalizeSlashes(target));
}

function toViewerUrl(markdownPath) {
  const url = new URL('./viewer.html', siteBaseUrl());
  url.searchParams.set('file', normalizeSlashes(markdownPath));
  return url.toString();
}

function escapeHtml(text = '') {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatTimestamp(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}`;
}

export {
  basename,
  dirname,
  encodePathSegments,
  escapeHtml,
  formatDate,
  formatTimestamp,
  isAnchoredOrExternal,
  isDataUrl,
  isExternalUrl,
  isHashLink,
  isMailTo,
  joinPath,
  normalizeSlashes,
  removeExtension,
  resolveAssetUrl,
  resolveFromSite,
  resolveMarkdownLink,
  safeDecodeURIComponent,
  siteBaseUrl,
  stripLeadingSlashes,
  toViewerUrl,
};
