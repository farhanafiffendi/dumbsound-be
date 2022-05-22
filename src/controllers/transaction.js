const { transaction, user } = require('../../models')

exports.addTransaction = async (req, res) => {
    try {
        let data = req.body;
        data = {
            id: parseInt(data.idProduct + Math.random().toString().slice(3, 8)),
            ...data,
            userId: req.user.id,
            status: "pending",
        };

        const newData = await transaction.create(data);

        res.send({
            status: 'success',
            message: 'Upload historytransaction data success'
        })

    } catch (error) {
        console.log(error)
        res.status({
            status: 'failed',
            message: 'Server Error',
        })
    }
}

exports.getTransaction = async (req, res) => {
    try {
        const transactions = await transaction.findAll({
            include: {
                model: user,
                as: 'user',
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'password', 'gender', 'address', 'status']
                }
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            order: [['id', 'DESC']],
        })

        res.send({
            status: 'success',
            message: 'User Successfully Get',
            transactions,
        })
    } catch (error) {
        console.log(error)
        res.status({
            status: 'failed',
            message: 'Server Error',
        })
    }
}

exports.deleteTrans = async (req, res) => {
    try {
        const { id } = req.params

        await transaction.destroy({
            where: {
                id
            }
        })

        res.send({
            status: 'success',
            message: 'transaction successfully Delete',
            data: {
                id
            }
        })

    } catch (error) {
        console.log(error)
        res.status({
            status: 'failed',
            message: 'Server Error',
        })
    }
}