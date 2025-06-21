# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Running the Application

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Set up Environment Variables:**
    Create a `.env` file in the root of your project and populate it with your Firebase project credentials and other necessary configurations. See the `.env.example` file (or the current `.env` if it exists) for required variables like `FIREBASE_SERVICE_ACCOUNT_KEY_JSON`, `NEXT_PUBLIC_FIREBASE_API_KEY`, etc.
    *   `FIREBASE_SERVICE_ACCOUNT_KEY_JSON`: Must be the **entire JSON content** of your Firebase service account key, preferably as a single line.
    *   `NEXT_PUBLIC_APP_URL`: Set this to your local development URL (e.g., `http://localhost:9002`) for features like external service callbacks to work correctly in the simulation.
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will typically be available at `http://localhost:9002`.

4.  **(Optional) Run Genkit in development mode (if using Genkit flows directly):**
    If you are actively developing or testing Genkit flows and want to see Genkit's UI or detailed logs, run this in a separate terminal:
    ```bash
    npm run genkit:dev
    ```
    The Genkit development UI is usually available at `http://localhost:4000`. Note that for most API interactions through the Next.js app, this step is not strictly necessary as the flows are invoked by the Next.js backend.

## Testing the APIs

Your Next.js application includes several API endpoints. You can test them using tools like Postman, Insomnia, or `curl`.

**Base URL:** `http://localhost:9002` (or your configured port)

### Common API Endpoints:

*   **Authentication:**
    *   `POST /api/auth/register`: Register a new user.
    *   `POST /api/auth/login`: Log in a user (expects a Firebase ID token obtained client-side).
    *   `POST /api/auth/logout`: Log out a user.
*   **Credit Processing:**
    *   `POST /api/credit/initiate`: Initiate credit report analysis.
*   **User Management:**
    *   `GET /api/users`: List all users.
    *   `GET /api/users/[userId]`: Get a specific user.
    *   `PUT /api/users/[userId]`: Update a user.
    *   `DELETE /api/users/[userId]`: Delete a user.
*   **AI Callbacks** (typically triggered by other services):
    *   `POST /api/ai/callbacks/analysis-complete`
    *   `POST /api/ai/callbacks/report-processed`
    *   `POST /api/ai/callbacks/dispute-status-update`

### Example: Registering a User with `curl`

```bash
curl -X POST http://localhost:9002/api/auth/register \
-H "Content-Type: application/json" \
-d '{
  "email": "testuser@example.com",
  "name": "Test User",
  "password": "password123"
}'
```
**Note:** For this to work, your `FIREBASE_SERVICE_ACCOUNT_KEY_JSON` must be correctly set in your `.env` file, allowing the Firebase Admin SDK to initialize.

### Example: Initiating Credit Processing with `curl`

**Internal Genkit Flow Processing:**
```bash
curl -X POST http://localhost:9002/api/credit/initiate \
-H "Content-Type: application/json" \
-d '{
  "identifier": "SCN12345INTERNAL",
  "userInformation": "Testing internal processing.",
  "jurisdiction": "US",
  "processingChannel": "internal"
}'
```

**Simulated External Python Service Processing:**
```bash
curl -X POST http://localhost:9002/api/credit/initiate \
-H "Content-Type: application/json" \
-d '{
  "identifier": "SCN67890EXTERNAL",
  "userInformation": "Testing external processing simulation.",
  "jurisdiction": "UK",
  "processingChannel": "external"
}'
```
If `NEXT_PUBLIC_APP_URL` is set (e.g., to `http://localhost:9002`), after a delay, the simulated external service will attempt to call back to `/api/ai/callbacks/analysis-complete`. Check your Next.js server logs.

### General Tips for API Testing:

*   **Headers:** For `POST` or `PUT` requests with a JSON body, always set the `Content-Type: application/json` header.
*   **Server Logs:** Check your Next.js terminal output for server-side logs, which are very helpful for debugging.
*   **Authentication:** For protected routes (not heavily implemented yet in this starter), you would typically need to get a Firebase ID token from the client-side Firebase SDK after a user logs in, and then send it in the `Authorization: Bearer <ID_TOKEN>` header.
*   **Firebase Emulators:** For comprehensive local testing of Firebase features (Auth, Firestore), consider using the [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite).

# Kill any process listening on 8080
Get-NetTCPConnection -LocalPort 8080 |
  Select-Object -ExpandProperty OwningProcess |
  ForEach-Object { Stop-Process -Id $_ -Force }
# TO GET RESPONSE SAVED TO [./response.json]
```powershell
Invoke-RestMethod `
  -Uri "http://localhost:9002/api/test/firestore-test" `
  -Method GET `
  -Headers @{ "Content-Type" = "application/json" } |
  ConvertTo-Json -Depth 5 | Out-File -FilePath .\response.json

```