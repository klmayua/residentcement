/**
 * USSD Menu Engine
 * Handles menu navigation and session management
 */

import { USSDSession, USSDResponse, MenuDefinition, MenuOption } from '../types/ussd';
import { menus } from './menus';

export class MenuEngine {
  /**
   * Process user input and generate response
   */
  async processInput(session: USSDSession, input: string): Promise<USSDResponse> {
    const currentMenu = menus[session.currentMenu];

    if (!currentMenu) {
      return {
        text: 'CON Invalid menu. Please try again.\n\n0. Main Menu',
        isEnd: false,
      };
    }

    // Handle custom menu handler if defined
    if (currentMenu.handler) {
      return await currentMenu.handler(session, input);
    }

    // Handle free text input
    if (currentMenu.allowFreeText) {
      return await this.handleFreeText(session, input, currentMenu);
    }

    // Handle menu selection
    const selectedOption = currentMenu.options.find(opt => opt.id === input);

    if (!selectedOption) {
      return this.renderMenu(currentMenu, 'Invalid selection. Please try again.');
    }

    return await this.executeOption(session, selectedOption, input);
  }

  /**
   * Render a menu with optional error message
   */
  private renderMenu(menu: MenuDefinition, errorMessage?: string): USSDResponse {
    let text = `CON ${menu.title}\n`;

    if (errorMessage) {
      text = `CON ${errorMessage}\n\n${menu.title}\n`;
    }

    menu.options.forEach(option => {
      text += `${option.id}. ${option.label}\n`;
    });

    return {
      text: text.trim(),
      isEnd: false,
    };
  }

  /**
   * Execute selected menu option
   */
  private async executeOption(
    session: USSDSession,
    option: MenuOption,
    input: string
  ): Promise<USSDResponse> {
    switch (option.action) {
      case 'navigate':
        if (option.target && menus[option.target]) {
          session.currentMenu = option.target;
          return this.renderMenu(menus[option.target]);
        }
        break;

      case 'input':
        if (option.target) {
          session.currentMenu = option.target;
          const targetMenu = menus[option.target];
          return {
            text: `CON ${targetMenu.title}\n(Enter your response)`,
            isEnd: false,
          };
        }
        break;

      case 'submit':
        if (option.handler) {
          return await option.handler(session, input);
        }
        break;

      case 'back':
        if (option.target && menus[option.target]) {
          session.currentMenu = option.target;
          return this.renderMenu(menus[option.target]);
        }
        break;

      case 'exit':
        return {
          text: 'END Thank you for using ResidentCement. Goodbye!',
          isEnd: true,
        };
    }

    return {
      text: 'CON Invalid action. Please try again.\n\n0. Main Menu',
      isEnd: false,
    };
  }

  /**
   * Handle free text input
   */
  private async handleFreeText(
    session: USSDSession,
    input: string,
    menu: MenuDefinition
  ): Promise<USSDResponse> {
    if (menu.handler) {
      return await menu.handler(session, input);
    }

    return {
      text: 'CON Input received. Processing...\n\n0. Main Menu',
      isEnd: false,
    };
  }

  /**
   * Initialize a new session
   */
  initializeSession(): USSDResponse {
    return this.renderMenu(menus['main']);
  }
}
