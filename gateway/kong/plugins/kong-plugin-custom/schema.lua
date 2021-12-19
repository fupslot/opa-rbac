return {
    name = "kong-plugin-custom",
    fields = {
        {
            config = {
                type = "record",
                fields = {
                    {
                        url = {
                            type = "string",
                            required = true,
                            default = "http://authorizer:9000/authorize",
                        }
                    },
                    {
                        method = {
                            type = "string",
                            required = true,
                            default = "POST",
                            one_of = {
                                "POST",
                                "PUT",
                            }
                        }
                    },
                    {
                        timeout = {
                            type = "number",
                            default = 10000,
                        }
                    },
                    {
                        keepalive_timeout = {
                            type = "number",
                            default = 60000,
                        }
                    },
                    {
                        -- See OpenResty docs: https://github.com/openresty/lua-nginx-module#tcpsocksetkeepalive
                        pool_size = {
                            type = "number",
                            default = 100,
                        }
                    },
                    {
                        original_headers_to_forward = {
                            type = "array",
                            elements = {
                                type = "string",
                            },
                            default = {
                                "host",
                                "authorization",
                                "x-forwarded-for",
                                "x-forwarded-proto",
                                "x-real-ip",
                                "x-forwarded-host",
                                "x-forwarded-server",
                                "x-forwarded-port",
                                "x-forwarded-prefix",
                                "x-forwarded-scheme",
                                "x-forwarded-uri",
                            }
                        }
                    },
                }
            }
        }
    }
}