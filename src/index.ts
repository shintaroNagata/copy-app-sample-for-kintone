import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { getAppConfig } from "./kintoneApp/config";
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

export { copySingleApp };
