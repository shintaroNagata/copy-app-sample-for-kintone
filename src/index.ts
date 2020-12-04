import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { getAllRelatedAppsConfig, getAppConfig } from "./kintoneApp/config";
import { releaseApp } from "./kintoneApp/management";

const copySingleApp = async ({
  from,
  to,
}: {
  from: { client: KintoneRestAPIClient; appId: string };
  to: { client: KintoneRestAPIClient };
}) => {
  const fromAppConfig = await getAppConfig({
    client: from.client,
    appId: from.appId,
  });
  return releaseApp({ client: to.client, config: fromAppConfig });
};

const getAllRelatedApps = async ({
  from,
}: {
  from: { client: KintoneRestAPIClient; appId: string };
}) => {
  return getAllRelatedAppsConfig({ client: from.client, appId: from.appId });
};

export { copySingleApp, getAllRelatedApps };
