const jwt = require('jsonwebtoken')

const CreateUserToken = async (user, req, res) => {
    const token = jwt.sign({
        name: user.name,
        id: user._id
    },'fatec_turma6_a2026')

    res.status(201).json({
        message: 'Você está autenticado',
        token: token,
        userId: user._id,
    })
}

module.exports = createUserToken