const { transaction, user } = require('../../models')

const midtransClient = require("midtrans-client");

const convertRupiah = require("rupiah-format");

// Import nodemailer here ...
const nodemailer = require("nodemailer");

exports.addTransaction = async (req, res) => {
    try {
        let d = new Date();
        let months = "";

        if (req.body.price === "20000") {
            months = "1";
        } else if (req.body.price === "250000") {
            months = "6";
        } else if (req.body.price === "500000") {
            months = "12";
        }

        let mySqlTimestamp = new Date(
            d.getFullYear(),
            d.getMonth() + parseInt(months),
            d.getDate(),
            d.getHours(),
            d.getMinutes(),
            d.getSeconds(),
            d.getMilliseconds()
        ).toISOString().slice(0, 19).replace("T", " ");

        let data = req.body;
        data = {
            ...data,
            userId: req.user.id,
            status: "pending",
            dueDate: mySqlTimestamp,
        };

        const newData = await transaction.create(data);

        const buyerData = await user.findOne({
            where: {
                id: newData.userId,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });

        // Create Snap API instance here ...
        let snap = new midtransClient.Snap({
            // Set to true if you want Production Environment (accept real transaction).
            isProduction: false,
            serverKey: process.env.MIDTRANS_SERVER_KEY,
        });

        // Create parameter for Snap API here ...
        let parameter = {
            transaction_details: {
                order_id: newData.id,
                gross_amount: newData.price,
            },
            credit_card: {
                secure: true,
            },
            customer_details: {
                full_name: buyerData?.fullname,
                email: buyerData?.email,
                phone: buyerData?.phone,
            },
        };

        // Create trasaction token & redirect_url with snap variable here ...
        const payment = await snap.createTransaction(parameter);

        console.log(payment);
        res.send({
            status: "pending",
            message: "Pending transaction payment gateway",
            payment,
            cust: {
                id: data.userId,
            },
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};

// Create configurate midtrans client with CoreApi here ...
const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY;
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;

const core = new midtransClient.CoreApi();

core.apiConfig.set({
    isProduction: false,
    serverKey: MIDTRANS_SERVER_KEY,
    clientKey: MIDTRANS_CLIENT_KEY,
});

/**
 *  Handle update transaction status after notification
 * from midtrans webhook
 * @param {string} status
 * @param {transactionId} transactionId
 */

// Create function for handle https notification / WebHooks of payment status here ...
exports.notification = async (req, res) => {
    try {
        const statusResponse = await core.transaction.notification(req.body);
        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;

        console.log(statusResponse);

        if (transactionStatus == "capture") {
            if (fraudStatus == "challenge") {
                // TODO set transaction status on your database to 'challenge'
                // and response with 200 OK
                // sendEmail("pending", orderId); //sendEmail with status pending and order id
                updateTransaction("pending", orderId);
                res.status(200);
            } else if (fraudStatus == "accept") {
                // TODO set transaction status on your database to 'success'
                // and response with 200 OK
                // sendEmail("success", orderId); //sendEmail with status success and order id
                // updateProduct(orderId);
                updateTransaction("success", orderId);
                res.status(200);
            }
        } else if (transactionStatus == "settlement") {
            // TODO set transaction status on your database to 'success'
            // and response with 200 OK
            // sendEmail("success", orderId); //sendEmail with status success and order id
            // updateProduct(orderId);
            updateTransaction("success", orderId);
            res.status(200);
        } else if (
            transactionStatus == "cancel" ||
            transactionStatus == "deny" ||
            transactionStatus == "expire"
        ) {
            // TODO set transaction status on your database to 'failure'
            // and response with 200 OK
            // sendEmail("failed", orderId); //sendEmail with status failed and order id
            updateTransaction("failed", orderId);
            res.status(200);
        } else if (transactionStatus == "pending") {
            // TODO set transaction status on your database to 'pending' / waiting payment
            // and response with 200 OK
            // sendEmail("pending", orderId); //sendEmail with status pending and order id
            updateTransaction("pending", orderId);
            res.status(200);
        }
    } catch (error) {
        console.log(error);
        res.status(500);
    }
};

// Create function for handle transaction update status here ...
const updateTransaction = async (status, transactionId) => {
    await transaction.update(
        {
            status,
        },
        {
            where: {
                id: transactionId,
            },
        }
    );
};

exports.getTransaction = async (req, res) => {
    try {
        const transactions = await transaction.findAll({
            include: {
                model: user,
                as: 'user',
                attributes: {
                    exclude: ['updatedAt', 'password', 'gender', 'address', 'status']
                }
            },
            attributes: {
                exclude: ['updatedAt']
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

exports.getTransactionAdmin = async (req, res) => {
    try {
        const userId = req.user.id;

        const trans = await transaction.findOne({
            where: { userId },
            include: {
                model: user,
                as: 'user',
                attributes: {
                    exclude: ['updatedAt', 'password', 'gender', 'address', 'status']
                }
            },
            attributes: {
                exclude: ['updatedAt']
            },
            order: [['createdAt', 'DESC']]
        })

        res.send({
            status: 'success',
            message: 'User Successfully Get',
            data: {
                trans,
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