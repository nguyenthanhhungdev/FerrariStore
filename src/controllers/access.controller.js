'use strict'
class AccessController {
    signUp = async (req, res, next) =>{
        // handle error
        try {
            console.log('[P]::signUp::', res.body)
            /*
            * 200 OK
            * 201 Created
            * */
            res.status(201).json({
                code: '20001'
                , message: 'Sign up successfully',
                metadata: {
                    userId: 1
                }
            })
        } catch (error) {
            // ném lỗi bằng next
            next(error)
        }
    }
}
const accessController = new AccessController()
module.exports = accessController;