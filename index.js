require('dotenv').config()
 const express = require('express')
 const app = express()
 const port = process.env.PORT
 const {checkScchema} = require('express-validator')
 const configDB = require('./config/db')
 const userCltr = require('./app/controllers/user-cltr')
 const petParentCltr = require('./app/controllers/petParent-cltr')
 const careTakerCltr = require('./app/controllers/careTaker-cltr')
 const adminCltr = require('./app/controllers/admin-cltr')

 const authenticateUser = require('./app/middleware/authenticateUser')
 const authorizeUser = require('./app/middleware/authorizeUser')

 app.use(express.json())
 configDB()

 app.post('/user/register',userCltr.register)
 app.post('/user/login',userCltr.login)
 app.get('/user/account',authenticateUser,userCltr.account)
 //petParent
 app.post('/api/newparent',petParentCltr.create)
 app.get('/api/allparents',petParentCltr.showall)
 app.get('/api/singleparent/:id',petParentCltr.showone)
 app.put('/api/updateparent/:id',petParentCltr.updateone)
 app.delete('/api/deleteparent/:id',petParentCltr.deleteone)
 //caretaker
 app.post('/api/newcaretaker',careTakerCltr.create)
 app.get('/api/allcaretakers',careTakerCltr.showall)
 app.get('/api/singlecaretaker/:id',careTakerCltr.showone)
 app.put('/api/updatecaretaker/:id',careTakerCltr.update)
 app.delete('/api/deletecaretaker/:id',careTakerCltr.delete)
 //admin
 app.get('/api/admin/caretakers',adminCltr.getAllCareTakers)
 app.get('/api/admin/petparents',adminCltr.getAllPetParents)
 app.put('/api/admin/verify-caretakers/:id',adminCltr.verifyCareTaker)

 app.listen(port,()=>{
    console.log('Port running successfully on port number : ',port)
 })