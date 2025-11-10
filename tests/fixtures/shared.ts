import { test as base } from '@playwright/test';

export type TestIds = {
    projectId?: string;
    applicationId?: string;
    gameActionId?: string;
};

export const test = base.extend<TestIds>({
    projectId: [async ({ }, use) => {
        await use('');
    }, { option: true }],
    applicationId: [async ({ }, use) => {
        await use('');
    }, { option: true }],
});