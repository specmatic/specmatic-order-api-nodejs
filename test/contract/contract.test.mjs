import { test } from "@jest/globals";
import specmatic from "specmatic";
import { getApp, startAppServer, stopAppServer } from "./util/app.server.js";

const APP_HOST = "localhost";
const APP_PORT = 8081;

const appServer = await startAppServer(APP_PORT);
await specmatic.testWithApiCoverage(getApp(), APP_HOST, APP_PORT);
specmatic.showTestResults(test);
await stopAppServer(appServer);
