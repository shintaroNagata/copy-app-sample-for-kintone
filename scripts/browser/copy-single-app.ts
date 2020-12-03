import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { copySingleApp } from "../../src";

kintone.events.on("app.record.index.show", (event: unknown) => {
  const headerElement: HTMLElement = kintone.app.getHeaderSpaceElement();
  const button = document.createElement("button");
  button.innerText = "copy!";
  const client = new KintoneRestAPIClient();
  button.addEventListener(
    "click",
    async () => {
      button.innerText = "...";
      await copySingleApp({
        from: {
          client,
          appId: Number(kintone.app.getId()),
        },
        to: { client },
      });
      button.innerText = "Done!";
      button.disabled = true;
    },
    { once: true }
  );
  headerElement.appendChild(button);
});
