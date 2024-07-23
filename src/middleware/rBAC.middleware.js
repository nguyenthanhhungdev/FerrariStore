const { Permission } = require('../models/permission.model');

/**
 *
 * Input: requiredPermission
 * Output: Middleware function
 * 1. Get the user's role
 * 2. Retrieve permissions for the user's role
 * 3. Check if the user's permissions include the required permission
 * 4. If the user has the permission, proceed to the next middleware
 *
 * */

// RBAC Middleware
const checkPermission = (requiredPermission) => async (req, res, next) => {
    try {
        // Assuming req.user.role contains the user's role
        const userRole = req.user.role;

        // Initialize Permission model and retrieve permissions for the role
        const permissionModel = new Permission();
        const permissions = permissionModel.getPermissionByRoleName(userRole);

        // Check if the user's permissions include the required permission
        if (permissions.includes(requiredPermission)) {
            next(); // User has permission, proceed to the next middleware
        } else {
            res.status(403).json({ message: "Access denied. Insufficient permissions." });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error while checking permissions." });
    }
};

module.exports = {
    checkPermission
};