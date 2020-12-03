import {
  KintoneFormLayout,
  KintoneRestAPIClient,
} from "@kintone/rest-api-client";
import { Properties, buildPropertiesToInitialize } from "./properties";

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
  appId: number;
}): Promise<AppConfig> => {
  const { name, description } = await client.app.getAppSettings({ app: appId });
  const { properties } = await client.app.getFormFields({ app: appId });
  const { layout } = await client.app.getFormLayout({ app: appId });
  return { name, description, properties, layout };
};

export { AppConfig, getAppConfig, buildPropertiesToInitialize };
