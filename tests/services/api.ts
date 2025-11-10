import { APIRequestContext } from '@playwright/test';

export class APIService {
    constructor(
        private request: APIRequestContext,
        private baseUrl = process.env.BASE_URL,
        private clientId = process.env.CLIENT_ID,
        private token = process.env.BEARER_PROJECT_TOKEN
    ) { }

    private getHeaders() {
        return {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
        };
    }

    async listProjects(page = 1, perPage = 10000): Promise<any> {
        const response = await this.request.get(
            `${this.baseUrl}/v1/projects/client/${this.clientId}/${page}/${perPage}`,
            { headers: this.getHeaders() }
        );
        return await response.json();
    }

    async createProject(name: string, description: string): Promise<any> {
        const response = await this.request.put(
            `${this.baseUrl}/v1/projects/client/${this.clientId}`,
            {
                headers: this.getHeaders(),
                data: { name, description }
            }
        );
        return await response.json();
    }

    async createApplication(projectId: string, name: string): Promise<any> {
        const payload = {
            name,
            emailId: "",
            description: "Created for automation testing",
            isSpecialDayPoints: false,
            domain: "it",
            recognitionLimit: 0,
            coinConversionRate: 1,
            privilegeName: "Badge",
            appSpecificId: [],
            projectId,
            clientId: this.clientId
        };

        const response = await this.request.post(
            `${this.baseUrl}/v1/applications`,
            {
                headers: this.getHeaders(),
                data: payload
            }
        );
        return await response.json();
    }

    async getLastCreatedProject(): Promise<any> {
        const list = await this.listProjects(1, 10);
        const projects = list.data?.Items[0]?.projects || [];
        return projects.length > 0 ? projects[projects.length - 1] : null;
    }

    async createGameAction(applicationId: string, name: string): Promise<any> {
        const payload = {
            name,
            points: 100,
            description: "Created for testing",
            gameCountPerDay: 100,
            minPoints: null,
            maxPoints: null,
            isDecision: false,
            decisionPoints: 0,
            application: applicationId
        };

        const response = await this.request.post(
            `${this.baseUrl}/v1/gameAction`,
            {
                headers: this.getHeaders(),
                data: payload
            }
        );
        return await response.json();
    }

    async createUser(applicationId: string, userId: string, userName: string): Promise<any> {
        const payload = {
            userId,
            userName,
            customAttributes: {
                Role: ["Employee"]
            },
            application: [applicationId]
        };

        const response = await this.request.post(
            `${this.baseUrl}/v1/users/addUser`,
            {
                headers: this.getHeaders(),
                data: payload
            }
        );
        return await response.json();
    }

    async triggerGameAction(gameActionId: string, userId: string, points: string): Promise<any> {
        const payload = {
            gameActionId,
            userId,
            correspondingUserId: "",
            correspondingUserApplicationId: "",
            point: points
        };

        const response = await this.request.post(
            `${this.baseUrl}/userCompletedGame/triggerGameAction`,
            {
                headers: this.getHeaders(),
                data: payload
            }
        );
        return await response.json();
    }
}