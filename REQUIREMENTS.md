# RewardRally API Testing - Requirements & Documentation

## Project Overview

This project contains an automated API test suite for the **RewardRally Gamification Platform** using Playwright and TypeScript. The test suite validates the complete end-to-end flow for creating gamification resources including projects, applications, game actions, users, privileges, VIP tiers, and virtual currency.

**Repository**: gamification-api-automation-playwrite  
**Base URL (Staging)**: https://stage-gamificationapi.rewardrally.in  
**Redemption API**: https://stage-gamificationredemption.rewardrally.in

---

## Prerequisites

### System Requirements
- **Node.js**: v16+ (LTS recommended)
- **NPM**: v7+
- **Operating System**: Windows, macOS, or Linux
- **PowerShell**: v5.1+ (for Windows users)

### Tools
- Playwright (installed via npm)
- TypeScript (development only)

---

## Project Setup

### 1. Installation

```powershell
# Navigate to project directory
Set-Location -Path "D:\RewardRally_APITesting"

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the project root with the following variables:

```
BASE_URL=https://stage-gamificationapi.rewardrally.in
CLIENT_ID=<your-client-id>
BEARER_PROJECT_TOKEN=<your-bearer-token>
BEARER_ADMIN_TOKEN=<your-bearer-admin-token>
```

**Environment Variables**:
- `BASE_URL`: Base URL for the RewardRally API
- `CLIENT_ID`: Your client ID for API requests
- `BEARER_PROJECT_TOKEN`: Bearer token for project-level operations
- `BEARER_ADMIN_TOKEN`: Bearer token for admin operations

---

## Test Execution

### Run All Tests
```powershell
npx playwright test
```

### Run Specific Test File
```powershell
npx playwright test tests/rewardRallyAdminFlow.spec.ts
```

### Run Tests with UI Inspector
```powershell
npx playwright test tests/rewardRallyAdminFlow.spec.ts --ui
```

### Run Tests in Debug Mode
```powershell
npx playwright test tests/rewardRallyAdminFlow.spec.ts --debug
```

### Run Tests in Headed Mode (with browser visible)
```powershell
npx playwright test --headed
```

### Generate HTML Report
```powershell
npx playwright show-report
```

---

## Test Suite Architecture

### File Structure
```
tests/
├── rewardRallyAdminFlow.spec.ts    # Main test suite (10 tests)
├── rewardRallyFlow.spec.ts          # User flow tests
├── testFixtures.ts                  # Custom test fixtures
├── services/
│   └── api.ts                       # APIService class with all endpoints
├── utils/
│   └── random.ts                    # Utility for random name generation
└── fixtures/
    └── shared.ts                    # Shared test fixtures
```

### APIService Class

The `APIService` class encapsulates all API calls with proper authentication and error handling. Located in `tests/services/api.ts`.

**Methods**:
- `listProjects()` - GET list of projects
- `createProject(name, description)` - PUT create new project
- `createApplication(projectId, name)` - POST create application
- `createGameAction(applicationId, name)` - POST create game action
- `createUser(applicationId, userId, userName)` - POST create user
- `triggerGameAction(gameActionId, userId, points)` - POST trigger game action
- `createLookupItem(applicationId, name, source)` - POST create lookup item
- `createLookupValue(value, lookupItemId, sourceImgUrl, imageAnimationUrl)` - POST create lookup value
- `createPrivilegeStage(lookupValueId, points, description, applicationId)` - POST create privilege stage
- `createVipTier(name, tierLevel, description, badges, imageUrl, benefits, applicationId)` - POST create VIP tier
- `createVirtualMoney(name, value, imageUrl, gamificationApplicationId)` - POST create virtual money

---

## Complete Test Flow

The `rewardRallyAdminFlow.spec.ts` contains 10 sequential tests that form a complete end-to-end flow:

### Test Sequence

#### **Test 1: Create Project**
- **Endpoint**: PUT `/v1/projects/client/{clientId}`
- **Purpose**: Create a new gamification project
- **Payload**:
  ```json
  {
    "name": "Playwright automation <suffix>",
    "description": "Playwright automation <suffix>"
  }
  ```
- **Output**: `projectId` (stored for next tests)

#### **Test 2: Create Application**
- **Endpoint**: POST `/v1/applications`
- **Purpose**: Create an application within the project
- **Payload**:
  ```json
  {
    "name": "Application <suffix>",
    "projectId": "<projectId>",
    "clientId": "<clientId>",
    "emailId": "",
    "description": "Created for automation testing",
    "isSpecialDayPoints": false,
    "domain": "it",
    "recognitionLimit": 0,
    "coinConversionRate": 1,
    "privilegeName": "Badge",
    "appSpecificId": []
  }
  ```
- **Output**: `applicationId` (used in subsequent tests)

#### **Test 3: Create Game Action**
- **Endpoint**: POST `/v1/gameAction`
- **Purpose**: Create a game action (action that users can perform for points)
- **Payload**:
  ```json
  {
    "name": "Game Action <suffix>",
    "points": 100,
    "description": "Created for testing",
    "gameCountPerDay": 100,
    "minPoints": null,
    "maxPoints": null,
    "isDecision": false,
    "decisionPoints": 0,
    "application": "<applicationId>"
  }
  ```
- **Output**: `gameActionId`

#### **Test 4: Create User**
- **Endpoint**: POST `/v1/users/addUser`
- **Purpose**: Create a user for the application
- **Payload**:
  ```json
  {
    "userId": "user_<suffix>",
    "userName": "Test User <suffix>",
    "customAttributes": {
      "Role": ["Employee"]
    },
    "application": ["<applicationId>"]
  }
  ```
- **Output**: `userId`

#### **Test 5: Create Lookup Item**
- **Endpoint**: POST `/v1/lookupItem`
- **Purpose**: Create a lookup item (e.g., Badge type)
- **Payload**:
  ```json
  {
    "applicationId": "<applicationId>",
    "name": "Badge <suffix>",
    "source": "upload"
  }
  ```
- **Output**: `lookupItemId`

#### **Test 6: Create Lookup Value**
- **Endpoint**: POST `/v1/lookupValue`
- **Purpose**: Create a lookup value (e.g., Bronze Badge)
- **Payload**:
  ```json
  {
    "value": "Bronze badge <suffix>",
    "lookupItemId": "<lookupItemId>",
    "sourceImgUrl": "https://stagegamificationui.blob.core.windows.net/assets/privilege-stage/1762793789495BRONZE.png",
    "imageAnimationUrl": ""
  }
  ```
- **Output**: `lookupValueId`

#### **Test 7: Create Privilege Stage**
- **Endpoint**: POST `/v1/privilegeStage`
- **Purpose**: Create a privilege stage (badge awarded at a certain point level)
- **Payload**:
  ```json
  {
    "lookupValue": "<lookupValueId>",
    "points": 100,
    "description": "When user get 100 points, they will achieve this badge",
    "application": "<applicationId>"
  }
  ```
- **Output**: `privilegeId`

#### **Test 8: Create VIP Tier**
- **Endpoint**: POST `/v1/vipTiers`
- **Purpose**: Create a VIP tier with benefits
- **Payload**:
  ```json
  {
    "name": "VIPE TIER LEVEL 1 <suffix>",
    "tierLevel": 1,
    "description": "<p>created this for testing</p>",
    "badges": ["<privilegeId>"],
    "imageUrl": "",
    "benefits": {
      "xFactor": 2,
      "bonusPoints": 100,
      "minDiscountValue": 1,
      "maxDiscountValue": 100
    },
    "application": "<applicationId>"
  }
  ```
- **Output**: `vipTierId`

#### **Test 9: Create Virtual Money**
- **Endpoint**: POST `/api/VirtualMoney/addOrUpdate`
- **Base URL**: https://stage-gamificationredemption.rewardrally.in
- **Purpose**: Create/update virtual currency for the application
- **Payload**:
  ```json
  {
    "name": "VIRTUAL MONEY",
    "value": 1,
    "imageUrl": "https://stagegamificationui.blob.core.windows.net/assets/virtual-money/1762795338897COINS.png",
    "gamificationApplicationId": "<applicationId>"
  }
  ```
- **Output**: Success response

#### **Test 10: Trigger Game Action for User (Final)**
- **Endpoint**: POST `/userCompletedGame/triggerGameAction`
- **Purpose**: Trigger a game action for a user (award points)
- **Payload**:
  ```json
  {
    "gameActionId": "<gameActionId>",
    "userId": "user_<suffix>",
    "correspondingUserId": "",
    "correspondingUserApplicationId": "",
    "point": "100"
  }
  ```
- **Output**: Success confirmation

---

## Authentication

All endpoints use Bearer token authentication via the `Authorization` header:

```
Authorization: Bearer <BEARER_ADMIN_TOKEN>
Content-Type: application/json
```

Tokens are set via environment variables:
- `BEARER_PROJECT_TOKEN` - For project-level operations
- `BEARER_ADMIN_TOKEN` - For admin operations

---

## Test Data Generation

The `utils/random.ts` utility generates unique suffixes for test data:

```typescript
export function makeRandomSuffix(): string {
  return `${getFormattedISTTime()}-${Math.random().toString(36).slice(2, 8)}`;
}
```

This ensures each test run creates unique project/application/game action names to avoid conflicts.

---

## Dependencies

### Core Dependencies
- **@playwright/test**: ^1.39.0 - Browser automation and testing framework
- **@types/node**: ^24.10.0 - TypeScript types for Node.js
- **dotenv**: ^16.0.0 - Environment variable management

### Development Tools
- **TypeScript**: Compiled to JavaScript before execution
- **Node.js**: Runtime environment

---

## Key Features

✅ **Serial Test Execution**: Tests run sequentially to maintain data flow  
✅ **Dependency Chaining**: Each test uses outputs from previous tests  
✅ **Comprehensive Logging**: Console logs show created resource IDs  
✅ **Error Validation**: Tests verify response status and message fields  
✅ **Random Data Generation**: Unique names prevent conflicts  
✅ **Full E2E Coverage**: Complete gamification flow from project to user action  
✅ **Flexible Execution**: UI mode, debug mode, headed mode supported  
✅ **HTML Reports**: Built-in test result reporting  

---

## Troubleshooting

### Tests Skip
**Issue**: Tests are skipped with "BEARER_PROJECT_TOKEN not set"  
**Solution**: Ensure environment variables are set before running tests

```powershell
$env:BEARER_PROJECT_TOKEN = "your-token"
$env:BASE_URL = "https://stage-gamificationapi.rewardrally.in"
$env:CLIENT_ID = "your-client-id"
```

### Tests Fail - Invalid Response
**Issue**: API returns unexpected response format  
**Solution**: Check that `BASE_URL` and `CLIENT_ID` are correct; verify bearer token is valid

### Playwright Not Found
**Issue**: "npx: command not found"  
**Solution**: Ensure Node.js and npm are installed and in PATH

```powershell
node --version
npm --version
```

---

## Future Enhancements

- [ ] Add teardown tests to clean up created resources
- [ ] Implement parameterized test data
- [ ] Add performance benchmarking
- [ ] Integrate with CI/CD pipeline
- [ ] Add retry logic for flaky endpoints
- [ ] Create fixture-based data sharing between tests

---

## Support & Documentation

- **Playwright Docs**: https://playwright.dev
- **API Staging**: https://stage-gamificationapi.rewardrally.in
- **Redemption API**: https://stage-gamificationredemption.rewardrally.in

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-11-11 | Initial release with 10-test E2E flow |

---

## License

Private project - RewardRally
