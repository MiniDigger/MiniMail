export default defineTask({
  meta: {
    name: "filters:run",
    description: "Run filters",
  },
  run({ payload, context }) {
    console.log("Running filters...");
    return { result: "Success" };
  },
});
