import models from '../models';
import { capitalize } from '../helper';

const { Foods } = models;

class FoodController {

    /** Add Food
     *
     * @param  {object} req - request
     * @param  {object} res - response
     *
     */
    static addFood(req, res) {
        const { userId } = req.decoded.currentUser;
        return Foods.create({
            name: capitalize(req.body.name),
            description: req.body.description,
            picture: req.body.picture,
            userId
        })
            .then(data => res.status(201).json({
                status: true,
                message: 'Food added successfully',
                data
            }))
            .catch(() => res.status(500).json({
                error: 'Internal sever Error'
            }));
    }

    /** Get all Foods
    *
    * @param  {object} req - request
    * @param  {object} res - response
    * @return {object} returns an object
    */
    static getAllFoods(req, res) {
        const pageNumber = Number(req.query.page) || 1;
        const limit = 12;
        let offset;
        let page;
        const message = 'Sorry no food found for this page';
        if (pageNumber === 0) {
            offset = 0;
        } else {
            page = pageNumber;
            offset = limit * (page - 1);
        }
        Foods
            .findAndCountAll({
                order: [['id', 'DESC']],
                limit,
                offset,
            })
            .then((foods) => {
                const pages = Math.ceil(foods.count / limit);
                if (!foods.count) {
                    return res.status(404).json({
                        message: 'No food found'
                    });
                } else if (pageNumber > pages) {
                    return res.status(404).json({
                        message: message
                    });
                }
                return res.status(200).json({
                    status: true,
                    foods,
                    pages
                });
            })
            .catch(() => res.status(500).json({
                error: 'Internal sever Error'
            }));
    }
};

export default FoodController;
