import { Language } from '../types';

export type TranslationKey =
  // Navigation
  | 'nav_dashboard'
  | 'nav_sales'
  | 'nav_inventory'
  | 'nav_khata'
  | 'nav_suppliers'
  | 'nav_nearby'
  | 'nav_assistant'
  | 'nav_analytics'
  | 'nav_login'
  | 'nav_logout'
  | 'nav_switch_role'
  | 'nav_demo_flow'
  | 'nav_voice'
  | 'nav_reset_demo'
  | 'role_merchant'
  | 'role_client'
  | 'role_supplier'

  // Dashboard
  | 'dash_hero_badge'
  | 'dash_hero_title_merchant'
  | 'dash_hero_title_client'
  | 'dash_hero_desc_merchant'
  | 'dash_hero_desc_client'
  | 'dash_voice_btn'
  | 'dash_today_sales'
  | 'dash_gross_profit'
  | 'dash_low_stock'
  | 'dash_total_udhaar'
  | 'dash_quick_actions'
  | 'dash_new_bill'
  | 'dash_add_customer'
  | 'dash_check_stock'
  | 'dash_manage_khata'
  | 'dash_recent_sales'
  | 'dash_view_all'
  | 'dash_no_sales_today'
  | 'dash_items_count'
  | 'dash_supplier_dues'
  | 'dash_pay_now'
  | 'dash_demo_guide_title'

  // POS / Sales
  | 'pos_title'
  | 'pos_subtitle'
  | 'pos_search_placeholder'
  | 'pos_all_categories'
  | 'pos_cart_title'
  | 'pos_cart_empty'
  | 'pos_cart_empty_sub'
  | 'pos_subtotal'
  | 'pos_estimated_profit'
  | 'pos_payment_mode'
  | 'pos_mode_cash'
  | 'pos_mode_upi'
  | 'pos_mode_udhaar'
  | 'pos_select_customer'
  | 'pos_complete_sale'
  | 'pos_processing'
  | 'pos_bill_success'
  | 'pos_print_receipt'
  | 'pos_share_whatsapp'

  // Inventory
  | 'inv_title'
  | 'inv_subtitle'
  | 'inv_add_product'
  | 'inv_search_placeholder'
  | 'inv_low_stock_only'
  | 'inv_product_name'
  | 'inv_category'
  | 'inv_stock_qty'
  | 'inv_purchase_price'
  | 'inv_selling_price'
  | 'inv_profit_margin'
  | 'inv_status'
  | 'inv_actions'
  | 'inv_in_stock'
  | 'inv_low_stock'

  // Khata
  | 'khata_title'
  | 'khata_subtitle'
  | 'khata_add_customer'
  | 'khata_search_placeholder'
  | 'khata_total_outstanding'
  | 'khata_give_credit'
  | 'khata_receive_payment'
  | 'khata_send_whatsapp_reminder'
  | 'khata_history'
  | 'khata_balance'

  // Suppliers
  | 'supp_title'
  | 'supp_subtitle'
  | 'supp_add_supplier'
  | 'supp_new_po'
  | 'supp_pending_amount'
  | 'supp_orders_count'
  | 'supp_pay_supplier'

  // Nearby & Map
  | 'nearby_title_merchant'
  | 'nearby_title_client'
  | 'nearby_subtitle_merchant'
  | 'nearby_subtitle_client'
  | 'nearby_search_placeholder'
  | 'nearby_filter_all'
  | 'nearby_filter_merchants'
  | 'nearby_filter_suppliers'
  | 'nearby_open_now'
  | 'nearby_closed'
  | 'nearby_whatsapp_order'
  | 'nearby_call_store'

  // AI Assistant
  | 'ai_title'
  | 'ai_subtitle'
  | 'ai_status_live'
  | 'ai_input_placeholder'
  | 'ai_listening'
  | 'ai_stop_listening'
  | 'ai_voice_btn'
  | 'ai_thinking'
  | 'ai_action_required'
  | 'ai_confirm_action'
  | 'ai_cancel_action'

  // Login
  | 'login_title'
  | 'login_tagline'
  | 'login_step_role'
  | 'login_step_method'
  | 'login_merchant_title'
  | 'login_merchant_desc'
  | 'login_client_title'
  | 'login_client_desc'
  | 'login_method_phone'
  | 'login_method_google'
  | 'login_phone_label'
  | 'login_phone_placeholder'
  | 'login_send_otp'
  | 'login_enter_otp'
  | 'login_verify_otp'
  | 'login_resend_otp'
  | 'login_google_btn'
  | 'login_demo_presets_title'
  | 'login_demo_merchant_btn'
  | 'login_demo_client_btn'
  | 'login_name_label'
  | 'login_store_label'
  | 'login_address_label'
  | 'login_success'
  | 'login_guest_btn';

export const TRANSLATIONS: Record<Language, Record<TranslationKey, string>> = {
  english: {
    // Navigation
    nav_dashboard: 'Dashboard',
    nav_sales: 'Sales (POS)',
    nav_inventory: 'Inventory',
    nav_khata: 'Digital Khata',
    nav_suppliers: 'Suppliers',
    nav_nearby: 'Nearby & Map',
    nav_assistant: 'AI Assistant',
    nav_analytics: 'Analytics',
    nav_login: 'Login / Portal',
    nav_logout: 'Logout',
    nav_switch_role: 'Switch Role',
    nav_demo_flow: 'Demo Flow',
    nav_voice: 'Voice',
    nav_reset_demo: 'Reset Demo',
    role_merchant: 'Merchant',
    role_client: 'Customer',
    role_supplier: 'Supplier',

    // Dashboard
    dash_hero_badge: 'Smart Kirana & Hyperlocal Platform',
    dash_hero_title_merchant: 'Namaste Sethji! Store Overview',
    dash_hero_title_client: 'Namaste Grahak ji! Local Shopping Hub',
    dash_hero_desc_merchant: 'Manage your store operations, real-time POS billing, inventory alerts, and voice AI Munimji.',
    dash_hero_desc_client: 'Discover nearby neighborhood stores, track your digital udhaar balance, and order over WhatsApp.',
    dash_voice_btn: 'Ask DukaanAI (Voice / Text)',
    dash_today_sales: "Today's Sales",
    dash_gross_profit: 'Gross Profit',
    dash_low_stock: 'Low Stock Items',
    dash_total_udhaar: 'Total Udhaar (Market Credit)',
    dash_quick_actions: 'Quick Operations',
    dash_new_bill: 'New Bill (POS)',
    dash_add_customer: 'Add Customer',
    dash_check_stock: 'Stock Inventory',
    dash_manage_khata: 'Khata Ledger',
    dash_recent_sales: "Recent Sales Today",
    dash_view_all: 'View All',
    dash_no_sales_today: 'No sales recorded yet today.',
    dash_items_count: 'items',
    dash_supplier_dues: 'Wholesale Supplier Dues',
    dash_pay_now: 'Record Payment',
    dash_demo_guide_title: 'Demo Walkthrough Steps',

    // POS / Sales
    pos_title: 'Quick Counter POS Billing',
    pos_subtitle: 'Fast item lookup, barcode scanner, and multiple payment methods',
    pos_search_placeholder: 'Search product by name, Hindi name, or barcode...',
    pos_all_categories: 'All Items',
    pos_cart_title: 'Current Bill Cart',
    pos_cart_empty: 'Cart is empty',
    pos_cart_empty_sub: 'Click on any item to add it to the counter bill',
    pos_subtotal: 'Total Bill Amount',
    pos_estimated_profit: 'Estimated Profit',
    pos_payment_mode: 'Payment Method',
    pos_mode_cash: 'Cash',
    pos_mode_upi: 'UPI / QR',
    pos_mode_udhaar: 'Udhaar',
    pos_select_customer: 'Select Customer for Khata',
    pos_complete_sale: 'Complete Sale & Generate Bill',
    pos_processing: 'Processing Invoice...',
    pos_bill_success: 'Bill Generated Successfully!',
    pos_print_receipt: 'Print Bill',
    pos_share_whatsapp: 'Send Bill on WhatsApp',

    // Inventory
    inv_title: 'Inventory & Stock Management',
    inv_subtitle: 'Track real-time stock levels, low-stock threshold alerts, and margins',
    inv_add_product: '+ Add New Item',
    inv_search_placeholder: 'Search products by name or category...',
    inv_low_stock_only: 'Low Stock Only',
    inv_product_name: 'Product Name',
    inv_category: 'Category',
    inv_stock_qty: 'Stock Left',
    inv_purchase_price: 'Cost Price',
    inv_selling_price: 'Selling Price',
    inv_profit_margin: 'Margin',
    inv_status: 'Status',
    inv_actions: 'Actions',
    inv_in_stock: 'In Stock',
    inv_low_stock: 'Low Stock Warning',

    // Khata
    khata_title: 'Digital Customer Udhaar Khata',
    khata_subtitle: 'Transparent ledger, 1-click WhatsApp payment reminders, and payment logs',
    khata_add_customer: '+ Add New Customer',
    khata_search_placeholder: 'Search customer by name or phone...',
    khata_total_outstanding: 'Total Outstanding Market Udhaar',
    khata_give_credit: 'Give Udhaar (+)',
    khata_receive_payment: 'Receive Payment (-)',
    khata_send_whatsapp_reminder: 'Send WhatsApp Reminder',
    khata_history: 'Transaction History',
    khata_balance: 'Current Balance',

    // Suppliers
    supp_title: 'Wholesale Suppliers & Purchase Orders',
    supp_subtitle: 'Manage distributors, upcoming payment dues, and reorders',
    supp_add_supplier: '+ Add Supplier',
    supp_new_po: '+ New Purchase Order',
    supp_pending_amount: 'Total Pending to Suppliers',
    supp_orders_count: 'Total Orders',
    supp_pay_supplier: 'Record Supplier Payment',

    // Nearby & Map
    nearby_title_merchant: 'B2B Wholesale & Nearby Merchant Directory',
    nearby_title_client: 'Neighborhood Kirana & Grocery Store Finder',
    nearby_subtitle_merchant: 'Locate distributors, mandis, and nearby retail stores with direct WhatsApp connection',
    nearby_subtitle_client: 'Find verified grocery stores near you, check opening hours, and order on WhatsApp',
    nearby_search_placeholder: 'Search stores by name, category, or items...',
    nearby_filter_all: 'All Locations',
    nearby_filter_merchants: 'Kirana Stores',
    nearby_filter_suppliers: 'Wholesalers',
    nearby_open_now: 'Open Now',
    nearby_closed: 'Closed',
    nearby_whatsapp_order: 'Order via WhatsApp',
    nearby_call_store: 'Call Store',

    // AI Assistant
    ai_title: 'DukaanAI Munimji Copilot',
    ai_subtitle: 'Ask in English, Hindi, or Hinglish with live store context',
    ai_status_live: 'Live Store Context Active',
    ai_input_placeholder: "Ask: 'What sold today?' or 'Atta stock left?' or 'Ramesh udhaar reminder'...",
    ai_listening: 'Listening to your voice...',
    ai_stop_listening: 'Stop',
    ai_voice_btn: 'Voice Input',
    ai_thinking: 'Munimji is analyzing store records...',
    ai_action_required: 'Confirmation Required',
    ai_confirm_action: 'Confirm & Execute Action',
    ai_cancel_action: 'Dismiss',

    // Login
    login_title: 'Welcome to Vyora DukaanAI',
    login_tagline: 'Hyperlocal Commerce & AI Copilot for Indian Retail',
    login_step_role: 'Step 1: Choose Account Type',
    login_step_method: 'Step 2: Sign-in Method',
    login_merchant_title: 'Merchant (Shopkeeper)',
    login_merchant_desc: 'POS billing, stock inventory, digital khata, and AI Munimji',
    login_client_title: 'Customer (Shopper)',
    login_client_desc: 'Nearby grocery stores, check your udhaar, and order online',
    login_method_phone: 'Mobile Number OTP',
    login_method_google: 'Google Account (Gmail)',
    login_phone_label: '10-Digit Mobile Number',
    login_phone_placeholder: '9876543210',
    login_send_otp: 'Send Verification OTP',
    login_enter_otp: 'Enter 4-Digit OTP',
    login_verify_otp: 'Verify & Enter Portal',
    login_resend_otp: 'Resend OTP',
    login_google_btn: 'Continue with Google Account',
    login_demo_presets_title: 'Quick 1-Click Demo Login',
    login_demo_merchant_btn: '🏪 Login as Demo Merchant (Ramesh Sharma)',
    login_demo_client_btn: '👤 Login as Demo Customer (Priya Verma)',
    login_name_label: 'Your Full Name',
    login_store_label: 'Shop / Store Name',
    login_address_label: 'Address / Locality',
    login_success: 'Login Successful! Welcome.',
    login_guest_btn: 'Continue as Guest',
  },

  hindi: {
    // Navigation
    nav_dashboard: 'डैशबोर्ड',
    nav_sales: 'नयी बिक्री (POS)',
    nav_inventory: 'स्टॉक / सामान',
    nav_khata: 'उधार खाता',
    nav_suppliers: 'सप्लायर्स & थोक',
    nav_nearby: 'आस-पास की दुकानें',
    nav_assistant: 'AI मुनीमजी',
    nav_analytics: 'रिपोर्ट & मुनाफ़ा',
    nav_login: 'लॉगिन / खाता',
    nav_logout: 'लॉगआउट',
    nav_switch_role: 'रोल बदलें',
    nav_demo_flow: 'डेमो गाइड',
    nav_voice: 'आवाज़',
    nav_reset_demo: 'रीसेट करें',
    role_merchant: 'दुकानदार',
    role_client: 'ग्राहक',
    role_supplier: 'सप्लायर',

    // Dashboard
    dash_hero_badge: 'स्मार्ट किराना और हाइपरलोकल प्लेटफॉर्म',
    dash_hero_title_merchant: 'नमस्ते सेठजी! आज की दुकान का हाल',
    dash_hero_title_client: 'नमस्ते ग्राहक जी! आपकी स्थानीय दुकान सेवा',
    dash_hero_desc_merchant: 'दुकान की बिक्री, डिजिटल बिलिंग, स्टॉक अलर्ट और AI मुनीमजी की लाइव सहायता प्राप्त करें।',
    dash_hero_desc_client: 'आस-पास की किराना दुकानें देखें, अपना उधार खाता जांचें और व्हाट्सएप पर ऑर्डर करें।',
    dash_voice_btn: 'बोल कर पूछें (AI मुनीमजी)',
    dash_today_sales: 'आज की कुल बिक्री',
    dash_gross_profit: 'आज का मुनाफ़ा',
    dash_low_stock: 'कम स्टॉक वाले सामान',
    dash_total_udhaar: 'कुल बाज़ार उधार',
    dash_quick_actions: 'त्वरित कार्य (Quick Actions)',
    dash_new_bill: 'नया बिल बनाएं',
    dash_add_customer: 'नया ग्राहक जोड़ें',
    dash_check_stock: 'स्टॉक चेक करें',
    dash_manage_khata: 'उधार खाता देखें',
    dash_recent_sales: 'आज की हालिया बिक्री',
    dash_view_all: 'सभी देखें',
    dash_no_sales_today: 'आज अभी तक कोई बिक्री दर्ज नहीं हुई है।',
    dash_items_count: 'सामान',
    dash_supplier_dues: 'सप्लायर्स का बकाया भुगतान',
    dash_pay_now: 'भुगतान दर्ज करें',
    dash_demo_guide_title: 'डेमो गाइड चरण',

    // POS / Sales
    pos_title: 'त्वरित काउंटर बिलिंग (POS)',
    pos_subtitle: 'तेज़ सामान खोज, बारकोड स्कैनर और कई भुगतान विकल्प',
    pos_search_placeholder: 'सामान का नाम, हिंदी नाम या बारकोड खोजें...',
    pos_all_categories: 'सभी सामान',
    pos_cart_title: 'वर्तमान बिल कार्ट',
    pos_cart_empty: 'कार्ट खाली है',
    pos_cart_empty_sub: 'बिल में जोड़ने के लिए किसी भी सामान पर क्लिक करें',
    pos_subtotal: 'कुल बिल राशि',
    pos_estimated_profit: 'अनुमानित मुनाफ़ा',
    pos_payment_mode: 'भुगतान का तरीका',
    pos_mode_cash: 'नकद (Cash)',
    pos_mode_upi: 'यूपीआई / क्यूआर',
    pos_mode_udhaar: 'उधार (Khata)',
    pos_select_customer: 'उधार के लिए ग्राहक चुनें',
    pos_complete_sale: 'बिक्री पूरी करें & पक्का बिल बनाएं',
    pos_processing: 'बिल तैयार हो रहा है...',
    pos_bill_success: 'बिल सफलतापूर्वक बन गया!',
    pos_print_receipt: 'बिल प्रिंट करें',
    pos_share_whatsapp: 'व्हाट्सएप पर बिल भेजें',

    // Inventory
    inv_title: 'स्टॉक एवं सामान प्रबंधन',
    inv_subtitle: 'सामान की मात्रा, न्यूनतम स्टॉक चेतावनी और मुनाफ़ा मार्जिन देखें',
    inv_add_product: '+ नया सामान जोड़ें',
    inv_search_placeholder: 'सामान का नाम या श्रेणी खोजें...',
    inv_low_stock_only: 'केवल कम स्टॉक वाले',
    inv_product_name: 'सामान का नाम',
    inv_category: 'श्रेणी (Category)',
    inv_stock_qty: 'बचा हुआ स्टॉक',
    inv_purchase_price: 'खरीद मूल्य',
    inv_selling_price: 'बिक्री मूल्य',
    inv_profit_margin: 'मार्जिन',
    inv_status: 'स्थिति',
    inv_actions: 'कार्रवाई',
    inv_in_stock: 'उपलब्ध है',
    inv_low_stock: 'स्टॉक खत्म होने वाला है',

    // Khata
    khata_title: 'डिजिटल ग्राहक उधार खाता',
    khata_subtitle: 'पारदर्शी बहीखाता, 1-क्लिक व्हाट्सएप भुगतान रिमाइंडर और रसीदें',
    khata_add_customer: '+ नया ग्राहक जोड़ें',
    khata_search_placeholder: 'ग्राहक का नाम या फोन नंबर खोजें...',
    khata_total_outstanding: 'कुल बकाया बाज़ार उधार',
    khata_give_credit: 'उधार दिया (+)',
    khata_receive_payment: 'भुगतान मिला (-)',
    khata_send_whatsapp_reminder: 'व्हाट्सएप पर रिमाइंडर भेजें',
    khata_history: 'लेनदेन का इतिहास',
    khata_balance: 'वर्तमान बकाया राशि',

    // Suppliers
    supp_title: 'थोक सप्लायर्स & खरीद आदेश (PO)',
    supp_subtitle: 'सप्लायर्स की सूची, बकाया राशि और नए ऑर्डर ट्रैक करें',
    supp_add_supplier: '+ नया सप्लायर जोड़ें',
    supp_new_po: '+ नया परचेज ऑर्डर बनाएं',
    supp_pending_amount: 'सप्लायर्स को कुल बकाया',
    supp_orders_count: 'कुल ऑर्डर',
    supp_pay_supplier: 'सप्लायर भुगतान दर्ज करें',

    // Nearby & Map
    nearby_title_merchant: 'थोक सप्लायर्स एवं आसपास के व्यापारी',
    nearby_title_client: 'आस-पास की किराना एवं राशन दुकानें',
    nearby_subtitle_merchant: 'मंडी, थोक डिस्ट्रीब्यूटर खोजें और व्हाट्सएप पर सीधे संपर्क करें',
    nearby_subtitle_client: 'अपने नजदीकी प्रमाणित किराना स्टोर खोजें, खुलने का समय देखें और ऑर्डर करें',
    nearby_search_placeholder: 'दुकान का नाम, सामान या श्रेणी खोजें...',
    nearby_filter_all: 'सभी स्थान',
    nearby_filter_merchants: 'किराना दुकानें',
    nearby_filter_suppliers: 'थोक विक्रेता',
    nearby_open_now: 'अभी खुली है',
    nearby_closed: 'बंद है',
    nearby_whatsapp_order: 'व्हाट्सएप पर ऑर्डर करें',
    nearby_call_store: 'दुकान पर कॉल करें',

    // AI Assistant
    ai_title: 'दुकानAI मुनीमजी सहायक',
    ai_subtitle: 'हिंदी, हिंग्लिश या इंग्लिश में बोलकर या लिखकर पूछें',
    ai_status_live: 'लाइव दुकान डेटा सक्रिय है',
    ai_input_placeholder: "पूछें: 'आज क्या बिक रहा है?' या 'आटा कितना बचा है?' या 'रमेश का उधार रिमाइंडर बना दो'...",
    ai_listening: 'आपकी आवाज़ सुन रहा हूँ...',
    ai_stop_listening: 'रोकें',
    ai_voice_btn: 'आवाज़ इनपुट',
    ai_thinking: 'मुनीमजी हिसाब की जांच कर रहे हैं...',
    ai_action_required: 'पुष्टि की आवश्यकता (अनुमति दें)',
    ai_confirm_action: 'पुष्टि करें & आगे बढ़ें',
    ai_cancel_action: 'रद्द करें',

    // Login
    login_title: 'व्योरा दुकानAI में आपका स्वागत है',
    login_tagline: 'भारतीय खुदरा व्यापार के लिए स्मार्ट कॉमर्स और AI मुनीमजी',
    login_step_role: 'चरण 1: खाते का प्रकार चुनें',
    login_step_method: 'चरण 2: साइन-इन का तरीका चुनें',
    login_merchant_title: 'दुकानदार (Merchant)',
    login_merchant_desc: 'POS बिलिंग, स्टॉक इन्वेंटरी, डिजिटल उधार खाता और AI मुनीमजी',
    login_client_title: 'ग्राहक (Customer)',
    login_client_desc: 'आस-पास की दुकानें देखें, अपना उधार जांचें और व्हाट्सएप ऑर्डर करें',
    login_method_phone: 'मोबाइल नंबर ओटीपी',
    login_method_google: 'गूगल खाता (जीमेल)',
    login_phone_label: '10 अंकों का मोबाइल नंबर',
    login_phone_placeholder: '9876543210',
    login_send_otp: 'वेरिफिकेशन ओटीपी भेजें',
    login_enter_otp: '4 अंकों का ओटीपी दर्ज करें',
    login_verify_otp: 'सत्यापित करें & आगे बढ़ें',
    login_resend_otp: 'ओटीपी पुनः भेजें',
    login_google_btn: 'गूगल खाते से जारी रखें',
    login_demo_presets_title: 'त्वरित 1-क्लिक डेमो लॉगिन',
    login_demo_merchant_btn: '🏪 दुकानदार डेमो: रमेश शर्मा (किराना स्टोर)',
    login_demo_client_btn: '👤 ग्राहक डेमो: प्रिया वर्मा (खरीदार)',
    login_name_label: 'आपका पूरा नाम',
    login_store_label: 'दुकान / स्टोर का नाम',
    login_address_label: 'पता / क्षेत्र',
    login_success: 'सफलतापूर्वक लॉगिन हुआ! स्वागत है।',
    login_guest_btn: 'अतिथि के रूप में जारी रखें',
  },

  hinglish: {
    // Navigation
    nav_dashboard: 'Dashboard',
    nav_sales: 'Sales (POS Billing)',
    nav_inventory: 'Stock / Inventory',
    nav_khata: 'Udhaar Khata',
    nav_suppliers: 'Suppliers & Wholesale',
    nav_nearby: 'Nearby Dukaan & Map',
    nav_assistant: 'AI Munimji Copilot',
    nav_analytics: 'Reports & Profit',
    nav_login: 'Login / Account',
    nav_logout: 'Logout',
    nav_switch_role: 'Switch Role',
    nav_demo_flow: 'Demo Flow',
    nav_voice: 'Voice',
    nav_reset_demo: 'Reset Demo Data',
    role_merchant: 'Merchant (Dukaandar)',
    role_client: 'Client (Grahak)',
    role_supplier: 'Wholesale Supplier',

    // Dashboard
    dash_hero_badge: 'Smart Kirana & Hyperlocal Platform',
    dash_hero_title_merchant: 'Namaste Sethji! Aaj Ki Dukaan Ka Haal',
    dash_hero_title_client: 'Namaste Grahak ji! Aapka Local Shopping Hub',
    dash_hero_desc_merchant: 'Dukaan ki live sale, fast POS billing, inventory stock alert aur AI Munimji ke sath poora control.',
    dash_hero_desc_client: 'Aas-paas ki kirana dukaanein dekhein, apna udhaar hisaab check karein aur WhatsApp par order karein.',
    dash_voice_btn: 'Bolkar Poochhein (AI Munimji)',
    dash_today_sales: 'Aaj Ki Total Sale',
    dash_gross_profit: 'Aaj Ka Munafa (Profit)',
    dash_low_stock: 'Stock Khatam Hone Wala',
    dash_total_udhaar: 'Market Udhaar Baki',
    dash_quick_actions: 'Zaroori Kaam (Quick Actions)',
    dash_new_bill: 'Naya Bill Banayein',
    dash_add_customer: 'Naya Grahak Add Karein',
    dash_check_stock: 'Stock Check Karein',
    dash_manage_khata: 'Udhaar Khata Dekhein',
    dash_recent_sales: 'Aaj Ki Recent Sales',
    dash_view_all: 'Sabhi Dekhein',
    dash_no_sales_today: 'Aaj abhi tak koi sale nahi hui hai.',
    dash_items_count: 'items',
    dash_supplier_dues: 'Suppliers Ka Baki Payment',
    dash_pay_now: 'Payment Record Karein',
    dash_demo_guide_title: 'Hackathon Demo Steps',

    // POS / Sales
    pos_title: 'Fast Counter POS Billing',
    pos_subtitle: 'Quick item search, barcode scanner, aur Cash/UPI/Udhaar payment options',
    pos_search_placeholder: 'Item ka naam, Hindi naam ya barcode search karein...',
    pos_all_categories: 'Sabhi Items',
    pos_cart_title: 'Current Bill Cart',
    pos_cart_empty: 'Cart abhi khali hai',
    pos_cart_empty_sub: 'Bill mein add karne ke liye kisi bhi item par tap karein',
    pos_subtotal: 'Total Bill Amount',
    pos_estimated_profit: 'Estimated Munafa',
    pos_payment_mode: 'Payment Mode',
    pos_mode_cash: 'Cash',
    pos_mode_upi: 'UPI / QR Code',
    pos_mode_udhaar: 'Udhaar (Khata)',
    pos_select_customer: 'Khata ke liye Customer select karein',
    pos_complete_sale: 'Sale Confirm & Bill Banayein',
    pos_processing: 'Bill ban raha hai...',
    pos_bill_success: 'Bill Successfully Ban Gaya!',
    pos_print_receipt: 'Print Bill',
    pos_share_whatsapp: 'WhatsApp par Bill Bhejo',

    // Inventory
    inv_title: 'Stock & Inventory Management',
    inv_subtitle: 'Real-time stock count, low-stock threshold alert aur item-wise profit margin',
    inv_add_product: '+ Naya Item Add Karein',
    inv_search_placeholder: 'Item ka naam ya category search karein...',
    inv_low_stock_only: 'Sirf Low Stock Items',
    inv_product_name: 'Item Ka Naam',
    inv_category: 'Category',
    inv_stock_qty: 'Kitna Bacha Hai',
    inv_purchase_price: 'Kharid Price (Cost)',
    inv_selling_price: 'Bikri Price (MRP)',
    inv_profit_margin: 'Munafa Margin',
    inv_status: 'Status',
    inv_actions: 'Actions',
    inv_in_stock: 'Stock Mein Hai',
    inv_low_stock: 'Khatam Hone Wala Hai',

    // Khata
    khata_title: 'Digital Customer Udhaar Khata',
    khata_subtitle: 'Saaf suthra hisaab-kitab, 1-click WhatsApp payment reminders aur bill history',
    khata_add_customer: '+ Naya Customer Add Karein',
    khata_search_placeholder: 'Customer ka naam ya mobile number search karein...',
    khata_total_outstanding: 'Market Mein Total Udhaar Baki',
    khata_give_credit: 'Udhaar Diya (+)',
    khata_receive_payment: 'Payment Jama Hui (-)',
    khata_send_whatsapp_reminder: 'WhatsApp Payment Reminder Bhejo',
    khata_history: 'Transaction History',
    khata_balance: 'Current Baki Khata',

    // Suppliers
    supp_title: 'Wholesale Suppliers & Purchase Orders',
    supp_subtitle: 'Distributors ki list, pending payments aur wholesale reorder management',
    supp_add_supplier: '+ Naya Supplier Add Karein',
    supp_new_po: '+ Naya Purchase Order (PO)',
    supp_pending_amount: 'Suppliers Ko Dena Baki',
    supp_orders_count: 'Total Purchase Orders',
    supp_pay_supplier: 'Supplier Payment Record Karein',

    // Nearby & Map
    nearby_title_merchant: 'Wholesale Mandi & Nearby Merchants Directory',
    nearby_title_client: 'Aas-Paas Ki Kirana & Grocery Dukaanein',
    nearby_subtitle_merchant: 'Mandi points, dealers aur aas-paas ke dukaandaron se direct WhatsApp contact karein',
    nearby_subtitle_client: 'Apne aas-paas ki verified dukaanein dekhein, open status check karein aur WhatsApp par mangwayein',
    nearby_search_placeholder: 'Dukaan ka naam, category ya item search karein...',
    nearby_filter_all: 'Sabhi Locations',
    nearby_filter_merchants: 'Kirana Dukaanein',
    nearby_filter_suppliers: 'Wholesale Dealers',
    nearby_open_now: 'Abhi Khuli Hai',
    nearby_closed: 'Band Hai',
    nearby_whatsapp_order: 'WhatsApp Order Bhejo',
    nearby_call_store: 'Dukaan Par Call Karein',

    // AI Assistant
    ai_title: 'DukaanAI Munimji Copilot',
    ai_subtitle: 'Hindi, Hinglish ya English mein bolkar ya likhkar poohein',
    ai_status_live: 'Live Dukaan Data Connected',
    ai_input_placeholder: "Poochhein: 'Aaj kya bik raha hai?' ya 'Atta kitna bacha hai?' ya 'Ramesh ka reminder bana do'...",
    ai_listening: 'Aapki aawaz sun raha hoon...',
    ai_stop_listening: 'Stop',
    ai_voice_btn: 'Voice Input',
    ai_thinking: 'Munimji hisaab dekh rahe hain...',
    ai_action_required: 'Sethji Se Anumati Chahiye (Confirmation)',
    ai_confirm_action: 'Confirm Karein & Bhejein',
    ai_cancel_action: 'Cancel Karein',

    // Login
    login_title: 'Vyora DukaanAI Mein Aapka Swagat Hai',
    login_tagline: 'Bharat Ka Smart Hyperlocal Commerce & AI Copilot',
    login_step_role: 'Step 1: Account Type Choose Karein',
    login_step_method: 'Step 2: Sign-In Method Select Karein',
    login_merchant_title: 'Merchant (Dukaandar)',
    login_merchant_desc: 'POS billing, stock inventory, digital udhaar khata aur AI Munimji',
    login_client_title: 'Client (Grahak / Shopper)',
    login_client_desc: 'Aas-paas ki dukaanein dekhein, apna udhaar hisaab check karein aur WhatsApp order',
    login_method_phone: 'Mobile Number (+91 OTP)',
    login_method_google: 'Google Account (Gmail)',
    login_phone_label: '10 Digits Ka Mobile Number',
    login_phone_placeholder: '9876543210',
    login_send_otp: 'Verification OTP Bhejo',
    login_enter_otp: '4 Digits Ka OTP Enter Karein',
    login_verify_otp: 'OTP Verify Karein & Login',
    login_resend_otp: 'Dobara OTP Bhejo',
    login_google_btn: 'Google Account Se Continue Karein',
    login_demo_presets_title: 'Instant 1-Click Demo Login',
    login_demo_merchant_btn: '🏪 Login as Demo Merchant (Ramesh Sharma - Kirana)',
    login_demo_client_btn: '👤 Login as Demo Client (Priya Verma - Customer)',
    login_name_label: 'Aapka Naam',
    login_store_label: 'Dukaan / Store Ka Naam',
    login_address_label: 'Pata / Area',
    login_success: 'Login Successful! DukaanAI mein aapka swagat hai.',
    login_guest_btn: 'Continue as Guest',
  },
};

