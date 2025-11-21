export default defineTask({
  meta: {
    name: "run-filters",
    description: "Run filters",
  },
  run() {
    console.log("Running filters...");
    return { result: "Success" };
  },
});
