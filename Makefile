OPA:=./opa_linux_amd64

.PHONY: bundle
bundle:
	$(OPA) build ./policy/rbac/policy.rego ./policy/rbac/data.json --output=./bundles/rbac.tar.gz
	$(OPA) build ./policy/authz/policy.rego ./policy/authz/data.json --output=./bundles/authz.tar.gz