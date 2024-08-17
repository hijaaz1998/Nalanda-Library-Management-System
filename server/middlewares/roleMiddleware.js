const roleCheck = (role) => {
   try {
      return (req, res, next) => {
         if(!req.user.id || req.user.role !== role){
            return res.status(403).json({success: false, message: 'Access denied'})
         }
         next();
      }
   } catch (error) {
      console.log(error)
   }
}

module.exports = roleCheck;