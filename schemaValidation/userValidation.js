import Joi from 'joi';

export default Joi.object().keys({
    email:Joi.string().email().required().label('Email'),
    username:Joi.string().regex(/^[a-zA-Z0-9-_]+$/).min(4).max(30).required().label('Username'),
    password:Joi.string().regex(/^(?=S*[a-z])(?=S*[A-Z])(?=\S*\d)(?=S*[^\W\s])\S{8,30}$/i).label('Password').options({
        language: {
            string: {
                regex: {
                    base:'Must have atleast one lowercase letter, one uppercase letter, one digit and one special character.'
                }
            }
        }
    }),
    name:Joi.string().max(254).required().label('Name'),
    gender:Joi.string().required()
})