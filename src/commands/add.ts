import { Command, flags } from "@oclif/command";
import * as lockfile from "@yarnpkg/lockfile";
import * as child_process from "child_process";
import * as fs from "fs";
import { requestCalculated } from "../client/fpms-server";
import { PackageRequest, RequestToYarnPackMap } from "../types";
import { createRequestToYarnPackMap } from "../yarnlock/update";
import * as debug from "debug";

export default class Add extends Command {
  static strict = false;

  static flags = {
    "fetch-only": flags.boolean({ default: false, description: "only fetching data from fpms" }),
    verbose: flags.boolean({ default: false, description: "output verbose message" }),
  };

  static description = "add package";

  private d = debug("add command");

  async run() {
    // parse argument
    const { argv, flags } = this.parse(Add);
    if (argv.length === 0) this._help();
    // fetch data from fpms and sconvert fpms data
    const packs = argv.map((arg) => this.parsearg(arg));
    const { map, requests } = await this.fetchData(packs);
    this.log("☑ fetch packages from fpms");
    if (!flags["fetch-only"]) {
      await Promise.all([this.updateYarnLock(map), this.updatePackageJson(requests)]);
      this.d("updated files");
      // exec yarn
      this.executeYarn();
    }
  }

  private parsearg(pack: string): PackageRequest {
    // react -> react, null
    // @types/node -> @types/node, null
    // react@* -> react, *
    // @types/node@* -> @types/node, null
    const z = pack.lastIndexOf("@");
    if (z !== 0 && z !== -1) {
      const tmp = pack.slice(1).split("@");
      const name = pack[0] + tmp[0];
      const range = tmp[1];
      return { name, range };
    }
    return { name: pack, range: null };
  }

  private async fetchData(
    packs: { name: string; range: string | null }[]
  ): Promise<{ map: RequestToYarnPackMap; requests: PackageRequest[] }> {
    this.d("start fetch data");
    const v = await Promise.all(
      packs.map((v) => requestCalculated(v.name, v.range).then((r) => ({ request: v, response: r })))
    );
    this.d("end fetch data");
    const map = v.map((z) => createRequestToYarnPackMap(z)).reduce((p, c) => Object.assign(p, c));
    const requests = v.map((z) => {
      return {
        name: z.request.name,
        range: z.request.range ? z.request.range : "^" + z.response.target.version,
      };
    });
    this.d("end convert data");
    return { map, requests };
  }

  private async updateYarnLock(newmap: RequestToYarnPackMap) {
    let updated;
    if (fs.existsSync("yarn.lock")) {
      const yarnlock = (await fs.promises.readFile("yarn.lock")).toString();
      const parse = lockfile.parse(yarnlock);
      if (parse.type !== "success") throw new Error("error of reading yarn.lock");
      updated = Object.assign(parse.object, newmap);
    } else {
      updated = newmap;
    }
    const s = lockfile.stringify(updated);
    await fs.promises.writeFile("yarn.lock", s);
    this.log("☑ update yarn.lock");
  }

  private async updatePackageJson(added: PackageRequest[]) {
    if (!fs.existsSync("package.json")) throw new Error("package.json not found");
    const p = JSON.parse(fs.readFileSync("package.json").toString());
    const v = p.dependencies || {};
    added.forEach((z) => {
      v[z.name] = z.range;
    });
    p.dependencies = v;
    await fs.promises.writeFile("package.json", JSON.stringify(p, null, 2));
    this.log("☑ update package.json");
  }

  private executeYarn() {
    this.log("");
    const s = child_process.spawn("yarn", { stdio: "inherit" });
    s.on("close", () => {
      this.log("\n☑ run yarn");
    });
  }
}
