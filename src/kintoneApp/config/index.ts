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

const getAllRelatedAppsConfig = async (params: {
  client: KintoneRestAPIClient;
  appId: string;
}) => {
  return getAllRelatedAppsConfigRecursive(params, []);
};

const getAllRelatedAppsConfigRecursive = async (
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

  const search = (
    current: Promise<Array<{ appId: string; appConfig: AppConfig }>>,
    properties: Properties
  ): Promise<Array<{ appId: string; appConfig: AppConfig }>> => {
    return Object.keys(properties).reduce(
      async (
        acc: Promise<Array<{ appId: string; appConfig: AppConfig }>>,
        fieldCode: string
      ) => {
        const fieldProperty = properties[fieldCode];
        if (isLookupFieldProperty(fieldProperty)) {
          const relatedAppId = fieldProperty.lookup.relatedApp.app;
          return getAllRelatedAppsConfigRecursive(
            {
              client: params.client,
              appId: relatedAppId,
            },
            await acc
          );
        }
        if (fieldProperty.type === "SUBTABLE") {
          return search(acc, fieldProperty.fields);
        }
        return acc;
      },
      Promise.resolve(current)
    );
  };

  const children = await search(Promise.resolve(appConfigs), config.properties);
  children.push({ appId: params.appId, appConfig: config });
  return children;
};

export {
  AppConfig,
  getAppConfig,
  getAllRelatedAppsConfig,
  buildPropertiesToInitialize,
};
