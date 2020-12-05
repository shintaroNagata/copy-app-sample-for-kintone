import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { copyMultipleApps } from "../../src";

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

  copyMultipleApps({
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
