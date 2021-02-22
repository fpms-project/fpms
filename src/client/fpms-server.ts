import { CalculatedResponse } from "../types";
import fetch from "node-fetch";

const base = "http://matsuri.cs.ise.shibaura-it.ac.jp/";

export const requestCalculated = async (
  name: string,
  range: string | null = null
) => {
  const url = `${base}/calculated/${name}${
    range !== null ? "?range=" + encodeURIComponent(range) : ""
  }`;
  return fetch(url)
    .then((v) => v.json())
    .then((v) => v as CalculatedResponse);
};
