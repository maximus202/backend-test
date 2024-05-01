import express from "express";
import * as mariadb from "mariadb";

/**
 * Use cases:
 * As the frontend client I want...
 * - To request a list of tasks by worker or by location.
 * - The list should include the total labor cost by the given worker or location.
 * - Each individual tasks should also include the total labor cost.
 * - Allow complete or incomplete tasks.
 * - Handle filtering by complete vs incomplete tasks.
 * - Handle filtering by worker ID.
 * - Handle filtering by location ID.
 * - Return in JSON format.
 */

/**
 * API Call Mockups
 * 
 * GET /reports/tasks/workers/:workerId
 * Response:
 * 	{
 * 		success: true,
 * 		data: {
 * 			totalLaborCost: "1000.00",
 * 			tasks: [
 * 				{
 * 					taskId: 1,
 * 					total: "250.00"
 * 				}
 * 			]
 * 		}
 * 	}
 * 
 * GET /reports/tasks/locations/:locationId
 * Response:
 *  {
 *  	success: true,
 * 		totalLaborCost: "1000.00",
 * 		data: {
 * 			tasks: [
 * 				{
 * 					taskId: 1,
 * 					total: "250.00"
 * 				}
 * 			]
 * 		}
 * 	}
 */

/**
 * This holds the express app instance.
 */
const app = express();

/**
 * This holds the port.
 */
const port = 3000;

/**
 * This holds the db instance.
 */
let db;

/**
 * This connects the database.
 * 
 * @returns {void}
 */
async function connect() {
	console.info("Connecting to DB...");
	db = mariadb.createPool({
		host: process.env["DATABASE_HOST"],
		user: process.env["DATABASE_USER"],
		password: process.env["DATABASE_PASSWORD"],
		database: process.env["DATABASE_NAME"]
	});
	
	const conn = await db.getConnection();
	try {
		await conn.query("SELECT 1");
	} finally {
		await conn.end();
	}
}

/**
 * This sets up the call.
 * 
 * @returns {void}
 */
async function main() {
	await connect();

	app.get("/", (req, res) => {
		res.send("Hello!");
	});
	
	app.listen(port, "0.0.0.0", () => {
		console.info(`App listening on ${port}.`);
	});
}

await main();
