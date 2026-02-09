const { GenericContainer } = await import("testcontainers");
import path from "node:path";
import { startAppServer, stopAppServer } from "./util/app.server";
import { Wait } from "testcontainers";

const APP_PORT = 8081;
const isLinux = process.platform === "linux";
const isCI = process.env.CI === "true" || process.env.CI === "1";
const describeOrSkipInNonLinuxCI = isCI && !isLinux ? describe.skip : describe;

describeOrSkipInNonLinuxCI("Contract Tests", () => {
  /**
   * @type {import("testcontainers").GenericContainer}
   */
  let specmaticTestContainer;
  /**
   * @type {any}
   */
  let appServer;

  beforeAll(async () => {
    appServer = await startAppServer(APP_PORT);
    specmaticTestContainer = new GenericContainer("specmatic/specmatic")
      .withCommand([
        "test",
        "--host",
        "host.docker.internal",
        "--port",
        APP_PORT.toString(),
      ])
      .withEnvironment({ SPECMATIC_GENERATIVE_TESTS: "true" })
      .withBindMounts([
        {
          source: path.resolve("specmatic.yaml"),
          target: "/usr/src/app/specmatic.yaml",
        },
        {
          source: path.resolve("build/reports/specmatic"),
          target: "/usr/src/app/build/reports/specmatic",
        },
      ])
      .withLogConsumer((stream) => {
        stream.on("data", process.stdout.write);
        stream.on("err", process.stderr.write);
      })
      .withExtraHosts([
        { host: "host.docker.internal", ipAddress: "host-gateway" },
      ])
      .withWaitStrategy(Wait.forLogMessage("Tests run:"));
  }, 600_000);

  afterAll(async () => {
    await stopAppServer(appServer);
  });

  test("Run contract tests", async () => {
    let testContainerLogs = "";
    const container = await specmaticTestContainer.start();
    const stream = await container.logs();

    await new Promise((resolve) => {
      stream.on("data", (chunk) => (testContainerLogs += chunk.toString()));
      stream.on("err", (chunk) => (testContainerLogs += chunk.toString()));
      stream.on("close", resolve);
    });

    expect(testContainerLogs).toMatch(/Failures:\s*0/);
  }, 600_000);
});
