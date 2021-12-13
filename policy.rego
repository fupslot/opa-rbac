package rbac

default allow = false

allow {
	permissions[data.users[input.user].role][_] == input.action
}

role_graph[role] = includes {
	data.roles[role]
	includes := { include | include := data.roles[role].includes[_] }
}

permissions[role] = permissions {
	data.roles[role]
	includes := graph.reachable(role_graph, {role})
    permissions := { perm | includes[i]; perm := data.roles[i].permissions[_] }
}