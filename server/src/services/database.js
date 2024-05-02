import * as mariadb from "mariadb";

/**
 * Database
 * 
 * This manages connections to the database.
 * 
 * @class Database
 */
export class Database {
	/**
	 * This constructs the class.
	 * 
	 * @returns {void}
	 */
	constructor() {
		this.db = mariadb.createPool({
			host: process.env["DATABASE_HOST"],
			user: process.env["DATABASE_USER"],
			password: process.env["DATABASE_PASSWORD"],
			database: process.env["DATABASE_NAME"]
		});
	};
	
	/**
	 * This connects the database.
	 * 
	 * @returns {void}
	 */
	async connect() {
		const conn = await this.db.getConnection();
		try {
			await conn.query("SELECT 1");
		} finally {
			await conn.end();
		}
	};

	/**
	 * This executes a query.
	 * 
	 * @param {string} query 
	 * @param {array} params 
	 * @returns {array}
	 */
	async query(query, params = []) {
		const conn = await this.db.getConnection();
		try {
			return await conn.query(query, params);
		}
		finally {
			await conn.end();
		}
	}
};