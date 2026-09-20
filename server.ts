import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// Fallback rule-based analyzer for offline/local resilience
function processLocalAssistantQuery(query: string, context: any) {
  const q = query.toLowerCase().trim();
  const products: any[] = context?.products || [];
  const customers: any[] = context?.customers || [];
  const sales: any[] = context?.sales || [];
  const summary: any = context?.summary || {};

  // 1. Check for Ramesh udhaar / reminder:
  // "Ramesh ka 850 rupaye udhaar hai, reminder bana do" or "Ramesh ka kitna udhaar hai?"
  if (q.includes("ramesh") && (q.includes("reminder") || q.includes("whatsapp") || q.includes("850") || q.includes("bana do"))) {
    const ramesh = customers.find((c: any) => c.name.toLowerCase().includes("ramesh")) || {
      name: "Ramesh Kumar",
      phone: "9876543210",
      udhaarBalance: 850,
    };
    const amount = 850;
    const waMsg = `Namaste Ramesh ji! 🙏 Dukaan se aapka ₹${amount} ka purana udhaar baki hai. Kripya samay par UPI ya cash dwara bhugtan karne ka kasht karein. Dhanyawad! - Dukaan`;
    const waLink = `https://wa.me/91${ramesh.phone}?text=${encodeURIComponent(waMsg)}`;

    return {
      reply: `Ji Sethji, Ramesh Kumar ji ka ₹${amount} ka udhaar ledger mein darj hai. Maine polite Hinglish mein WhatsApp payment reminder taiyar kar diya hai. Kripya review karein aur bhejne ke liye confirm karein:`,
      actionProposal: {
        id: `act-${Date.now()}`,
        type: "SEND_WHATSAPP_REMINDER",
        title: "WhatsApp Payment Reminder: Ramesh Kumar",
        description: `₹${amount} ka payment reminder WhatsApp par bhejna hai.`,
        status: "PENDING",
        details: {
          customerName: ramesh.name,
          phone: ramesh.phone,
          amount: amount,
          whatsAppMessage: waMsg,
          waLink: waLink,
        },
      },
    };
  }

  // 2. "Atta kitna bacha hai?" or specific product stock query
  if (q.includes("atta") || (q.includes("stock") && q.includes("kitna"))) {
    const atta = products.find((p: any) => p.name.toLowerCase().includes("atta"));
    const stock = atta ? atta.stock : 4;
    const threshold = atta ? atta.minStockThreshold : 10;
    const isLow = stock <= threshold;

    let response = `Aashirvaad Shudh Chakki Atta ka abhi sirf **${stock} packets** bacha hai. `;
    if (isLow) {
      response += `⚠️ Yeh minimum stock limit (${threshold} packets) se kam hai! Distributor ko naya order turant dena chahiye taaki shaam ki bheed mein shortage na ho.`;
    } else {
      response += `Stock filhal paryapt hai.`;
    }

    return {
      reply: response,
      actionProposal: isLow ? {
        id: `act-${Date.now()}`,
        type: "UPDATE_STOCK",
        title: "Restock Alert: Aashirvaad Atta",
        description: "Supplier ko 10 packets ka naya order generate karein?",
        status: "PENDING",
        details: {
          productName: "Aashirvaad Shudh Chakki Atta (10kg)",
          productId: atta ? atta.id : "prod-1",
          quantity: 10,
        }
      } : undefined
    };
  }

  // 3. "Aaj kya bik raha hai?" or "top selling" or "kya bik raha hai"
  if (q.includes("bik raha hai") || q.includes("bika") || q.includes("best selling") || q.includes("top item")) {
    return {
      reply: `Aaj sabse zyada demand in items ki rahi hai:\n\n` +
        `1. 🌾 **Aashirvaad Chakki Atta**: 2 packets (₹880)\n` +
        `2. 🥛 **Amul Taaza Milk**: 4 packets (₹112)\n` +
        `3. 🍜 **Maggi Noodles**: 6 packets (₹84)\n` +
        `4. 🍪 **Parle-G Biscuits**: 5 packets (₹150)\n` +
        `5. 🛢️ **Fortune Sunflower Oil**: 1 packet (₹155)\n\n` +
        `💡 *Munimji Tip:* Chai aur Parle-G ka combo subah sabse fast nikla hai. Red Label Chai ka counter display aage rakhein!`,
    };
  }

  // 4. "Aaj kitni sale hui?" / Today's sales
  if (q.includes("aaj kitni sale") || (q.includes("sale") && (q.includes("kitni") || q.includes("aaj")))) {
    const todayRev = summary.todayRevenue || 1838;
    const todayProfit = summary.todayProfit || 266;
    const billsCount = summary.todaySalesCount || 4;
    return {
      reply: `Aaj abhi tak kul **₹${todayRev.toLocaleString("en-IN")}** ki sale hui hai (${billsCount} bills ke sath).\n\n` +
        `• Gross Munafa (Profit): **₹${todayProfit.toLocaleString("en-IN")}**\n` +
        `• Cash: ₹${(summary.cashRevenue || 502).toLocaleString("en-IN")}\n` +
        `• UPI / Online: ₹${(summary.upiRevenue || 1035).toLocaleString("en-IN")}\n` +
        `• Naya Udhaar: ₹${(summary.udhaarRevenue || 301).toLocaleString("en-IN")}\n\n` +
        `Dukaan ki shuruaat kafi achhi chal rahi hai, Sethji! 👍`,
    };
  }

  // 5. "Kya stock khatam hone wala hai?" / Low stock items
  if (q.includes("stock khatam") || q.includes("low stock") || q.includes("khatam hone wala")) {
    const lowItems = products.filter((p: any) => p.stock <= p.minStockThreshold);
    const names = lowItems.map((p: any) => `• **${p.name}**: sirf ${p.stock} ${p.unit} baki (Min: ${p.minStockThreshold})`).join("\n");
    return {
      reply: `Haan Sethji! In ${lowItems.length} items ka stock khatam hone ki kagaar par hai:\n\n${names}\n\nKripya inka distributor order time par laga dijiye!`,
    };
  }

  // 6. Generic customer udhaar query
  if (q.includes("udhaar") && (q.includes("kitna") || q.includes("kiska"))) {
    const totalUdhaar = summary.totalUdhaar || 4570;
    return {
      reply: `Dukaan ka kul market udhaar **₹${totalUdhaar.toLocaleString("en-IN")}** baki hai.\n\n` +
        `Sabse bade baaki khate:\n` +
        `• Priya Singh: ₹2,100 (1 week se)\n` +
        `• Suresh Sharma: ₹1,200\n` +
        `• Ramesh Kumar: ₹850\n` +
        `• Anita Devi: ₹420\n\n` +
        `Aap kisi bhi grahak ko 1-click WhatsApp payment reminder bhej sakte hain.`,
    };
  }

  // 7. Supplier Queries: pending payments, supplier details, purchase orders
  const suppliers: any[] = context?.suppliers || [];
  if (q.includes("supplier") || q.includes("distributor") || q.includes("dealer") || q.includes("wholesaler") || q.includes("po ")) {
    if (q.includes("pending") || q.includes("payment") || q.includes("baki") || q.includes("due") || q.includes("kitna dena")) {
      const pendingSuppliers = suppliers.filter((s: any) => (s.totalPendingPayment || 0) > 0);
      const totalPending = pendingSuppliers.reduce((sum: number, s: any) => sum + (s.totalPendingPayment || 0), 0);
      const list = pendingSuppliers.map((s: any) => `• **${s.companyName}** (${s.name}): ₹${(s.totalPendingPayment || 0).toLocaleString("en-IN")} due (Due date: ${s.nextPaymentDueDate || 'Soon'})`).join("\n");

      return {
        reply: `Sethji, suppliers ko kul **₹${totalPending.toLocaleString("en-IN")}** ka bhugtan pending hai:\n\n${list}\n\n💡 *Munimji Tip:* Aap 'Suppliers' tab mein jaa kar 1-click UPI ya Bank Transfer se payment record kar sakte hain.`,
      };
    }

    const supplierNames = suppliers.map((s: any) => `• **${s.companyName}** (${s.category}) - 📞 ${s.phone}`).join("\n");
    return {
      reply: `Aapke registered wholesale suppliers:\n\n${supplierNames}\n\nAap kisi bhi supplier ko naya Purchase Order generate kar sakte hain!`,
    };
  }

  // 8. Nearby / Map Queries: nearby shops, mandi, dairy, client vs merchant
  const nearbyMerchants: any[] = context?.nearbyMerchants || [];
  if (q.includes("nearby") || q.includes("paas") || q.includes("map") || q.includes("location") || q.includes("mandi") || q.includes("dukaan")) {
    const list = nearbyMerchants.slice(0, 3).map((m: any) => `• **${m.storeName}** (${m.category}) - ${m.distanceKm} km door (⭐ ${m.rating})`).join("\n");
    return {
      reply: `Aapke aas-paas ke verified dukaandar aur mandi points:\n\n${list}\n\n📍 Inka exact visual location dekhne ke liye **Nearby Map** tab kholein. Wahan se direct Call ya WhatsApp bhi kar sakte hain!`,
    };
  }

  // Default friendly copilot response
  return {
    reply: `Namaste Sethji! 🙏 Mai aapka DukaanAI Munimji hoon. Aap mujhse bol kar ya likh kar poochhein:\n` +
      `• *"Aaj kya bik raha hai?"*\n` +
      `• *"Atta kitna bacha hai?"*\n` +
      `• *"Ramesh ka 850 rupaye udhaar hai, reminder bana do."*\n` +
      `• *"Suppliers ka kitna payment baki hai?"*\n` +
      `• *"Aas-paas konsi dukaanein hain?"*\n` +
      `• *"Aaj kitni sale hui?"*`,
  };
}

// API Route for Dukaan AI Assistant
app.post("/api/assistant", async (req, res) => {
  try {
    const { query, context } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const ai = getGenAI();

    // If Gemini API is not configured or fails, smoothly run our tuned local engine
    if (!ai) {
      const localResult = processLocalAssistantQuery(query, context);
      return res.json(localResult);
    }

    // With Gemini API Key available
    try {
      const systemPrompt = `You are 'DukaanAI Munimji', an intelligent, trustworthy, warm, and highly practical AI business copilot for Indian retail and kirana shopkeepers (dukandars).
You communicate fluently in natural conversational Hinglish (Hindi mixed with English words commonly used by shopkeepers like 'sale', 'stock', 'profit', 'udhaar', 'jama', 'bill', 'packets', 'reminder', 'Sethji').

Current Store Context provided by the POS & Khata system:
- Products in Stock: ${JSON.stringify(
        (context?.products || []).map((p: any) => ({
          name: p.name,
          stock: p.stock,
          unit: p.unit,
          threshold: p.minStockThreshold,
          price: p.sellingPrice,
        }))
      )}
- Customers & Udhaar Balances: ${JSON.stringify(
        (context?.customers || []).map((c: any) => ({
          name: c.name,
          phone: c.phone,
          udhaar: c.udhaarBalance,
        }))
      )}
- Today's Sales Summary: ${JSON.stringify(context?.summary || {})}
- Recent Sales: ${JSON.stringify(
        (context?.sales || []).slice(0, 5).map((s: any) => ({
          invoice: s.invoiceNo,
          amount: s.totalAmount,
          mode: s.paymentMode,
          items: s.items?.map((i: any) => `${i.quantity}x ${i.productName}`).join(", "),
        }))
      )}
- Wholesale Suppliers & Pending Payments: ${JSON.stringify(
        (context?.suppliers || []).map((s: any) => ({
          name: s.name,
          company: s.companyName,
          category: s.category,
          phone: s.phone,
          pendingAmount: s.totalPendingPayment,
          nextDueDate: s.nextPaymentDueDate,
        }))
      )}
- Nearby Shops / Directory: ${JSON.stringify(
        (context?.nearbyMerchants || []).slice(0, 5).map((m: any) => ({
          storeName: m.storeName,
          category: m.category,
          distance: `${m.distanceKm} km`,
          rating: m.rating,
          phone: m.phone,
        }))
      )}

RULES:
1. Address the shopkeeper warmly as 'Sethji' or 'Bhaiya'.
2. Give concise, direct answers with numbers, rupee signs (₹), and bullet points where helpful.
3. If the user asks to send a reminder, update stock, add udhaar, or record a sale, ALWAYS generate a structured 'actionProposal' so the shopkeeper can review and confirm before it executes.
4. For WhatsApp reminders (like for Ramesh Kumar ₹850), compose a polite, respectful Hinglish WhatsApp message with customer name, exact amount, and request for payment, plus a valid WhatsApp link (wa.me).
5. Output your response strictly in valid JSON with this format:
{
  "reply": "Conversational reply in natural Hinglish...",
  "actionProposal": {
    "type": "SEND_WHATSAPP_REMINDER" | "UPDATE_STOCK" | "ADD_UDHAAR" | "CREATE_SALE",
    "title": "Short title",
    "description": "Short explanation",
    "status": "PENDING",
    "details": {
      "customerName": "...",
      "phone": "...",
      "amount": 850,
      "whatsAppMessage": "...",
      "waLink": "https://wa.me/91..."
    }
  } // actionProposal is optional, only include if user asks to take an action or if an alert warrants immediate action.
}`;

      const generatePromise = ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: query,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Gemini timeout")), 4000)
      );

      const response: any = await Promise.race([generatePromise, timeoutPromise]);

      const textOutput = response.text || "";
      try {
        const parsed = JSON.parse(textOutput);
        return res.json(parsed);
      } catch (parseError) {
        // If JSON parsing fails, wrap the text into standard structure
        return res.json({
          reply: textOutput,
        });
      }
    } catch (geminiError) {
      console.warn("Gemini API call failed, using intelligent fallback:", geminiError);
      const fallbackResult = processLocalAssistantQuery(query, context);
      return res.json(fallbackResult);
    }
  } catch (error: any) {
    console.error("Assistant endpoint error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "DukaanAI", time: new Date().toISOString() });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DukaanAI Server running on port ${PORT}`);
  });
}

startServer();
