const Customer = require('../models/customer');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// local mock generator if API key fails or quota is exceeded
const getFallbackSuggestion = (customer) => {
  const name = customer.name;
  const purchases = customer.totalPurchases;
  const activeDays = customer.lastActiveDays;
  const satisfaction = customer.satisfactionScore;
  const age = customer.age;

  let churnReason = "";
  let retentionStrategy = "";
  let marketingRec = "";
  let personalizedOffer = "";

  if (customer.churnRisk === 'High') {
    churnReason = `For ${name}, the critical risk factor is an extended inactivity period of ${activeDays} days combined with a low satisfaction score of ${satisfaction}/10. Having spent $${purchases} with us, this user is likely experiencing unresolved issues or has shifted operations to a competitor.`;
    retentionStrategy = `Establish immediate contact with ${name} via a senior representative. Conduct a high-priority service audit to resolve any pending account friction or performance complaints.`;
    marketingRec = `Initiate a high-touch manual sequence. Send a personalized email from the Customer Success Director acknowledging the inactivity, requesting feedback, and offering direct support.`;
    personalizedOffer = `Provide a 40% discount on their subscription/service renewal, or credit their account with a free month of premium service to demonstrate our commitment to their business.`;
  } else if (customer.churnRisk === 'Medium') {
    churnReason = `${name} (Age: ${age}) shows signs of fading engagement with ${activeDays} active days of lapse or a satisfaction rating of ${satisfaction}/10. While not completely lost, they are at risk of sliding into churn if left unmanaged.`;
    retentionStrategy = `Launch a feedback questionnaire to identify and rectify setup issues or feature gaps. Assign a junior relationship agent to review their usage patterns.`;
    marketingRec = `Deploy an educational email campaign. Highlight product upgrades, tutorials, or features relevant to their purchase volume ($${purchases}) to re-ignite platform engagement.`;
    personalizedOffer = `Offer a 20% discount voucher valid for the next 7 days, or a complimentary upgrade on their next purchase cycle.`;
  } else {
    churnReason = `${name} has a high satisfaction rating of ${satisfaction}/10 and was active recently (${activeDays} days ago). Lifetime purchases total $${purchases}. Churn risk is low, but retaining active accounts requires ongoing nurturing.`;
    retentionStrategy = `Enroll ${name} into our VIP Loyalty Program to reward their consistent platform utilization and satisfaction.`;
    marketingRec = `Request a testimonial, case study, or platform review in exchange for loyalty points. Invite them to join our beta program for early access to new releases.`;
    personalizedOffer = `Provide a surprise 15% loyalty discount code on their next invoice as a token of appreciation for being a valued customer.`;
  }

  return {
    churnReason,
    retentionStrategy,
    marketingRecommendation: marketingRec,
    personalizedOffer,
    source: "Local Heuristic Engine (Fallback)"
  };
};

const getSuggestion = async (req, res) => {
  try {
    const { customerId } = req.body;

    if (!customerId) {
      return res.status(400).json({ message: 'Customer ID is required' });
    }

    const customer = await Customer.findOne({ _id: customerId, createdBy: req.user.id });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // immediately fallback if no API key
    if (!apiKey || apiKey === 'your_gemini_api_key' || apiKey.trim() === '') {
      console.log('Gemini API key is not configured. Using fallback suggestions.');
      const fallback = getFallbackSuggestion(customer);
      return res.json(fallback);
    }

    try {
      // call google gemini api using generative-ai library
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

      const prompt = `
You are an AI customer success advisor for RelationshipOS.
Analyze this customer profile:
- Name: ${customer.name}
- Email: ${customer.email}
- Age: ${customer.age}
- Total Purchases: $${customer.totalPurchases}
- Days Since Last Active: ${customer.lastActiveDays} days
- Satisfaction Score (out of 10): ${customer.satisfactionScore}/10
- Calculated Churn Risk: ${customer.churnRisk}

Provide:
1. Churn reason (Why they might churn or why they are at risk)
2. Retention strategy (Direct steps to keep them)
3. Marketing recommendation (How to market to them)
4. Personalized offer (A specific offer to win them back or delight them)

Format the output strictly as a JSON object, without backticks or markdown, matching these keys:
{
  "churnReason": "...",
  "retentionStrategy": "...",
  "marketingRecommendation": "...",
  "personalizedOffer": "..."
}
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().trim();

      // remove markdown code block backticks if present
      if (text.startsWith('```')) {
        text = text.replace(/^```json\s*/, '').replace(/```$/, '').trim();
      }

      try {
        const suggestionData = JSON.parse(text);
        return res.json({
          ...suggestionData,
          source: "Gemini AI Engine"
        });
      } catch (parseError) {
        console.error("JSON parsing error from Gemini output. Text was:", text);
        const fallback = getFallbackSuggestion(customer);
        return res.json(fallback);
      }

    } catch (apiError) {
      console.error("Gemini API call failed:", apiError);
      // fallback if API quota is exceeded or error occurs
      const fallback = getFallbackSuggestion(customer);
      return res.json(fallback);
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error generating AI suggestions' });
  }
};

module.exports = {
  getSuggestion
};
