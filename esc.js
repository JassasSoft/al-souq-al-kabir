// تهريب آمن: esc للنصوص داخل HTML، escJs للقيم داخل onclick='...'
window.esc = function (s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
};
window.escJs = function (s) {
  return String(s == null ? '' : s).replace(/[\\'"<>&\n\r\u2028\u2029]/g, function (c) {
    return '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4);
  });
};
