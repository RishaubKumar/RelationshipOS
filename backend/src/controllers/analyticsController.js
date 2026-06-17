const Customer = require('../models/customer');

// fetch analytics metrics for dashboard
const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const customers = await Customer.find({ createdBy: userId });

    const totalCustomers = customers.length;
    let highRiskCount = 0;
    let mediumRiskCount = 0;
    let lowRiskCount = 0;
    let totalSatisfaction = 0;
    let totalPurchasesSum = 0;

    customers.forEach(customer => {
      if (customer.churnRisk === 'High') {
        highRiskCount++;
      } else if (customer.churnRisk === 'Medium') {
        mediumRiskCount++;
      } else if (customer.churnRisk === 'Low') {
        lowRiskCount++;
      }

      totalSatisfaction += customer.satisfactionScore || 0;
      totalPurchasesSum += customer.totalPurchases || 0;
    });

    // replace ternary operators with standard if-else blocks
    let averageSatisfaction = 0;
    if (totalCustomers > 0) {
      averageSatisfaction = (totalSatisfaction / totalCustomers).toFixed(1);
    }

    let averagePurchases = 0;
    if (totalCustomers > 0) {
      averagePurchases = (totalPurchasesSum / totalCustomers).toFixed(1);
    }

    // formatting for recharts pie chart
    const riskDistribution = [
      { name: 'High Risk', value: highRiskCount, color: '#ef4444' },
      { name: 'Medium Risk', value: mediumRiskCount, color: '#f59e0b' },
      { name: 'Low Risk', value: lowRiskCount, color: '#10b981' }
    ];

    // formatting for recharts bar chart
    const customerDistribution = customers.map(c => ({
      name: c.name,
      purchases: c.totalPurchases,
      satisfaction: c.satisfactionScore,
      lastActive: c.lastActiveDays
    })).slice(0, 10);

    res.json({
      summary: {
        totalCustomers,
        highRiskCount,
        mediumRiskCount,
        lowRiskCount,
        averageSatisfaction: Number(averageSatisfaction),
        averagePurchases: Number(averagePurchases)
      },
      riskDistribution,
      customerDistribution
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching analytics data' });
  }
};

module.exports = {
  getAnalytics
};
