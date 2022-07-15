import * as Utils from '../utils';
import * as Services from '../services';

export const sampleController = async (req, res) => {
	try {
		// Checking before all the logic
		await Utils.checkRequiredFields(req.query, [ 'x', 'y', 'type' ]);

		// Vairables
		let data = {};
		const { x, y, type } = req.query;

		// Generate Token
		let token = await Services.generateToken(req.query);
		let tokenWithClass = new Services.Token(x, y, type);
		let msg = await tokenWithClass.saveData();

		// Return result
		data = { token, tokenWithClass: tokenWithClass.id, msg };
		return Utils.returnApiResponse(res, { msg: 'success', data });
	} catch (e) {
		return Utils.returnCatchError(e, res);
	}
};
