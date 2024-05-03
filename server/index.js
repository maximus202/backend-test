import express from "express";
import { Database } from "./src/services/database.js";
import { ReportController } from "./src/controllers/report-controller.js";

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
 * API Call/Response Examples
 * 
 * GET /reports/tasks/workers/:workerId?completedTasks=1&locationId=1
 * Response:
 * 	{
 * 		success: true,
 * 		data: {
 *  		total_labor_cost: "1000.00",
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
 * 
 * GET /reports/tasks/locations/:locationId?completedTasks=1&workerId=1
 * Response:
 *  {
 *  	success: true,
 * 		data: {
 *  		total_labor_cost: "1000.00",
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
 * 
 * @type {Express}
 */
const app = express();

/**
 * This holds the port.
 * 
 * @type {int}
 */
const port = 3000;

/**
 * This holds the database instance.
 * 
 * @type {Database}
 */
const db = new Database();

/**
 * This sets up the call.
 * 
 * @returns {void}
 */
async function main() {
	await db.connect();

	app.get("/", (req, res) => {
		res.send("Hello!");
	});

	/**
	 * GET /reports/tasks/workers/:workerId
	 */
	app.get("/reports/tasks/workers/:workerId", handleGetTasksByWorker);

	/**
	 * GET /reports/tasks/locations/:locationId
	 */
	app.get("/reports/tasks/locations/:locationId", handleGetTasksByLocation);
	
	app.listen(port, "0.0.0.0", () => {
		console.info(`App listening on ${port}.`);
	});
};

/**
 * This handles the get tasks by worker.
 * 
 * @param {Request} req
 * @param {Response} res
 * @returns {function}
 */
async function handleGetTasksByWorker(req, res) {
	const workerId = req.params.workerId || null;
	const completedTasks = req.query.completedTasks || null;
	const locationId = req.query.locationId || null;

	try {
		const controller = new ReportController();
		const response = await controller.getTaskCosts(workerId, completedTasks, locationId);
		res.json(response);
	} catch (error) {
		res.json({
			success: false, 
			error: error.message 
		});
	}
};

/**
 * This handles the get tasks by location.
 * 
 * @param {Request} req
 * @param {Response} res
 * @returns {function}
 */
async function handleGetTasksByLocation(req, res) {
	const locationId = req.params.locationId || null;
	const completedTasks = req.query.completedTasks || null;
	const workerId = req.query.workerId || null;

	try {
		const controller = new ReportController();
		const response = await controller.getTaskCosts(locationId, completedTasks, workerId);
		res.json(response);
	} catch (error) {
		res.json({ 
			success: false, 
			error: error.message 
		});
	}
};

await main();