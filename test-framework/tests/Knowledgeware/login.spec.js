import { test, expect } from '@playwright/test';
import * as commonFunctions from '../../commonFunctions';

test('open Knowledgeware final page', async ({ page }) => {
    const url = 'https://www.knowledgeware.in/final.html';
    commonFunctions.gotoUrl( page, url);
    commonFunctions.enterText( page, 'input[name="name"]', 'testuser');
    commonFunctions.enterText( page, '#password', 'password123');
    commonFunctions.clickButton( page, '#loginButton');
});