import { test, expect, APIRequestContext, PlaywrightWorkerArgs } from '@playwright/test';

// No storage state needed — authentication is handled via API HTTP requests
test.use({ storageState: { cookies: [], origins: [] } });

// Run tests sequentially so apiContext and createdEmpNumber are shared between tests
test.describe.configure({ mode: 'serial' });

test.describe('API Tests Suite — OrangeHRM v2 REST API', () => {
  const baseURL = 'https://opensource-demo.orangehrmlive.com';
  let apiContext: APIRequestContext;
  let createdEmpNumber: number;

  /**
   * Extracts the CSRF token from the HTML of the login page.
   * OrangeHRM's Vue SPA renders the token as a prop on the `<auth-login>`
   * component (`:token="&quot;...&quot;"`), not as a plain hidden input,
   * so it must be pulled out of that HTML-encoded attribute.
   */
  async function extractCsrfToken(context: APIRequestContext): Promise<string> {
    const loginPageResponse = await context.get(`${baseURL}/web/index.php/auth/login`);
    expect(loginPageResponse.status()).toBe(200);

    const html = await loginPageResponse.text();
    const csrfMatch = html.match(/:token="&quot;([^&]+)&quot;"/);

    if (!csrfMatch || !csrfMatch[1]) {
      throw new Error('CSRF token not found in login page HTML');
    }

    return csrfMatch[1];
  }

  /**
   * Authenticates against OrangeHRM using the HTTP form-based login flow:
   * 1. GET /auth/login — fetches the CSRF token embedded in the HTML.
   * 2. POST /auth/validate — submits credentials and receives the session cookie.
   * Returns an authenticated APIRequestContext that persists cookies across requests.
   */
  async function authenticateViaApi(playwright: PlaywrightWorkerArgs['playwright']): Promise<APIRequestContext> {
    // Create a fresh HTTP context with no pre-loaded session
    const context = await playwright.request.newContext({ baseURL });

    // Step 1: Extract CSRF token from the login page
    const csrfToken = await extractCsrfToken(context);

    // Step 2: Submit credentials using application/x-www-form-urlencoded format
    const loginResponse = await context.post(`${baseURL}/web/index.php/auth/validate`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      form: {
        _token: csrfToken,
        username: 'Admin',
        password: 'admin123',
      },
      maxRedirects: 5,
    });

    // The server responds with 302 (redirect to dashboard) or 200 if already resolved
    expect([200, 302]).toContain(loginResponse.status());

    return context;
  }

  test.beforeAll(async ({ playwright }) => {
    // Authenticate once via API before all tests in this describe block run
    apiContext = await authenticateViaApi(playwright);
  });

  test.afterAll(async () => {
    // Dispose the API context to release resources
    await apiContext?.dispose();
  });

  // ---------------------------------------------------------------------------
  // 1. PIM Module (Employee API)
  // ---------------------------------------------------------------------------

  test('GET /api/v2/pim/employees — Should list employees', async () => {
    // Act
    const response = await apiContext.get(`${baseURL}/web/index.php/api/v2/pim/employees`, {
      params: { limit: 10, offset: 0 },
    });

    // Assert
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);

    createdEmpNumber = body.data[0].empNumber;
  });

  test('GET /api/v2/pim/employees/{empNumber}/personal-details — Should fetch personal details', async () => {
    // Arrange
    expect(createdEmpNumber).toBeDefined();

    // Act
    const response = await apiContext.get(`${baseURL}/web/index.php/api/v2/pim/employees/${createdEmpNumber}/personal-details`);

    // Assert
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data).toHaveProperty('firstName');
  });

  test('PUT /api/v2/pim/employees/{empNumber}/personal-details — Should update personal details', async () => {
    // Arrange
    expect(createdEmpNumber).toBeDefined();

    // Act
    const response = await apiContext.put(`${baseURL}/web/index.php/api/v2/pim/employees/${createdEmpNumber}/personal-details`, {
      data: {
        firstName: 'Admin',
        lastName: 'User',
        otherId: 'API-9999',
      },
    });

    // Assert
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.otherId).toBe('API-9999');
  });

  // ---------------------------------------------------------------------------
  // 2. Admin & Directory Module
  // ---------------------------------------------------------------------------

  test('GET /api/v2/admin/users — Should fetch system users list', async () => {
    // Act
    const response = await apiContext.get(`${baseURL}/web/index.php/api/v2/admin/users`, {
      params: { limit: 10, offset: 0 },
    });

    // Assert
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });

  test('GET /api/v2/directory/employees — Should fetch directory cards', async () => {
    // Act
    const response = await apiContext.get(`${baseURL}/web/index.php/api/v2/directory/employees`, {
      params: { limit: 14, offset: 0 },
    });

    // Assert
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('data');
    expect(body.data.length).toBeGreaterThan(0);
  });

  // ---------------------------------------------------------------------------
  // 3. Validation & Error Handling Checks
  // ---------------------------------------------------------------------------

  test('POST /api/v2/admin/users — Should reject invalid request payload', async () => {
    // Act: Attempt sending an empty payload
    const response = await apiContext.post(`${baseURL}/web/index.php/api/v2/admin/users`, {
      data: {},
    });

    // Assert: API responds with a validation error or redirect
    expect([400, 422, 302, 401]).toContain(response.status());
  });
});
