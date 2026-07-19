const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { validateString, asyncHandler } = require('../utils/security');

const servicesPath = path.join(__dirname, '../data/services.json');

function getServicesData() {
  try {
    const raw = fs.readFileSync(servicesPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return { food: [], merchandise: [], restrooms: [] };
  }
}

// GET /api/services
router.get('/', asyncHandler(async (req, res) => {
  const data = getServicesData();
  res.json({ success: true, data });
}));

// POST /api/services/order
router.post('/order', asyncHandler(async (req, res) => {
  const { cart, deliveryType, seatNumber, paymentMethod } = req.body;

  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ success: false, error: 'Cart cannot be empty. Please select items.' });
  }

  // Validate cart items
  const sanitizedCart = [];
  for (const item of cart) {
    const id = validateString(item.id, 1, 50);
    const name = validateString(item.name, 1, 100);
    const price = typeof item.price === 'number' && item.price >= 0 ? item.price : 0;
    const quantity = typeof item.quantity === 'number' && item.quantity > 0 ? Math.min(20, Math.round(item.quantity)) : 1;

    if (id && name) {
      sanitizedCart.push({ id, name, price, quantity });
    }
  }

  if (sanitizedCart.length === 0) {
    return res.status(400).json({ success: false, error: 'Invalid cart payload provided' });
  }

  const cleanSeat = validateString(seatNumber, 2, 100) || 'Section 104, Row 12, Seat 8';
  const cleanDelivery = validateString(deliveryType, 2, 100) || 'In-Seat Express Delivery';
  const cleanPayment = validateString(paymentMethod, 2, 100) || 'FIFA Card / Apple Pay';

  const orderId = 'FIFA-ORD-' + Math.floor(1000 + Math.random() * 9000);
  const totalAmount = sanitizedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const orderReceipt = {
    orderId,
    timestamp: new Date().toISOString(),
    deliveryType: cleanDelivery,
    seatNumber: cleanSeat,
    paymentMethod: cleanPayment,
    items: sanitizedCart,
    total: totalAmount.toFixed(2),
    estimatedTime: '12-15 minutes',
    status: 'PREPARING'
  };

  console.log('🍔 FOOD ORDER PLACED:', orderReceipt);
  res.status(201).json({
    success: true,
    message: 'Order placed successfully! Track live delivery updates below.',
    order: orderReceipt
  });
}));

module.exports = router;
