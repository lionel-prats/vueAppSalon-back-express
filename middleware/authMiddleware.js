const authMiddleware = async(req, res, next) => {
    console.log("desde authMiddleware");
    next()
}

export default authMiddleware