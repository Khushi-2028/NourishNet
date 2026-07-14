/**
 * Triggers a browser download for a binary blob returned by the
 * admin report endpoints (PDF / Excel / CSV).
 */
export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const reportFilename = (type, format) => {
  const ext = format === "excel" ? "xlsx" : format;
  const date = new Date().toISOString().slice(0, 10);
  return `nourishnet-${type}-report-${date}.${ext}`;
};
