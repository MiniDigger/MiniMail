import { startWorker } from "jazz-tools/worker";

export default defineTask({
  meta: {
    name: "test",
    description: "test",
  },
  async run({ payload, context }) {
    const {
      public: { jazzServerUrl, jazzApiKey },
    } = useRuntimeConfig();
    const peer = jazzServerUrl + (jazzApiKey ? `?key=${jazzApiKey}` : "");

    const { worker } = await startWorker({
      AccountSchema: MyWorkerAccount,
      syncServer: peer,
      accountID: process.env.JAZZ_WORKER_ACCOUNT || "co_zDJNYtPykdq1sFKpH27wAoYnGQX",
      accountSecret:
        process.env.JAZZ_WORKER_SECRET ||
        "sealerSecret_z7wJbwgEGrdmvVFqz3jNtxs39z19GeXVKP9qdQSzsuEmj/signerSecret_z3AFog7BAfZLqLnnqujRJScCQKR4jjuGurGqnFnyU9ezF",
    });

    return { result: "Success" };
  },
});
