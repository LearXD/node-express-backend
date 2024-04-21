export class Environment {
    static get<T>(key: string, defaultValue?: T): T | any {
        return process.env[key] || defaultValue;
    }

    static getApiPort(): number {
        return this.get<number>('SERVER_PORT', 3000);
    }
}