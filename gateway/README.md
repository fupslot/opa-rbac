**Note**

Kong supports the imperative way to setting up its configuration. It comes with and internal [RESTfull Admin API](https://docs.konghq.com/gateway/2.6.x/admin-api/) that sists on port `8001` (default). This API provide a full controll over Kong and genrally used to setting up Kong configuration.

In general Kong suggests sending request to its Admin API via HTTP(S) passing the configuration settings as a body attributes.

Kong claims that it supports configuration via a configuration file as well. However there is no simple instruction or the reference api on how to do so. Given examples on Kong documentation website are way to simple and does not cover the entire API.

Instead Kong suggests use the project [decK](https://docs.konghq.com/deck/1.8.x/installation/). This is `cli` tools that helps extract Kong's configuration from Admin API in `yml` format that could be saved to a file and feeded to Kong.
First Kong must be configured via its RESTful API. Once its done we run `deck dump` command to export Kong configuration to a file.


```
deck --kong-addr=http://localhost:8001 dump
```

That will dump Kong's configuration to a `Kong.yml` file 
