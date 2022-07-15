import * as Utils from './';

export const checkRequiredFields = (request, fields = []) => {
	return new Promise(async (resolve, reject) => {
		let missing = '';

		fields.map((field) => {
			if (!(field in request)) {
				missing += `${field} `;
			}
			return missing;
		});

		if (missing !== '') {
			return reject({ code: 401, msg: `${String(missing)}is missing` });
		}

		return resolve(true);
	});
};

export const returnApiResponse = (res, message: Object, code = 200) => {
	res.status(code).json({
		success: code === 200 ? true : false,
		...message
	});
};

export const returnCatchError = (e, res) => {
	let code = (e && e.code) || 500;
	let msg = (e && e.msg) || 'Internal Server Error';
	return Utils.returnApiResponse(res, { message: msg }, code);
};
