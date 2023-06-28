const { response } = require('express');
const User = require('../models/User');
const Auth = require('../config/auth');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs-extra');






// Função para manipular o upload de imagens e atualizar o usuário
const uploadImage = async (req, res) => {
    try {
        const buffer = req.file.buffer;

        // Realizar o recorte em um quadrado
        const croppedBuffer = await sharp(buffer)
            .resize(400, 400, {
                fit: sharp.fit.cover,
                position: sharp.strategy.entropy
            })
            .toBuffer();

        // Salvar apenas o cropped em um arquivo
        const fileName = 'cropped-' + Date.now() + '-' + req.file.originalname;
        await sharp(croppedBuffer).toFile('uploads/' + fileName);

        // Recuperar o usuário existente
        const userId = req.body.userId;
        const usuario = await User.findByPk(userId);

        if (!usuario) {
            return res.status(404).send('Usuário não encontrado.');
        }

        if (usuario.photo && usuario.photo != 'foto-perfil.png') {
            const imagePath = 'uploads/' + usuario.photo;
            fs.remove(imagePath)
                .then(() => {
                    console.log('Arquivo anterior excluído com sucesso');
                })
                .catch((error) => {
                    console.error('Erro ao excluir o arquivo anterior:', error);
                });
        }

        // Atualizar o campo de imagem do usuário
        usuario.photo = fileName;
        await usuario.save();

        res.send('Arquivo enviado, cortado em quadrado e redimensionado com sucesso!');
    } catch (error) {
        res.status(500).send('Erro ao processar o arquivo.');
    }
};

const index = async (req, res) => {
    try {
        const users = await User.findAll();
        return res.status(200).json({ users });
    } catch (err) {
        return res.status(500).json({ err });
    }
};


const show = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        return res.status(200).json({ user });
    } catch (err) {
        return res.status(500).json({ err });
    }
};

const create = async (req, res) => {
    try {
        console.log(req.body)
        const { password } = req.body;
        const hashAndSalt = Auth.generatePassword(password);
        const { salt } = hashAndSalt;
        const { hash } = hashAndSalt;
        const newUserData = {
            email: req.body.email,
            name: req.body.name,
            username: req.body.username,
            photo: 'foto-perfil.png',
            hash,
            salt
        };
        const user = await User.create(newUserData);
        const token = Auth.generateJWT(user);
        console.log(token)
        await user.update({ token: token });
        return res.status(200).json({ user, token });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

const update = async (req, res) => {
    const { id } = req.params;
    try {
        const [updated] = await User.update(req.body, { where: { id: id } });
        if (updated) {
            const user = await User.findByPk(id);
            return res.status(200).send(user);
        }
        throw new Error();
    } catch (err) {
        return res.status(500).json("Usuário não encontrado");
    }
};
const destroy = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await User.destroy({ where: { id: id } });
        if (deleted) {
            return res.status(200).json("Usuario deletado com sucesso.");
        }
        throw new Error();
    } catch (err) {
        return res.status(500).json("Usuario não encontrado.");
    }
};

const checkUsername = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findAll({ where: { username: username } });
        if (user.length > 0) {
            return res.status(200).send('1');
        }
        else {
            return res.status(200).send('0');
        }

    } catch (err) {
        return res.status(500).json("Error");
    }
};

const checkEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findAll({ where: { email: email } });
        if (user.length > 0) {
            return res.status(200).send('1');
        }
        else {
            return res.status(200).send('0');
        }

    } catch (err) {
        return res.status(500).json("Error");
    }
};

const updateWithImage = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await User.update(req.body, { where: { id: id } });
        




        const buffer = req.file.buffer;

        // Realizar o recorte em um quadrado
        const croppedBuffer = await sharp(buffer)
            .resize(400, 400, {
                fit: sharp.fit.cover,
                position: sharp.strategy.entropy
            })
            .toBuffer();

        // Salvar apenas o cropped em um arquivo
        const fileName = 'cropped-' + Date.now() + '-' + req.file.originalname;
        await sharp(croppedBuffer).toFile('uploads/' + fileName);

        // Recuperar o usuário existente


        console.log('passou aqui')

        // Atualizar o campo de imagem do usuário
        if (updated) {
            const user = await User.findByPk(id);
            const updatedWithImage = await User.update({photo: fileName}, { where: { id: id } });
            if (updatedWithImage) {
                return res.status(200).send(user);
            }
           
            // user.photo = fileName;
            // await user.save();
            
        }
       


    } catch (err) {
        res.status(500).json({ error: err });
    }
};




module.exports = {
    index,
    show,
    create,
    update,
    destroy,
    checkUsername,
    checkEmail,
    uploadImage,
    updateWithImage

};
