import { test } from './testFixtures';
import { expect } from '@playwright/test';
import { makeRandomSuffix } from './utils/random';
import { APIService } from './services/api';

test.describe('RewardRally API Flow', () => {
    test('3. Create Game Action', async ({ request }) => {
        const token = process.env.BEARER_PROJECT_TOKEN;
        test.skip(!token, 'BEARER_PROJECT_TOKEN not set');

        // Get application ID from previous test
        const annotations = test.info().annotations;
        const appAnnotation = annotations.find(a => a.type === 'Application ID');
        const applicationId = appAnnotation?.description;
        expect(applicationId, 'No application ID from previous test').toBeTruthy();

        const api = new APIService(request);
        const suffix = makeRandomSuffix();
        
        // Create game action using application ID from previous test
        const response = await api.createGameAction(
            applicationId!,
            `Game Action ${suffix}`
        );

        expect(response.data).toBeTruthy();
        expect(response.message).toBe('created');
        expect(response.data._id).toBeTruthy();

        // Store game action ID for reference
        test.info().annotations.push({
            type: 'Game Action ID',
            description: response.data._id
        });

        console.log('Created Game Action:', {
            id: response.data._id,
            name: response.data.name,
            points: response.data.points,
            applicationId: applicationId
        });
    });
});