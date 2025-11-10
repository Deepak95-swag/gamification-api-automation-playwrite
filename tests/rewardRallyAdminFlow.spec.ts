import { test } from './testFixtures';
import { expect } from '@playwright/test';
import { makeRandomSuffix } from './utils/random';
import { APIService } from './services/api';

test.describe.serial('RewardRally Complete Flow', () => {
    let projectId: string;
    let applicationId: string;
    let gameActionId: string;
    let userId: string;
    let lookupItemId: string;
    let lookupValueId: string;
    let privilegeId: string;
    let vipTierId: string;
    let virtualMoneyId: string;

    test('1. Create Project', async ({ request }) => {
        const api = new APIService(request);
        const suffix = makeRandomSuffix();
        const name = `Playwright automation ${suffix}`;
        const description = `Playwright automation ${suffix}`;

        // Create a new project
        const createResponse = await api.createProject(name, description);
        expect(createResponse.data).toBeTruthy();
        expect(createResponse.message).toBe('AddorUpdate');

        // Get projects and verify the created project
        const projectList = await api.listProjects();
        const projects = projectList.data.Items[0]?.projects || [];
        expect(projects.length).toBeGreaterThan(0);

        // Store the last created project's ID
        const lastProject = projects[projects.length - 1];
        expect(lastProject.name).toBe(name);
        projectId = lastProject._id;

        console.log('Project created:', {
            id: projectId,
            name: lastProject.name,
            description: lastProject.description
        });
    });

    test('2. Create Application', async ({ request }) => {
        expect(projectId, 'Project ID from previous step is required').toBeTruthy();

        const api = new APIService(request);
        const suffix = makeRandomSuffix();

        // Create application using project ID from previous step
        const response = await api.createApplication(
            projectId,
            `Application ${suffix}`
        );

        expect(response.data).toBeTruthy();
        expect(response.message).toBe('created');
        expect(response.data._id).toBeTruthy();

        // Store application ID for next step
        applicationId = response.data._id;

        console.log('Application created:', {
            id: applicationId,
            name: response.data.name,
            projectId: projectId
        });
    });

    test('3. Create Game Action', async ({ request }) => {
        expect(applicationId, 'Application ID from previous step is required').toBeTruthy();

        const api = new APIService(request);
        const suffix = makeRandomSuffix();

        // Create game action using application ID from previous step
        const response = await api.createGameAction(
            applicationId,
            `Game Action ${suffix}`
        );

        expect(response.data).toBeTruthy();
        expect(response.message).toBe('created');
        expect(response.data._id).toBeTruthy();

        console.log('Game Action created:', {
            id: response.data._id,
            name: response.data.name,
            points: response.data.points,
            applicationId: applicationId
        });

        // Store game action ID for next step
        gameActionId = response.data._id;
    });

    test('4. Create User', async ({ request }) => {

        expect(applicationId, 'Application ID from previous step is required').toBeTruthy();

        const api = new APIService(request);
        const suffix = makeRandomSuffix();
        userId = `user_${suffix}`;
        const userName = `Test User ${suffix}`;

        // Create user with application ID from previous step
        const response = await api.createUser(
            applicationId,
            userId,
            userName
        );

        expect(response.data).toBeTruthy();
        expect(response.message).toBe('created');
        expect(response.data._id).toBeTruthy();
        expect(response.data.userId).toBe(userId);

        console.log('User created:', {
            id: response.data._id,
            userId: response.data.userId,
            userName: response.data.userName,
            applicationId: applicationId
        });
    });

    test('5. Create Lookup Item', async ({ request }) => {
        expect(applicationId, 'Application ID from previous step is required').toBeTruthy();

        const api = new APIService(request);
        const suffix = makeRandomSuffix();
        const name = `Badge ${suffix}`;

        const response = await api.createLookupItem(
            applicationId,
            name,
            'upload'
        );

        // response may include data._id or _id at top level depending on API
        const lookupItemIdResp = response.data?._id || response._id || response.data?._id;
        expect(lookupItemIdResp).toBeTruthy();
        lookupItemId = lookupItemIdResp;

        console.log('Lookup Item created:', {
            id: lookupItemId,
            name,
            applicationId
        });
    });

    test('6. Create Lookup Value', async ({ request }) => {
        expect(lookupItemId, 'Lookup Item ID from previous step is required').toBeTruthy();

        const api = new APIService(request);
        const valueName = `Bronze badge ${makeRandomSuffix()}`;
        const sourceImgUrl = 'https://stagegamificationui.blob.core.windows.net/assets/privilege-stage/1762793789495BRONZE.png';

        const response = await api.createLookupValue(
            valueName,
            lookupItemId,
            sourceImgUrl,
            ''
        );

        const lookupValueIdResp = response.data?._id || response._id || response.data?._id;
        expect(lookupValueIdResp).toBeTruthy();
        lookupValueId = lookupValueIdResp;

        console.log('Lookup Value created:', {
            id: lookupValueId,
            value: valueName,
            lookupItemId
        });
    });

    test('7. Create Privilege Stage', async ({ request }) => {
        expect(lookupValueId, 'Lookup Value ID from previous step is required').toBeTruthy();
        expect(applicationId, 'Application ID from previous steps is required').toBeTruthy();

        const api = new APIService(request);
        const description = 'When user get 100 points, they will achieve this badge';

        const response = await api.createPrivilegeStage(
            lookupValueId,
            100,
            description,
            applicationId
        );

        const privilegeIdResp = response.data?._id || response._id || response.data?._id;
        expect(privilegeIdResp).toBeTruthy();
        privilegeId = privilegeIdResp;

        console.log('Privilege Stage created:', {
            id: privilegeId,
            lookupValueId,
            points: 100,
            applicationId
        });
    });

    test('8. Create VIP Tier', async ({ request }) => {
        expect(privilegeId, 'Privilege ID from previous step is required').toBeTruthy();
        expect(applicationId, 'Application ID is required').toBeTruthy();

        const api = new APIService(request);
        const name = `VIPE TIER LEVEL 1 ${makeRandomSuffix()}`;
        const tierLevel = 1;
        const description = '<p>created this for testing</p>';
        // Use created privilegeId as badge
        const badges = [privilegeId];
        const imageUrl = '';
        const benefits = {
            xFactor: 2,
            bonusPoints: 100,
            minDiscountValue: 1,
            maxDiscountValue: 100
        };

        const response = await api.createVipTier(
            name,
            tierLevel,
            description,
            badges,
            imageUrl,
            benefits,
            applicationId
        );

        const vipTierIdResp = response.data?._id || response._id || response.data?._id;
        expect(vipTierIdResp).toBeTruthy();
        vipTierId = vipTierIdResp;

        console.log('VIP Tier created:', {
            id: vipTierId,
            name,
            tierLevel,
            badges,
            applicationId
        });
    });

    test('9. Create Virtual Money', async ({ request }) => {
        expect(applicationId, 'Application ID is required').toBeTruthy();

        const api = new APIService(request);
        const name = 'VIRTUAL MONEY';
        const value = 1;
        const imageUrl = 'https://stagegamificationui.blob.core.windows.net/assets/virtual-money/1762795338897COINS.png';

        const response = await api.createVirtualMoney(
            name,
            value,
            imageUrl,
            applicationId
        );

        const vmIdResp = response.data?._id || response._id || response.data?._id || response.data?._id;
        // endpoint may return the created entity or success message; ensure truthy response
        expect(response).toBeTruthy();
        if (vmIdResp) {
            virtualMoneyId = vmIdResp;
        }

        console.log('Virtual Money created/updated:', {
            id: virtualMoneyId || '(no id returned)',
            name,
            value,
            applicationId
        });
    });

    test('10. Trigger Game Action for User', async ({ request }) => {
        expect(gameActionId, 'Game Action ID from previous step is required').toBeTruthy();
        expect(userId, 'User ID from previous step is required').toBeTruthy();

        const api = new APIService(request);

        // Trigger game action for the user
        const response = await api.triggerGameAction(
            gameActionId,
            userId,
            "100"
        );

        expect(response).toBeTruthy();

        console.log('Game Action triggered (final):', {
            gameActionId: gameActionId,
            userId: userId,
            points: "100"
        });
    });
});