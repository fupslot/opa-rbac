local http = require "resty.http"
local cjson = require "cjson.safe"


local CustomPlugin = {
    VERSION = "1.0.0",
    PRIORITY = 1001,
}

function CustomPlugin:access(conf)
    local schema, host, port, _ = unpack(http:parse_uri(conf.url))

    local client = http.new()
    client:set_timeout(conf.timeout)
    client:connect(host, port)

    local original_url = kong.request.get_path()
    local original_user_agent = kong.request.get_header("user-agent")

    local headers = {}
    for _, header in ipairs(conf.original_headers_to_forward) do
        local value = kong.request.get_header(header)
        if value then
            headers[header] = value
        end
    end

    local res, err = client:request_uri(conf.url, {
        method = conf.method,
        headers = {
            charset = "utf-8",
            ["content-type"] = "application/json"
        },
        keepalive_timeout = conf.keepalive_timeout,
        body = cjson.encode({
            original_url = original_url,
            original_user_agent = original_user_agent,
            message = "hello world",
            headers = headers
        })
    })
    -- cjson encode the body
    if err then
        kong.log.err(err)
        return kong.response.exit(500, { message = "An unexpected error occurred" })
    end

    if res.status > 299 then
        return kong.response.exit(res.status, res.body)
    end

    -- kong.log("access", schema, host, port)
end

return CustomPlugin