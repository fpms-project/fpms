export type PackageRequest = {
  name: string;
  range: string | null;
};

export type FpmsPackage = {
  name: string;
  version: string;
  shasum: string;
  integrity?: string;
  dep: { [key: string]: string };
};

export type YarnPackage = {
  version: string;
  resolved: string;
  integrity?: string;
  dependencies?: { [key: string]: string };
};

export type RequestToYarnPackMap = { [key: string]: YarnPackage };

export type CalculatedResponse = {
  target: FpmsPackage;
  packages: Array<FpmsPackage>;
};
