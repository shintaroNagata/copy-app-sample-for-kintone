// References:
// [1] テスト環境で作ったアプリを運用環境にデプロイしてみよう 前編 https://developer.cybozu.io/hc/ja/articles/204851030
// [2] テスト環境で作ったアプリを運用環境にデプロイしてみよう 後編 https://developer.cybozu.io/hc/ja/articles/204930710

import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { copySingleApp } from "../../src";

const processEnv = (name: string): string => {
  const value = process.env[name];
  if (typeof value !== "string") {
    throw new Error(`${name} does not exist`);
  }
  return value;
};

export const run = () => {
  const fromAppId = process.argv[2];
  const fromBaseUrl = processEnv("FROM_BASE_URL");
  const toBaseUrl = processEnv("TO_BASE_URL");
  const fromUsername = processEnv("FROM_USERNAME");
  const fromPassword = processEnv("FROM_PASSWORD");
  const toUsername = processEnv("TO_USERNAME");
  const toPassword = processEnv("TO_PASSWORD");

  copySingleApp({
    from: {
      appId: fromAppId,
      client: new KintoneRestAPIClient({
        baseUrl: fromBaseUrl,
        auth: { username: fromUsername, password: fromPassword },
      }),
    },
    to: {
      client: new KintoneRestAPIClient({
        baseUrl: toBaseUrl,
        auth: { username: toUsername, password: toPassword },
      }),
    },
  });
};
