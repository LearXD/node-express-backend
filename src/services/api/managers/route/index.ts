import express from "express";
import morgan from "morgan";
import cors from "cors";

import fs from "fs";
import path from "path";

import { API } from "../..";
import { APIError } from "../../utils/error";

export class RouteManager {

    static readonly ROUTES_PATH = path.resolve(__dirname, "..", "..", "routes");
    static readonly ROUTE_EXTENSIONS = ['.route.ts', '.route.js'];

    constructor(
        private readonly api: API
    ) { }

    public init() {
        this.registerMiddlewares();
        this.registerRoutes();
        this.registerFallbackRoutes();
    }

    public registerMiddlewares() {
        this.api.getServer().use(cors());
        this.api.getServer().use(express.json());
        this.api.getServer().use(morgan('dev'));
    }

    public registerRoutes() {
        this.findRoutes();
    }

    public async findRoutes(dir: string = RouteManager.ROUTES_PATH) {
        const routes = fs.readdirSync(dir);

        routes.forEach(async (read) => {
            const readPath = path.resolve(dir, read);
            const route = '/' + dir.substring(RouteManager.ROUTES_PATH.length + 1).replace(/\\/g, "/");

            const stat = fs.statSync(readPath);

            if (stat.isDirectory()) {
                return this.findRoutes(readPath);
            }

            const isRoute = RouteManager.ROUTE_EXTENSIONS.some((ext) => read.endsWith(ext));
            if (isRoute) {
                console.log(`Registering route: ${route}`);
                const router = require(readPath);
                this.api.getServer().use(route, router.default);
            }

        });
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

    public getRoutes() {
        const routes = fs.readdirSync(RouteManager.ROUTES_PATH);
    }

}