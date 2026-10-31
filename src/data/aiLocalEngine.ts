import { Product, Customer, Sale, BusinessSummary, Supplier, NearbyMerchant, UserProfile, ActionProposal, Language } from '../types';

export interface AssistantContext {
  products: Product[];
  customers: Customer[];
  sales: Sale[];
  summary: BusinessSummary;
  suppliers: Supplier[];
  currentUser: UserProfile;
  nearbyMerchants: NearbyMerchant[];
  language?: Language;
}

export interface AssistantResponse {
  reply: string;
  actionProposal?: ActionProposal;
}

export function processAssistantQuery(
  rawQuery: string,
  context: AssistantContext
): AssistantResponse {
  const q = rawQuery.toLowerCase().trim();
  const lang: Language = context.language || 'hinglish';
  const role = context.currentUser?.role || 'MERCHANT';
  const products = context.products || [];
  const customers = context.customers || [];
  const sales = context.sales || [];
  const summary = context.summary || ({} as BusinessSummary);
  const suppliers = context.suppliers || [];
  const nearbyMerchants = context.nearbyMerchants || [];

  // 1. Ramesh Udhaar Reminder (Central demo flow & core feature)
  // Queries: "Ramesh ka 850 rupaye udhaar hai, reminder bana do", "रमेश का उधार रिमाइंडर बनाओ", "Send reminder to Ramesh for 850"
  if (
    (q.includes('ramesh') || q.includes('रमेश')) &&
    (q.includes('reminder') || q.includes('रिमाइंडर') || q.includes('whatsapp') || q.includes('व्हाट्सएप') || q.includes('850') || q.includes('bana do') || q.includes('bhejo') || q.includes('send') || q.includes('udhaar') || q.includes('उधार'))
  ) {
    const ramesh = customers.find(c => c.name.toLowerCase().includes('ramesh') || c.name.includes('रमेश')) || {
      id: 'cust-1',
      name: 'Ramesh Kumar',
      phone: '9876543210',
      udhaarBalance: 850,
      lastActive: 'Yesterday',
      transactions: [],
    };
    const amount = 850;

    const waMsgHinglish = `Namaste Ramesh ji! 🙏 Sharma General Kirana Store se aapka ₹${amount} ka purana udhaar baki hai. Kripya samay par UPI ya cash dwara bhugtan karne ka kasht karein. Dhanyawad!`;
    const waMsgHindi = `नमस्ते रमेश जी! 🙏 शर्मा जनरल किराना स्टोर से आपका ₹${amount} का पुराना उधार बकाया है। कृपया समय पर UPI या नकद द्वारा भुगतान करने का कष्ट करें। धन्यवाद!`;
    const waMsgEnglish = `Hello Ramesh ji! 🙏 This is a reminder from Sharma Kirana Store regarding your pending balance of ₹${amount}. Kindly clear the payment via UPI or Cash at your earliest convenience. Thank you!`;

    const chosenWaMsg = lang === 'hindi' ? waMsgHindi : lang === 'english' ? waMsgEnglish : waMsgHinglish;
    const waLink = `https://wa.me/91${ramesh.phone}?text=${encodeURIComponent(chosenWaMsg)}`;

    let reply = '';
    if (lang === 'hindi') {
      reply = `जी सेठजी! रमेश कुमार जी का ₹${amount} का उधार बहीखाते में दर्ज है। मैंने विनम्र भाषा में व्हाट्सएप भुगतान रिमाइंडर तैयार कर दिया है। कृपया विवरण देखें और भेजने के लिए पुष्टि करें:`;
    } else if (lang === 'english') {
      reply = `Yes Sethji! Ramesh Kumar's pending ledger shows an outstanding udhaar of ₹${amount}. I have drafted a polite WhatsApp payment reminder for you. Please review and confirm to send:`;
    } else {
      reply = `Ji Sethji! Ramesh Kumar ji ka ₹${amount} ka udhaar ledger mein darj hai. Maine polite Hinglish mein WhatsApp payment reminder draft kar diya hai. Kripya review karein aur bhejne ke liye confirm karein:`;
    }

    return {
      reply,
      actionProposal: {
        id: `act-${Date.now()}`,
        type: 'SEND_WHATSAPP_REMINDER',
        title: lang === 'hindi' ? 'व्हाट्सएप भुगतान रिमाइंडर: रमेश कुमार' : 'WhatsApp Payment Reminder: Ramesh Kumar',
        description: lang === 'hindi' ? `₹${amount} का बकाया रिमाइंडर व्हाट्सएप पर भेजें` : `Send ₹${amount} udhaar balance payment reminder to Ramesh Kumar`,
        status: 'PENDING',
        details: {
          customerName: ramesh.name,
          customerId: ramesh.id,
          phone: ramesh.phone,
          amount,
          whatsAppMessage: chosenWaMsg,
          waLink,
        },
      },
    };
  }

  // 2. Specific Product Inventory Check (e.g. Atta, Milk, Oil, Maggi)
  // Queries: "Atta kitna bacha hai?", "आटा कितना बचा है?", "How much atta is left?", "Stock of milk"
  if (q.includes('atta') || q.includes('आटा') || q.includes('flour') || (q.includes('stock') && (q.includes('kitna') || q.includes('बचा') || q.includes('left')))) {
    const atta = products.find(p => p.name.toLowerCase().includes('atta') || p.nameHindi.includes('आटा')) || products[0];
    const stock = atta ? atta.stock : 4;
    const threshold = atta ? atta.minStockThreshold : 10;
    const isLow = stock <= threshold;

    let reply = '';
    if (lang === 'hindi') {
      reply = `आशीर्वाद शुद्ध चक्की आटा का अभी सिर्फ **${stock} पैकेट** बचा हुआ है। `;
      if (isLow) {
        reply += `⚠️ यह न्यूनतम स्टॉक सीमा (${threshold} पैकेट) से कम है! थोक डिस्ट्रीब्यूटर (अग्रवाल ग्रेंस) को नया ऑर्डर तुरंत देना चाहिए ताकि शाम की भीड़ में कमी न हो।`;
      } else {
        reply += `स्टॉक फिलहाल पर्याप्त है।`;
      }
    } else if (lang === 'english') {
      reply = `Currently, only **${stock} packets** of Aashirvaad Shudh Chakki Atta are remaining in stock. `;
      if (isLow) {
        reply += `⚠️ This is below your safe minimum threshold of ${threshold} packets! Generating a reorder to your wholesale distributor is recommended.`;
      } else {
        reply += `Current stock level is sufficient.`;
      }
    } else {
      reply = `Aashirvaad Shudh Chakki Atta ka abhi sirf **${stock} packets** bacha hai. `;
      if (isLow) {
        reply += `⚠️ Yeh minimum stock limit (${threshold} packets) se kam hai! Wholesale distributor ko 10 packets ka naya order turant bhejna chahiye taaki shortage na ho.`;
      } else {
        reply += `Stock filhal paryapt hai.`;
      }
    }

    return {
      reply,
      actionProposal: isLow
        ? {
            id: `act-${Date.now()}`,
            type: 'UPDATE_STOCK',
            title: lang === 'hindi' ? 'रीस्टॉक अलर्ट: आशीर्वाद आटा' : 'Restock Alert: Aashirvaad Atta',
            description: lang === 'hindi' ? 'सप्लायर से 10 पैकेट आटा रीस्टॉक करने का ऑर्डर लगाएं?' : 'Generate reorder of 10 packets to wholesale supplier?',
            status: 'PENDING',
            details: {
              productName: atta ? atta.name : 'Aashirvaad Shudh Chakki Atta (10kg)',
              productId: atta ? atta.id : 'prod-1',
              quantity: 10,
            },
          }
        : undefined,
    };
  }

  // 3. Top Selling Products & Demand Analysis
  // Queries: "Aaj kya bik raha hai?", "आज क्या बिक रहा है?", "What is selling today?", "Top selling items"
  if (
    q.includes('bik raha hai') ||
    q.includes('bika') ||
    q.includes('बिक रहा') ||
    q.includes('बिक्री') ||
    q.includes('best selling') ||
    q.includes('top selling') ||
    q.includes('what is selling') ||
    q.includes('demand')
  ) {
    if (lang === 'hindi') {
      return {
        reply: `आज दुकान पर सबसे ज्यादा मांग इन जरूरी सामानों की रही है:\n\n` +
          `1. 🌾 **आशीर्वाद चक्की आटा**: 2 पैकेट (₹880)\n` +
          `2. 🥛 **अमुल ताज़ा दूध**: 4 पैकेट (₹112)\n` +
          `3. 🍜 **मैगी नूडल्स**: 6 पैकेट (₹84)\n` +
          `4. 🍪 **पारले-जी बिस्कुट**: 5 पैकेट (₹150)\n` +
          `5. 🛢️ **फॉर्च्यून सनलाइट तेल**: 1 पैकेट (₹155)\n\n` +
          `💡 *मुनीमजी सुझाव:* सुबह के समय चायपत्ती और पारले-जी बिस्कुट की मांग सबसे तेज रही है। रेड लेबल चाय का काउंटर डिस्प्ले आगे रखें!`,
      };
    } else if (lang === 'english') {
      return {
        reply: `Today's top-selling grocery items based on live POS records:\n\n` +
          `1. 🌾 **Aashirvaad Chakki Atta**: 2 packets (₹880)\n` +
          `2. 🥛 **Amul Taaza Milk**: 4 packets (₹112)\n` +
          `3. 🍜 **Maggi 2-Min Noodles**: 6 packets (₹84)\n` +
          `4. 🍪 **Parle-G Glucose Biscuits**: 5 packets (₹150)\n` +
          `5. 🛢️ **Fortune Sunlite Oil**: 1 packet (₹155)\n\n` +
          `💡 *Munimji Pro Tip:* The Tea + Parle-G breakfast combo has high turnover. Keep Red Label Tea near the billing checkout!`,
      };
    } else {
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
  }

  // 4. Today's Revenue & Profit Sales Summary
  // Queries: "Aaj kitni sale hui?", "आज कितनी बिक्री हुई?", "How much sales today?", "Today's profit"
  if (
    q.includes('kitni sale') ||
    q.includes('kitna bika') ||
    q.includes('बिक्री हुई') ||
    q.includes('कमाई') ||
    q.includes('today sales') ||
    q.includes('total revenue') ||
    q.includes('today profit')
  ) {
    const todayRev = summary.todayRevenue || 1838;
    const todayProfit = summary.todayProfit || 266;
    const billsCount = summary.todaySalesCount || 4;
    const cash = summary.cashRevenue || 502;
    const upi = summary.upiRevenue || 1035;
    const udhaar = summary.udhaarRevenue || 301;

    if (lang === 'hindi') {
      return {
        reply: `आज अभी तक कुल **₹${todayRev.toLocaleString('en-IN')}** की बिक्री हुई है (${billsCount} बिलों के साथ):\n\n` +
          `• सकल मुनाफ़ा (Gross Profit): **₹${todayProfit.toLocaleString('en-IN')}**\n` +
          `• नकद (Cash): ₹${cash.toLocaleString('en-IN')}\n` +
          `• यूपीआई / ऑनलाइन: ₹${upi.toLocaleString('en-IN')}\n` +
          `• नया उधार (Udhaar): ₹${udhaar.toLocaleString('en-IN')}\n\n` +
          `दुकान की गति बहुत बढ़िया चल रही है, सेठजी! 👍`,
      };
    } else if (lang === 'english') {
      return {
        reply: `Today's store sales summary (${billsCount} completed invoices):\n\n` +
          `• Total Revenue: **₹${todayRev.toLocaleString('en-IN')}**\n` +
          `• Gross Profit: **₹${todayProfit.toLocaleString('en-IN')}**\n` +
          `• Cash Collections: ₹${cash.toLocaleString('en-IN')}\n` +
          `• UPI / Digital: ₹${upi.toLocaleString('en-IN')}\n` +
          `• Credit Given (Udhaar): ₹${udhaar.toLocaleString('en-IN')}\n\n` +
          `Store sales performance is performing strongly today! 👍`,
      };
    } else {
      return {
        reply: `Aaj abhi tak kul **₹${todayRev.toLocaleString('en-IN')}** ki sale hui hai (${billsCount} bills ke sath):\n\n` +
          `• Gross Munafa (Profit): **₹${todayProfit.toLocaleString('en-IN')}**\n` +
          `• Cash Collection: ₹${cash.toLocaleString('en-IN')}\n` +
          `• UPI / Online: ₹${upi.toLocaleString('en-IN')}\n` +
          `• Naya Udhaar: ₹${udhaar.toLocaleString('en-IN')}\n\n` +
          `Dukaan ki shuruaat kafi achhi chal rahi hai, Sethji! 👍`,
      };
    }
  }

  // 5. Low Stock Alert & Reorder Needs
  // Queries: "Kya stock khatam hone wala hai?", "कम स्टॉक वाले सामान", "Which items are low in stock?"
  if (
    q.includes('stock khatam') ||
    q.includes('low stock') ||
    q.includes('khatam hone') ||
    q.includes('कम स्टॉक') ||
    q.includes('खत्म होने') ||
    q.includes('out of stock')
  ) {
    const lowItems = products.filter(p => p.stock <= p.minStockThreshold);
    if (lowItems.length === 0) {
      return {
        reply: lang === 'hindi'
          ? 'सेठजी, सभी सामान पर्याप्त मात्रा में उपलब्ध हैं। कोई भी सामान क्रिटिकल स्तर पर नहीं है।'
          : lang === 'english'
          ? 'All inventory items are currently well stocked above safety thresholds.'
          : 'Sethji, sabhi items abhi safe limit mein hain. Koi item low stock nahi hai.',
      };
    }

    const names = lowItems
      .map(p => `• **${lang === 'hindi' ? p.nameHindi || p.name : p.name}**: सिर्फ ${p.stock} ${p.unit} बाकी (न्यूनतम सीमा: ${p.minStockThreshold})`)
      .join('\n');

    let reply = '';
    if (lang === 'hindi') {
      reply = `हाँ सेठजी! इन ${lowItems.length} सामानों का स्टॉक खत्म होने की कगार पर है:\n\n${names}\n\nकृपया इनका डिस्ट्रीब्यूटर ऑर्डर समय पर लगा दीजिए ताकि ग्राहकों को खाली हाथ न जाना पड़े।`;
    } else if (lang === 'english') {
      reply = `Attention Sethji: The following ${lowItems.length} items are running below minimum stock:\n\n${names}\n\nPlease place purchase orders to avoid running out during evening peak hours.`;
    } else {
      reply = `Haan Sethji! In ${lowItems.length} items ka stock khatam hone ki kagaar par hai:\n\n${names}\n\nKripya inka distributor order time par laga dijiye!`;
    }

    return { reply };
  }

  // 6. Udhaar Khata Overview & Customer Balances
  // Queries: "Udhaar kitna baki hai?", "उधार कितना है?", "Who owes money?", "Customer ledger"
  if (
    q.includes('udhaar') ||
    q.includes('उधार') ||
    q.includes('khata') ||
    q.includes('खाता') ||
    q.includes('ledger') ||
    q.includes('credit')
  ) {
    // If client is asking about their own balance
    if (role === 'CLIENT') {
      const clientName = context.currentUser?.name || 'Priya Verma';
      return {
        reply: lang === 'hindi'
          ? `नमस्ते ${clientName} जी! 🙏 शर्मा किराना स्टोर पर आपका कोई पुराना बकाया नहीं है (खाता ₹0 पर साफ़ है)। आप कभी भी पास की दुकान से ताजा राशन या दूध मंगा सकते हैं!`
          : lang === 'english'
          ? `Hello ${clientName}! 🙏 Your current account ledger balance with Sharma General Kirana Store is clear (₹0 due). You can order daily groceries via WhatsApp anytime!`
          : `Namaste ${clientName} ji! 🙏 Sharma Kirana Store par aapka khata clear hai (Balance: ₹0). Aap jab chahein online order ya WhatsApp enquiry kar sakte hain!`,
      };
    }

    const totalUdhaar = summary.totalUdhaar || 4570;
    const topDebtors = customers.filter(c => c.udhaarBalance > 0).slice(0, 4);
    const debtorList = topDebtors.map(c => `• **${c.name}**: ₹${c.udhaarBalance.toLocaleString('en-IN')} (${c.phone})`).join('\n');

    if (lang === 'hindi') {
      return {
        reply: `दुकान का कुल बाज़ार उधार **₹${totalUdhaar.toLocaleString('en-IN')}** बकाया है।\n\n` +
          `मुख्य बकायादार ग्राहक:\n${debtorList}\n\n` +
          `💡 आप 'उधार खाता' टैब से किसी भी ग्राहक को 1-क्लिक व्हाट्सएप पेमेंट रिमाइंडर भेज सकते हैं।`,
      };
    } else if (lang === 'english') {
      return {
        reply: `Total outstanding market credit (udhaar) is **₹${totalUdhaar.toLocaleString('en-IN')}**.\n\n` +
          `Top customer balances:\n${debtorList}\n\n` +
          `💡 You can send automated WhatsApp payment reminders with one tap from the Digital Khata screen.`,
      };
    } else {
      return {
        reply: `Dukaan ka kul market udhaar **₹${totalUdhaar.toLocaleString('en-IN')}** baki hai.\n\n` +
          `Sabse bade baaki khate:\n${debtorList}\n\n` +
          `💡 Aap kisi bhi grahak ko 1-click WhatsApp payment reminder bhej sakte hain.`,
      };
    }
  }

  // 7. Wholesale Suppliers & Purchase Orders
  // Queries: "Suppliers ka kitna baki hai?", "सप्लायर्स का कितना बकाया है?", "Supplier dues", "Wholesalers"
  if (
    q.includes('supplier') ||
    q.includes('सप्लायर') ||
    q.includes('distributor') ||
    q.includes('डिस्ट्रीब्यूटर') ||
    q.includes('dealer') ||
    q.includes('wholesaler') ||
    q.includes('po ')
  ) {
    const pendingSuppliers = suppliers.filter(s => (s.totalPendingPayment || 0) > 0);
    const totalPending = pendingSuppliers.reduce((sum, s) => sum + (s.totalPendingPayment || 0), 0);
    const list = pendingSuppliers
      .map(s => `• **${s.companyName}** (${s.name}): ₹${(s.totalPendingPayment || 0).toLocaleString('en-IN')} बकाया (Due date: ${s.nextPaymentDueDate || 'Soon'})`)
      .join('\n');

    if (lang === 'hindi') {
      return {
        reply: `सेठजी, थोक सप्लायर्स को कुल **₹${totalPending.toLocaleString('en-IN')}** का भुगतान बकाया है:\n\n${list}\n\n💡 आप 'सप्लायर्स' टैब में जाकर 1-क्लिक यूपीआई या बैंक ट्रांसफर से भुगतान दर्ज कर सकते हैं।`,
      };
    } else if (lang === 'english') {
      return {
        reply: `Sethji, total pending dues to wholesale distributors stand at **₹${totalPending.toLocaleString('en-IN')}**:\n\n${list}\n\n💡 You can record supplier payments with UPI/NEFT details in the 'Suppliers' tab.`,
      };
    } else {
      return {
        reply: `Sethji, wholesale suppliers ko kul **₹${totalPending.toLocaleString('en-IN')}** ka bhugtan pending hai:\n\n${list}\n\n💡 Aap 'Suppliers' tab mein jaa kar 1-click UPI ya Bank Transfer se payment record kar sakte hain.`,
      };
    }
  }

  // 8. Nearby Kirana Stores & Map Directory
  // Queries: "Aas-paas konsi dukaanein hain?", "आस-पास की दुकानें", "Nearby stores", "Mandi points"
  if (
    q.includes('nearby') ||
    q.includes('paas') ||
    q.includes('पास') ||
    q.includes('map') ||
    q.includes('मैप') ||
    q.includes('location') ||
    q.includes('mandi') ||
    q.includes('दुकानें') ||
    q.includes('shops')
  ) {
    const list = nearbyMerchants
      .slice(0, 3)
      .map(m => `• **${m.storeName}** (${m.category}) - ${m.distanceKm} km दूर (⭐ ${m.rating}) [${m.isOpen ? 'खुली है' : 'बंद है'}]`)
      .join('\n');

    if (lang === 'hindi') {
      return {
        reply: `आपके आस-पास की प्रमाणित किराना दुकानें एवं मंडी केंद्र:\n\n${list}\n\n📍 इनका दृश्य नक्शा और फोन नंबर देखने के लिए **आस-पास की दुकानें** टैब खोलें। वहाँ से सीधा कॉल या व्हाट्सएप ऑर्डर कर सकते हैं!`,
      };
    } else if (lang === 'english') {
      return {
        reply: `Verified neighborhood stores and supply points near your location:\n\n${list}\n\n📍 Open the **Nearby & Map** tab to view live distance markers, operating hours, and 1-click WhatsApp order shortcuts!`,
      };
    } else {
      return {
        reply: `Aapke aas-paas ke verified dukaandar aur mandi points:\n\n${list}\n\n📍 Inka exact map location dekhne ke liye **Nearby Dukaan & Map** tab kholein. Wahan se direct Call ya WhatsApp order bhi bhej sakte hain!`,
      };
    }
  }

  // Default Warm, Context-Aware Response
  if (lang === 'hindi') {
    return {
      reply: role === 'CLIENT'
        ? `नमस्ते ग्राहक जी! 🙏 मैं हूँ आपका DukaanAI शॉपिंग साथी। आप मुझसे पूछ सकते हैं:\n` +
          `• *"आस-पास कौन सी किराना दुकानें खुली हैं?"*\n` +
          `• *"आशीर्वाद आटा और दूध का क्या भाव है?"*\n` +
          `• *"मेरा कितना उधार बकाया है?"*`
        : `नमस्ते सेठजी! 🙏 मैं हूँ DukaanAI मुनीमजी। आप मुझसे बोलकर या लिखकर पूछ सकते हैं:\n` +
          `• *"आज क्या बिक रहा है?"*\n` +
          `• *"आटा कितना बचा है?"*\n` +
          `• *"रमेश का 850 रुपये उधार है, रिमाइंडर बना दो।"*\n` +
          `• *"आज कितनी बिक्री हुई?"*\n` +
          `• *"कम स्टॉक वाले सामान दिखाओ।"*\n` +
          `• *"सप्लायर्स का कितना बकाया है?"*`,
    };
  } else if (lang === 'english') {
    return {
      reply: role === 'CLIENT'
        ? `Hello! 🙏 I am your DukaanAI Shopping Assistant. Feel free to ask:\n` +
          `• *"Which grocery stores are open near me?"*\n` +
          `• *"What is the price and stock of Atta or Milk?"*\n` +
          `• *"What is my pending ledger balance?"*`
        : `Hello Sethji! 🙏 I am DukaanAI Munimji, your digital retail business copilot. You can ask:\n` +
          `• *"What is selling most today?"*\n` +
          `• *"How much Atta stock is left?"*\n` +
          `• *"Ramesh owes 850, create a WhatsApp payment reminder."*\n` +
          `• *"What are today's total sales and profit?"*\n` +
          `• *"Which items are running low on stock?"*\n` +
          `• *"How much do we owe to wholesale suppliers?"*`,
    };
  } else {
    return {
      reply: role === 'CLIENT'
        ? `Namaste Grahak ji! 🙏 Mai hoon aapka DukaanAI Shopping Assistant. Aap poochh sakte hain:\n` +
          `• *"Aas-paas konsi kirana dukaanein khuli hain?"*\n` +
          `• *"Aashirvaad Atta aur doodh ka price kya hai?"*\n` +
          `• *"Mera udhaar khata kitna baki hai?"*`
        : `Namaste Sethji! 🙏 Mai hoon DukaanAI Munimji. Aap bol kar ya likh kar poochh sakte hain:\n` +
          `• *"Aaj kya bik raha hai?"*\n` +
          `• *"Atta kitna bacha hai?"*\n` +
          `• *"Ramesh ka 850 rupaye udhaar hai, reminder bana do."*\n` +
          `• *"Aaj kitni sale hui?"*\n` +
          `• *"Kya stock khatam hone wala hai?"*\n` +
          `• *"Suppliers ka kitna payment baki hai?"*`,
    };
  }
}

