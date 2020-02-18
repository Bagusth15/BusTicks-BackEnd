-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Feb 18, 2020 at 04:09 PM
-- Server version: 10.1.38-MariaDB
-- PHP Version: 7.1.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bustick`
--

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `invoice` int(11) NOT NULL,
  `id_schedule` int(11) NOT NULL,
  `total_price` int(11) NOT NULL,
  `payment_link` varchar(250) NOT NULL,
  `payment_status` varchar(100) NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `bookingdetail`
--

CREATE TABLE `bookingdetail` (
  `id` int(11) NOT NULL,
  `id_booking` int(11) NOT NULL,
  `id_schedule` int(11) NOT NULL,
  `no_identity` int(100) NOT NULL,
  `name` varchar(250) NOT NULL,
  `seat` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `bus`
--

CREATE TABLE `bus` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_seat` int(11) NOT NULL,
  `format_seat` varchar(50) NOT NULL,
  `ac` int(2) NOT NULL,
  `wifi` int(2) NOT NULL,
  `status` int(2) NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `bus`
--

INSERT INTO `bus` (`id`, `name`, `total_seat`, `format_seat`, `ac`, `wifi`, `status`, `create_at`, `update_at`) VALUES
(1, 'MGI', 36, '2-2', 1, 0, 1, '2020-02-15 02:30:44', '2020-02-15 02:30:44'),
(2, 'BELA UTAMA', 36, '2-2', 1, 1, 1, '2020-02-15 02:30:44', '2020-02-15 02:30:44'),
(3, 'LORENA', 36, '2-2', 1, 1, 1, '2020-02-18 14:24:58', '2020-02-18 14:24:58'),
(4, 'AKAS', 36, '2-2', 0, 1, 1, '2020-02-18 14:24:58', '2020-02-18 14:24:58'),
(5, 'EKA', 36, '2-2', 1, 1, 1, '2020-02-18 14:25:53', '2020-02-18 14:25:53'),
(6, 'SUMBER KENCONO', 36, '2-2', 1, 0, 1, '2020-02-18 14:25:53', '2020-02-18 14:25:53');

-- --------------------------------------------------------

--
-- Table structure for table `city`
--

CREATE TABLE `city` (
  `id` int(11) NOT NULL,
  `name` varchar(250) NOT NULL,
  `status` int(2) NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `city`
--

INSERT INTO `city` (`id`, `name`, `status`, `create_at`, `update_at`) VALUES
(1, 'Bogor', 1, '2020-02-15 02:27:43', '2020-02-15 02:27:43'),
(2, 'Bandung', 1, '2020-02-15 02:27:43', '2020-02-15 02:27:43'),
(3, 'Jakarta', 1, '2020-02-16 12:24:16', '2020-02-16 12:24:16'),
(4, 'Tangerang', 1, '2020-02-16 12:24:16', '2020-02-16 12:24:16'),
(5, 'Bekasi', 1, '2020-02-16 12:24:29', '2020-02-16 12:24:29'),
(6, 'Depok', 1, '2020-02-16 12:24:43', '2020-02-16 12:24:43');

-- --------------------------------------------------------

--
-- Table structure for table `schedule`
--

CREATE TABLE `schedule` (
  `id` int(11) NOT NULL,
  `id_bus` int(11) NOT NULL,
  `departure_city` int(11) NOT NULL,
  `departure_location` int(11) NOT NULL,
  `departure_time` datetime NOT NULL,
  `arrival_city` int(11) NOT NULL,
  `arrival_location` int(11) NOT NULL,
  `arrival_time` datetime NOT NULL,
  `price` int(11) NOT NULL,
  `status` int(2) NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `schedule`
--

INSERT INTO `schedule` (`id`, `id_bus`, `departure_city`, `departure_location`, `departure_time`, `arrival_city`, `arrival_location`, `arrival_time`, `price`, `status`, `create_at`, `update_at`) VALUES
(1, 1, 1, 1, '2020-02-20 09:00:00', 2, 2, '2020-02-20 12:00:00', 100000, 1, '2020-02-15 02:38:01', '2020-02-15 02:38:01'),
(2, 2, 2, 2, '2020-02-20 13:00:00', 1, 1, '2020-02-20 16:00:00', 90000, 1, '2020-02-15 02:38:01', '2020-02-15 02:38:01'),
(3, 5, 3, 5, '2020-02-20 04:00:00', 4, 6, '2020-02-20 06:00:00', 40000, 1, '2020-02-18 14:29:13', '2020-02-18 14:29:13'),
(4, 5, 4, 6, '2020-02-20 18:00:00', 3, 5, '2020-02-20 20:00:00', 45000, 1, '2020-02-18 14:29:13', '2020-02-18 14:29:13'),
(5, 3, 3, 5, '2020-02-20 06:00:00', 5, 4, '2020-02-20 09:00:00', 50000, 1, '2020-02-18 14:30:59', '2020-02-18 14:30:59'),
(6, 1, 3, 5, '2020-02-20 10:00:00', 6, 3, '2020-02-18 12:00:00', 30000, 1, '2020-02-18 14:30:59', '2020-02-18 14:30:59'),
(7, 4, 3, 5, '2020-02-20 15:00:00', 6, 3, '2020-02-18 17:00:00', 25000, 1, '2020-02-18 14:34:03', '2020-02-18 14:34:03'),
(8, 3, 3, 5, '2020-02-20 04:00:00', 6, 3, '2020-02-18 06:00:00', 50000, 1, '2020-02-18 14:34:03', '2020-02-18 14:34:03'),
(10, 1, 3, 5, '2020-02-20 15:00:00', 6, 3, '2020-02-20 17:00:00', 45000, 1, '2020-02-18 14:35:43', '2020-02-18 14:35:43'),
(11, 6, 3, 5, '2020-02-20 08:00:00', 6, 3, '2020-02-18 09:00:00', 55000, 1, '2020-02-18 14:40:52', '2020-02-18 14:40:52');

-- --------------------------------------------------------

--
-- Table structure for table `terminal`
--

CREATE TABLE `terminal` (
  `id` int(11) NOT NULL,
  `name` varchar(250) NOT NULL,
  `id_city` int(11) NOT NULL,
  `location` varchar(250) NOT NULL,
  `status` int(2) NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `terminal`
--

INSERT INTO `terminal` (`id`, `name`, `id_city`, `location`, `status`, `create_at`, `update_at`) VALUES
(1, 'Leuwi Panjang', 2, 'Jl. Leuwi Panjang Gg. Panyileukan, Kopo, Kec. Bojongloa Kaler, Kota Bandung, Jawa Barat 40233', 1, '2020-02-15 02:33:07', '2020-02-15 02:33:07'),
(2, 'Baranang Siang', 1, 'Jl. Manggis VI, Baranangsiang, Kec. Bogor Tim., Kota Bogor, Jawa Barat 16143', 1, '2020-02-15 02:33:07', '2020-02-15 02:33:07'),
(3, 'Jatijajar', 6, 'Jl. Jatijajar 1 No.04, Jatijajar, Kec. Tapos, Kota Depok, Jawa Barat 16451', 1, '2020-02-16 12:27:18', '2020-02-16 12:27:18'),
(4, 'Bekasi Kota', 5, 'Jl. Ir. H. Juanda, Margahayu, Kec. Bekasi Tim., Kota Bks, Jawa Barat', 1, '2020-02-16 12:27:18', '2020-02-16 12:27:18'),
(5, 'Grogol', 3, ' Jl. Kyai Tapa No.1 RT.1/RW.5, Grogol, Grogol, Kec. Grogol petamburan, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta 11450', 1, '2020-02-16 12:28:39', '2020-02-16 12:28:39'),
(6, 'Poris Plawad', 4, 'Jl. Benteng Betawi, Poris Plawad, Kec. Tangerang, Kota Tangerang, Banten 15141', 1, '2020-02-16 12:28:39', '2020-02-16 12:28:39');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `image` varchar(250) NOT NULL,
  `key_user` varchar(4) NOT NULL,
  `status` int(2) NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `username`, `password`, `image`, `key_user`, `status`, `create_at`, `update_at`) VALUES
(2, 'Bagus Tri Harjanto', 'bagustri15@gmail.com', 'bagusth15', '$2b$10$32SFkZ.VC2cfw3A2xXUwyevboxAndFuXG9RIjhdLHXse8isKAVJ8G', '369284bear.png', '2779', 1, '2020-02-17 00:05:37', '2020-02-17 10:50:09');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_schedule` (`id_schedule`);

--
-- Indexes for table `bookingdetail`
--
ALTER TABLE `bookingdetail`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bus`
--
ALTER TABLE `bus`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `city`
--
ALTER TABLE `city`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `schedule`
--
ALTER TABLE `schedule`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_bus` (`id_bus`),
  ADD KEY `departure_location` (`departure_location`),
  ADD KEY `arrival_location` (`arrival_location`);

--
-- Indexes for table `terminal`
--
ALTER TABLE `terminal`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_city` (`id_city`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `booking`
--
ALTER TABLE `booking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT for table `bookingdetail`
--
ALTER TABLE `bookingdetail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=115;

--
-- AUTO_INCREMENT for table `bus`
--
ALTER TABLE `bus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `city`
--
ALTER TABLE `city`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `schedule`
--
ALTER TABLE `schedule`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `terminal`
--
ALTER TABLE `terminal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `booking`
--
ALTER TABLE `booking`
  ADD CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `booking_ibfk_2` FOREIGN KEY (`id_schedule`) REFERENCES `schedule` (`id`);

--
-- Constraints for table `schedule`
--
ALTER TABLE `schedule`
  ADD CONSTRAINT `schedule_ibfk_1` FOREIGN KEY (`id_bus`) REFERENCES `bus` (`id`),
  ADD CONSTRAINT `schedule_ibfk_2` FOREIGN KEY (`departure_location`) REFERENCES `terminal` (`id`),
  ADD CONSTRAINT `schedule_ibfk_3` FOREIGN KEY (`arrival_location`) REFERENCES `terminal` (`id`);

--
-- Constraints for table `terminal`
--
ALTER TABLE `terminal`
  ADD CONSTRAINT `terminal_ibfk_1` FOREIGN KEY (`id_city`) REFERENCES `city` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
