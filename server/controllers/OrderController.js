import models from '../models';

const { Orders } = models;

class OrderController {

    /** Place Order
     *
     * @param  {object} req - request
     * @param  {object} res - response
     *
     */
    static placeOrder(req, res) {
        const { userId } = req.decoded.currentUser;
        return Orders.create({
            foodId: req.body.foodId,
            quantity: req.body.quantity,
            userId
        })
            .then(data => res.status(201).json({
                status: true,
                message: 'Order Placed Succesfully',
                data
            }))
            .catch(() => res.status(500).json({
                error: 'Internal sever Error'
            }));
    }

    /** Modify Order
       *
       * @param  {object} req - request
       * @param  {object} res - response
       *
       */

    static modifyOrder(req, res) {
        Orders
            .findByPk(req.params.orderId)
            .then((order) => {
                const { userId } = req.decoded.currentUser;
                if (order.userId !== userId) {
                    return res.status(403).json({
                        message: 'sorry! you do not have access to update this order'
                    });
                }
                return Orders
                    .findOne({
                        where: {
                            id: req.params.orderId
                        }
                    })
                    .then(foundOrder => foundOrder
                        .update({
                            foodId: req.body.foodId || foundOrder.foodId,
                            quantity: req.body.quantity || foundOrder.quantity,
                        })
                        .then(() => {
                            Orders.findByPk(req.params.orderId)
                                .then(result => res.status(200).json({
                                    status: true,
                                    message: 'Order modified successfully!',
                                    data: result
                                }));
                        }));
            })
            .catch(() => res.status(500).json({
                error: 'Internal sever Error'
            }));
    }

    /** Delete Order
       *
       * @param  {object} req - request
       * @param  {object} res - response
       * @return {object} returns an object
       *
       */
    static deleteOrder(req, res) {
        Orders
            .findByPk(req.params.orderId)
            .then((order) => {
                const { userId } = req.decoded.currentUser;
                if (order.userId !== userId) {
                    return res.status(403).json({
                        message: 'sorry! you can only delete your own order'
                    });
                }
                return Orders
                    .destroy({
                        where: {
                            id: req.params.orderId,
                            userId: req.decoded.currentUser.userId
                        }
                    })
                    .then(() => {
                        res.status(200).json({
                            status: true,
                            message: 'Order deleted successfully!',
                            data: {
                                id: Number(req.params.orderId)
                            }
                        });
                    });
            })
            .catch(() => res.status(500).json({
                error: 'Internal sever Error'
            }));
    }

    /** Get all Orders
    *
    * @param  {object} req - request
    * @param  {object} res - response
    * @return {object} returns an object
    */
    static getAllOrders(req, res) {
        const pageNumber = Number(req.query.page) || 1;
        const limit = 12;
        let offset;
        let page;
        const message = 'Sorry no food order for this page';
        if (pageNumber === 0) {
            offset = 0;
        } else {
            page = pageNumber;
            offset = limit * (page - 1);
        }
        Orders
            .findAndCountAll({
                order: [['id', 'DESC']],
                limit,
                offset,
            })
            .then((orders) => {
                const pages = Math.ceil(orders.count / limit);
                if (!orders.count) {
                    return res.status(404).json({
                        message: 'No order found'
                    });
                } else if (pageNumber > pages) {
                    return res.status(404).json({
                        message: message
                    });
                }
                return res.status(200).json({
                    status: true,
                    orders,
                    pages
                });
            })
            .catch(() => res.status(500).json({
                error: 'Internal sever Error'
            }));
    }

    /** Modify Order
   *
   * @param  {object} req - request
   * @param  {object} res - response
   *
   */

    static modifyOrderStatus(req, res) {
        Orders
            .findByPk(req.params.orderId)
            .then((order) => {
                return Orders
                    .findOne({
                        where: {
                            id: req.params.orderId
                        }
                    })
                    .then(foundOrder => foundOrder
                        .update({
                            status: req.body.status || foundOrder.status
                        })
                        .then(() => {
                            Orders.findByPk(req.params.orderId)
                                .then(result => res.status(200).json({
                                    status: true,
                                    message: 'Order Status Updated successfully!',
                                    data: result
                                }));
                        }));
            })
            .catch(() => res.status(500).json({
                error: 'Internal sever Error'
            }));
    }
};

export default OrderController;
