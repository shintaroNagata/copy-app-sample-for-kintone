import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { copySingleApp } from "../../src";

kintone.events.on("app.record.index.show", (event: unknown) => {
  const headerSpaceElement = kintone.app.getHeaderSpaceElement();
  if (headerSpaceElement) {
    const button = document.createElement("button");
    button.innerText = "Copy!";
    const client = new KintoneRestAPIClient();
    button.addEventListener(
      "click",
      async () => {
        button.innerText = "...";
        await copySingleApp({
          from: {
            client,
            appId: String(kintone.app.getId()),
          },
          to: { client },
        });
        button.innerText = "Done!";
        button.disabled = true;
      },
      { once: true }
    );
    headerSpaceElement.appendChild(button);
  }
});
