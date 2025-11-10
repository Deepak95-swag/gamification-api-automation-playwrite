import { test } from './testFixtures';
import { expect } from '@playwright/test';
import { makeRandomSuffix } from './utils/random';
import { APIService } from './services/api';

test.describe.serial('RewardRally Complete Flow', () => {
    let projectId: string;
    let applicationId: string;
    let gameActionId: string;
    let userId: string;

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

    test('5. Trigger Game Action for User', async ({ request }) => {

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

        console.log('Game Action triggered:', {
            gameActionId: gameActionId,
            userId: userId,
            points: "100"
        });
    });
});