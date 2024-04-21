import { API } from "./services/api";
import { Environment } from "./utils/environment";

const api = new API({ port: Environment.getApiPort() });
api.start().then((port) => {
    console.log(`API running on port ${port}`);
})