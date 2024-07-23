const roleModel = require("../configs/role.json")

class Role {
    constructor() {
        this.role = roleModel
    }

    getRoleByName = (name) => {
        return this.role.find((role) => {role.name === name})
    }

    getRole = () => {
        return this.role
    }

}

module.exports = Role;