const passport = require('passport');

/**
 * Nếu thành công callback done trả về null và user
 * Nếu không thành công callback done trả về null và false
 * Trong hàm callback của authenticate ta thực hiện việc kiểm tra user
 * Nếu tồn tại user thì gán vào trong req
 * Nếu tồn tại lỗi thì ta thực hiện việc ghi log và trả về lỗi
 * */


const auth = passport.authenticate('jwt', { session: false }, (user, err, next) => {
    if (err) {
        console.log("::Error in authByPassport middleware:: ", err);
        return next(err);
    }

    if (!user) {
        return next(null, false);
    }

    return next(null, user);
});

