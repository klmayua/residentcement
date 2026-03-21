/**
 * USSD Menu Definitions
 * Complete menu structure for ResidentCement USSD service
 */

import { MenuDefinition, USSDSession, USSDResponse } from '../types/ussd';

export const menus: Record<string, MenuDefinition> = {
  // Main Menu
  main: {
    id: 'main',
    title: 'Welcome to ResidentCement',
    options: [
      { id: '1', label: 'Check Balance', action: 'navigate', target: 'balance' },
      { id: '2', label: 'Place Order', action: 'navigate', target: 'order_product' },
      { id: '3', label: 'Order Status', action: 'navigate', target: 'order_status' },
      { id: '4', label: 'Find Distributor', action: 'navigate', target: 'find_distributor' },
      { id: '5', label: 'Price Check', action: 'navigate', target: 'price_check' },
      { id: '6', label: 'Register Account', action: 'navigate', target: 'register' },
      { id: '7', label: 'Customer Support', action: 'navigate', target: 'support' },
      { id: '0', label: 'Exit', action: 'exit' },
    ],
  },

  // Check Balance
  balance: {
    id: 'balance',
    title: 'Account Balance',
    options: [
      { id: '1', label: 'Check Credit Limit', action: 'submit', handler: async (session) => {
        // TODO: Integrate with customer service
        return {
          text: 'END Your current credit limit is: NGN 5,000,000\nOutstanding balance: NGN 0\nAvailable: NGN 5,000,000',
          isEnd: true,
        };
      }},
      { id: '2', label: 'Payment History', action: 'submit', handler: async (session) => {
        return {
          text: 'END Last 3 payments:\n1. NGN 500,000 - 15/03/2024\n2. NGN 1,200,000 - 28/02/2024\n3. NGN 800,000 - 10/02/2024',
          isEnd: true,
        };
      }},
      { id: '0', label: 'Back to Main Menu', action: 'back', target: 'main' },
    ],
  },

  // Place Order - Product Selection
  order_product: {
    id: 'order_product',
    title: 'Select Product',
    options: [
      { id: '1', label: 'Dangote Cement (50kg)', action: 'navigate', target: 'order_quantity' },
      { id: '2', label: 'Premium Cement (50kg)', action: 'navigate', target: 'order_quantity' },
      { id: '3', label: 'Block Master Cement', action: 'navigate', target: 'order_quantity' },
      { id: '4', label: 'Concrete Mix', action: 'navigate', target: 'order_quantity' },
      { id: '0', label: 'Back', action: 'back', target: 'main' },
    ],
  },

  // Place Order - Quantity Input
  order_quantity: {
    id: 'order_quantity',
    title: 'Enter Quantity (bags)',
    allowFreeText: true,
    options: [{ id: '0', label: 'Cancel', action: 'back', target: 'main' }],
    handler: async (session, input) => {
      const quantity = parseInt(input, 10);
      if (isNaN(quantity) || quantity <= 0) {
        return {
          text: 'CON Invalid quantity. Please enter a number.\n\n0. Cancel',
          isEnd: false,
        };
      }
      session.data.quantity = quantity;
      session.currentMenu = 'order_address';
      return {
        text: 'CON Enter delivery address:\n(Street, City, State)',
        isEnd: false,
      };
    },
  },

  // Place Order - Address Input
  order_address: {
    id: 'order_address',
    title: 'Delivery Address',
    allowFreeText: true,
    options: [{ id: '0', label: 'Cancel', action: 'back', target: 'main' }],
    handler: async (session, input) => {
      session.data.address = input;
      session.currentMenu = 'order_confirm';
      const product = session.data.product || 'Dangote Cement (50kg)';
      const quantity = session.data.quantity || 0;
      const price = quantity * 4500; // Placeholder price

      return {
        text: `CON Order Summary:\n${product}\nQty: ${quantity} bags\nTotal: NGN ${price.toLocaleString()}\nDelivery: ${input}\n\n1. Confirm Order\n2. Cancel`,
        isEnd: false,
      };
    },
  },

  // Place Order - Confirmation
  order_confirm: {
    id: 'order_confirm',
    title: 'Confirm Order',
    options: [
      { id: '1', label: 'Confirm', action: 'submit', handler: async (session) => {
        // TODO: Integrate with order service
        const orderId = 'ORD' + Date.now().toString().slice(-8);
        return {
          text: `END Order placed successfully!\nOrder ID: ${orderId}\nYou will receive an SMS confirmation shortly.\n\nThank you for choosing ResidentCement!`,
          isEnd: true,
        };
      }},
      { id: '2', label: 'Cancel', action: 'back', target: 'main' },
    ],
  },

  // Order Status
  order_status: {
    id: 'order_status',
    title: 'Check Order Status',
    allowFreeText: true,
    options: [
      { id: '1', label: 'View Recent Orders', action: 'submit', handler: async (session) => {
        return {
          text: 'END Your recent orders:\n1. ORD123456 - Delivered\n2. ORD123455 - In Transit\n3. ORD123454 - Processing\n\nCall 0700-RESIDENT for details.',
          isEnd: true,
        };
      }},
      { id: '0', label: 'Back', action: 'back', target: 'main' },
    ],
    handler: async (session, input) => {
      // Check specific order
      return {
        text: `END Order ${input}:\nStatus: In Transit\nExpected Delivery: 25/03/2024\nDriver: +234 801 234 5678`,
        isEnd: true,
      };
    },
  },

  // Find Distributor
  find_distributor: {
    id: 'find_distributor',
    title: 'Find Nearest Distributor',
    allowFreeText: true,
    options: [
      { id: '1', label: 'Use Current Location', action: 'submit', handler: async (session) => {
        return {
          text: 'END Nearest Distributors:\n1. ABC Depot - 2km away\n   123 Main St, Lagos\n   Tel: 0801 234 5678\n\n2. XYZ Supplies - 4km away\n   456 Market Rd, Lagos\n   Tel: 0802 345 6789',
          isEnd: true,
        };
      }},
      { id: '0', label: 'Back', action: 'back', target: 'main' },
    ],
    handler: async (session, input) => {
      // Search by location
      return {
        text: `END Distributors in ${input}:\n1. ${input} Cement Depot\n   10 bags minimum\n   Tel: 0800 123 4567\n\nCall for current prices.`,
        isEnd: true,
      };
    },
  },

  // Price Check
  price_check: {
    id: 'price_check',
    title: 'Current Prices',
    options: [
      { id: '1', label: 'Retail Prices', action: 'submit', handler: async (session) => {
        return {
          text: 'END Retail Prices (per bag):\nDangote Cement: NGN 4,500\nPremium Cement: NGN 4,800\nBlock Master: NGN 4,200\n\nPrices valid until 31/03/2024',
          isEnd: true,
        };
      }},
      { id: '2', label: 'Distributor Prices', action: 'submit', handler: async (session) => {
        return {
          text: 'END Distributor Prices:\n100+ bags: NGN 4,200/bag\n500+ bags: NGN 4,000/bag\n1000+ bags: NGN 3,800/bag\n\nContact sales for bulk orders.',
          isEnd: true,
        };
      }},
      { id: '0', label: 'Back', action: 'back', target: 'main' },
    ],
  },

  // Registration
  register: {
    id: 'register',
    title: 'Register Account',
    options: [
      { id: '1', label: 'New Distributor', action: 'navigate', target: 'register_business' },
      { id: '2', label: 'New Retailer', action: 'navigate', target: 'register_business' },
      { id: '0', label: 'Back', action: 'back', target: 'main' },
    ],
  },

  // Registration - Business Details
  register_business: {
    id: 'register_business',
    title: 'Enter Business Name',
    allowFreeText: true,
    options: [{ id: '0', label: 'Cancel', action: 'back', target: 'main' }],
    handler: async (session, input) => {
      session.data.businessName = input;
      session.currentMenu = 'register_email';
      return {
        text: 'CON Enter email address:',
        isEnd: false,
      };
    },
  },

  // Registration - Email
  register_email: {
    id: 'register_email',
    title: 'Enter Email',
    allowFreeText: true,
    options: [{ id: '0', label: 'Cancel', action: 'back', target: 'main' }],
    handler: async (session, input) => {
      session.data.email = input;
      session.currentMenu = 'register_location';
      return {
        text: 'CON Enter business location\n(City, State):',
        isEnd: false,
      };
    },
  },

  // Registration - Location
  register_location: {
    id: 'register_location',
    title: 'Enter Location',
    allowFreeText: true,
    options: [{ id: '0', label: 'Cancel', action: 'back', target: 'main' }],
    handler: async (session, input) => {
      session.data.location = input;
      // TODO: Submit registration to customer service
      return {
        text: `END Registration submitted!\nBusiness: ${session.data.businessName}\nLocation: ${input}\n\nOur team will contact you within 24 hours.\nRef: REG${Date.now().toString().slice(-6)}`,
        isEnd: true,
      };
    },
  },

  // Support
  support: {
    id: 'support',
    title: 'Customer Support',
    options: [
      { id: '1', label: 'Call Support', action: 'submit', handler: async (session) => {
        return {
          text: 'END Call our support team:\n0700-RESIDENT (0700-737-4683)\n\nAvailable: Mon-Fri 8am-6pm\nSat: 9am-4pm',
          isEnd: true,
        };
      }},
      { id: '2', label: 'WhatsApp Chat', action: 'submit', handler: async (session) => {
        return {
          text: 'END Chat with us on WhatsApp:\n+234 800 123 4567\n\nSave this number and send "Hi" to start.',
          isEnd: true,
        };
      }},
      { id: '3', label: 'Report Issue', action: 'navigate', target: 'support_issue' },
      { id: '0', label: 'Back', action: 'back', target: 'main' },
    ],
  },

  // Support - Report Issue
  support_issue: {
    id: 'support_issue',
    title: 'Describe Your Issue',
    allowFreeText: true,
    options: [{ id: '0', label: 'Cancel', action: 'back', target: 'main' }],
    handler: async (session, input) => {
      // TODO: Submit ticket to support system
      const ticketId = 'TKT' + Date.now().toString().slice(-6);
      return {
        text: `END Ticket submitted!\nTicket ID: ${ticketId}\n\nIssue: ${input.substring(0, 50)}...\n\nOur support team will contact you within 4 hours.`,
        isEnd: true,
      };
    },
  },
};
