-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 19, 2023 at 04:38 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `t7_6958`
--
CREATE DATABASE IF NOT EXISTS `t7_6958` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `t7_6958`;

-- --------------------------------------------------------

--
-- Table structure for table `applications`
--

DROP TABLE IF EXISTS `applications`;
CREATE TABLE `applications` (
  `application_id` varchar(6) NOT NULL,
  `job_id` varchar(6) NOT NULL,
  `user_id` varchar(6) NOT NULL,
  `status` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `applications`
--

INSERT INTO `applications` (`application_id`, `job_id`, `user_id`, `status`) VALUES
('APL001', 'JOB001', 'USR001', 'Accepted'),
('APL002', 'JOB001', 'USR003', 'Accepted');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
CREATE TABLE `jobs` (
  `job_id` varchar(6) NOT NULL,
  `user_id` varchar(6) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `salary_range_from` int(15) NOT NULL,
  `salary_range_to` int(15) NOT NULL,
  `promoted` varchar(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`job_id`, `user_id`, `title`, `description`, `salary_range_from`, `salary_range_to`, `promoted`) VALUES
('JOB001', 'USR002', 'job 1', 'job 1', 8, 9, 'N'),
('JOB002', 'USR002', 'job 2', 'job 2', 8, 9, 'N'),
('JOB003', 'USR002', 'job 3', 'job 3', 8, 9, 'N'),
('JOB004', 'USR002', 'job 4', 'job 4', 8, 9, 'Y'),
('JOB005', 'USR002', 'job 5', 'job 5', 8, 9, 'N'),
('JOB006', 'USR002', 'job 6', 'job 6', 8, 9, 'N'),
('JOB007', 'USR002', 'job 7', 'job 7', 8, 9, 'Y'),
('JOB008', 'USR002', 'job 8', 'job 8', 8, 9, 'Y'),
('JOB009', 'USR002', 'job 9', 'job 9', 8, 9, 'N'),
('JOB010', 'USR002', 'job 10', 'job 10', 8, 9, 'N'),
('JOB011', 'USR002', 'job 11', 'job 11', 8, 9, 'N'),
('JOB012', 'USR002', 'job 12', 'job 12', 8, 9, 'N'),
('JOB013', 'USR002', 'job 13', 'job 13', 8, 9, 'N'),
('JOB014', 'USR002', 'job 14', 'job 14', 8, 9, 'N'),
('JOB015', 'USR002', 'programming', 'programming', 8, 9, 'Y'),
('JOB016', 'USR002', 'programming', 'programming', 8, 9, 'N'),
('JOB017', 'USR002', 'programming', 'programming', 8, 9, 'N'),
('JOB018', 'USR002', 'programming', 'programming', 8, 9, 'N'),
('JOB019', 'USR002', 'programming', 'programming', 8, 9, 'N'),
('JOB020', 'USR002', 'programming', 'programming', 8, 9, 'N'),
('JOB021', 'USR002', 'asd', 'asd', 8, 9, 'N'),
('JOB022', 'USR002', 'asd', 'asd', 8, 9, 'N'),
('JOB023', 'USR002', 'programming', 'programming', 8, 9, 'N'),
('JOB024', 'USR002', 'programming', 'programming', 8, 9, 'N'),
('JOB025', 'USR002', 'programming', 'programming', 8, 9, 'N'),
('JOB026', 'USR002', 'programming', 'programming', 8, 9, 'N'),
('JOB027', 'USR002', 'programming', 'programming', 8, 9, 'N'),
('JOB028', 'USR002', 'programming', 'programming', 8, 9, 'N'),
('JOB029', 'USR002', 'programming', 'programming', 8, 9, 'N'),
('JOB030', 'USR002', 'programming', 'programming', 8, 9, 'N'),
('JOB031', 'USR002', 'programming', 'programming', 8, 9, 'N'),
('JOB032', 'USR002', 'programming', 'programming', 8, 9, 'N'),
('JOB033', 'USR002', 'programming', 'programming', 8, 9, 'N'),
('JOB034', 'USR002', 'programming', 'programming', 8, 9, 'N'),
('JOB035', 'USR002', 'programming', 'programming', 8, 9, 'N'),
('JOB036', 'USR002', 'programming', 'programming', 8, 9, 'N'),
('JOB037', 'USR002', 'programming', 'programming', 8, 9, 'N'),
('JOB038', 'USR002', 'programming', 'programming', 8, 9, 'N'),
('JOB039', 'USR002', 'programming', 'programming', 8, 9, 'N'),
('JOB040', 'USR002', 'programming', 'programming', 8, 9, 'N'),
('JOB041', 'USR002', 'programming', 'programming', 8, 9, 'N'),
('JOB042', 'USR002', 'programming', 'programming', 8, 9, 'N'),
('JOB043', 'USR002', 'programming', 'programming', 8, 9, 'N'),
('JOB044', 'USR002', 'programming', 'programming', 8, 9, 'N');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `user_id` varchar(6) NOT NULL,
  `info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`info`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`notification_id`, `user_id`, `info`) VALUES
(35, 'USR001', '{\"type\":\"Personalized\",\"status\":\"Match\",\"job_id\":\"JOB043\",\"title\":\"programming\"}'),
(36, 'USR003', '{\"type\":\"Personalized\",\"status\":\"Match\",\"job_id\":\"JOB043\",\"title\":\"programming\"}'),
(37, 'USR003', '{\"type\":\"Personalized\",\"status\":\"Match\",\"job_id\":\"JOB044\",\"title\":\"programming\"}'),
(38, 'USR002', '{\"application_id\":\"APL002\",\"name\":\"Job Seeker 2\",\"applying_to\":\"job 1\",\"job_fields\":[\"programming\",\"web programming\",\"frontend developer\",\"backend developer\",\"full-stack developer\"]}'),
(39, 'USR003', '{\"type\":\"Application\",\"status\":\"Accepted\",\"job_id\":\"JOB001\",\"title\":\"job 1\"}');

-- --------------------------------------------------------

--
-- Table structure for table `subscriptions`
--

DROP TABLE IF EXISTS `subscriptions`;
CREATE TABLE `subscriptions` (
  `subscription_id` int(11) NOT NULL,
  `user_id` varchar(6) NOT NULL,
  `feature` varchar(255) NOT NULL,
  `quota` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `subscriptions`
--

INSERT INTO `subscriptions` (`subscription_id`, `user_id`, `feature`, `quota`) VALUES
(1, 'USR001', 'Personalized Notifications', 0),
(2, 'USR002', 'Promoted Jobs', 5),
(3, 'USR003', 'Personalized Notifications', 3);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` varchar(6) NOT NULL,
  `email_address` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `display_name` varchar(255) NOT NULL,
  `balance` int(15) NOT NULL DEFAULT 0,
  `job_fields` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `email_address`, `password`, `type`, `display_name`, `balance`, `job_fields`) VALUES
('USR001', 'jobseeker1@nice.com', '123', 'Job Seeker', 'Job Seeker 1', 50000, '[\"programming\",\"web programming\",\"frontend developer\",\"backend developer\",\"full-stack developer\"]'),
('USR002', 'employer1@nice.com', '321', 'Employer', 'Employer 1', 100000, NULL),
('USR003', 'jobseeker2@nice.com', 'abc', 'Job Seeker', 'Job Seeker 2', 150000, '[\"programming\",\"web programming\",\"frontend developer\",\"backend developer\",\"full-stack developer\"]'),
('USR004', 'employer2@nice.com', 'cba', 'Employer', 'Employer 2', 100000, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`application_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`job_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`);

--
-- Indexes for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`subscription_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `subscription_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
