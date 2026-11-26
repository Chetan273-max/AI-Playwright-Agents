# SauceDemo Login Test Plan

## Application Overview

Comprehensive login-page test coverage for https://www.saucedemo.com/, based on fresh-state Playwright exploration. Covers UI structure, positive credential scenarios, account states, required-field validation, credential mismatch handling, error dismissal, keyboard submission, and session-state edge cases.

## Test Scenarios

### 1. SauceDemo Login

**Seed:** `tests/seed.spec.ts`

#### 1.1. AUTH-UI-001 - Verify login page structure and default state

**File:** `spec/test.plan.md`

**Steps:**
  1. Open https://www.saucedemo.com/ in a fresh browser context.
    - expect: The page title is "Swag Labs".
    - expect: The login form is visible.
    - expect: The Username textbox and Password textbox are visible.
    - expect: The Password field masks entered text.
    - expect: The Login button is visible.
    - expect: The accepted-username list and shared password hint are visible.
    - expect: No login error is initially displayed.
  2. Leave both credential fields blank and inspect the page.
    - expect: Both fields remain empty.
    - expect: The application remains on the login page.
    - expect: The Login button is enabled.
    - expect: The credential hints remain visible.

#### 1.2. AUTH-POS-001 - Successful login with standard_user

**File:** `spec/test.plan.md`

**Steps:**
  1. Start from a fresh login page.
    - expect: The login form is displayed.
  2. Enter "standard_user" in Username and "secret_sauce" in Password.
    - expect: Both values are accepted in their fields.
    - expect: The Password field displays masked characters.
  3. Click Login.
    - expect: The browser navigates to /inventory.html.
    - expect: The "Swag Labs" header and "Products" heading are visible.
    - expect: The inventory product list and sort control are visible.
    - expect: The cart control is visible.
    - expect: The login form and login error are no longer present.

#### 1.3. AUTH-POS-002 - Login with each additional accepted demo account

**File:** `spec/test.plan.md`

**Steps:**
  1. Using a fresh browser context for each account, enter the shared password "secret_sauce" with one of: problem_user, performance_glitch_user, error_user, or visual_user.
    - expect: Each account is listed on the login page as an accepted username.
  2. Submit the credentials by clicking Login.
    - expect: Locked_out_user is not among the tested positive accounts.
    - expect: The browser navigates to /inventory.html.
    - expect: The application loads the inventory page for the account.
    - expect: No login error is displayed.
    - expect: Problem and visual/account-specific behavior is observable only in post-login testing and is outside this login scenario.

#### 1.4. AUTH-POS-003 - Login by pressing Enter

**File:** `spec/test.plan.md`

**Steps:**
  1. Start from a fresh login page.
    - expect: The login form is displayed.
  2. Enter "standard_user" and "secret_sauce", then press Enter while focus is in a credential field.
    - expect: Valid credentials are submitted.
    - expect: The browser navigates to /inventory.html.
    - expect: The Products page is shown without a login error.

#### 1.5. AUTH-NEG-001 - Blank username and blank password

**File:** `spec/test.plan.md`

**Steps:**
  1. Start from a fresh login page.
    - expect: No validation message is initially shown.
  2. Leave Username and Password blank and click Login.
    - expect: The alert text is "Epic sadface: Username is required".
    - expect: The alert and dismiss button are visible.
    - expect: The URL remains the login page.
    - expect: The user is not authenticated.
    - expect: Both fields remain available for correction.

#### 1.6. AUTH-NEG-002 - Username supplied, password blank

**File:** `spec/test.plan.md`

**Steps:**
  1. Start from a fresh login page.
    - expect: The login form is displayed.
  2. Enter "standard_user" in Username, leave Password blank, and click Login.
    - expect: The alert text is "Epic sadface: Password is required".
    - expect: The alert and dismiss button are visible.
    - expect: The URL remains the login page.
    - expect: The user is not authenticated.

#### 1.7. AUTH-NEG-003 - Password supplied, username blank

**File:** `spec/test.plan.md`

**Steps:**
  1. Start from a fresh login page.
    - expect: The login form is displayed.
  2. Leave Username blank, enter "secret_sauce" in Password, and click Login.
    - expect: The alert text is "Epic sadface: Username is required".
    - expect: The alert and dismiss button are visible.
    - expect: The URL remains the login page.
    - expect: The user is not authenticated.

#### 1.8. AUTH-NEG-004 - Invalid username and password

**File:** `spec/test.plan.md`

**Steps:**
  1. Start from a fresh login page.
    - expect: No login error is initially present.
  2. Enter "invalid_user" and "wrong_password", then click Login.
    - expect: The alert text is "Epic sadface: Username and password do not match any user in this service".
    - expect: A Dismiss error button is visible.
    - expect: The user remains on the login page.
    - expect: The URL remains /.
    - expect: Entered credentials remain visible in their fields for correction.

#### 1.9. AUTH-NEG-005 - Valid username with wrong password

**File:** `spec/test.plan.md`

**Steps:**
  1. Start from a fresh login page.
    - expect: The login form is displayed.
  2. Enter "standard_user" and "incorrect_password", then click Login.
    - expect: The alert text is "Epic sadface: Username and password do not match any user in this service".
    - expect: The user is not redirected.
    - expect: The login form remains usable.

#### 1.10. AUTH-NEG-006 - Invalid username with valid password

**File:** `spec/test.plan.md`

**Steps:**
  1. Start from a fresh login page.
    - expect: The login form is displayed.
  2. Enter "not_a_demo_user" and "secret_sauce", then click Login.
    - expect: The alert text is "Epic sadface: Username and password do not match any user in this service".
    - expect: The URL remains the login page.
    - expect: No inventory or authenticated session is created.

#### 1.11. AUTH-NEG-007 - Locked-out account

**File:** `spec/test.plan.md`

**Steps:**
  1. Start from a fresh login page.
    - expect: The login form is displayed.
  2. Enter "locked_out_user" and "secret_sauce", then click Login.
    - expect: The alert text is "Epic sadface: Sorry, this user has been locked out.".
    - expect: The Dismiss error button is visible.
    - expect: The browser remains on the login page.
    - expect: No inventory page or authenticated session is created.

#### 1.12. AUTH-ERR-001 - Dismiss validation and credential errors

**File:** `spec/test.plan.md`

**Steps:**
  1. Submit the blank form to produce a validation alert.
    - expect: An alert and Dismiss error button are visible.
  2. Click Dismiss error.
    - expect: The alert is removed.
    - expect: The login form remains visible.
    - expect: Both credential fields remain available.
    - expect: No navigation occurs.
  3. Repeat for invalid credentials and the locked-out account.
    - expect: Each alert can be dismissed.
    - expect: Dismissal removes only the error state and does not log the user in.
    - expect: The page remains on the login route.

#### 1.13. AUTH-ERR-002 - Credential whitespace and case sensitivity

**File:** `spec/test.plan.md`

**Steps:**
  1. Start from a fresh login page.
    - expect: The login form is displayed.
  2. Enter " standard_user " with "secret_sauce", then submit.
    - expect: Leading or trailing whitespace is not silently treated as valid credentials.
    - expect: An invalid-credentials or no-match error is shown.
    - expect: The user remains on the login page.
  3. Enter "STANDARD_USER" with "secret_sauce", then submit.
    - expect: Username matching is case-sensitive or the application otherwise rejects the uppercase username consistently.
    - expect: No authenticated session is created.

#### 1.14. AUTH-SEC-001 - Direct navigation to inventory while unauthenticated

**File:** `spec/test.plan.md`

**Steps:**
  1. Use a fresh browser context with no login.
    - expect: No authenticated session is present.
  2. Navigate directly to https://www.saucedemo.com/inventory.html.
    - expect: The application redirects to the login page or does not expose inventory data.
    - expect: There is no authenticated user inventory view.
    - expect: No login credentials are pre-filled.

#### 1.15. AUTH-SEC-002 - Browser refresh after successful login

**File:** `spec/test.plan.md`

**Steps:**
  1. Log in successfully with "standard_user" and "secret_sauce".
    - expect: The inventory page is displayed.
    - expect: The URL is /inventory.html.
  2. Refresh the browser page.
    - expect: The authenticated inventory session remains available unless the demo app is intentionally stateless.
    - expect: The inventory page reloads without an unexpected login error.
    - expect: A separate login should not be required unless session-policy expectations define otherwise.

#### 1.16. AUTH-SEC-003 - Back navigation after logout or after login

**File:** `spec/test.plan.md`

**Steps:**
  1. Log in successfully with "standard_user" and "secret_sauce".
    - expect: The inventory page is displayed.
  2. Open the menu and use Logout if available.
    - expect: The application returns to the login page.
    - expect: The credentials are cleared or not reused.
    - expect: Back navigation does not expose the inventory page as an authenticated view.
  3. If logout is unavailable in this login-focused pass, verify only that browser back behavior does not create or preserve a new login session.
    - expect: No protected page remains accessible without valid authentication.
    - expect: Security behavior is consistent and testable.

#### 1.17. AUTH-A11Y-001 - Keyboard and field semantics review

**File:** `spec/test.plan.md`

**Steps:**
  1. Open the login page and inspect keyboard focus behavior.
    - expect: The page can be reached and operated with keyboard only.
    - expect: Visible focus is present on Username, Password, and Login controls.
    - expect: Username and Password are identified by accessible names.
    - expect: The form has an accessible Login name or equivalent semantic structure.
  2. Tab from Username to Password to Login and press Enter to submit valid credentials.
    - expect: Tab order follows a logical visual order.
    - expect: The successful login is reachable without mouse use.
    - expect: Password entry is masked.
  3. Trigger and inspect a validation alert.
    - expect: The alert text is perceivable and exposed as an alert.
    - expect: The Dismiss error control is keyboard reachable.
    - expect: The error is dismissible with the keyboard.
