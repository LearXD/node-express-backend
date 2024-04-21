import express from "express";

import { APIConfig } from "./types";

export class API {

    private server: express.Application;

    private initialized: boolean = false;
    private running: boolean = false;

    constructor(
        private readonly config: APIConfig
    ) {
    }

    public start() {
        return new Promise((resolve) => {
            this.server = express();
            this.server.listen(this.config.port, () => resolve(this.config.port));
        });
    }

    public init() {
        if (this.initialized) {
            return;
        }


    }

    public getServer() {
        return this.server;
    }
}