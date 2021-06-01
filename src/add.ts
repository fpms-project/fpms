import { PackageRequest, RequestToYarnPackMap } from "./types";
import * as fs from "fs";
import * as lockfile from "@yarnpkg/lockfile";
import * as child_process from "child_process";
import { requestCalculated } from "./client/fpms-server";
import { createRequestToYarnPackMap } from "./yarnlock/update";

const parsearg = (pack: string): PackageRequest => {
  const z = pack.lastIndexOf("@");
  if (z !== 0 && z !== -1) {
    const tmp = pack.slice(1).split("@");
    const name = pack[0] + tmp[0];
    const range = tmp[1];
    return { name, range };
  }
  return { name: pack, range: null };
};

const fetchData = async (
  packs: { name: string; range: string | null }[]
): Promise<{ map: RequestToYarnPackMap; requests: PackageRequest[] }> => {
  const v = await Promise.all(
    packs.map((v) => requestCalculated(v.name, v.range).then((r) => ({ request: v, response: r })))
  );
  const map = v.map((z) => createRequestToYarnPackMap(z)).reduce((p, c) => Object.assign(p, c));
  const requests = v.map((z) => {
    return {
      name: z.request.name,
      range: z.request.range ? z.request.range : "^" + z.response.target.version,
    };
  });
  return { map, requests };
};

const updateYarnLock = async (newmap: RequestToYarnPackMap) => {
  let updated;
  try {
    const yarnlock = (await fs.promises.readFile("yarn.lock")).toString();
    const parse = lockfile.parse(yarnlock);
    if (parse.type !== "success") throw new Error("error of reading yarn.lock");
    updated = Object.assign(parse.object, newmap);
  } catch {
    updated = newmap;
  }
  const s = lockfile.stringify(updated);
  await fs.promises.writeFile("yarn.lock", s);
  console.log("☑ update yarn.lock");
};

const updatePackageJson = async (added: PackageRequest[]) => {
  if (!fs.existsSync("package.json")) throw new Error("package.json not found");
  const p = JSON.parse(fs.readFileSync("package.json").toString());
  const v = p.dependencies || {};
  added.forEach((z) => {
    v[z.name] = z.range;
  });
  p.dependencies = v;
  await fs.promises.writeFile("package.json", JSON.stringify(p, null, 2));
  console.log("☑ update package.json");
};

const executeYarn = () => {
  console.log("");
  const s = child_process.spawn("yarn", { stdio: "inherit" });
  s.on("close", () => {
    console.log("\n☑ run yarn");
  });
};

export const add_package = async (args: string[], fetchonly = false): Promise<void> => {
  const packs = args.map((arg) => parsearg(arg));
  const { map, requests } = await fetchData(packs);
  console.log("☑ fetch packages from fpms");
  if (!fetchonly) {
    await Promise.all([updateYarnLock(map), updatePackageJson(requests)]);
    // exec yarn
    executeYarn();
  }
};
