const { response } = require('express');
const Tweet = require('../models/Tweet');
const User = require('../models/User');
const Auth = require('../config/auth');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs-extra');
const moment = require('moment');


function calculateTimeElapsed(tweets) {
    tweets.forEach((tweet) => {
      const createdAt = moment(tweet.createdAt);
      const now = moment();
  
      const duration = moment.duration(now.diff(createdAt));
  
      let timeElapsed = '';
  
      if (duration.years() > 0) {
        timeElapsed = duration.years() + ' y';
      } else if (duration.months() > 0) {
        timeElapsed = duration.months() + ' mo';
      } else if (duration.weeks() > 0) {
        timeElapsed = duration.weeks() + ' w';
      } else if (duration.days() > 0) {
        timeElapsed = duration.days() + ' d';
      } else if (duration.hours() > 0) {
        timeElapsed = duration.hours() + ' h';
      } else if (duration.minutes() > 0) {
        timeElapsed = duration.minutes() + ' min';
      } else {
        timeElapsed = 'agora';
      }
  
      tweet.timeElapsed = timeElapsed;
    });
  }





const index = async (req, res) => {
    try {
        const tweets = await Tweet.findAll({
            include: {
                model: User,
                attributes: ['id', 'name', 'username', 'photo'] // Atributos que você deseja retornar do modelo User
            }
        });
        calculateTimeElapsed(tweets);
        return res.status(200).json({ tweets });
    } catch (err) {
        return res.status(500).json({ err });
    }
};


const show = async (req, res) => {
    const { id } = req.params;
    try {
        const tweet = await Tweet.findByPk(id);
        return res.status(200).json({ tweet });
    } catch (err) {
        return res.status(500).json({ err });
    }
};


const create = async (req, res) => {
    try {
        console.log(req.body)
        const { userId } = req.params;
        const tweet = await Tweet.create(req.body);

        const user = await User.findByPk(userId);

        await tweet.setUser(user);
        await tweet.save();
    } catch (err) {
        res.status(500).json({ error: err });
    }
}

const createWithImage = async (req, res) => {
    try {
        const { userId } = req.params;
        const tweet = await Tweet.create(req.body);



        const buffer = req.file.buffer;

        // Realizar o recorte em um quadrado
        const croppedBuffer = await sharp(buffer)
            .resize(500, null, {  
                fit: sharp.fit.cover,
                position: sharp.strategy.entropy
            })
            .toBuffer();

        // Salvar apenas o cropped em um arquivo
        const fileName = 'cropped-' + Date.now() + '-' + req.file.originalname;
        await sharp(croppedBuffer).toFile('uploads/' + fileName);

        // Recuperar o usuário existente




        // Atualizar o campo de imagem do usuário
        tweet.tweetPhoto = fileName;
        const user = await User.findByPk(userId);

        await tweet.setUser(user);
        await tweet.save();







        return res.status(200).json({ tweet });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

const update = async (req, res) => {
    const { id } = req.params;
    try {
        const [updated] = await Tweet.update(req.body, { where: { id: id } });
        if (updated) {
            const tweet = await Tweet.findByPk(id);
            return res.status(200).send(tweet);
        }
        throw new Error();
    } catch (err) {
        return res.status(500).json("Tweet não encontrado");
    }
};
const destroy = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Tweet.destroy({ where: { id: id } });
        if (deleted) {
            return res.status(200).json("Tweet deletado com sucesso.");
        }
        throw new Error();
    } catch (err) {
        return res.status(500).json("Tweet não encontrado.");
    }
};

const indexUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const tweets = await Tweet.findAll({
            include: {
              model: User,
              attributes: ['id', 'name', 'username', 'photo']
              
            }, where: { userId: userId }
          });
          
        calculateTimeElapsed(tweets);
        return res.status(200).json({ tweets });
    } catch (err) {
        return res.status(500).json({ err });
    }
};







module.exports = {
    index,
    show,
    create,
    update,
    destroy,
    createWithImage,
    indexUser
};
