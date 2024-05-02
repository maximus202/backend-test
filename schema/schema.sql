CREATE TABLE locations (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL UNIQUE
) ENGINE=INNODB;

CREATE TABLE workers (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(30) NOT NULL UNIQUE,
  hourly_wage DECIMAL(5, 2) NOT NULL
) ENGINE=INNODB;

CREATE TABLE tasks (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  description VARCHAR(100) NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT 0,
  location_id INT(11) NOT NULL,

  FOREIGN KEY(location_id) REFERENCES locations(id) ON DELETE CASCADE

) ENGINE=INNODB;

CREATE TABLE logged_time (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  time_seconds INT(11) NOT NULL,

  task_id INT(11) NOT NULL,
  worker_id INT(11) NOT NULL,

  FOREIGN KEY(task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY(worker_id) REFERENCES workers(id) ON DELETE CASCADE
) ENGINE=INNODB;

INSERT INTO locations (name) VALUES
('Warehouse A'),
('Warehouse B'),
('Office');

INSERT INTO workers (id, username, hourly_wage) VALUES
(1, 'john_doe', 15.50),
(2, 'jane_smith', 18.75),
(3, 'mike_jackson', 20.00);

INSERT INTO tasks (id, description, completed, location_id) VALUES
(1, 'Stock inventory', 0, 1),
(2, 'Pack orders', 0, 2),
(3, 'Clean office', 1, 3),
(4, 'Write Letters', 1, 1),
(5, 'Pack orders', 1, 1),
(6, 'Clean office', 0, 3);

INSERT INTO logged_time (time_seconds, task_id, worker_id) VALUES
(3600, 1, 1),
(1800, 1, 1),
(2700, 2, 1),
(7200, 3, 1);
