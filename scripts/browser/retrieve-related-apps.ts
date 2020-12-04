import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { retrieveAllRelatedApps } from "../../src";

kintone.events.on("app.record.index.show", (event: unknown) => {
  const headerElement: HTMLElement = kintone.app.getHeaderSpaceElement();
  const button = document.createElement("button");
  button.innerText = "Get!";
  const client = new KintoneRestAPIClient();
  button.addEventListener(
    "click",
    async () => {
      button.innerText = "...";
      console.dir(
        await retrieveAllRelatedApps({
          from: { client, appId: kintone.app.getId() },
        }),
        { depth: 5 }
      );
      button.innerText = "Done!";
      button.disabled = true;
    },
    { once: true }
  );
  headerElement.appendChild(button);
});
