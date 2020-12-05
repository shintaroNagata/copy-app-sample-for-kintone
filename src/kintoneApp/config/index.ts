import {
  KintoneFormLayout,
  KintoneRestAPIClient,
} from "@kintone/rest-api-client";
import {
  Properties,
  buildPropertiesToInitialize,
  isLookupFieldProperty,
} from "./properties";

type Layout = KintoneFormLayout.OneOf[];
type AppConfig = {
  name: string;
  description: string;
  properties: Properties;
  layout: Layout;
};

const getAppConfig = async ({
  client,
  appId,
}: {
  client: KintoneRestAPIClient;
  appId: string;
}): Promise<AppConfig> => {
  const { name, description } = await client.app.getAppSettings({ app: appId });
  const { properties } = await client.app.getFormFields({ app: appId });
  const { layout } = await client.app.getFormLayout({ app: appId });
  return { name, description, properties, layout };
};

const retrieveAllRelatedApps = async (params: {
  client: KintoneRestAPIClient;
  appId: string;
}) => {
  return retrieveAllRelatedAppsRecursive(params, []);
};

const retrieveAllRelatedAppsFromProperties = (
  params: {
    client: KintoneRestAPIClient;
    properties: Properties;
  },
  apps: Array<{ appId: string; config: AppConfig }>
): Promise<Array<{ appId: string; config: AppConfig }>> => {
  return Object.keys(params.properties).reduce(
    async (acc, fieldCode: string) => {
      const fieldProperty = params.properties[fieldCode];
      if (isLookupFieldProperty(fieldProperty)) {
        const relatedAppId = fieldProperty.lookup.relatedApp.app;
        return retrieveAllRelatedAppsRecursive(
          {
            client: params.client,
            appId: relatedAppId,
          },
          await acc
        );
      }
      if (fieldProperty.type === "SUBTABLE") {
        return retrieveAllRelatedAppsFromProperties(
          { client: params.client, properties: fieldProperty.fields },
          await acc
        );
      }
      return acc;
    },
    Promise.resolve(apps)
  );
};

const retrieveAllRelatedAppsRecursive = async (
  params: {
    client: KintoneRestAPIClient;
    appId: string;
  },
  apps: Array<{ appId: string; config: AppConfig }>
): Promise<Array<{ appId: string; config: AppConfig }>> => {
  if (
    apps.some(({ appId }) => {
      return appId === params.appId;
    })
  ) {
    return apps;
  }

  const config = await getAppConfig(params);

  const allRelatedApps = await retrieveAllRelatedAppsFromProperties(
    { client: params.client, properties: config.properties },
    apps
  );
  allRelatedApps.push({ appId: params.appId, config });
  return allRelatedApps;
};

export {
  AppConfig,
  getAppConfig,
  retrieveAllRelatedApps,
  buildPropertiesToInitialize,
};
