# glinet

Simple CLI to interact with Gl.iNet routers.

## Commands

Most commands must be preceeded by `login`.  `glinet` will store the token provided by the router for subsequent use, but tokens are short-lived.  `glinet` will alert you when your token has expired.

### login

**Use**

`glinet login <password>`

Logs into your router with given password.

### reboot

**Use**

`glinet reboot`

Reboots the router
