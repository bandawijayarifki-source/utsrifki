const fs = require('fs');
let code = fs.readFileSync('js/app.js', 'utf8');

// Replace showToast
const oldShowToast = 'function showToast(message, type = "info") {';
const newShowToast = `function showToast(message, type = "info") {
  if (typeof window !== 'undefined' && typeof window.showToastHook === 'function') {
    window.showToastHook(message, type);
  }`;
code = code.replace(oldShowToast, newShowToast);

const exportsCode = `
// Global Window Exports for Testing & Debugging
if (typeof window !== 'undefined') {
  window.showToast = showToast;
  window.renderProductCard = renderProductCard;
  window.renderAdminOverviewTab = renderAdminOverviewTab;
  window.renderAdminReportsTab = renderAdminReportsTab;
  window.renderHomeView = renderHomeView;
  window.renderCatalogView = renderCatalogView;
  window.renderProductDetailView = renderProductDetailView;
  window.renderCartView = renderCartView;
  window.renderCheckoutView = renderCheckoutView;
  window.renderBuyerDashboard = renderBuyerDashboard;
  window.renderSellerDashboard = renderSellerDashboard;
  window.renderAdminDashboard = renderAdminDashboard;
  window.formatRupiah = formatRupiah;
  window.getStatusBadge = getStatusBadge;
}
`;

if (!code.includes('window.renderProductCard = renderProductCard')) {
  code += exportsCode;
}

fs.writeFileSync('js/app.js', code, 'utf8');
console.log('Successfully updated showToast & exports in js/app.js');
