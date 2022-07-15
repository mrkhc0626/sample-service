import { getTokenData } from '../models/sample';

// As a function
export const generateToken = (data: getTokenData) => {
	return new Promise(async (resolve, reject) => {
		try {
			let token = null;
			token = `${data.x}_${data.y}_${data.type}`;
			return resolve(token);
		} catch (err) {
			return reject({ err, code: 500 });
		}
	});
};

// As a class
export class Token {
	id: string;

	constructor(x: string, y: string, type: string) {
		this.id = `${x}_${y}_${type}`;
	}

	saveData() {
		// Do the save data action
		const msg = 'Data is saved to db';
		return msg;
	}
}
