Create Table Ticket(
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    phone_number NUMERIC(10),
    ip VARCHAR(45) NOT NULL,	
    created_at TIMESTAMP,
    tutor_id VARCHAR(36), FOREIGN KEY(tutor_id) REFERENCES Tutor(id),
    status VARCHAR(20) NOT NULL
);
Create Table Tutor(
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    f_name VARCHAR(40),
    l_name VARCHAR(40)
);
Create Table Issue(
    ticket_id VARCHAR(36) NOT NULL,
    issue_Nbr MEDIUMINT(3) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description VARCHAR(1000),
    PRIMARY KEY (ticket_id, issue_Nbr)
);
Create Table BlockedIP(
    ip VARCHAR(45) NOT NULL PRIMARY KEY,
    blocked_at TIMESTAMP
);