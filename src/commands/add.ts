import { Command, flags } from "@oclif/command";
import * as lockfile from "@yarnpkg/lockfile";
import * as child_process from "child_process";
import { SingleBar } from "cli-progress";
import * as fs from "fs";
import { requestCalculated } from "../client/fpms-server";
import { PackageRequest, RequestToYarnPackMap } from "../types";
import { createRequestToYarnPackMap } from "../yarnlock/update";

export default class Add extends Command {
  static strict = false;

  static flags = {
    "fetch-only": flags.boolean({ default: false, description: "only fetching data from fpms" }),
  };

  static description = "add package";

  async run() {
    // parse argument
    const { argv, flags } = this.parse(Add);
    if (argv.length === 0) this._help();
    // fetch data from fpms and sconvert fpms data
    const packs = argv.map((arg) => this.parsearg(arg));
    const { map, requests } = await this.fetchData(packs);
    console.log("☑ fetch packages from fpms");
    if (!flags["fetch-only"]) {
      this.updateYarnLock(map);
      console.log("☑ update yarn.lock");
      // update package.json
      this.updatePackageJson(requests);
      console.log("☑ update package.json");
      // exec yarn
      this.executeYarn();
    }
  }

  private parsearg(pack: string) {
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
    const bar = new SingleBar({});
    bar.start(packs.length, 0);
    const v = await Promise.all(
      packs.map((v) =>
        requestCalculated(v.name, v.range).then((v) => {
          bar.increment();
          return v;
        })
      )
    );
    bar.stop();
    return {
      map: v.map((z) => createRequestToYarnPackMap(z)).reduce((p, c) => Object.assign(p, c)),
      requests: v.map((z) => z.request),
    };
  }

  private updateYarnLock(newmap: RequestToYarnPackMap) {
    let updated;
    if (fs.existsSync("yarn.lock")) {
      const yarnlock = fs.readFileSync("yarn.lock").toString();
      const parse = lockfile.parse(yarnlock);
      if (parse.type !== "success") throw new Error("error of reading yarn.lock");
      updated = Object.assign(parse.object, newmap);
    } else {
      updated = newmap;
    }
    const s = lockfile.stringify(updated);
    fs.writeFileSync("yarn.lock", s);
  }

  private updatePackageJson(added: { name: string; range: string }[]) {
    if (!fs.existsSync("package.json")) throw new Error("package.json not found");
    const p = JSON.parse(fs.readFileSync("package.json").toString());
    const v = p.dependencies || {};
    added.forEach((z) => {
      v[z.name] = z.range;
    });
    p.dependencies = v;
    fs.writeFileSync("package.json", JSON.stringify(p, null, 2));
  }

  private executeYarn() {
    console.log("");
    const s = child_process.spawn("yarn", { stdio: "inherit" });
    s.on("close", () => {
      console.log("");
      console.log("☑ run yarn");
    });
  }
}
