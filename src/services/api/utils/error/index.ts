export class APIError extends Error {

    constructor(
        message: string,
        public readonly code: number
    ) {
        super(message);
    }

    public getStatusCode() {
        return this.code;
    }

    public toJSON() {
        return {
            success: false,
            message: this.message
        };
    }
}