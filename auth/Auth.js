import jwt from 'jsonwebtoken';
import User from '../models/user';

const getToken = (authorizationHeader) => {
    if(authorizationHeader) {
        const token = authorizationHeader || '';
        if (!token || token.split(' ')[0] !== 'Bearer')
            throw new Error('Invalid Authorization Header');
        return token.split(' ')[1];
    }
}

const verifyUser = req => {
    try {
        if(req.headers['authorization']) {
            const token = getToken(req.headers['authorization']);
            if(token !== "null") {
                try {
                    const {payload} = jwt.verify(token, 'secret');
                    if (!payload.tenant) 
                        throw new Error('No Tenant');
                    const userId = payload.tenant;
                    return userId;
                }
                catch(err){
                    console.log(err);
                }
            }
        }
    } catch (err) {
        console.log(err)
        return {}
    }     
}

export { verifyUser };