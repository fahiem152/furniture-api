class _response{
    sendResponse = (res, data)=>{
        try {
            if (data.code) {
                res.status(data.code)
                delete data.code
                res.send(data)
                return true
            }
        } catch (error) {
            res.status(400).send({
                status: false, 
                error
            })
            return false
        }
    }
}

module.exports = new _response();