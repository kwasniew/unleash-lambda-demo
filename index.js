import {
    startUnleash,
    InMemStorageProvider,
    destroyWithFlush,
} from "unleash-client";

let unleash;

async function init() {
    if (!unleash) {
        console.log("[runtime] Starting unleash");
        unleash = await startUnleash({
            url: "https://app.unleash-hosted.com/demo/api/",
            appName: "lambda-example-app",
            customHeaders: {
                authorization: 'demo-app:dev.9fc74dd72d2b88bea5253c04240b21a54841f08d9918046ed55a06b5',
            },
            storageProvider: new InMemStorageProvider(),
        });
        unleash.on("initialized", () =>
            console.log("[runtime] Unleash initialized")
        );
    }
}

export const handler = async (event, context) => {
    // Only the first invocation will trigger SDK initialization.
    await init();

    const isEnabled = unleash.isEnabled("example-flag");

    return {
        statusCode: 200,
        body: {
            message: `Feature flag 'example-flag' is ${
                isEnabled ? "enabled" : "disabled"
            }`,
        },
    };
};

handler().then(console.log).catch(console.error);