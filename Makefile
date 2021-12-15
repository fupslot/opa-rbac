OPA:=./opa_linux_amd64
RBAC_BUNDLE_NAME:=rbac.tar.gz

.PHONY: bundle
bundle:
	rm -rf ./bundles/*
	tar -czf ./bundles/${RBAC_BUNDLE_NAME} -C ./policy/rbac .
	tar -tf ./bundles/${RBAC_BUNDLE_NAME}