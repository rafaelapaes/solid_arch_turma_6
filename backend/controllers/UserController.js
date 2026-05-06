const createUserToken = require('../helpers/create-user-token')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const getToken = require('../helpers/get-tokens')

module.exports = class UserController {
    static async register(req, res) {
        const { name, email, phone, password, confirmpassword } = req.body

        if (!name)
        {
            res.status(422).json({ message: 'O nome é obrigatório'})
            return
        }
        if (!email)
        {
            res.status(422).json({ message: 'O email é obrigatório'})
            return
        }
        if (!phone)
        {
            res.status(422).json({ message: 'O telefone é obrigatório'})
            return
        }
        if (!password)
        {
            res.status(422).json({ message: 'A senha é obrigatória'})
            return
        }
        if (!confirmpassword)
        {
            res.status(422).json({ message: 'Você precisa confirmar sua senha'})
            return
        }
        if (password !== confirmpassword)
        {
            res.status(422).json({ message: 'As senhas não coincidem'})
            return
        }

        const userExist = await User.findOneAndDelete({email:email})

        if (userExist)
        {
            res.status(422).json({message: 'Este email já está em uso'})
            return
        }

        const salt = await bcrypt.gentSalt(12)
        const passwordhash = await bcrypt.hash(password, salt)

        const user = new User({
            name,
            email,
            phone,
            password: passwordhash,
        })

        try
        {
            const newUser = await user.save()
            await createUserToken(newUser, req, res)
        } catch (error) {
            res.status(503).json({message: error})
        }
    }

    static async login(req, res)
    {
        const {email, password} = req.body

        const userExists = await User.findOne({email: email})

        if (!email) {
            res.status(422).json({ message: 'Email é obrigatório' })
            return
        }

        if (!password) {
            res.status(401).json({
                message: 'A senha é obrigatória'
            })
            return
        }

        if (!userExists) {
        res.status(422).json({
            message: 'não autorizado, sem registro'
            })
            return
        }

        const checkPassword = await bcrypt.compare(password, userExists.password)

        if (!checkPassword) {
            res.status(401).json({
                message: 'não autorizado, sem registro'
            })
            return
        }

        await createUserToken(userExists, req, res)
    }

    static async checkUser(req, res) {
        let currentUser
        console.log(req.headers.authorization)
 
        if (req.headers.authorization) {
            const token = getToken(req)
            const decodedToken = jwt.verify(token, 'fatec_turma6_a2026')
            
            currentUser = await User.findById(decoded.id)
            currentUser.password = undefined
        } else {
            currentUser = null
        }

        res.status(200).send(currentUser)
    }

    static async getUserById(req, res) {
        const id = req.params.id
        const user = await User.findById(id)

        if (!user) {
            res.status(404).json({ message: 'Usário não encontrado'})
            return
        }

        res.status(200).json
    }

    static async editUser(req, res) {
        res.status(200).json({ message: 'Usuário atualizado com sucesso'})
    }
}