export default defineTask({
  meta: {
    name: "run-filters",
    description: "Run filters",
  },
  run({ payload, context }) {
    console.log("Running filters...");
    return { result: "Success" };
  },
});
