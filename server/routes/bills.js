const express = require('express');
const router = express.Router();

const {
  getBills,
  getBill,
  createBill,
  updatePaymentStatus,
  getBillsByCustomer,
  getOverdueBills,
  getBillStats,
  generateBillPDF,
  createRazorpayOrder,
  verifyPayment,
  deleteBill,
  sendInvoiceEmail
} = require('../controllers/billController');

const { protect, authorize } = require('../middlewares/auth');

// All routes require authentication
router.use(protect);

// ✅ Specific routes FIRST
router.get('/admin/stats', authorize('admin'), getBillStats);
router.get('/admin/overdue', authorize('admin'), getOverdueBills);
router.get('/customer/:customerId', getBillsByCustomer);

// ✅ Other specific patterns
router.get('/:id/pdf', generateBillPDF);
router.get('/:id/download-pdf', require('../controllers/billController').downloadBillPDF);

// ✅ General routes
router.get('/', getBills);

// ❌ ALWAYS KEEP THIS LAST
router.get('/:id', getBill);

// POST / PATCH / DELETE (order usually safe, but keep consistent)
router.post('/', createBill);
router.post('/:id/send-email', sendInvoiceEmail);
router.post('/:id/create-order', createRazorpayOrder);
router.post('/:id/verify-payment', verifyPayment);

router.patch('/:id/payment', authorize('admin'), updatePaymentStatus);
router.delete('/:id', authorize('admin'), deleteBill);
module.exports = router;
