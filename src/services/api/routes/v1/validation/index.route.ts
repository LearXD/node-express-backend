import { Router } from "express";
import { Validator, ValidatorType } from "../../../middlewares/validator";

import * as yup from 'yup';

const router = Router();

const entities = [
    {
        id: 1,
        name: "Entity 1"
    },
    {
        id: 2,
        name: "Entity 2"
    }
]

router.get(
    "/",
    Validator.validate(
        yup.object().shape({
            id: yup.number().required()
        }),
        ValidatorType.QUERY
    ),
    (req, res) => {

        const entity = entities.find((entity) => entity.id === parseInt(req.query.id.toString()));

        if (!entity) {
            return res.status(404).json({
                message: "Entity not found"
            });
        }

        return res.json(entity);
    }
);

router.post(
    "/",
    Validator.validate(
        yup.object().shape({
            name: yup.string().required()
        }),
        ValidatorType.BODY
    ),
    (req, res) => {
        const entity = {
            id: entities.length + 1,
            name: req.body.name
        };

        entities.push(entity);

        return res.json(entity);
    }
)

router.delete(
    "/:id",
    Validator.validate(
        yup.object().shape({
            id: yup.number().required()
        }),
        ValidatorType.PARAMS
    ),
    (req, res) => {
        const entityIndex = entities.findIndex((entity) => entity.id === parseInt(req.params.id));

        if (entityIndex === -1) {
            return res.status(404).json({
                message: "Entity not found"
            });
        }

        entities.splice(entityIndex, 1);

        return res.json({
            message: "Entity deleted"
        });
    }
);

export default router;