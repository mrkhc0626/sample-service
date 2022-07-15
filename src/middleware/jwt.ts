import jwt from 'jsonwebtoken';
import { securityConfig } from '../config/index';
import * as Services from '../services';
import * as Utils from '../utils';

const jwtTime = securityConfig.jwtTime;
const jwtKey = securityConfig.jwtKey;

export const jwtEncryption = (loginDetails, isVerified) => {
	const token = jwt.sign(
		{
			id: loginDetails['id'],
			email: loginDetails['email'],
			isVerified: isVerified
		},
		jwtKey,
		{
			algorithm: 'HS256',
			expiresIn: isVerified ? jwtTime : '15m'
		}
	);
	return token;
};

const getJwtObject = async (req, res) => {
	let bearerHeader = req['headers']['authorization'];
	if (!bearerHeader) {
		return Utils.returnApiResponse(res, { error: `jwt_not_found` }, 403);
	}
	const bearer = bearerHeader.split(' ');
	const bearerToken = bearer[1];
	let token = bearerToken;
	let user = jwt.verify(token, jwtKey);

	// Check user
	let dbUser: any = await Services.getUser(user['email']);
	if (dbUser && dbUser.locked) return Utils.returnApiResponse(res, { error: 'user_is_locked' }, 402);

	req.user = {
		id: user['id'],
		email: user['email']
	};

	return user;
};

// Verify JWT token && Roles Level
export const jwtVerify = async (req, res, then) => {
	try {
		let user = await getJwtObject(req, res);
		if (!user['isVerified']) return Utils.returnApiResponse(res, { error: `user_is_not_verified` }, 404);
		return then();
	} catch (e) {
		returnJwtError(res, e);
	}
};

export const jwtVerifyBeforeOtp = async (req, res, then) => {
	try {
		await getJwtObject(req, res);
		then();
	} catch (e) {
		returnJwtError(res, e);
	}
};

const returnJwtError = (res, e) => {
	if (e instanceof jwt.JsonWebTokenError) {
		// if the error thrown is because the JWT is unauthorized, return a 401 error
		return Utils.returnApiResponse(
			res,
			{ error: `jwt_unauthorized` }, // otherwise, return a bad request error
			401
		);
	}
	return Utils.returnApiResponse(res, { error: `jwt_bad_request` }, 500);
};
