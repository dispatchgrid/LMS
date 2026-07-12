-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.43 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.17.0.7270
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for librarymanagementsystem
DROP DATABASE IF EXISTS `librarymanagementsystem`;
CREATE DATABASE IF NOT EXISTS `librarymanagementsystem` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `librarymanagementsystem`;

-- Dumping structure for table librarymanagementsystem.audit
DROP TABLE IF EXISTS `audit`;
CREATE TABLE IF NOT EXISTS `audit` (
  `id` int NOT NULL AUTO_INCREMENT,
  `book_no` int NOT NULL,
  `check_date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `book_no` (`book_no`),
  KEY `idx_audit_date` (`check_date`),
  CONSTRAINT `audit_ibfk_1` FOREIGN KEY (`book_no`) REFERENCES `books` (`book_no`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table librarymanagementsystem.audit: ~4 rows (approximately)
DELETE FROM `audit`;
INSERT INTO `audit` (`id`, `book_no`, `check_date`) VALUES
	(1, 10001, '2026-07-10 10:31:46'),
	(2, 10002, '2026-07-10 10:32:03'),
	(3, 10001, '2026-07-10 10:32:34'),
	(5, 10008, '2026-07-10 11:17:15'),
	(6, 10001, '2026-07-10 11:17:23'),
	(7, 10001, '2026-07-12 11:30:35');

-- Dumping structure for table librarymanagementsystem.books
DROP TABLE IF EXISTS `books`;
CREATE TABLE IF NOT EXISTS `books` (
  `book_no` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `availability` tinyint(1) NOT NULL DEFAULT '1',
  `metadata` json DEFAULT (_utf8mb4'{"title":"","author":"","category":""}'),
  `category` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`book_no`),
  KEY `idx_books_category` (`category_id`),
  CONSTRAINT `books_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table librarymanagementsystem.books: ~8 rows (approximately)
DELETE FROM `books`;
INSERT INTO `books` (`book_no`, `title`, `author`, `price`, `category_id`, `availability`, `metadata`, `category`) VALUES
	(10001, 'To Kill a Mockingbird III', 'Harper Lee', 12.99, 1, 1, '{"title": "", "author": "", "category": ""}', '102'),
	(10002, 'A Brief History of Time', 'Stephen Hawking', 15.50, 3, 0, '{"title": "", "author": "", "category": ""}', '101'),
	(10003, 'Sapiens', 'Yuval Noah Harari', 18.00, 2, 0, '{"title": "", "author": "", "category": ""}', '102'),
	(10004, 'The Art of War', 'Sun Tzu', 8.99, 4, 1, '{"title": "", "author": "", "category": ""}', '105'),
	(10005, NULL, NULL, NULL, 1, 1, '{"title": "", "author": "", "category": ""}', NULL),
	(10006, 'Cosmos', 'Carl Sagan', 14.99, 3, 1, '{"title": "", "author": "", "category": ""}', '101'),
	(10007, 'ටෙස්ටින්', '', 100.00, NULL, 1, '{"title": "", "author": "", "category": ""}', '101'),
	(10008, 'ටෙස්ටින් වන් ටූ ත්රී', 'ටෙස්ටින්', 1580.00, NULL, 0, 'null', '101');

-- Dumping structure for table librarymanagementsystem.categories
DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table librarymanagementsystem.categories: ~6 rows (approximately)
DELETE FROM `categories`;
INSERT INTO `categories` (`category_id`, `name`) VALUES
	(1, 'Fiction'),
	(2, 'Non-Fiction'),
	(3, 'Science'),
	(4, 'History'),
	(5, 'Reference'),
	(6, 'Literature');

-- Dumping structure for table librarymanagementsystem.lends
DROP TABLE IF EXISTS `lends`;
CREATE TABLE IF NOT EXISTS `lends` (
  `id` int NOT NULL AUTO_INCREMENT,
  `book_no` int NOT NULL,
  `admission_no` int NOT NULL,
  `lend_date` date NOT NULL,
  `return_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_lends_book` (`book_no`),
  KEY `idx_lends_student` (`admission_no`),
  KEY `idx_lends_return` (`return_date`),
  CONSTRAINT `lends_ibfk_1` FOREIGN KEY (`book_no`) REFERENCES `books` (`book_no`),
  CONSTRAINT `lends_ibfk_2` FOREIGN KEY (`admission_no`) REFERENCES `students` (`admission_no`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table librarymanagementsystem.lends: ~4 rows (approximately)
DELETE FROM `lends`;
INSERT INTO `lends` (`id`, `book_no`, `admission_no`, `lend_date`, `return_date`) VALUES
	(1, 10001, 2001, '2026-07-10', '2026-07-10'),
	(2, 10001, 2001, '2026-07-10', '2026-07-11'),
	(3, 10002, 2001, '2026-07-11', '2026-07-11'),
	(4, 10001, 2001, '2026-07-11', '2026-07-12'),
	(5, 10002, 2001, '2026-07-12', NULL);

-- Dumping structure for table librarymanagementsystem.students
DROP TABLE IF EXISTS `students`;
CREATE TABLE IF NOT EXISTS `students` (
  `admission_no` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `class` varchar(50) NOT NULL,
  PRIMARY KEY (`admission_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table librarymanagementsystem.students: ~0 rows (approximately)
DELETE FROM `students`;
INSERT INTO `students` (`admission_no`, `name`, `class`) VALUES
	(2001, 'Nethmal Sooriyabandara', '11E');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
