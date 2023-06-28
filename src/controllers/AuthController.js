const User = require('../models/User');
const Auth = require('../config/auth');

const login = async (req, res) => {
  try {

    if (req.body.email.indexOf('@') > 0) {

      var attempt = await User.findOne({ where: { email: req.body.email } });

    } else {

      var attempt = await User.findOne({where: {phone_number: req.body.email } });

    }
    
    const user = attempt;

    if (!user) return res.status(404).json({ message: 'Usuario não encontrado.' });

    const { password } = req.body;
    if (Auth.checkPassword(password, user.hash, user.salt)) {
      const token = Auth.generateJWT(user);
      await user.update({ token: token });

      return res.status(200).json({ user, token });
    }
    return res.status(401).json({ message: 'Senha invalida' });
    
  } catch (e) {
    return res.status(500).json({ err: e });
  }
};

const getDetails = async (req, res) => {
  try {
    const token = Auth.getToken(req);
    const payload = Auth.decodeJwt(token);
    const user = await User.findByPk(payload.sub);
    if (user.dataValues.token != token) { return res.status(401).json({ message: 'Acesso não permitido.' }); }
    if (!user) { return res.status(404).json({ message: 'Usuario não encontrado.' }); }
    return res.status(200).json({ user });
  } catch (e) {
    return res.status(500).json({ err: e });
  }
};

module.exports = {
  login,
  getDetails,
};
