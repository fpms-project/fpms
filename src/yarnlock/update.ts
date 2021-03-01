import { CalculatedResponse, FpmsPackage, YarnPackage, RequestToYarnPackMap } from "../types";
import { Range, satisfies, gt } from "semver";

export const convert = (obj: FpmsPackage): YarnPackage => {
  const v: YarnPackage = {
    version: obj.version,
    resolved: `https://registry.yarnpkg.com/${obj.name}/-/${
      obj.name.includes("@") ? obj.name.split("/")[1] : obj.name
    }-${obj.version}.tgz#${obj.shasum}`,
  };
  if (obj.integrity) v.integrity = obj.integrity;
  if (obj.dep && Object.keys(obj.dep).length > 0) v.dependencies = obj.dep;
  return v;
};

export const createRequestToYarnPackMap = (added: {
  request: { name: string; range: string | null };
  response: CalculatedResponse;
}): RequestToYarnPackMap => {
  const set: RequestToYarnPackMap = {};
  const list = added.response.packages.concat(added.response.target);
  list.forEach((v) => {
    const z = Object.entries(v.dep);
    for (const d of z) {
      const r = new Range(d[1]);
      const t = list
        .filter((v) => v.name === d[0] && satisfies(v.version, r))
        .sort((l, r) => (gt(l.version, r.version) ? 1 : -1))[0];
      set[d[0] + "@" + d[1]] = convert(t);
    }
  });
  // requestについて
  const range = added.request.range !== null ? added.request.range : "^" + added.response.target.version;
  const key = added.request.name + "@" + range;
  set[key] = convert(added.response.target);
  return set;
};
