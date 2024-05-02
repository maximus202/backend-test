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
 * 			tasks: {
 * 				1: {
 * 					taskId: 1,
 * 					total: "250.00"
 * 				},
 * 				2: {
 * 					taskId: 2,
 * 					total: "250.00"
 *              }
 * 			}
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

	/**
	 * GET /reports/tasks/workers/:workerId
	 */
	app.get("/reports/tasks/workers/:workerId?", async (req, res) => {
		
		/**
		 * Get parameters and query database.
		 */
		const workerId = req.params.workerId || null;
		const completedTasks = req.query.completedTasks || null;

		const conn = await db.getConnection();
		try {
			let query = `SELECT t.*,
				l.name AS location_name,
				w.id AS worker_id,
				w.username AS worker_username,
				lt.time_seconds AS logged_seconds,
				w.hourly_wage
				FROM tasks AS t
				LEFT JOIN logged_time AS lt ON t.id = lt.task_id
				LEFT JOIN workers AS w ON lt.worker_id = w.id
				LEFT JOIN locations AS l ON t.location_id = l.id`;
			const bindParams = [];
			if (workerId) {
				query += ` WHERE w.id = ?`;
				bindParams.push(workerId);
			}
			if (completedTasks !== null) {
				query += ` AND t.completed = ?`;
				bindParams.push(completedTasks);
			}
			const rows = await conn.query(query, bindParams);
			conn.end();

			/**
			 * Put together tasks object.
			 */
			const tasks = {};
			let totalLaborCost = 0;
			rows.forEach(row => {
				/**
				 * Calculate labor cost.
				 */
				if (!row.hourly_wage || !row.logged_seconds)
				{
					row.labor_cost = 0;
					return;
				}

				row.labor_cost = (row.logged_seconds / 3600) * row.hourly_wage;
				totalLaborCost += row.labor_cost;

				/**
				 * If task is not in the object, add it.
				 */
				if (!tasks[row.id]) {
					tasks[row.id] = {
						task_id: row.id,
						description: row.description,
						completed: row.completed,
						location_id: row.location_id,
						location_name: row.location_name,
						worker_id: row.worker_id,
						worker_username: row.worker_username,
						hourly_wage: row.hourly_wage,
						logged_seconds: row.logged_seconds,
						labor_cost: Number(row.labor_cost.toFixed(2))
					};
					return;
				}

				/**
				 * Add labor cost and seconds to task totals.
				 * Labor cost needs to use 2 decimal places.
				 */
				tasks[row.id].labor_cost += Number(row.labor_cost.toFixed(2));
				tasks[row.id].logged_seconds += row.logged_seconds;
			});

			res.json({
				success: true,
				total_labor_cost: Number(totalLaborCost.toFixed(2)),
				data: {
					task_ids: tasks
				}
			});
		} finally {
			await conn.end();
		}

		/**
		 * Return response.
		 */
		//res.send(`Worker ID: ${workerId} Completed Tasks: ${completedTasks}`);
	});
	
	app.listen(port, "0.0.0.0", () => {
		console.info(`App listening on ${port}.`);
	});
}

await main();
