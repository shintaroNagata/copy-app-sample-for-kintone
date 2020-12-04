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

const retrieveAllRelatedAppsConfig = async (params: {
  client: KintoneRestAPIClient;
  appId: string;
}) => {
  return retrieveAllRelatedAppsConfigRecursive(params, []);
};

const retrieveAllRelatedAppsConfigFromProperties = (
  params: {
    client: KintoneRestAPIClient;
    properties: Properties;
  },
  appsConfig: Array<{ appId: string; appConfig: AppConfig }>
): Promise<Array<{ appId: string; appConfig: AppConfig }>> => {
  return Object.keys(params.properties).reduce(
    async (
      acc: Promise<Array<{ appId: string; appConfig: AppConfig }>>,
      fieldCode: string
    ) => {
      const fieldProperty = params.properties[fieldCode];
      if (isLookupFieldProperty(fieldProperty)) {
        const relatedAppId = fieldProperty.lookup.relatedApp.app;
        return retrieveAllRelatedAppsConfigRecursive(
          {
            client: params.client,
            appId: relatedAppId,
          },
          await acc
        );
      }
      if (fieldProperty.type === "SUBTABLE") {
        return retrieveAllRelatedAppsConfigFromProperties(
          { client: params.client, properties: fieldProperty.fields },
          await acc
        );
      }
      return acc;
    },
    Promise.resolve(appsConfig)
  );
};

const retrieveAllRelatedAppsConfigRecursive = async (
  params: {
    client: KintoneRestAPIClient;
    appId: string;
  },
  appConfigs: Array<{ appId: string; appConfig: AppConfig }>
): Promise<Array<{ appId: string; appConfig: AppConfig }>> => {
  if (
    appConfigs.some(({ appId }) => {
      return appId === params.appId;
    })
  ) {
    return appConfigs;
  }

  const config = await getAppConfig(params);

  const allRelatedAppsConfig = await retrieveAllRelatedAppsConfigFromProperties(
    { client: params.client, properties: config.properties },
    appConfigs
  );
  allRelatedAppsConfig.push({ appId: params.appId, appConfig: config });
  return allRelatedAppsConfig;
};

export {
  AppConfig,
  getAppConfig,
  retrieveAllRelatedAppsConfig,
  buildPropertiesToInitialize,
};
