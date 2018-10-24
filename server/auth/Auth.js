import User from '../models/user';

const getToken = (authorizationHeader) => {
    if(authorizationHeader) {
        const token = authorizationHeader || '';
        if (!token || token.split(' ')[0] !== 'Bearer') console.log('Invalid Authorization Header');
            // throw new Error('Invalid Authorization Header');
        return token.split(' ')[1];
    }
}

const getUser = async _id => await User.findOne({ _id });

export { getToken, getUser };