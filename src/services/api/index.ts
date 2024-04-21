import express from "express";

import { APIConfig } from "./types";
import { RouteManager } from "./managers/route";

export class API {

    private server: express.Application;

    private routeManager: RouteManager;

    private initialized: boolean = false;
    private running: boolean = false;

    constructor(
        private readonly config: APIConfig
    ) {
        this.routeManager = new RouteManager(this);
    }

    public async start() {
        return new Promise((resolve) => {
            this.server = express();
            this.init();
            this.server.listen(this.config.port, () => resolve(this.config.port));
        });
    }

    public init() {
        if (this.initialized) {
            return false;
        }

        this.routeManager.init();
        this.initialized = true;
    }

    public getServer() {
        return this.server;
    }
}