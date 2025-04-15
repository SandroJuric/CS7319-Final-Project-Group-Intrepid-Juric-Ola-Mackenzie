CREATE SCHEMA IF NOT EXISTS `instant_messager` ;

use instant_messager;

CREATE USER IF NOT EXISTS '7319Team'@'localhost' IDENTIFIED BY 'Smu-Team2025!';

GRANT ALL PRIVILEGES ON instant_messager.* TO '7319Team'@'localhost';



DROP TABLE IF EXISTS `message`;
DROP TABLE IF EXISTS `usersession`;
DROP TABLE IF EXISTS `session`;
DROP TABLE IF EXISTS `usersessionArchive`;
DROP TABLE IF EXISTS `messageArchive`;
DROP TABLE IF EXISTS `sessionArchive`;
DROP TABLE IF EXISTS `user`;

CREATE TABLE IF NOT EXISTS user (
    userId integer PRIMARY KEY AUTO_INCREMENT NOT NULL,
    username VARCHAR(100) NOT NULL,
    displayname VARCHAR(500) NULL,
    email VARCHAR(500) NOT NULL,
    status bit NOT NULL,
    picture VARCHAR(1000),
    active bit NOT NULL
);

CREATE TABLE IF NOT EXISTS sessionArchive (
    sessionId integer PRIMARY KEY NOT NULL,
    createdOn datetime NOT NULL,
    archivedOn datetime NOT NULL
);

CREATE TABLE IF NOT EXISTS messageArchive (
    messageId integer PRIMARY KEY NOT NULL,
    sessionId integer NOT NULL,
    content VARCHAR(2000) NOT NULL,
    createdOn datetime NOT NULL,
    userId integer NOT NULL,
	CONSTRAINT FK_messageArchive_sessionId FOREIGN KEY (sessionId) REFERENCES sessionArchive(sessionId) ON DELETE CASCADE,
    CONSTRAINT FK_messageArchive_userId FOREIGN KEY (userId) REFERENCES user(userId)
);

CREATE TABLE IF NOT EXISTS usersessionArchive(
	userSessionId integer PRIMARY KEY NOT NULL,
    userId integer NOT NULL,
    sessionId integer NOT NULL,
    createdOn datetime NOT NULL,
    CONSTRAINT FK_usersessionArchive_sessionId FOREIGN KEY (sessionId) REFERENCES sessionArchive(sessionId) ON DELETE CASCADE,
	CONSTRAINT FK_usersessionArchive_userId FOREIGN KEY (userId) REFERENCES user(userId)
);

CREATE TABLE IF NOT EXISTS session (
    sessionId integer PRIMARY KEY AUTO_INCREMENT NOT NULL,
	createdOn datetime NOT NULL,
    modifiedOn datetime NOT NULL
);

CREATE TABLE IF NOT EXISTS userSession (
    userSessionId integer PRIMARY KEY AUTO_INCREMENT NOT NULL,
    userId integer NOT NULL,
    sessionId integer NOT NULL,
    createdOn datetime NOT NULL,
	CONSTRAINT FK_userSession_userId FOREIGN KEY (userId) REFERENCES user(userId),
    CONSTRAINT FK_userSession_sessionId FOREIGN KEY (sessionId) REFERENCES session(sessionId) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS message (
    messageId integer PRIMARY KEY AUTO_INCREMENT NOT NULL,
    sessionId integer NOT NULL,
    userId integer NOT NULL,
    content VARCHAR(2000) NOT NULL,
    createdOn datetime NOT NULL,
    isRead BIT NOT NULL,
    CONSTRAINT FK_message_userId FOREIGN KEY (userId) REFERENCES user(userId),
	CONSTRAINT FK_message_sessionId FOREIGN KEY (sessionId) REFERENCES session(sessionId) ON DELETE CASCADE
);
