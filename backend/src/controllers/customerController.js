const Customer = require('../models/customer');

// simple churn prediction logic from prompt
const calculateChurnRisk = (lastActiveDays, satisfactionScore) => {
  const activeDays = Number(lastActiveDays);
  const score = Number(satisfactionScore);

  if (activeDays > 30 && score < 5) {
    return 'High';
  } else if (activeDays > 15 || score < 7) {
    return 'Medium';
  } else {
    return 'Low';
  }
};

// get all customers of logged in user
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching customers' });
  }
};

// create new customer
const createCustomer = async (req, res) => {
  try {
    const { name, email, age, totalPurchases, lastActiveDays, satisfactionScore } = req.body;

    if (!name || !email || age === undefined || totalPurchases === undefined || lastActiveDays === undefined || satisfactionScore === undefined) {
      return res.status(400).json({ message: 'All customer fields are required' });
    }

    // calculate risk before saving
    const churnRisk = calculateChurnRisk(lastActiveDays, satisfactionScore);

    const newCustomer = new Customer({
      name,
      email,
      age: Number(age),
      totalPurchases: Number(totalPurchases),
      lastActiveDays: Number(lastActiveDays),
      satisfactionScore: Number(satisfactionScore),
      churnRisk,
      createdBy: req.user.id
    });

    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating customer' });
  }
};

// update customer details
const updateCustomer = async (req, res) => {
  try {
    const { name, email, age, totalPurchases, lastActiveDays, satisfactionScore } = req.body;
    const customerId = req.params.id;

    let customer = await Customer.findOne({ _id: customerId, createdBy: req.user.id });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found or unauthorized' });
    }

    if (!name || !email || age === undefined || totalPurchases === undefined || lastActiveDays === undefined || satisfactionScore === undefined) {
      return res.status(400).json({ message: 'All customer fields are required' });
    }

    // recalculate risk
    const churnRisk = calculateChurnRisk(lastActiveDays, satisfactionScore);

    customer.name = name;
    customer.email = email;
    customer.age = Number(age);
    customer.totalPurchases = Number(totalPurchases);
    customer.lastActiveDays = Number(lastActiveDays);
    customer.satisfactionScore = Number(satisfactionScore);
    customer.churnRisk = churnRisk;

    const updatedCustomer = await customer.save();
    res.json(updatedCustomer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating customer' });
  }
};

// delete customer
const deleteCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;

    const customer = await Customer.findOneAndDelete({ _id: customerId, createdBy: req.user.id });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found or unauthorized' });
    }

    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting customer' });
  }
};

module.exports = {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer
};
