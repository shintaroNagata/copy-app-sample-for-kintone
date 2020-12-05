import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { getAppConfig, retrieveAllRelatedApps } from "./kintoneApp/config";
import { releaseApp, releaseRelatedApps } from "./kintoneApp/management";

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

const copyMultipleApps = async ({
  from,
  to,
}: {
  from: { client: KintoneRestAPIClient; appId: string };
  to: { client: KintoneRestAPIClient };
}) => {
  const apps = await retrieveAllRelatedApps(from);
  return releaseRelatedApps({ ...to, apps });
};

export { copySingleApp, copyMultipleApps };
