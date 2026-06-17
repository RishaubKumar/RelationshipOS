const express = require('express');
const router = express.Router();
const { getCustomers, createCustomer, updateCustomer, deleteCustomer } = require('../controllers/customerController');
const auth = require('../middleware/auth');

// All routes here require authorization
router.use(auth);

// Route: GET /api/customers
router.get('/', getCustomers);

// Route: POST /api/customers
router.post('/', createCustomer);

// Route: PUT /api/customers/:id
router.put('/:id', updateCustomer);

// Route: DELETE /api/customers/:id
router.delete('/:id', deleteCustomer);

module.exports = router;
