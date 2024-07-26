require('dotenv').config()
 const cors = require('cors')
 const express = require('express')
 const app = express()
 const port = process.env.PORT
 const {checkSchema} = require('express-validator')
 const configDB = require('./config/db')
 //Controllers
 const userCltr = require('./app/controllers/user-cltr')
 const petParentCltr = require('./app/controllers/petParent-cltr')
 const careTakerCltr = require('./app/controllers/careTaker-cltr')
 const adminCltr = require('./app/controllers/admin-cltr')
 const petCltr = require('./app/controllers/pet-cltr')
 const bookingCltr = require('./app/controllers/booking-cltr')
 const reviewCltr = require('./app/controllers/review-cltr')
 const paymentCntrl = require('./app/controllers/payment-cltr')
 //Validations
 const {userRegisteration,userLoginValidation,verifyOtpValidation,userUpdateValidation,userResetPassword} = require('./app/validations/user-validation')
 const {careTakerValidation,careTakerUpdateValidation} = require('./app/validations/careTaker-validations')
 const {petParentValidation,petParentUpdateValidation} = require('./app/validations/petParent-validations')
 const {petValidation,petUpdateValidation} = require('./app/validations/pet-validations')
 const {bookingValidation} = require('./app/validations/booking-validations')
 //Middleware
 const authenticateUser = require('./app/middleware/authenticateUser')
 const authorizeUser = require('./app/middleware/authorizeUser')

 const upload = require('./app/middleware/multer')
 const uploadToCloudinary = require('./app/utility/cloudinary')

 configDB()
 app.use(express.json())
 app.use(cors())


 app.post('/user/register',checkSchema(userRegisteration),userCltr.register)
//  app.post('/user/generateOtp',userCltr.generateOtp)
 app.post('/user/verify',checkSchema(verifyOtpValidation),userCltr.verify)
 app.post('/user/login',checkSchema(userLoginValidation),userCltr.login)
 app.get('/user/account',authenticateUser,userCltr.account)
 app.post('/user/forgotPassword',userCltr.forgetPassword)
 app.post('/user/resetPassword',checkSchema(userResetPassword),userCltr.resetPassword)
 app.put('/user/update',checkSchema(userUpdateValidation),userCltr.update)
 app.delete('/user/delete/:id',authenticateUser,userCltr.delete)
 //petParent
 app.post('/api/newparent',upload.fields([{name:'photo',maxCount:1},{name:'proof',maxCount:1}]),authenticateUser,authorizeUser(['petParent']),petParentCltr.create)
 app.get('/api/allparents',petParentCltr.showall)
 app.get('/api/singleparent/:id',petParentCltr.showone)
 app.put('/api/updateparent/:id',authenticateUser,authorizeUser(['petParent']),checkSchema(petParentUpdateValidation),petParentCltr.updateone)
 app.delete('/api/deleteparent/:id',authenticateUser,authorizeUser(['petParent']),petParentCltr.deleteone)
 //caretaker
 app.post('/api/newcaretaker',upload.fields([{name:'photo',maxCount:1},{name:'proof',maxCount:1}]),authenticateUser,authorizeUser(['careTaker']),careTakerCltr.create)
 app.get('/api/allcaretakers',careTakerCltr.showall)
 app.get('/api/singlecaretaker/:id',careTakerCltr.showone)
 app.put('/api/updatecaretaker/:id', upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'proof', maxCount: 1 }]),authenticateUser,authorizeUser(['careTaker']),checkSchema(careTakerUpdateValidation),careTakerCltr.update)
 app.delete('/api/deletecaretaker/:id',authenticateUser,authorizeUser(['careTaker']),careTakerCltr.delete)
 //admin
 app.get('/api/admin/caretakers',adminCltr.getAllCareTakers)
 app.get('/api/admin/petparents',adminCltr.getAllPetParents)
 app.put('/api/admin/verify-caretakers/:id',adminCltr.verifyCareTaker)
 //Pets
 app.post('/api/newpet',authenticateUser,authorizeUser(['petParent']),checkSchema(petValidation),petCltr.create)
 app.get('/api/allpets',petCltr.showall)
 app.get('/api/singlepet',petCltr.showone)
 app.put('/api/updatepet',authenticateUser,authorizeUser(['petParent']),checkSchema(petUpdateValidation),petCltr.updateone)
 app.delete('/api/deletepet',authenticateUser,authorizeUser(['petParent']),petCltr.deleteone)
//Booking
app.post('/api/new-booking/:id',authenticateUser,authorizeUser(['petParent']),bookingCltr.create)
app.get('/api/all-booking',bookingCltr.showall)
app.get('/api/single-booking',bookingCltr.showone)
app.put('/api/update-booking',bookingCltr.updateone)
app.delete('/api/delete-booking',bookingCltr.deleteone)
//review
app.post('/api/new-review',authenticateUser,authorizeUser(['petParent']),reviewCltr.create)
app.get('/api/all-review',reviewCltr.getAll)
app.get('/api/single-review/:id',reviewCltr.getByCaretaker)
app.put('/api/update-review',reviewCltr.update)
app.delete('/api/delete-review',reviewCltr.delete)
//payment
// app.post('/api/new-payment',paymentCntrl.pay)

 app.listen(port,()=>{
    console.log('Port running successfully on port number : ',port)
 })