function shortDate(value) {
  return new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function intentLabel(intent) {
  return intent.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export { shortDate, intentLabel }
