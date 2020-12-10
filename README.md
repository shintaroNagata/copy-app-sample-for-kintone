# copy-app-sample-for-kintone
Sample scripts to copy Kintone apps.

# Setup
```
% yarn
% yarn build
```

# Usage
## Node.js
1. Set environment variables
    ```sh
    # The information of your Kintone environment where apps you want to copy locate in.
    export FROM_BASE_URL=...
    export FROM_USERNAME=...
    export FROM_PASSWORD=...

    # The information of your Kintone environment where you want to create copies of apps.
    export TO_BASE_URL=...
    export TO_USERNAME=...
    export TO_PASSWORD=...
    ```
1. Execute scripts under the `bin/` by Node.js.
    ```
    % node bin/copy-single-app.js YOUR_APP_ID
    ```

## Browser(Customization for Kintone app)
Apply customization files under the `bundle/` to your Kintone app you want to copy.



# Links
## Articles
- [kintone のアプリをまとめてコピーする](https://zenn.dev/shintaro_nagata/articles/ab6be9f8b03d7a)