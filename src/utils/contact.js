export function isPlaceholder(value) {
  return !value || /^\[.+\]$/.test(value.trim())
}
