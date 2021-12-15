Download OPA latest release

```
https://github.com/open-policy-agent/opa/releases
```

Run with `build.security`

```
docker pull buildsecurity/pdp:plus; \
docker run \
  --rm \
  -p 8181:8181 \
  -d \
  -e API_KEY="p0GFTcXs3Ng9KsTXhQFcFPDnRoQk6eCm" \
  -e API_SECRET="xA3Oz497rdZBYbeVnatjwBHCusI1G96fyVIcwXNPAZkJy8SMqc4b2X6h2YZVzABJ" \
  -e CONTROL_PLANE_ADDR="https://api.dev.build.security/v1/api/pdp" \
buildsecurity/pdp:plus
```



```
curl -XPOST -d '{ "input": { "user": "alice", "action": "person.edit" }}' http://localhost:8181/v1/data/rbac
```


```/opa_linux_amd64 run --server policy.rego```

## Create a bundle

```./opa_linux_amd64 build policy.rego data.json --output=rbac.tar.gz```

This command will create `rbac.tar.gz` to `./bundles` folder and run

```dc up```

that should elect the opa service with `rbac` policy

Now try it out

```
curl --location --request POST 'http://localhost:8181/v1/data/rbac/allow' \
--header 'Content-Type: application/json' \
--data-raw '{
    "input": {
        "user": "bob",
        "action": "person.view"
    }
}'
```


## Authorizer

Run `dc up -d`

Query 

```
curl http://localhost:8080/api/api
```

## Start Fake JSON API

```
json-server --watch ./example/api.json
```

## Rego policy examples
- https://github.com/DataDog/security-agent-policies
- https://github.com/raspbernetes/k8s-security-policies