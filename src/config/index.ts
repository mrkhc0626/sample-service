require('dotenv').config();

export const generalConfig = {
	port: process.env.PORT || 7001,
	mode: process.env.MODE || 'DEV'
};
