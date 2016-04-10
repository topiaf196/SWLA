Create Table Customer(
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    f_name VARCHAR(40),
    l_name VARCHAR(40),
    street VARCHAR(100),
    city VARCHAR(100),
    state VARCHAR(100),
    zip VARCHAR(100),
    phone_number NUMERIC(10)  
);
Create Table Employee(
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    f_name VARCHAR(40),
    l_name VARCHAR(40),
    skill_level NUMERIC(2)
);
Create Table Request(
    ip NUMERIC(45) NOT NULL PRIMARY KEY,
    created_at TIMESTAMP
);
Create Table BlockedIP(
    ip NUMERIC(45) NOT NULL PRIMARY KEY,
    blocked_at TIMESTAMP
);

Create Table Issue(
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL, FOREIGN KEY(customer_id) REFERENCES Customer(id),
    employee_id VARCHAR(36) NOT NULL, FOREIGN KEY(employee_id) REFERENCES Employee(id),
    difficulty_score NUMERIC(2),
    description VARCHAR(1000),
    status VARCHAR(10)
);