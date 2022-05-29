const { music, art } = require('../../models');

const cloudinary = require('../utils/cloudinary');

exports.getMusics = async (req, res) => {
    try {
        let data = await music.findAll({
            include: [
                {
                    model: art,
                    as: 'art',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt'],
                    },
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
        })

        data = JSON.parse(JSON.stringify(data))

        data = data.map((item) => {
            return {
                ...item,
                thumbnail: process.env.FILE_PATH + item.thumbnail,
                attache: process.env.FILE_PATH + item.attache
            }
        });


        res.send({
            status: "success",
            messsage: "successfully get music",
            data,

        })
    } catch (error) {
        console.log(error);
        res.status({
            status: 'failed',
            message: 'Server Error'
        })
    }
};

exports.getMusicsHome = async (req, res) => {
    try {
        let data = await music.findAll({
            include: [
                {
                    model: art,
                    as: 'art',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt'],
                    },
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
        })

        data = JSON.parse(JSON.stringify(data))

        data = data.map((item) => {
            return {
                ...item,
                thumbnail: process.env.FILE_PATH + item.thumbnail,
                attache: process.env.FILE_PATH + item.attache
            }
        });


        res.send({
            status: "success",
            messsage: "successfully get music",
            data,

        })
    } catch (error) {
        console.log(error);
        res.status({
            status: 'failed',
            message: 'Server Error'
        })
    }
};

exports.addMusics = async (req, res) => {
    try {
        // Handle uploader to cloudinary here ...
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'dumbmerch',
            use_filename: true,
            unique_filename: false,
        });

        const data = req.body;
        const attache = req.files.attache[0].filename
        const thumbnail = result.public_id;

        const uploadData = {
            ...data,
            attache,
            thumbnail,
        }

        let dataMusic = await music.create(uploadData)

        dataMusic = JSON.parse(JSON.stringify(dataMusic));

        res.send({
            status: 'success',
            data: {
                ...dataMusic,
                thumbnail: process.env.FILE_PATH + dataMusic.thumbnail,
                attache: process.env.FILE_PATH + dataMusic.attache
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.deleteMusic = async (req, res) => {
    try {
        const { id } = req.params;

        await music.destroy({
            where: {
                id,
            },
        });

        res.send({
            status: "success",
            message: `Delete music id: ${id} finished`,
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.updateMusic = async (req, res) => {
    try {
        const { id } = req.params;

        const data = req.body;
        console.log(data);
        const attache = req.files.attache[0].filename
        const thumbnail = req.files.thumbnail[0].filename

        const uploadData = {
            ...data,
            attache,
            thumbnail,
        }
        await music.update(uploadData,
            {
                where: { id },
            },
        );

        res.send({
            status: "success",
            message: `Update music id: ${id} finished`,
            data: {
                title: req.body.title,
                year: req.body.year,
                attache: req.files.attache[0].filename,
                thumbnail: req.files.thumbnail[0].filename
            }
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.getDetailMusic = async (req, res) => {
    try {
        const { id } = req.params;

        let data = await music.findOne({
            where: { id },
            include: [
                {
                    model: art,
                    as: 'art',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt'],
                    },
                },
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
        });

        data = JSON.parse(JSON.stringify(data))

        data = {
            ...data,
            thumbnail: process.env.FILE_PATH + data.thumbnail,
            attache: process.env.FILE_PATH + data.attache
        }

        res.send({
            status: "success",
            data,
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};
