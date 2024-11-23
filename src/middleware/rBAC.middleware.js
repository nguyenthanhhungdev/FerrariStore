const { Permission } = require('../models/permission.model');
const { CustomError } = require('./ExceptionHandler.middleware');
const logger = require('../utils/logger');

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
            next(CustomError(403, "Forbidden", { layer: 'MIDDLEWARE', methodName: 'checkPermission' }));
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    checkPermission
};


/**
 *
 *
 *
 * Middleware checkPermission trong file src/middleware/rBAC.middleware.js hoạt động như sau:
 * Nhận quyền yêu cầu: Middleware nhận một tham số requiredPermission đại diện cho quyền cần kiểm tra.
 * Lấy vai trò của người dùng: Middleware giả định rằng vai trò của người dùng được lưu trong req.user.role.
 * Lấy quyền của vai trò: Middleware khởi tạo một đối tượng Permission và gọi phương thức getPermissionByRoleName để lấy danh sách quyền của vai trò người dùng.
 * Kiểm tra quyền: Middleware kiểm tra xem danh sách quyền của người dùng có chứa quyền yêu cầu hay không.
 * Quyết định tiếp tục: Nếu người dùng có quyền yêu cầu, middleware gọi next() để tiếp tục đến middleware tiếp theo. Nếu không, middleware gọi next() với một lỗi CustomError có mã trạng thái 403 (Forbidden).
 *
 *
 *
 * */