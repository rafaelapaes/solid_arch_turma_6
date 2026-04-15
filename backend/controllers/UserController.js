const User = require('../models/User')
const bcrypt = require('bcrypt')

module.exports = class UserController {
    static async register(req, res) {
        res.json('Olá Get Pet') 
       const {name, email, phone, password, confirmpassword} = req.body

       if (name) {
        res.status(422).json({message:'O nome é obrigatório'})
        return
       }
       if (email) {
        res.status(422).json({message:'O email é obrigatório'})
        return
       }
       if (phone) {
        res.status(422).json({message:'O telefone é obrigatório'})
        return
       }
       if (senha) {
        res.status(422).json({message:'A senha é obrigatória'})
        return   
    }
      if (!confirmpassword) {
        res.status(422).json({message:'A confirmação da senha é obrigatória'})
        return
       }
       if (password !== confirmpassword) {
        res.status(422).json({message:'As senhas não coincidem'})
        return
       }
       const userExists= await User.findOne({email:email})

       if (userExists) {
        res.status(422).json({message:'Usuário já existe em nossos registros'})
        return
       }
       const salt = await bcrypt.genSalt(12)
       const passwordHash = await bcrypt.hash(password, salt)

       const user = new User ({
        name,
        email,
        phone,
        password: passwordHash,
       })

       try{
        const newUser = await user.save()
        res.status(201).json({message:'Usuário criado no Get Pet,'
        })
       } catch (error) {
        res.status(201).json({message:error})
       }
    } 
}