import { test as base } from '@playwright/test';

export type TestInfo = {
    projectId: string;
    applicationId: string;
};

export const fixtures = base.extend<TestInfo>({
    projectId: ['', { option: true }],
    applicationId: ['', { option: true }]
});

export const test = fixtures;