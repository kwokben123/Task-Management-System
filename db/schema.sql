CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  assignee VARCHAR(255) NOT NULL,
  dueDate DATE NOT NULL,
  status ENUM('Dev', 'in-progress', 'UAT-Ready', 'UAT-passed', 'PROD-Ready', 'Launched') NOT NULL
);