package authz

import data.channels

token = {"payload": payload} { io.jwt.decode(input.token, [_, payload, _]) }

user_owns_token { input.username == token.payload.username }


default allow = false

debug = value { value:=split(trim_prefix(input.path, "/"), "/") }

allow {
    some channel
	user_owns_token
    
    input.method == "GET"
    path := split(trim_prefix(input.path, "/"), "/")
    path = ["channels", channel]
    member_of_channel[_] == channel
}

member_of_channel[channel] {
	channels[channel].members[_] == token.payload.username
}