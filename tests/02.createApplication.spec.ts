import { test } from './testFixtures';
import { expect } from '@playwright/test';
import { makeRandomSuffix } from './utils/random';
import { APIService } from './services/api';

test.describe('RewardRally API Flow', () => {
    test('2. Create Application', async ({ request }) => {
        const token = process.env.BEARER_PROJECT_TOKEN;
        test.skip(!token, 'BEARER_PROJECT_TOKEN not set');

        // Get project ID from previous test
        const annotations = test.info().annotations;
        const projectAnnotation = annotations.find(a => a.type === 'Project ID');
        const projectId = projectAnnotation?.description;
        expect(projectId, 'No project ID from previous test').toBeTruthy();

        const api = new APIService(request);
        const suffix = makeRandomSuffix();
        
        // Create application
        const response = await api.createApplication(
            projectId!,
            `Application ${suffix}`
        );

        expect(response.data).toBeTruthy();
        expect(response.message).toBe('created');
        expect(response.data._id).toBeTruthy();

        // Store for next test
        test.info().annotations.push({
            type: 'Application ID',
            description: response.data._id
        });

        console.log('Application created:', {
            id: response.data._id,
            name: response.data.name,
            projectId: projectId
        });
    });
});