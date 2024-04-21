import express from "express";

import { API } from "../..";
import { APIError } from "../../utils/error";

export class RouteManager {

    constructor(
        private readonly api: API
    ) { }

    public init() {

    }

    public registerRoutes() {

    }

    public registerFallbackRoutes() {
        this.api.getServer().use((req, res) => {
            res.status(404).send({ success: false, message: "Route not found" });
        });

        this.api.getServer().use((
            error: Error | APIError,
            req: express.Request,
            res: express.Response,
            next: express.NextFunction
        ) => {
            if (error instanceof APIError) {
                res.status(error.code).send(error.toJSON());
                return;
            }

            if (error instanceof Error && error.message) {
                res.status(500).send({ success: false, message: error.message });
                return;
            }

            if (typeof error === "string") {
                res.status(500).send({ success: false, message: error });
                return;
            }

            res.status(500).send({ success: false, message: "Internal server error" });
        });
    }

}