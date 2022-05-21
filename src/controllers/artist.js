const { art } = require('../../models');

exports.addArtist = async (req, res) => {
    try {
        const artisData = await art.create(req.body)

        res.send({
            status: 'success',
            data: artisData
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.updateArtist = async (req, res) => {
    try {

        const { id } = req.params
        const data = req.body

        await art.update(data,
            {
                where: { id },
            },
        );
        res.send({
            status: 'success',
            data: data
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.getArtist = async (req, res) => {
    try {
        let data = await art.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
        })

        res.send({
            status: "success",
            messsage: "successfully get artist",
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

exports.deleteArtist = async (req, res) => {

    const { id } = req.params

    try {
        await art.destroy({
            where: {
                id,
            },
        });

        res.send({
            status: "success",
            message: `Delete artist id: ${id} finished`,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "Server Error",
        });
    }
};
