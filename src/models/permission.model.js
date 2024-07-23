const roles = require("../configs/role.json")

class Permission {
    constructor() {
        this.permission = []
    }

    getPermissionByRoleName = (roleName) => {
        const role = roles.roles.find((r) => r.name === roleName)
        return role ? role.permission:[]
    }
}

module.exports = Permission;