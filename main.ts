import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { add_package } from "./src/add";

yargs(hideBin(process.argv)).command(
  "add [packages..]",
  "add package",
  (yargs) => {
    return yargs.option("fetch-only", { type: "boolean", description: "only fetching data from fpms" });
  },
  (argv) => {
    if (argv.packages !== undefined) {
      add_package(argv.packages as string[], argv["fetch-only"]);
    }
  }
).argv;
