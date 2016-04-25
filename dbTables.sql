Create Table Ticket(
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    phone_number NUMERIC(10),
    ip VARCHAR(45) NOT NULL,	
    created_at TIMESTAMP,
    tutor_id VARCHAR(36), FOREIGN KEY(tutor_id) REFERENCES Tutor(id),
    status VARCHAR(20) NOT NULL,
    comment VARCHAR(1000)
);

Create Table Tutor(
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    f_name VARCHAR(40),
    l_name VARCHAR(40),
    user_name VARCHAR(40) NOT NULL UNIQUE,
    password VARCHAR(40) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE
);

Create Table BlockedIP(
    ip VARCHAR(45) NOT NULL PRIMARY KEY,
    blocked_at TIMESTAMP
);

Create Table Issue(
    ticket_id VARCHAR(36) NOT NULL,
    issue_Nbr MEDIUMINT(3) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description VARCHAR(1000),    
    PRIMARY KEY (ticket_id, issue_Nbr)
);

DELIMITER $$

CREATE TRIGGER Issue_incrementer BEFORE INSERT ON Issue
FOR EACH ROW BEGIN
    SET NEW.issue_Nbr = (
       SELECT IFNULL(MAX(issue_Nbr), 0) + 1
       FROM Issue
       WHERE ticket_id  = NEW.ticket_id
    );
END $$

DELIMITER ;

DELIMITER $$
CREATE EVENT delete_event
ON SCHEDULE EVERY 1 DAY STARTS (NOW() + INTERVAL 1 DAY)

DO BEGIN
      DELETE from BlockedIP WHERE blocked_at < (DATE_SUB(NOW(), INTERVAL 1 DAY));
END;$$
DELIMITER ;