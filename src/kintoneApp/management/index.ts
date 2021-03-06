import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import {
  AppConfig,
  buildPropertiesToInitialize,
  modifyLookupReferences,
} from "../config";

const deployAppAndWait = async ({
  client,
  appId,
  revision,
}: {
  client: KintoneRestAPIClient;
  appId: string;
  revision?: string;
}) => {
  client.app.deployApp({
    apps: [{ app: appId, revision }],
  });

  let deployStatus: "PROCESSING" | "SUCCESS" | "FAIL" | "CANCEL" = "PROCESSING";
  while (deployStatus === "PROCESSING") {
    // wait 1 second per loop.
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
    const { apps } = await client.app.getDeployStatus({
      apps: [appId],
    });
    deployStatus = apps[0].status;
  }
  if (deployStatus !== "SUCCESS") {
    throw new Error(`Release does not succeed: ${deployStatus}`);
  }
};

const initializeForm = async ({
  client,
  config,
  appId,
  revision,
}: {
  client: KintoneRestAPIClient;
  config: AppConfig;
  appId: string;
  revision?: string;
}) => {
  const { properties: currentProperties } = await client.app.getFormFields({
    app: appId,
    preview: true,
  });

  const { propertiesForAdd, propertiesForUpdate } = buildPropertiesToInitialize(
    {
      currentProperties,
      newProperties: config.properties,
    }
  );

  const { revision: fieldUpdatedRevision } = await client.app.updateFormFields({
    app: appId,
    properties: propertiesForUpdate,
    revision,
  });

  const { revision: fieldsAddedRevision } = await client.app.addFormFields({
    app: appId,
    properties: propertiesForAdd,
    revision: fieldUpdatedRevision,
  });

  const { revision: layoutUpdatedRevision } = await client.app.updateFormLayout(
    {
      app: appId,
      layout: config.layout,
      revision: fieldsAddedRevision,
    }
  );

  return { revision: layoutUpdatedRevision };
};

const createApp = async ({
  client,
  config,
}: {
  client: KintoneRestAPIClient;
  config: AppConfig;
}) => {
  const { app: appId, revision: createdRevision } = await client.app.addApp({
    name: config.name,
  });

  const {
    revision: settingsUpdatedRevision,
  } = await client.app.updateAppSettings({
    app: appId,
    description: config.description,
    revision: createdRevision,
  });

  const { revision: formInitializedRevision } = await initializeForm({
    client,
    config,
    appId,
    revision: settingsUpdatedRevision,
  });

  return { appId, revision: formInitializedRevision };
};

const releaseApp = async (params: {
  client: KintoneRestAPIClient;
  config: AppConfig;
}) => {
  const { appId, revision: createdRevision } = await createApp(params);
  await deployAppAndWait({
    client: params.client,
    appId,
    revision: createdRevision,
  });
  return appId;
};

const releaseRelatedApps = (params: {
  client: KintoneRestAPIClient;
  apps: Array<{ appId: string; config: AppConfig }>;
}) => {
  return releaseRelatedAppsRecursive(params, [], []);
};

const releaseRelatedAppsRecursive = async (
  {
    client,
    apps,
  }: {
    client: KintoneRestAPIClient;
    apps: Array<{ appId: string; config: AppConfig }>;
  },
  released: string[],
  appIdMap: Array<{ from: string; to: string }>
): Promise<string[]> => {
  if (apps.length === 0) {
    return released;
  }
  const app = apps[0];
  const properties = app.config.properties;
  const newProperties = modifyLookupReferences({ properties, appIdMap });
  const appId = await releaseApp({
    client,
    config: { ...app.config, properties: newProperties },
  });
  return releaseRelatedAppsRecursive(
    { client, apps: apps.slice(1) },
    [...released, appId],
    [...appIdMap, { from: app.appId, to: appId }]
  );
};

export { releaseApp, releaseRelatedApps };
