import { test, expect } from '@playwright/test';
import { makeRandomSuffix } from './utils/random';
import { APIService } from './services/api';

// Store IDs for the flow
export const testIds = {
    projectId: '',
    applicationId: ''
};

test.describe.serial('RewardRally API Flow', () => {
    test('1. Create new project', async ({ request }) => {
        const token = process.env.BEARER_PROJECT_TOKEN;
        test.skip(!token, 'BEARER_PROJECT_TOKEN not set — set it in the environment to run this test');

        const api = new APIService(request);
        
        // Create a new project
        const suffix = makeRandomSuffix();
        const name = `Playwright automation ${suffix}`;
        const description = `Playwright automation ${suffix}`;
        
        const createResponse = await api.createProject(name, description);
        expect(createResponse.data).toBeTruthy();
        expect(createResponse.message).toBe('AddorUpdate');
        
        console.log('Project created successfully');
    });

    test('2. Get all projects and store last project ID', async ({ request }) => {
        const api = new APIService(request);
        
        // List all projects
        const projectList = await api.listProjects();
        const projects = projectList.data.Items[0]?.projects || [];
        expect(projects.length).toBeGreaterThan(0);
        
        // Store the last project's ID
        const lastProject = projects[projects.length - 1];
        testIds.projectId = lastProject._id;
        
        console.log('Found projects:', {
            total: projects.length,
            lastProjectId: testIds.projectId,
            lastProjectName: lastProject.name
        });
    });
});
