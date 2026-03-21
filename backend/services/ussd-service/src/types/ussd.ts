/**
 * USSD Types and Interfaces
 * Defines the structure for USSD sessions and menu responses
 */

export interface USSDSession {
  sessionId: string;
  phoneNumber: string;
  networkCode?: string;
  serviceCode: string;
  text: string;
  currentMenu: string;
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface USSDResponse {
  text: string;
  isEnd: boolean;
}

export interface MenuOption {
  id: string;
  label: string;
  action: 'navigate' | 'input' | 'submit' | 'back' | 'exit';
  target?: string;
  handler?: (session: USSDSession, input: string) => Promise<USSDResponse>;
}

export interface MenuDefinition {
  id: string;
  title: string;
  options: MenuOption[];
  allowFreeText?: boolean;
  handler?: (session: USSDSession, input: string) => Promise<USSDResponse>;
}

export enum USSDActions {
  CHECK_BALANCE = '1',
  PLACE_ORDER = '2',
  CHECK_ORDER_STATUS = '3',
  FIND_DISTRIBUTOR = '4',
  PRICE_CHECK = '5',
  REGISTER = '6',
  SUPPORT = '7',
  EXIT = '0',
}

export interface OrderInput {
  productId?: string;
  quantity?: number;
  deliveryAddress?: string;
  confirm?: boolean;
}

export interface UserRegistration {
  businessName?: string;
  email?: string;
  location?: string;
}
