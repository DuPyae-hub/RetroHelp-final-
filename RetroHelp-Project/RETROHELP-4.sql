-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 21, 2026 at 05:57 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `RETROHELP`
--

-- --------------------------------------------------------

--
-- Table structure for table `art_centers`
--

CREATE TABLE `art_centers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `nickname` varchar(255) DEFAULT NULL,
  `role_id` bigint(20) UNSIGNED DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `contact_no` varchar(255) DEFAULT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
  `art_pills_available` tinyint(1) NOT NULL DEFAULT 0,
  `art_pills_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `township` varchar(255) DEFAULT NULL,
  `area` varchar(255) DEFAULT NULL,
  `rating_avg` decimal(3,2) DEFAULT 0.00,
  `total_reviews` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `art_centers`
--

INSERT INTO `art_centers` (`id`, `name`, `nickname`, `role_id`, `image`, `latitude`, `longitude`, `contact_no`, `is_verified`, `art_pills_available`, `art_pills_count`, `created_at`, `updated_at`, `township`, `area`, `rating_avg`, `total_reviews`) VALUES
(4, 'Mandalay General Hospital', 'mdy-seed-01', 2, 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Mandalay_Central_Women_Hospital.jpg', 21.9587000, 96.0944000, '+95 2 40360', 1, 1, 200, '2026-05-11 22:04:39', '2026-05-12 01:10:27', 'Chanayethazan', '30th St / downtown corridor', 4.10, 18),
(5, 'Mandalay Central Women\'s Hospital', 'mdy-seed-02', 2, 'https://upload.wikimedia.org/wikipedia/commons/7/78/550_Beded_Children_Hospital_Mandalay.jpg', 21.9726000, 96.1012000, '+95 2 40370', 1, 1, 200, '2026-05-11 22:04:39', '2026-05-12 01:10:27', 'Chanmyathazi', 'Near Mandalay Palace east', 3.40, 31),
(6, '550 Bed Mandalay Children\'s Hospital', 'mdy-seed-03', 2, 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Mandalay_Infectious_Diseases_Hospital.jpg', 21.9462000, 96.0736000, '+95 2 40380', 1, 1, 200, '2026-05-11 22:04:40', '2026-05-12 01:10:27', 'Mahaaungmyay', 'Children\'s hospital campus', 4.10, 44),
(7, '300 Bed Children\'s Hospital', 'mdy-seed-04', 2, 'https://upload.wikimedia.org/wikipedia/commons/9/91/Mandalay_Workers_Hospital.jpg', 21.9763000, 96.1012000, '+95 2 40381', 1, 1, 200, '2026-05-11 22:04:40', '2026-05-12 01:10:27', 'Chanmyathazi', 'East of moat', 3.40, 57),
(8, 'Mandalay EENT Hospital', 'mdy-seed-05', 2, 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Mandalay_Orthopaedics_Hospital.jpg', 21.9622000, 96.0907000, '+95 2 40390', 1, 1, 200, '2026-05-11 22:04:40', '2026-05-12 01:10:27', 'Chanayethazan', 'Central Mandalay', 4.10, 70),
(9, 'Mandalay Infectious Diseases Hospital', 'mdy-seed-06', 2, 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Mandalay_EENT_Hospital.jpg', 21.9608000, 96.0903000, '+95 2 40400', 1, 1, 200, '2026-05-11 22:04:40', '2026-05-12 01:10:27', 'Chanayethazan', 'ID care campus', 3.40, 83),
(10, 'Mandalay Mental Health Hospital', 'mdy-seed-07', 2, 'https://upload.wikimedia.org/wikipedia/commons/d/d1/University_Hospital,_Mandalay.jpg', 21.9855000, 96.0822000, '+95 2 40410', 1, 1, 200, '2026-05-11 22:04:40', '2026-05-12 01:10:27', 'Aungmyaythazan', 'North Mandalay', 4.10, 96),
(11, 'Mandalay Traditional Medicine Hospital', 'mdy-seed-08', 2, 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Mandalay_Palace.jpg', 21.9691000, 96.1056000, '+95 2 40420', 1, 1, 200, '2026-05-11 22:04:41', '2026-05-12 01:10:27', 'Chanmyathazi', 'Traditional medicine ward', 3.40, 109),
(12, '300 Bed Mandalay Training Hospital', 'mdy-seed-09', 2, 'https://upload.wikimedia.org/wikipedia/commons/2/27/Yangon_General_Hospital.jpg', 21.9436000, 96.0723000, '+95 2 40430', 1, 1, 200, '2026-05-11 22:04:41', '2026-05-12 01:10:27', 'Mahaaungmyay', 'Training hospital zone', 4.10, 122),
(13, 'Mandalay Tuberculosis Hospital', 'mdy-seed-10', 2, 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Mandalay_Central_Women_Hospital.jpg', 21.9385000, 96.1164000, '+95 2 40440', 1, 1, 200, '2026-05-11 22:04:41', '2026-05-12 01:10:27', 'Pyigyitagon', 'TB / respiratory services', 3.40, 15),
(14, 'Mandalay Workers\' Hospital', 'mdy-seed-11', 2, 'https://upload.wikimedia.org/wikipedia/commons/7/78/550_Beded_Children_Hospital_Mandalay.jpg', 21.9300000, 96.1343000, '+95 2 40450', 1, 1, 207, '2026-05-11 22:04:41', '2026-05-12 01:10:27', 'Patheingyi', 'Industrial corridor', 4.10, 28),
(15, 'Mandalay Orthopaedics Hospital', 'mdy-seed-12', 2, 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Mandalay_Infectious_Diseases_Hospital.jpg', 21.9939000, 96.0795000, '+95 2 40460', 1, 1, 224, '2026-05-11 22:04:42', '2026-05-12 01:10:27', 'Aungmyaythazan', 'Orthopaedic campus', 3.40, 41),
(16, 'University Hospital, Mandalay', 'mdy-seed-13', 2, 'https://upload.wikimedia.org/wikipedia/commons/9/91/Mandalay_Workers_Hospital.jpg', 21.9671000, 96.0984000, '+95 2 40470', 1, 1, 241, '2026-05-11 22:04:42', '2026-05-12 01:10:27', 'Chanayethazan', 'Medical University vicinity', 4.10, 54),
(17, 'Aungmyaythazan Township Hospital', 'mdy-seed-14', 2, 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Mandalay_Orthopaedics_Hospital.jpg', 21.9834000, 96.0864000, '+95 9 790 100001', 1, 1, 258, '2026-05-11 22:04:42', '2026-05-12 01:10:27', 'Aungmyaythazan', 'Township hospital road', 3.40, 67),
(18, 'Amarapura Township Hospital', 'mdy-seed-15', 2, 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Mandalay_EENT_Hospital.jpg', 21.9010000, 96.0532000, '+95 9 790 100002', 1, 1, 275, '2026-05-11 22:04:42', '2026-05-12 01:10:27', 'Amarapura', 'Amarapura town', 4.10, 80),
(19, 'Chanayethazan Township Hospital', 'mdy-seed-16', 2, 'https://upload.wikimedia.org/wikipedia/commons/d/d1/University_Hospital,_Mandalay.jpg', 21.9538000, 96.0888000, '+95 9 790 100003', 1, 1, 292, '2026-05-11 22:04:43', '2026-05-12 01:10:27', 'Chanayethazan', 'Township health compound', 3.40, 93),
(20, 'Chanmyathazi Township Hospital', 'mdy-seed-17', 2, 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Mandalay_Palace.jpg', 21.9765000, 96.1025000, '+95 9 790 100004', 1, 1, 200, '2026-05-11 22:04:43', '2026-05-12 01:10:27', 'Chanmyathazi', 'Near moat', 4.10, 106),
(21, 'Mahaaungmyay Township Hospital', 'mdy-seed-18', 2, 'https://upload.wikimedia.org/wikipedia/commons/2/27/Yangon_General_Hospital.jpg', 21.9432000, 96.0662000, '+95 9 790 100005', 1, 1, 200, '2026-05-11 22:04:43', '2026-05-12 01:10:27', 'Mahaaungmyay', 'Southwest Mandalay', 3.40, 119),
(22, 'Patheingyi Township Hospital', 'mdy-seed-19', 2, 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Mandalay_Central_Women_Hospital.jpg', 21.9274000, 96.1304000, '+95 9 790 100006', 1, 1, 200, '2026-05-11 22:04:43', '2026-05-12 01:10:27', 'Patheingyi', 'Eastern Mandalay', 4.10, 12),
(23, 'Pyigyitagon Township Hospital', 'mdy-seed-20', 2, 'https://upload.wikimedia.org/wikipedia/commons/7/78/550_Beded_Children_Hospital_Mandalay.jpg', 21.9356000, 96.1096000, '+95 9 790 100007', 1, 1, 200, '2026-05-11 22:04:44', '2026-05-12 01:10:27', 'Pyigyitagon', 'Southeast township', 3.40, 25),
(24, 'Tada-U Township Hospital', 'mdy-seed-21', 2, 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Mandalay_Infectious_Diseases_Hospital.jpg', 21.8564000, 96.1188000, '+95 9 790 100008', 1, 1, 200, '2026-05-11 22:04:44', '2026-05-12 01:10:27', 'Tada-U', 'Tada-U town', 4.10, 38),
(25, 'Singu Township Hospital', 'mdy-seed-22', 2, 'https://upload.wikimedia.org/wikipedia/commons/9/91/Mandalay_Workers_Hospital.jpg', 22.0476000, 96.2200000, '+95 9 790 100009', 1, 1, 200, '2026-05-11 22:04:44', '2026-05-12 01:10:27', 'Singu', 'Singu town', 3.40, 51),
(26, 'Thabeikkyin Township Hospital', 'mdy-seed-23', 2, 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Mandalay_Orthopaedics_Hospital.jpg', 22.1788000, 96.0112000, '+95 9 790 100010', 1, 1, 200, '2026-05-11 22:04:44', '2026-05-12 01:10:27', 'Thabeikkyin', 'Irrawaddy west bank', 4.10, 64),
(27, 'Kyaukse Township Hospital', 'mdy-seed-24', 2, 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Mandalay_EENT_Hospital.jpg', 21.6130000, 96.1324000, '+95 9 790 100011', 1, 1, 200, '2026-05-11 22:04:44', '2026-05-12 01:10:27', 'Kyaukse', 'Kyaukse town centre', 3.40, 77),
(28, 'Sintgaing Township Hospital', 'mdy-seed-25', 2, 'https://upload.wikimedia.org/wikipedia/commons/d/d1/University_Hospital,_Mandalay.jpg', 21.7212000, 96.1376000, '+95 9 790 100012', 1, 1, 200, '2026-05-11 22:04:45', '2026-05-12 01:10:27', 'Sintgaing', 'Sintgaing town', 4.10, 90),
(29, 'Myittha Township Hospital', 'mdy-seed-26', 2, 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Mandalay_Palace.jpg', 21.4224000, 96.1388000, '+95 9 790 100013', 1, 1, 200, '2026-05-11 22:04:45', '2026-05-12 01:10:27', 'Myittha', 'Myittha town', 3.40, 103),
(30, 'Taungtha Township Hospital', 'mdy-seed-27', 2, 'https://upload.wikimedia.org/wikipedia/commons/2/27/Yangon_General_Hospital.jpg', 21.0436000, 95.4800000, '+95 9 790 100014', 1, 1, 200, '2026-05-11 22:04:45', '2026-05-12 01:10:27', 'Taungtha', 'Taungtha town', 4.10, 116),
(31, 'Yamethin Township Hospital', 'mdy-seed-28', 2, 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Mandalay_Central_Women_Hospital.jpg', 20.4264000, 96.1412000, '+95 9 790 100015', 1, 1, 216, '2026-05-11 22:04:45', '2026-05-12 01:10:27', 'Yamethin', 'Yamethin town', 3.40, 9),
(32, 'Pyawbwe Township Hospital', 'mdy-seed-29', 2, 'https://upload.wikimedia.org/wikipedia/commons/7/78/550_Beded_Children_Hospital_Mandalay.jpg', 20.5876000, 96.5224000, '+95 9 790 100016', 1, 1, 233, '2026-05-11 22:04:46', '2026-05-12 01:10:27', 'Pyawbwe', 'Pyawbwe town', 4.10, 22),
(33, 'Meiktila Township Hospital', 'mdy-seed-30', 2, 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Mandalay_Infectious_Diseases_Hospital.jpg', 20.8788000, 95.8576000, '+95 9 790 100017', 1, 1, 250, '2026-05-11 22:04:46', '2026-05-12 01:10:27', 'Meiktila', 'Meiktila town', 3.40, 35),
(34, 'Thazi Township Hospital', 'mdy-seed-31', 2, 'https://upload.wikimedia.org/wikipedia/commons/9/91/Mandalay_Workers_Hospital.jpg', 20.8500000, 96.0788000, '+95 9 790 100018', 1, 1, 267, '2026-05-11 22:04:46', '2026-05-12 01:10:27', 'Thazi', 'Thazi town', 4.10, 48),
(35, 'Wundwin Township Hospital', 'mdy-seed-32', 2, 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Mandalay_Orthopaedics_Hospital.jpg', 21.1012000, 96.0400000, '+95 9 790 100019', 1, 1, 284, '2026-05-11 22:04:46', '2026-05-12 01:10:27', 'Wundwin', 'Wundwin town', 3.40, 61),
(36, 'Naungcho Township Hospital', 'mdy-seed-33', 2, 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Mandalay_EENT_Hospital.jpg', 22.3224000, 96.4512000, '+95 9 790 100020', 1, 1, 200, '2026-05-11 22:04:47', '2026-05-12 01:10:27', 'Naungcho', 'Naungcho town', 4.10, 74),
(37, 'Nawnghkio Township Hospital', 'mdy-seed-34', 2, 'https://upload.wikimedia.org/wikipedia/commons/d/d1/University_Hospital,_Mandalay.jpg', 22.3336000, 96.6524000, '+95 9 790 100021', 1, 1, 200, '2026-05-11 22:04:47', '2026-05-12 01:10:27', 'Nawnghkio', 'Nawnghkio town', 3.40, 87),
(38, 'Pyin Oo Lwin (Maymyo) District Hospital', 'mdy-seed-35', 2, 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Mandalay_Palace.jpg', 22.0314000, 96.4676000, '+95 9 790 100022', 1, 1, 200, '2026-05-11 22:04:47', '2026-05-12 01:10:27', 'Pyin Oo Lwin', 'Hill station town', 4.10, 100),
(39, 'Madaya Township Hospital', 'mdy-seed-36', 2, 'https://upload.wikimedia.org/wikipedia/commons/2/27/Yangon_General_Hospital.jpg', 22.1076000, 96.0888000, '+95 9 790 100023', 1, 1, 200, '2026-05-11 22:04:47', '2026-05-12 01:10:27', 'Madaya', 'Madaya town', 3.40, 113),
(40, 'Mogok Township Hospital', 'mdy-seed-37', 2, 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Mandalay_Central_Women_Hospital.jpg', 22.9188000, 96.5100000, '+95 9 790 100024', 1, 1, 200, '2026-05-11 22:04:48', '2026-05-12 01:10:27', 'Mogok', 'Mogok town', 4.10, 6),
(41, 'Myingyan Township Hospital', 'mdy-seed-38', 2, 'https://upload.wikimedia.org/wikipedia/commons/7/78/550_Beded_Children_Hospital_Mandalay.jpg', 21.4600000, 95.3912000, '+95 9 790 100025', 1, 1, 200, '2026-05-11 22:04:48', '2026-05-12 01:10:27', 'Myingyan', 'Myingyan town', 3.40, 19),
(42, 'Natogyi Township Hospital', 'mdy-seed-39', 2, 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Mandalay_Infectious_Diseases_Hospital.jpg', 21.4112000, 95.3924000, '+95 9 790 100026', 1, 1, 200, '2026-05-11 22:04:48', '2026-05-12 01:10:27', 'Natogyi', 'Natogyi town', 4.10, 32),
(43, 'Ngazun Township Hospital', 'mdy-seed-40', 2, 'https://upload.wikimedia.org/wikipedia/commons/9/91/Mandalay_Workers_Hospital.jpg', 21.4524000, 95.6176000, '+95 9 790 100027', 1, 1, 200, '2026-05-11 22:04:48', '2026-05-12 01:10:27', 'Ngazun', 'Ngazun town', 3.40, 45),
(44, 'Kyaukse General Hospital', 'mdy-seed-41', 2, 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Mandalay_Orthopaedics_Hospital.jpg', 21.6186000, 96.1308000, '+95 9 790 100028', 1, 1, 200, '2026-05-11 22:04:49', '2026-05-12 01:10:27', 'Kyaukse', 'Main referral (Kyaukse)', 4.10, 58),
(45, 'Myingyan General Hospital', 'mdy-seed-42', 2, 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Mandalay_EENT_Hospital.jpg', 21.4584000, 95.3920000, '+95 9 790 100029', 1, 1, 200, '2026-05-11 22:04:49', '2026-05-12 01:10:27', 'Myingyan', 'Main referral (Myingyan)', 3.40, 71),
(46, 'Meiktila 300-Bed General Hospital', 'mdy-seed-43', 2, 'https://upload.wikimedia.org/wikipedia/commons/d/d1/University_Hospital,_Mandalay.jpg', 20.8796000, 95.8632000, '+95 9 790 100030', 1, 1, 200, '2026-05-11 22:04:49', '2026-05-12 01:10:27', 'Meiktila', 'Larger referral site', 4.10, 84),
(47, 'Maternal and Child Hospital — Meiktila', 'mdy-seed-44', 2, 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Mandalay_Palace.jpg', 20.8768000, 95.8604000, '+95 9 790 100031', 1, 1, 208, '2026-05-11 22:04:49', '2026-05-12 01:10:27', 'Meiktila', 'PMTCT / maternal health', 3.40, 97),
(48, 'Pyin Oo Lwin 300-Bed Children\'s Hospital', 'mdy-seed-45', 2, 'https://upload.wikimedia.org/wikipedia/commons/2/27/Yangon_General_Hospital.jpg', 22.0380000, 96.4656000, '+95 9 790 100032', 1, 1, 225, '2026-05-11 22:04:50', '2026-05-12 01:10:27', 'Pyin Oo Lwin', 'Paediatric referral', 4.10, 110),
(49, 'Defence Services General Hospital — Mandalay', 'mdy-seed-46', 2, 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Mandalay_Central_Women_Hospital.jpg', 21.9372000, 96.1208000, '+95 9 790 100033', 1, 1, 242, '2026-05-11 22:04:50', '2026-05-12 01:10:27', 'Pyigyitagon', 'Military medical services', 3.40, 123),
(50, 'Mandalay Region Public Health Department — Central ART coordination', 'mdy-seed-47', 2, 'https://upload.wikimedia.org/wikipedia/commons/7/78/550_Beded_Children_Hospital_Mandalay.jpg', 21.9874000, 96.0810000, '+95 9 790 100034', 1, 1, 259, '2026-05-11 22:04:50', '2026-05-12 01:10:27', 'Aungmyaythazan', 'Regional office / programme', 4.10, 16),
(51, 'Amarapura Station Hospital', 'mdy-seed-48', 2, 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Mandalay_Infectious_Diseases_Hospital.jpg', 21.9046000, 96.0592000, '+95 9 790 100035', 1, 1, 276, '2026-05-11 22:04:50', '2026-05-12 01:10:27', 'Amarapura', 'U Bein corridor health', 3.40, 29),
(52, 'Patheingyi Rural Health Centre (RHC) — ART satellite', 'mdy-seed-49', 2, 'https://upload.wikimedia.org/wikipedia/commons/9/91/Mandalay_Workers_Hospital.jpg', 21.9184000, 96.1344000, '+95 9 790 100036', 1, 1, 293, '2026-05-11 22:04:51', '2026-05-12 01:10:27', 'Patheingyi', 'RHC network site', 4.10, 42),
(53, 'Tada-U Rural Health Centre (RHC) — ART satellite', 'mdy-seed-50', 2, 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Mandalay_Orthopaedics_Hospital.jpg', 21.8556000, 96.1156000, '+95 9 790 100037', 1, 1, 200, '2026-05-11 22:04:51', '2026-05-12 01:10:27', 'Tada-U', 'RHC network site', 3.40, 55);

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `art_center_id` bigint(20) UNSIGNED NOT NULL,
  `staff_id` bigint(20) UNSIGNED DEFAULT NULL,
  `navigation_id` bigint(20) UNSIGNED DEFAULT NULL,
  `status` varchar(32) NOT NULL DEFAULT 'requested',
  `patient_note` text DEFAULT NULL,
  `accepted_at` timestamp NULL DEFAULT NULL,
  `respond_by_at` timestamp NULL DEFAULT NULL,
  `cancelled_at` timestamp NULL DEFAULT NULL,
  `cancellation_reason` varchar(64) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `user_id`, `art_center_id`, `staff_id`, `navigation_id`, `status`, `patient_note`, `accepted_at`, `respond_by_at`, `cancelled_at`, `cancellation_reason`, `created_at`, `updated_at`) VALUES
(1, 163, 4, NULL, NULL, 'cancelled', 'seed:du-du-demo', NULL, NULL, '2026-01-11 22:43:54', 'cancelled_by_patient', '2026-01-11 22:13:54', '2026-01-11 22:13:54'),
(2, 163, 5, NULL, NULL, 'cancelled', 'seed:du-du-demo', NULL, NULL, '2026-01-12 22:43:54', 'cancelled_by_clinic', '2026-01-12 22:13:54', '2026-01-12 22:13:54'),
(3, 163, 6, NULL, NULL, 'cancelled', 'seed:du-du-demo', NULL, NULL, '2026-01-13 22:43:54', 'cancelled_by_patient', '2026-01-13 22:13:54', '2026-01-13 22:13:54'),
(4, 163, 7, NULL, NULL, 'cancelled', 'seed:du-du-demo', NULL, NULL, '2026-01-14 22:43:54', 'cancelled_by_clinic', '2026-01-14 22:13:54', '2026-01-14 22:13:54'),
(5, 163, 8, NULL, NULL, 'cancelled', 'seed:du-du-demo', NULL, NULL, '2026-01-15 22:43:54', 'cancelled_by_patient', '2026-01-15 22:13:54', '2026-01-15 22:13:54'),
(6, 163, 9, NULL, NULL, 'cancelled', 'seed:du-du-demo', NULL, NULL, '2026-01-16 22:43:54', 'cancelled_by_clinic', '2026-01-16 22:13:54', '2026-01-16 22:13:54'),
(7, 163, 10, NULL, NULL, 'cancelled', 'seed:du-du-demo', NULL, NULL, '2026-01-17 22:43:54', 'cancelled_by_patient', '2026-01-17 22:13:54', '2026-01-17 22:13:54'),
(8, 163, 11, NULL, NULL, 'cancelled', 'seed:du-du-demo', NULL, NULL, '2026-01-18 22:43:54', 'cancelled_by_clinic', '2026-01-18 22:13:54', '2026-01-18 22:13:54'),
(9, 163, 12, NULL, NULL, 'cancelled', 'seed:du-du-demo', NULL, NULL, '2026-01-19 22:43:54', 'cancelled_by_patient', '2026-01-19 22:13:54', '2026-01-19 22:13:54'),
(10, 163, 13, NULL, NULL, 'cancelled', 'seed:du-du-demo', NULL, NULL, '2026-01-20 22:43:54', 'cancelled_by_clinic', '2026-01-20 22:13:54', '2026-01-20 22:13:54'),
(11, 163, 14, NULL, NULL, 'cancelled', 'seed:du-du-demo', NULL, NULL, '2026-01-21 22:43:54', 'cancelled_by_patient', '2026-01-21 22:13:54', '2026-01-21 22:13:54'),
(12, 163, 15, NULL, NULL, 'cancelled', 'seed:du-du-demo', NULL, NULL, '2026-01-22 22:43:54', 'cancelled_by_clinic', '2026-01-22 22:13:54', '2026-01-22 22:13:54'),
(13, 163, 16, NULL, NULL, 'cancelled', 'seed:du-du-demo', NULL, NULL, '2026-01-23 22:43:54', 'cancelled_by_patient', '2026-01-23 22:13:54', '2026-01-23 22:13:54'),
(14, 163, 17, NULL, NULL, 'cancelled', 'seed:du-du-demo', NULL, NULL, '2026-01-24 22:43:54', 'cancelled_by_clinic', '2026-01-24 22:13:54', '2026-01-24 22:13:54'),
(15, 163, 18, NULL, NULL, 'cancelled', 'seed:du-du-demo', NULL, NULL, '2026-01-25 22:43:54', 'cancelled_by_patient', '2026-01-25 22:13:54', '2026-01-25 22:13:54'),
(16, 163, 19, NULL, NULL, 'cancelled', 'seed:du-du-demo', NULL, NULL, '2026-01-26 22:43:54', 'cancelled_by_clinic', '2026-01-26 22:13:54', '2026-01-26 22:13:54'),
(17, 163, 20, NULL, NULL, 'cancelled', 'seed:du-du-demo', NULL, NULL, '2026-01-27 22:43:54', 'cancelled_by_patient', '2026-01-27 22:13:54', '2026-01-27 22:13:54'),
(18, 163, 21, NULL, NULL, 'cancelled', 'seed:du-du-demo', NULL, NULL, '2026-01-28 22:43:54', 'cancelled_by_clinic', '2026-01-28 22:13:54', '2026-01-28 22:13:54'),
(19, 163, 22, NULL, NULL, 'cancelled', 'seed:du-du-demo', NULL, NULL, '2026-01-29 22:43:54', 'cancelled_by_patient', '2026-01-29 22:13:54', '2026-01-29 22:13:54'),
(20, 163, 23, NULL, NULL, 'cancelled', 'seed:du-du-demo', NULL, NULL, '2026-01-30 22:43:54', 'cancelled_by_clinic', '2026-01-30 22:13:54', '2026-01-30 22:13:54'),
(21, 163, 24, NULL, NULL, 'cancelled', 'seed:du-du-demo', NULL, NULL, '2026-01-31 22:43:54', 'cancelled_by_patient', '2026-01-31 22:13:54', '2026-01-31 22:13:54'),
(22, 163, 25, NULL, NULL, 'cancelled', 'seed:du-du-demo', NULL, NULL, '2026-02-01 22:43:54', 'cancelled_by_clinic', '2026-02-01 22:13:54', '2026-02-01 22:13:54'),
(23, 163, 26, NULL, NULL, 'cancelled', 'seed:du-du-demo', NULL, NULL, '2026-02-02 22:43:54', 'cancelled_by_patient', '2026-02-02 22:13:54', '2026-02-02 22:13:54'),
(24, 163, 27, NULL, NULL, 'cancelled', 'seed:du-du-demo', NULL, NULL, '2026-02-03 22:43:54', 'cancelled_by_clinic', '2026-02-03 22:13:54', '2026-02-03 22:13:54'),
(25, 163, 28, NULL, NULL, 'cancelled', 'seed:du-du-demo', NULL, NULL, '2026-02-04 22:43:54', 'cancelled_by_patient', '2026-02-04 22:13:54', '2026-02-04 22:13:54'),
(26, 163, 29, NULL, NULL, 'cancelled', 'seed:du-du-demo', NULL, NULL, '2026-02-05 22:43:54', 'cancelled_by_clinic', '2026-02-05 22:13:54', '2026-02-05 22:13:54'),
(27, 163, 30, NULL, NULL, 'cancelled', 'seed:du-du-demo', NULL, NULL, '2026-02-06 22:43:54', 'cancelled_by_patient', '2026-02-06 22:13:54', '2026-02-06 22:13:54'),
(28, 163, 31, NULL, NULL, 'cancelled', 'seed:du-du-demo', NULL, NULL, '2026-02-07 22:43:54', 'cancelled_by_clinic', '2026-02-07 22:13:54', '2026-02-07 22:13:54'),
(29, 163, 32, NULL, NULL, 'cancelled', 'seed:du-du-demo', NULL, NULL, '2026-02-08 22:43:54', 'cancelled_by_patient', '2026-02-08 22:13:54', '2026-02-08 22:13:54'),
(30, 163, 33, NULL, NULL, 'cancelled', 'seed:du-du-demo', NULL, NULL, '2026-02-09 22:43:54', 'cancelled_by_clinic', '2026-02-09 22:13:54', '2026-02-09 22:13:54'),
(31, 163, 34, 43, NULL, 'completed', 'seed:du-du-demo', '2026-02-11 00:13:54', '2026-02-13 00:13:54', NULL, NULL, '2026-02-10 22:13:54', '2026-02-10 22:13:54'),
(32, 163, 35, 44, NULL, 'completed', 'seed:du-du-demo', '2026-02-12 00:13:54', '2026-02-14 00:13:54', NULL, NULL, '2026-02-11 22:13:54', '2026-02-11 22:13:54'),
(33, 163, 36, 45, NULL, 'completed', 'seed:du-du-demo', '2026-02-13 00:13:54', '2026-02-15 00:13:54', NULL, NULL, '2026-02-12 22:13:54', '2026-02-12 22:13:54'),
(34, 163, 37, 46, NULL, 'completed', 'seed:du-du-demo', '2026-02-14 00:13:54', '2026-02-16 00:13:54', NULL, NULL, '2026-02-13 22:13:54', '2026-02-13 22:13:54'),
(35, 163, 38, 47, NULL, 'completed', 'seed:du-du-demo', '2026-02-15 00:13:54', '2026-02-17 00:13:54', NULL, NULL, '2026-02-14 22:13:54', '2026-02-14 22:13:54'),
(36, 163, 39, 48, NULL, 'completed', 'seed:du-du-demo', '2026-02-16 00:13:54', '2026-02-18 00:13:54', NULL, NULL, '2026-02-15 22:13:54', '2026-02-15 22:13:54'),
(37, 163, 40, 49, NULL, 'completed', 'seed:du-du-demo', '2026-02-17 00:13:54', '2026-02-19 00:13:54', NULL, NULL, '2026-02-16 22:13:54', '2026-02-16 22:13:54'),
(38, 163, 41, 50, NULL, 'completed', 'seed:du-du-demo', '2026-02-18 00:13:54', '2026-02-20 00:13:54', NULL, NULL, '2026-02-17 22:13:54', '2026-02-17 22:13:54'),
(39, 163, 42, 51, NULL, 'completed', 'seed:du-du-demo', '2026-02-19 00:13:54', '2026-02-21 00:13:54', NULL, NULL, '2026-02-18 22:13:54', '2026-02-18 22:13:54'),
(40, 163, 43, 52, NULL, 'completed', 'seed:du-du-demo', '2026-02-20 00:13:54', '2026-02-22 00:13:54', NULL, NULL, '2026-02-19 22:13:54', '2026-02-19 22:13:54'),
(41, 163, 44, 53, NULL, 'completed', 'seed:du-du-demo', '2026-02-21 00:13:54', '2026-02-23 00:13:54', NULL, NULL, '2026-02-20 22:13:54', '2026-02-20 22:13:54'),
(42, 163, 45, 54, NULL, 'completed', 'seed:du-du-demo', '2026-02-22 00:13:54', '2026-02-24 00:13:54', NULL, NULL, '2026-02-21 22:13:54', '2026-02-21 22:13:54'),
(43, 163, 46, 55, NULL, 'completed', 'seed:du-du-demo', '2026-02-23 00:13:54', '2026-02-25 00:13:54', NULL, NULL, '2026-02-22 22:13:54', '2026-02-22 22:13:54'),
(44, 163, 47, 56, NULL, 'completed', 'seed:du-du-demo', '2026-02-24 00:13:54', '2026-02-26 00:13:54', NULL, NULL, '2026-02-23 22:13:54', '2026-02-23 22:13:54'),
(45, 163, 48, 57, NULL, 'completed', 'seed:du-du-demo', '2026-02-25 00:13:54', '2026-02-27 00:13:54', NULL, NULL, '2026-02-24 22:13:54', '2026-02-24 22:13:54'),
(46, 163, 49, 58, NULL, 'completed', 'seed:du-du-demo', '2026-02-26 00:13:54', '2026-02-28 00:13:54', NULL, NULL, '2026-02-25 22:13:54', '2026-02-25 22:13:54'),
(47, 163, 50, 59, NULL, 'completed', 'seed:du-du-demo', '2026-02-27 00:13:54', '2026-03-01 00:13:54', NULL, NULL, '2026-02-26 22:13:54', '2026-02-26 22:13:54'),
(48, 163, 51, 60, NULL, 'completed', 'seed:du-du-demo', '2026-02-28 00:13:54', '2026-03-02 00:13:54', NULL, NULL, '2026-02-27 22:13:54', '2026-02-27 22:13:54'),
(49, 163, 52, 61, NULL, 'completed', 'seed:du-du-demo', '2026-03-01 00:13:54', '2026-03-03 00:13:54', NULL, NULL, '2026-02-28 22:13:54', '2026-02-28 22:13:54'),
(50, 163, 53, 62, NULL, 'completed', 'seed:du-du-demo', '2026-03-02 00:13:54', '2026-03-04 00:13:54', NULL, NULL, '2026-03-01 22:13:54', '2026-03-01 22:13:54'),
(51, 163, 4, 13, NULL, 'completed', 'seed:du-du-demo', '2026-03-03 00:13:54', '2026-03-05 00:13:54', NULL, NULL, '2026-03-02 22:13:54', '2026-03-02 22:13:54'),
(52, 163, 5, 14, NULL, 'completed', 'seed:du-du-demo', '2026-03-04 00:13:54', '2026-03-06 00:13:54', NULL, NULL, '2026-03-03 22:13:54', '2026-03-03 22:13:54'),
(53, 163, 6, 15, NULL, 'completed', 'seed:du-du-demo', '2026-03-05 00:13:54', '2026-03-07 00:13:54', NULL, NULL, '2026-03-04 22:13:54', '2026-03-04 22:13:54'),
(54, 163, 7, 16, NULL, 'completed', 'seed:du-du-demo', '2026-03-06 00:13:54', '2026-03-08 00:13:54', NULL, NULL, '2026-03-05 22:13:54', '2026-03-05 22:13:54'),
(55, 163, 8, 17, NULL, 'completed', 'seed:du-du-demo', '2026-03-07 00:13:54', '2026-03-09 00:13:54', NULL, NULL, '2026-03-06 22:13:54', '2026-03-06 22:13:54'),
(56, 163, 9, 18, NULL, 'completed', 'seed:du-du-demo', '2026-03-08 00:13:54', '2026-03-10 00:13:54', NULL, NULL, '2026-03-07 22:13:54', '2026-03-07 22:13:54'),
(57, 163, 10, 19, NULL, 'completed', 'seed:du-du-demo', '2026-03-09 00:13:54', '2026-03-11 00:13:54', NULL, NULL, '2026-03-08 22:13:54', '2026-03-08 22:13:54'),
(58, 163, 11, 20, NULL, 'completed', 'seed:du-du-demo', '2026-03-10 00:13:54', '2026-03-12 00:13:54', NULL, NULL, '2026-03-09 22:13:54', '2026-03-09 22:13:54'),
(59, 163, 12, 21, NULL, 'completed', 'seed:du-du-demo', '2026-03-11 00:13:54', '2026-03-13 00:13:54', NULL, NULL, '2026-03-10 22:13:54', '2026-03-10 22:13:54'),
(60, 163, 13, 22, NULL, 'completed', 'seed:du-du-demo', '2026-03-12 00:13:54', '2026-03-14 00:13:54', NULL, NULL, '2026-03-11 22:13:54', '2026-03-11 22:13:54'),
(61, 163, 14, 23, NULL, 'completed', 'seed:du-du-demo', '2026-03-13 00:13:54', '2026-03-15 00:13:54', NULL, NULL, '2026-03-12 22:13:54', '2026-03-12 22:13:54'),
(62, 163, 15, 24, NULL, 'completed', 'seed:du-du-demo', '2026-03-14 00:13:54', '2026-03-16 00:13:54', NULL, NULL, '2026-03-13 22:13:54', '2026-03-13 22:13:54'),
(63, 163, 16, 25, NULL, 'completed', 'seed:du-du-demo', '2026-03-15 00:13:54', '2026-03-17 00:13:54', NULL, NULL, '2026-03-14 22:13:54', '2026-03-14 22:13:54'),
(64, 163, 17, 26, NULL, 'completed', 'seed:du-du-demo', '2026-03-16 00:13:54', '2026-03-18 00:13:54', NULL, NULL, '2026-03-15 22:13:54', '2026-03-15 22:13:54'),
(65, 163, 18, 27, NULL, 'completed', 'seed:du-du-demo', '2026-03-17 00:13:54', '2026-03-19 00:13:54', NULL, NULL, '2026-03-16 22:13:54', '2026-03-16 22:13:54'),
(66, 163, 19, 28, NULL, 'completed', 'seed:du-du-demo', '2026-03-18 00:13:54', '2026-03-20 00:13:54', NULL, NULL, '2026-03-17 22:13:54', '2026-03-17 22:13:54'),
(67, 163, 20, 29, NULL, 'completed', 'seed:du-du-demo', '2026-03-19 00:13:54', '2026-03-21 00:13:54', NULL, NULL, '2026-03-18 22:13:54', '2026-03-18 22:13:54'),
(68, 163, 21, 30, NULL, 'completed', 'seed:du-du-demo', '2026-03-20 00:13:54', '2026-03-22 00:13:54', NULL, NULL, '2026-03-19 22:13:54', '2026-03-19 22:13:54'),
(69, 163, 22, 31, NULL, 'completed', 'seed:du-du-demo', '2026-03-21 00:13:54', '2026-03-23 00:13:54', NULL, NULL, '2026-03-20 22:13:54', '2026-03-20 22:13:54'),
(70, 163, 23, 32, NULL, 'completed', 'seed:du-du-demo', '2026-03-22 00:13:54', '2026-03-24 00:13:54', NULL, NULL, '2026-03-21 22:13:54', '2026-03-21 22:13:54'),
(71, 163, 24, 33, NULL, 'completed', 'seed:du-du-demo', '2026-03-23 00:13:54', '2026-03-25 00:13:54', NULL, NULL, '2026-03-22 22:13:54', '2026-03-22 22:13:54'),
(72, 163, 25, 34, NULL, 'completed', 'seed:du-du-demo', '2026-03-24 00:13:54', '2026-03-26 00:13:54', NULL, NULL, '2026-03-23 22:13:54', '2026-03-23 22:13:54'),
(73, 163, 26, 35, NULL, 'completed', 'seed:du-du-demo', '2026-03-25 00:13:54', '2026-03-27 00:13:54', NULL, NULL, '2026-03-24 22:13:54', '2026-03-24 22:13:54'),
(74, 163, 27, 36, NULL, 'completed', 'seed:du-du-demo', '2026-03-26 00:13:54', '2026-03-28 00:13:54', NULL, NULL, '2026-03-25 22:13:54', '2026-03-25 22:13:54'),
(75, 163, 28, 37, NULL, 'completed', 'seed:du-du-demo', '2026-03-27 00:13:54', '2026-03-29 00:13:54', NULL, NULL, '2026-03-26 22:13:54', '2026-03-26 22:13:54'),
(76, 163, 29, 38, NULL, 'completed', 'seed:du-du-demo', '2026-03-28 00:13:54', '2026-03-30 00:13:54', NULL, NULL, '2026-03-27 22:13:54', '2026-03-27 22:13:54'),
(77, 163, 30, 39, NULL, 'completed', 'seed:du-du-demo', '2026-03-29 00:13:54', '2026-03-31 00:13:54', NULL, NULL, '2026-03-28 22:13:54', '2026-03-28 22:13:54'),
(78, 163, 31, 40, NULL, 'completed', 'seed:du-du-demo', '2026-03-30 00:13:54', '2026-04-01 00:13:54', NULL, NULL, '2026-03-29 22:13:54', '2026-03-29 22:13:54'),
(79, 163, 32, 41, NULL, 'completed', 'seed:du-du-demo', '2026-03-31 00:13:54', '2026-04-02 00:13:54', NULL, NULL, '2026-03-30 22:13:54', '2026-03-30 22:13:54'),
(80, 163, 33, 42, NULL, 'completed', 'seed:du-du-demo', '2026-04-01 00:13:54', '2026-04-03 00:13:54', NULL, NULL, '2026-03-31 22:13:54', '2026-03-31 22:13:54'),
(81, 163, 34, 43, NULL, 'completed', 'seed:du-du-demo', '2026-04-02 00:13:54', '2026-04-04 00:13:54', NULL, NULL, '2026-04-01 22:13:54', '2026-04-01 22:13:54'),
(82, 163, 35, 44, NULL, 'completed', 'seed:du-du-demo', '2026-04-03 00:13:54', '2026-04-05 00:13:54', NULL, NULL, '2026-04-02 22:13:54', '2026-04-02 22:13:54'),
(83, 163, 36, 45, NULL, 'completed', 'seed:du-du-demo', '2026-04-04 00:13:54', '2026-04-06 00:13:54', NULL, NULL, '2026-04-03 22:13:54', '2026-04-03 22:13:54'),
(84, 163, 37, 46, NULL, 'completed', 'seed:du-du-demo', '2026-04-05 00:13:54', '2026-04-07 00:13:54', NULL, NULL, '2026-04-04 22:13:54', '2026-04-04 22:13:54'),
(85, 163, 38, 47, NULL, 'completed', 'seed:du-du-demo', '2026-04-06 00:13:54', '2026-04-08 00:13:54', NULL, NULL, '2026-04-05 22:13:54', '2026-04-05 22:13:54'),
(86, 163, 39, 48, NULL, 'completed', 'seed:du-du-demo', '2026-04-07 00:13:54', '2026-04-09 00:13:54', NULL, NULL, '2026-04-06 22:13:54', '2026-04-06 22:13:54'),
(87, 163, 40, 49, NULL, 'completed', 'seed:du-du-demo', '2026-04-08 00:13:54', '2026-04-10 00:13:54', NULL, NULL, '2026-04-07 22:13:54', '2026-04-07 22:13:54'),
(88, 163, 41, 50, NULL, 'completed', 'seed:du-du-demo', '2026-04-09 00:13:54', '2026-04-11 00:13:54', NULL, NULL, '2026-04-08 22:13:54', '2026-04-08 22:13:54'),
(89, 163, 42, 51, NULL, 'completed', 'seed:du-du-demo', '2026-04-10 00:13:54', '2026-04-12 00:13:54', NULL, NULL, '2026-04-09 22:13:54', '2026-04-09 22:13:54'),
(90, 163, 43, 52, NULL, 'completed', 'seed:du-du-demo', '2026-04-11 00:13:54', '2026-04-13 00:13:54', NULL, NULL, '2026-04-10 22:13:54', '2026-04-10 22:13:54'),
(91, 163, 44, 53, NULL, 'completed', 'seed:du-du-demo', '2026-04-12 00:13:54', '2026-04-14 00:13:54', NULL, NULL, '2026-04-11 22:13:54', '2026-04-11 22:13:54'),
(92, 163, 45, 54, NULL, 'completed', 'seed:du-du-demo', '2026-04-13 00:13:54', '2026-04-15 00:13:54', NULL, NULL, '2026-04-12 22:13:54', '2026-04-12 22:13:54'),
(93, 163, 46, 55, NULL, 'completed', 'seed:du-du-demo', '2026-04-14 00:13:54', '2026-04-16 00:13:54', NULL, NULL, '2026-04-13 22:13:54', '2026-04-13 22:13:54'),
(94, 163, 47, 56, NULL, 'completed', 'seed:du-du-demo', '2026-04-15 00:13:54', '2026-04-17 00:13:54', NULL, NULL, '2026-04-14 22:13:54', '2026-04-14 22:13:54'),
(95, 163, 48, 57, NULL, 'completed', 'seed:du-du-demo', '2026-04-16 00:13:54', '2026-04-18 00:13:54', NULL, NULL, '2026-04-15 22:13:54', '2026-04-15 22:13:54'),
(96, 163, 49, 58, NULL, 'completed', 'seed:du-du-demo', '2026-04-17 00:13:54', '2026-04-19 00:13:54', NULL, NULL, '2026-04-16 22:13:54', '2026-04-16 22:13:54'),
(97, 163, 50, 59, NULL, 'completed', 'seed:du-du-demo', '2026-04-18 00:13:54', '2026-04-20 00:13:54', NULL, NULL, '2026-04-17 22:13:54', '2026-04-17 22:13:54'),
(98, 163, 51, 60, NULL, 'completed', 'seed:du-du-demo', '2026-04-19 00:13:54', '2026-04-21 00:13:54', NULL, NULL, '2026-04-18 22:13:54', '2026-04-18 22:13:54'),
(99, 163, 52, 61, NULL, 'completed', 'seed:du-du-demo', '2026-04-20 00:13:54', '2026-04-22 00:13:54', NULL, NULL, '2026-04-19 22:13:54', '2026-04-19 22:13:54'),
(100, 163, 53, 62, NULL, 'completed', 'seed:du-du-demo', '2026-04-21 00:13:54', '2026-04-23 00:13:54', NULL, NULL, '2026-04-20 22:13:54', '2026-04-20 22:13:54'),
(101, 163, 50, 59, 2, 'completed', NULL, '2026-05-21 03:33:58', '2026-05-23 03:33:58', NULL, NULL, '2026-05-21 03:26:42', '2026-05-21 03:34:42');

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'new',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2026_03_20_000001_create_roles_table', 1),
(2, '2026_03_20_000002_create_users_table', 1),
(3, '2026_03_20_000003_create_art_centers_table', 1),
(5, '2026_03_20_000005_create_resource_libraries_table', 1),
(6, '2026_03_20_000006_create_contact_messages_table', 1),
(7, '2026_03_20_000007_create_navigations_table', 1),
(8, '2019_12_14_000001_create_personal_access_tokens_table', 2),
(9, '2026_03_20_000008_add_township_area_to_art_centers', 3),
(10, '2026_03_20_000009_add_art_center_to_navigations', 3),
(12, '2026_03_20_100000_drop_singular_tables', 4),
(13, '2026_05_04_000001_create_roles_table', 5),
(14, '2026_05_04_000002_create_users_table', 5),
(15, '2026_05_04_000003_create_art_centers_table', 5),
(16, '2026_05_04_000004_create_resource_libraries_table', 5),
(17, '2026_05_04_000005_create_navigations_table', 5),
(18, '2026_05_04_000006_drop_pill_dispenses_table', 5),
(19, '2026_05_04_000007_create_contact_messages_table', 5),
(20, '2026_05_04_000008_create_reviews_table', 5),
(21, '2026_05_04_000009_create_personal_access_tokens_table', 5),
(22, '2026_05_04_000010_create_sessions_table', 5),
(23, '2026_05_04_000011_create_bookings_table', 5),
(24, '2026_05_04_000012_add_booking_id_to_reviews_table', 5),
(25, '2026_05_04_000013_add_booking_accept_deadline_columns', 5),
(26, '2026_05_04_000014_ensure_booking_deadline_columns', 5),
(27, '2026_05_04_000015_add_center_staff_link_columns', 5),
(28, '2026_05_05_000016_add_art_pill_availability_to_art_centers_table', 5),
(29, '2026_05_05_000017_add_ebook_url_to_resource_libraries_table', 5),
(30, '2026_05_12_000018_add_cover_image_url_to_resource_libraries_table', 6);

-- --------------------------------------------------------

--
-- Table structure for table `navigations`
--

CREATE TABLE `navigations` (
  `navigation_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `start_location` varchar(255) DEFAULT NULL,
  `destination` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `art_center_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `navigations`
--

INSERT INTO `navigations` (`navigation_id`, `user_id`, `start_location`, `destination`, `created_at`, `updated_at`, `art_center_id`) VALUES
(1, 9, 'Downtown', 'ART Center A', '2026-03-20 05:09:40', '2026-03-20 05:09:40', NULL),
(2, 163, NULL, 'Mandalay Region Public Health Department — Central ART coordination', '2026-05-21 03:34:09', '2026-05-21 03:34:09', 50);

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 9, 'api-token', '711d9b13f8d0ec3cef071495fb5186e53874fc4ad93881af98a98a30ab9820ec', '[\"*\"]', '2026-03-20 05:10:07', NULL, '2026-03-20 05:09:24', '2026-03-20 05:10:07'),
(2, 'App\\Models\\User', 10, 'api-token', 'b1eeb729912de4d5593fbde3a78d0764f42636a67a9a4d72553d5b7bd9fc8b42', '[\"*\"]', '2026-03-20 05:10:04', NULL, '2026-03-20 05:09:31', '2026-03-20 05:10:04'),
(3, 'App\\Models\\User', 11, 'api-token', '12a24edfe5bef9c1fd7d6d8b635324f13ec1bf9daa5f5b09a3b066185b0a094c', '[\"*\"]', '2026-03-20 05:11:03', NULL, '2026-03-20 05:09:34', '2026-03-20 05:11:03'),
(4, 'App\\Models\\User', 9, 'api-token', 'a4fe8b132f4f1b607f92c08318e86895bef10ba2eb6d9a0f18a6b896700f2b3a', '[\"*\"]', NULL, NULL, '2026-03-20 05:22:56', '2026-03-20 05:22:56'),
(5, 'App\\Models\\User', 10, 'api-token', '9bcbbc3c23265073ca5e983f30614ca94d45c275bdaaface2f1e6bdd7b635709', '[\"*\"]', NULL, NULL, '2026-03-20 05:22:56', '2026-03-20 05:22:56'),
(6, 'App\\Models\\User', 11, 'api-token', 'd1c071b8d3301bb3f7bb574073fa6d27de9bf115adcad47069d096e549188138', '[\"*\"]', NULL, NULL, '2026-03-20 05:22:57', '2026-03-20 05:22:57'),
(7, 'App\\Models\\User', 9, 'api-token', 'cd9331008036f64c2fcb0628c9bf2938fc1b4e12a6af2606a14811a76f320c99', '[\"*\"]', NULL, NULL, '2026-03-20 05:23:01', '2026-03-20 05:23:01'),
(8, 'App\\Models\\User', 10, 'api-token', '74dedab780a26b887c772d9fea99b50ab5d649dbac1566248f039ffc59e56920', '[\"*\"]', NULL, NULL, '2026-03-20 05:23:02', '2026-03-20 05:23:02'),
(9, 'App\\Models\\User', 11, 'api-token', 'aa56ce177c3562411b8af8f4524f9043dd35506d2bb24b19c3aabe4f66849326', '[\"*\"]', NULL, NULL, '2026-03-20 05:23:02', '2026-03-20 05:23:02'),
(10, 'App\\Models\\User', 9, 'api-token', '3bb7bc86754aec6587c2f5fc374ccbbaea2176649c85e275de6698881967e646', '[\"*\"]', NULL, NULL, '2026-03-20 05:23:08', '2026-03-20 05:23:08'),
(11, 'App\\Models\\User', 10, 'api-token', '94a55b0d71e38e097f814fb946b1366467c4f07d772ceb7f7d1404d79fbf3cf9', '[\"*\"]', NULL, NULL, '2026-03-20 05:23:08', '2026-03-20 05:23:08'),
(12, 'App\\Models\\User', 11, 'api-token', '76a132cd8b40fa3ea4bf54fec1c0b16f1eb78d75f5c83470feb6241aabf0a05b', '[\"*\"]', NULL, NULL, '2026-03-20 05:23:09', '2026-03-20 05:23:09'),
(13, 'App\\Models\\User', 9, 'api-token', '06e7d5e408a9bcbaf6cba274822ad1dd50a5e831fbfb1be5667c8a3301a4c3cd', '[\"*\"]', '2026-03-20 05:23:21', NULL, '2026-03-20 05:23:15', '2026-03-20 05:23:21'),
(14, 'App\\Models\\User', 10, 'api-token', '489343e64fb71a70294d192d5462d34915825f097a349fc0fc5d57ba9cc16b18', '[\"*\"]', '2026-03-20 05:23:21', NULL, '2026-03-20 05:23:16', '2026-03-20 05:23:21'),
(15, 'App\\Models\\User', 11, 'api-token', '6a956fd5e82b2e93e1b8722f3c183cecfa17a76b201a2b0502502fd5db8c1ce7', '[\"*\"]', '2026-03-20 05:23:21', NULL, '2026-03-20 05:23:16', '2026-03-20 05:23:21'),
(22, 'App\\Models\\User', 163, 'patient', 'e1a7ec37ca17259403607540bd1a0bed0f1cc1c07badfb312c53f42a544aa5e7', '[\"*\"]', '2026-05-21 03:34:42', NULL, '2026-05-21 03:23:04', '2026-05-21 03:34:42'),
(23, 'App\\Models\\User', 12, 'staff', '0487c06bc75ecfcf4312a69c293a16b51e62e11daa55cb1d2083c5403059dd9c', '[\"*\"]', '2026-05-21 03:37:27', NULL, '2026-05-21 03:31:12', '2026-05-21 03:37:27'),
(24, 'App\\Models\\User', 59, 'staff', '4addaca71d0bd33f2274885909df76125bce1a13979f103011393db78aacda12', '[\"*\"]', '2026-05-21 03:34:49', NULL, '2026-05-21 03:33:13', '2026-05-21 03:34:49');

-- --------------------------------------------------------

--
-- Table structure for table `resource_libraries`
--

CREATE TABLE `resource_libraries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `ebook_url` varchar(2048) DEFAULT NULL,
  `cover_image_url` varchar(2048) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `resource_libraries`
--

INSERT INTO `resource_libraries` (`id`, `title`, `content`, `ebook_url`, `cover_image_url`, `category`, `created_at`, `updated_at`) VALUES
(1, 'What is ART?', 'ART stands for Antiretroviral Therapy. This library item is demo content.', NULL, NULL, 'Basics', '2026-03-20 05:07:51', '2026-03-20 05:07:51'),
(2, 'Medication Tips', 'Demo tips for taking medication consistently and safely.', NULL, NULL, 'Care', '2026-03-20 05:07:51', '2026-03-20 05:07:51'),
(3, 'Psychological first aid: Guide for field workers (WHO)', 'Practical, humane support for people in distress after serious crises (WHO, War Trauma Foundation & World Vision).', 'https://iris.who.int/bitstream/handle/10665/131130/9789241548925_eng.pdf', 'https://covers.openlibrary.org/b/isbn/9789241548925-L.jpg', 'Mental health & psychosocial', '2026-05-12 01:10:27', '2026-05-12 01:10:27'),
(4, 'mhGAP Humanitarian Intervention Guide (WHO)', 'Clinical guidance for mental, neurological and substance use conditions in humanitarian emergencies.', 'https://iris.who.int/bitstream/handle/10665/249564/9789241549922-eng.pdf', 'https://covers.openlibrary.org/b/isbn/9789241549922-L.jpg', 'Mental health & psychosocial', '2026-05-12 01:10:27', '2026-05-12 01:10:27'),
(5, 'Thinking healthy (mhGAP): Problem Management Plus (WHO)', 'Training manual for Problem Management Plus (PM+) for community health workers.', 'https://iris.who.int/bitstream/handle/10665/185010/9789241548994_eng.pdf', 'https://covers.openlibrary.org/b/isbn/9789241548994-L.jpg', 'Mental health & psychosocial', '2026-05-12 01:10:27', '2026-05-12 01:10:27'),
(6, 'Depression: What you need to know (NIMH / NIH)', 'U.S. National Institute of Mental Health brochure on depression signs, care, and recovery.', 'https://www.nimh.nih.gov/sites/default/files/health/publications/depression/depression.pdf', 'https://covers.openlibrary.org/b/isbn/9781462508043-L.jpg', 'Mental health & psychosocial', '2026-05-12 01:10:27', '2026-05-12 01:10:27'),
(7, 'I’m so stressed out! Fact sheet (NIMH / NIH)', 'Short NIH fact sheet on stress vs anxiety and coping strategies.', 'https://www.nimh.nih.gov/sites/default/files/documents/health/publications/so-stressed-out-fact-sheet/Im-So-Stressed-Out.pdf', 'https://covers.openlibrary.org/b/isbn/9781462547219-L.jpg', 'Mental health & psychosocial', '2026-05-12 01:10:27', '2026-05-12 01:10:27');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `clinic_id` bigint(20) UNSIGNED NOT NULL,
  `booking_id` bigint(20) UNSIGNED DEFAULT NULL,
  `rating` tinyint(4) NOT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `role_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `role_name`, `created_at`, `updated_at`) VALUES
(1, 'Patient', '2026-03-20 05:08:12', '2026-03-20 05:08:12'),
(2, 'ClinicStaff', '2026-03-20 05:08:12', '2026-03-20 05:08:12'),
(3, 'Admin', '2026-03-20 05:08:13', '2026-03-20 05:08:13');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nickname` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `art_center_id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nickname`, `full_name`, `password`, `role_id`, `art_center_id`, `is_verified`, `created_at`, `updated_at`) VALUES
(1, 'patient1', NULL, '$2y$12$lDm55OPsSgq7aOF98VvxKeZyBGlVdZDc2FBBTMNaN.HWcQ45v/yey', 1, NULL, 1, '2026-03-20 05:08:12', '2026-03-20 05:08:12'),
(2, NULL, 'Clinic Staff 1', '$2y$12$evKF4PmVKeVWXlaAXqS3POROXQotkDXIVyt62mTTFxIjwNDyVY.jy', 2, NULL, 1, '2026-03-20 05:08:13', '2026-03-20 05:08:13'),
(3, 'admin1', NULL, '$2y$12$/iS9nmiJVYmo9KM2XyaY8OiPp3qC9q0rFwP0iDV2HoFj8tv/JXJpe', 3, NULL, 1, '2026-03-20 05:08:13', '2026-03-20 05:08:13'),
(4, 'patient2', NULL, '$2y$12$z3J1Z6LngJLk3.2IwvOiau1XJYn6Xs1lZxXZ5NSDRM4DNGf0GTGJ2', 1, NULL, 1, '2026-03-20 05:08:26', '2026-03-20 05:08:26'),
(5, NULL, 'Clinic Staff 2', '$2y$12$s9RC2PKJqb0lCP3GyFxAXO0e7gvanSyCQhixF5VHO7Sv2uTlN635.', 2, NULL, 1, '2026-03-20 05:08:26', '2026-03-20 05:08:26'),
(6, 'admin2', NULL, '$2y$12$Z7enouJDG/KVbAcrEbCwHuZG6Z7eXsNQZOLQOPBITbcun15dbfwY.', 3, NULL, 1, '2026-03-20 05:08:26', '2026-03-20 05:08:26'),
(7, NULL, 'Clinic Staff 2', '$2y$12$zn4ApePRTUX41Le7PCjUQu9NFBAFVaudrG.AIxhSoI2sXoS4OT3L6', 2, NULL, 1, '2026-03-20 05:08:42', '2026-03-20 05:08:42'),
(8, 'patient3', NULL, '$2y$12$bN9c5tYjbGwz2D7zvWdjQuCGyOIexhEZOko/BAUnMV9UGNfZQ3V5u', 1, NULL, 1, '2026-03-20 05:08:50', '2026-03-20 05:08:50'),
(9, 'patientX', NULL, '$2y$12$BtM3pS/YRmIXapdlLF9h9eKwL/CqeaeJqUbL.ZCtNI3JRlBQ9FElK', 1, NULL, 1, '2026-03-20 05:09:24', '2026-03-20 05:09:24'),
(10, NULL, 'Clinic Staff X', '$2y$12$mOrOVWHh.BksRLwRNcCa5.dkR5YTygJN1vnX4Ao7lOkvTn4KMm7iG', 2, NULL, 1, '2026-03-20 05:09:31', '2026-03-20 05:09:31'),
(11, 'adminX', NULL, '$2y$12$.aXyK7mHCq3nVo5yQ4FRMuQ4VvxEYrw6eNE9OYlpERHQMgIniEG0i', 3, NULL, 1, '2026-03-20 05:09:34', '2026-03-20 05:09:34'),
(12, NULL, 'Dupyae', '$2y$12$Jl2okkE7RfcTYoZw3OWV6el1p29NpCJ2ejm5zxlCbdn5l5VywwuzW', 3, NULL, 1, '2026-05-11 22:04:39', '2026-05-11 22:04:39'),
(13, NULL, 'ART site lead — mdy-seed-01', '$2y$12$qdMJWa6egjAeKVAAI6fwCuxoPTIHI3c3ysp6QVGMdJKJNXICjIDlK', 2, 4, 1, '2026-05-11 22:04:39', '2026-05-11 22:04:39'),
(14, NULL, 'ART site lead — mdy-seed-02', '$2y$12$9qFjzQN581Z1odMb8a56KeVIxLjg9F4Y4cysTpXq0asU/uQuV494e', 2, 5, 1, '2026-05-11 22:04:40', '2026-05-11 22:04:40'),
(15, NULL, 'ART site lead — mdy-seed-03', '$2y$12$E4iq1m5n2Xn/mCw4AeWP0OE5ZTeihv3Nrcmf3hJDmf6LfYdZ0CPBG', 2, 6, 1, '2026-05-11 22:04:40', '2026-05-11 22:04:40'),
(16, NULL, 'ART site lead — mdy-seed-04', '$2y$12$EGF36ke1JjZq48ag.A8VWeqn6P9etbKSSV8MQ2Fxpq19ipuDDBB5C', 2, 7, 1, '2026-05-11 22:04:40', '2026-05-11 22:04:40'),
(17, NULL, 'ART site lead — mdy-seed-05', '$2y$12$VhUrgz.lQyp9XiciCJ/42.ZlnGKoYdOiQw4tJ1utjbGZ3cRntAC0S', 2, 8, 1, '2026-05-11 22:04:40', '2026-05-11 22:04:40'),
(18, NULL, 'ART site lead — mdy-seed-06', '$2y$12$IFo5QETbxwNBGNGFLke2sOGacq0Hmm1OzwwxF0LMEv1CHqjN.Aa5O', 2, 9, 1, '2026-05-11 22:04:40', '2026-05-11 22:04:40'),
(19, NULL, 'ART site lead — mdy-seed-07', '$2y$12$HtGVVUethnDXo0egj6qx5.5usmIX6Y7JWd7vFbuxJ8JAs0bgHEESe', 2, 10, 1, '2026-05-11 22:04:41', '2026-05-11 22:04:41'),
(20, NULL, 'ART site lead — mdy-seed-08', '$2y$12$LL3fgBVImzcy.kA.T7EDw.RjoQGrcIFJdLFqCsqh9kmaRGV/X4Rbi', 2, 11, 1, '2026-05-11 22:04:41', '2026-05-11 22:04:41'),
(21, NULL, 'ART site lead — mdy-seed-09', '$2y$12$UxqJYIvCjxr0UXoQjYh4DOUBGzDC6vU0zLZF0n6mJJe1d2NTp16bS', 2, 12, 1, '2026-05-11 22:04:41', '2026-05-11 22:04:41'),
(22, NULL, 'ART site lead — mdy-seed-10', '$2y$12$6b2VibFpRYwF6/AgK0Fqj.Vzv1blBuxNXcLAZ4auoe06tEsv0tMeC', 2, 13, 1, '2026-05-11 22:04:41', '2026-05-11 22:04:41'),
(23, NULL, 'ART site lead — mdy-seed-11', '$2y$12$vPBQqlkBIAqBaEMJr72IOuROmxJNDiEw8pAaWWYT.fpUBRpC.IKxW', 2, 14, 1, '2026-05-11 22:04:42', '2026-05-11 22:04:42'),
(24, NULL, 'ART site lead — mdy-seed-12', '$2y$12$YO31IVHuypSLz7GVO4rcseZBwHpem6tUv6z6yyRDOlfLPl3evfa42', 2, 15, 1, '2026-05-11 22:04:42', '2026-05-11 22:04:42'),
(25, NULL, 'ART site lead — mdy-seed-13', '$2y$12$XZXnlnS2V8bVBuphe2dJh.eP/lMe7npCE.emYf.xy11i.jzk17wuO', 2, 16, 1, '2026-05-11 22:04:42', '2026-05-11 22:04:42'),
(26, NULL, 'ART site lead — mdy-seed-14', '$2y$12$bT341VW9Oel4AfF76IXMWOwUIJyWa0t05qbHrPoFGq0htwWHnu4pW', 2, 17, 1, '2026-05-11 22:04:42', '2026-05-11 22:04:42'),
(27, NULL, 'ART site lead — mdy-seed-15', '$2y$12$1lvB9Dm4BGy0TzWHZVH5q.zzmRKTUOldf1xp2W5fU585Nxb.bXZVO', 2, 18, 1, '2026-05-11 22:04:43', '2026-05-11 22:04:43'),
(28, NULL, 'ART site lead — mdy-seed-16', '$2y$12$.ukSolMQWh62Y6/g.qWi2.NYujjXdh6hGxzMm5PqLbZxymVCb7L4i', 2, 19, 1, '2026-05-11 22:04:43', '2026-05-11 22:04:43'),
(29, NULL, 'ART site lead — mdy-seed-17', '$2y$12$lwMHskSlhgoVngT2s4pZJev75PubMCjr0pVXhMWx6FHl61igk5.Lu', 2, 20, 1, '2026-05-11 22:04:43', '2026-05-11 22:04:43'),
(30, NULL, 'ART site lead — mdy-seed-18', '$2y$12$uqCX9jUPkYuLkN9z7KMNZ.aIcJNK.THMbN010t/6./kTI2dVpFI6W', 2, 21, 1, '2026-05-11 22:04:43', '2026-05-11 22:04:43'),
(31, NULL, 'ART site lead — mdy-seed-19', '$2y$12$lrymFz/nX6tW15Fr7/hxWuHNVtytoVF30TiHeIWYklJkfvJjrBQLG', 2, 22, 1, '2026-05-11 22:04:44', '2026-05-11 22:04:44'),
(32, NULL, 'ART site lead — mdy-seed-20', '$2y$12$XiuPiGv25amlNSu1uHFuyu.JECzabbImIbUv/HpPETIe/WeGCyhs6', 2, 23, 1, '2026-05-11 22:04:44', '2026-05-11 22:04:44'),
(33, NULL, 'ART site lead — mdy-seed-21', '$2y$12$PYPnWOTr1AuDy/ZSRvcYiulnLNezzD8uv4Q975Ay6//oK9nrJIABa', 2, 24, 1, '2026-05-11 22:04:44', '2026-05-11 22:04:44'),
(34, NULL, 'ART site lead — mdy-seed-22', '$2y$12$rAPAQvbRUofdLU.eCauL/.FDP/n601rm4uooqGrex67VajXLFQq6C', 2, 25, 1, '2026-05-11 22:04:44', '2026-05-11 22:04:44'),
(35, NULL, 'ART site lead — mdy-seed-23', '$2y$12$CIiV/aW2qPtZPvv2t1cJxuuxaq2sUveB1RmsqhHT9OL9fVJ1AciVe', 2, 26, 1, '2026-05-11 22:04:44', '2026-05-11 22:04:44'),
(36, NULL, 'ART site lead — mdy-seed-24', '$2y$12$kUFl5Xd27cj5sRWx6gWAyuJvQs9kX8VmKAdCR2zYBBB3XcxrM/xO2', 2, 27, 1, '2026-05-11 22:04:45', '2026-05-11 22:04:45'),
(37, NULL, 'ART site lead — mdy-seed-25', '$2y$12$GqimdpdR5JVbsz/5FrEATumlvKOq/ZWQ0b5iA2un3jAQSY4pd.Tte', 2, 28, 1, '2026-05-11 22:04:45', '2026-05-11 22:04:45'),
(38, NULL, 'ART site lead — mdy-seed-26', '$2y$12$HNbyQDmcwyD4mJiXS0VjgOPmeUb0B9t/VcieogQC/iE4sNbNVObvG', 2, 29, 1, '2026-05-11 22:04:45', '2026-05-11 22:04:45'),
(39, NULL, 'ART site lead — mdy-seed-27', '$2y$12$va65x3YmU51NaFRDyCtd4ezY8k18qtdQuaSNBvmEWFeTKnI05fyqG', 2, 30, 1, '2026-05-11 22:04:45', '2026-05-11 22:04:45'),
(40, NULL, 'ART site lead — mdy-seed-28', '$2y$12$cSpDAWpTappVMHJsdsD9iObgxMoYLZ/l785t8hR1wct226GmyMZ8G', 2, 31, 1, '2026-05-11 22:04:46', '2026-05-11 22:04:46'),
(41, NULL, 'ART site lead — mdy-seed-29', '$2y$12$4YwlZqaNo6gcgLWAdDOsPebMBaBMn0tutgSK1ZtbLHDUPC8Ay675y', 2, 32, 1, '2026-05-11 22:04:46', '2026-05-11 22:04:46'),
(42, NULL, 'ART site lead — mdy-seed-30', '$2y$12$RdbZ6XQGdfgEJ9zRm0YY5O4HhRrGIzwzFzkxIB2ToJOzruMIE9dAK', 2, 33, 1, '2026-05-11 22:04:46', '2026-05-11 22:04:46'),
(43, NULL, 'ART site lead — mdy-seed-31', '$2y$12$7TRupq/3UQH1zcFkgays0u249YE/a3QXlK09BtDa.OiEQkyWCGD0S', 2, 34, 1, '2026-05-11 22:04:46', '2026-05-11 22:04:46'),
(44, NULL, 'ART site lead — mdy-seed-32', '$2y$12$5IFYQq6XP7e5eFdc7UQvs.dEb/0qrIcVr9LnB.9x74c7tuRR3UiuK', 2, 35, 1, '2026-05-11 22:04:47', '2026-05-11 22:04:47'),
(45, NULL, 'ART site lead — mdy-seed-33', '$2y$12$tYvNn4zEpsEH15FaJ4.scuVCocJextH/h47qFX0/dsmsGHEehDE.K', 2, 36, 1, '2026-05-11 22:04:47', '2026-05-11 22:04:47'),
(46, NULL, 'ART site lead — mdy-seed-34', '$2y$12$WTA5zc/CB.BjZ51UnM.d9O0iD3zr1OqaPtJLOgaN7RfKxVItvVaX.', 2, 37, 1, '2026-05-11 22:04:47', '2026-05-11 22:04:47'),
(47, NULL, 'ART site lead — mdy-seed-35', '$2y$12$PDMBhqI.0pNnNJ7UNG/6nu3olf6g.d7TCXonaqqhCgM.qkPtsYUfy', 2, 38, 1, '2026-05-11 22:04:47', '2026-05-11 22:04:47'),
(48, NULL, 'ART site lead — mdy-seed-36', '$2y$12$so93Ui/3Mbo5B3NW6jxHc.ppoy1h3faZgAgkOJfFvl5K/Z88HsNhi', 2, 39, 1, '2026-05-11 22:04:48', '2026-05-11 22:04:48'),
(49, NULL, 'ART site lead — mdy-seed-37', '$2y$12$FNcVwIZIwiAS2CDKubMmHOiAU897HiVoXQPmcyGAY1r4DCBS2tQkq', 2, 40, 1, '2026-05-11 22:04:48', '2026-05-11 22:04:48'),
(50, NULL, 'ART site lead — mdy-seed-38', '$2y$12$XUd2PodUWl5bXP5jE75UMebs/YFXcH7g19XdszgB5LM4AnocSJ3gu', 2, 41, 1, '2026-05-11 22:04:48', '2026-05-11 22:04:48'),
(51, NULL, 'ART site lead — mdy-seed-39', '$2y$12$WLiCdGXXJ788CUPOUpZGoeLHnSg44.7IvwqDjXLCHP/jg7Lor6ry.', 2, 42, 1, '2026-05-11 22:04:48', '2026-05-11 22:04:48'),
(52, NULL, 'ART site lead — mdy-seed-40', '$2y$12$E5Pbp5xbDkPQDsrFTWbk.udNEzOptAkxKXr4QoD2/em5jxVwzn1Va', 2, 43, 1, '2026-05-11 22:04:49', '2026-05-11 22:04:49'),
(53, NULL, 'ART site lead — mdy-seed-41', '$2y$12$WtKO9uf/DG6cFvMNP.w32ejXJ6ulleV1v7ZIY2jwlq6uJaZ3cewJe', 2, 44, 1, '2026-05-11 22:04:49', '2026-05-11 22:04:49'),
(54, NULL, 'ART site lead — mdy-seed-42', '$2y$12$q3GHd8wyUtdEoZnXAbWqkuC9Fyy0v1ow8AJf26Df4ir4W0fQjEqDq', 2, 45, 1, '2026-05-11 22:04:49', '2026-05-11 22:04:49'),
(55, NULL, 'ART site lead — mdy-seed-43', '$2y$12$c7USJwLJ878vxDSfDlbreOhuoy15DjIxSmiNVnNa3pUGRZvM0WBe6', 2, 46, 1, '2026-05-11 22:04:49', '2026-05-11 22:04:49'),
(56, NULL, 'ART site lead — mdy-seed-44', '$2y$12$dePX5J8UMtHM0Gqa2JIxiejzN02.juxIwzu73UKBs2WtcrKT/VH3u', 2, 47, 1, '2026-05-11 22:04:50', '2026-05-11 22:04:50'),
(57, NULL, 'ART site lead — mdy-seed-45', '$2y$12$mTbGJPEvA3JlEfbJ9G/X4.TVFGT.eX0BCzrZBAFnWCrGxnWj/lMBy', 2, 48, 1, '2026-05-11 22:04:50', '2026-05-11 22:04:50'),
(58, NULL, 'ART site lead — mdy-seed-46', '$2y$12$yMg9vdHduUnMU48HihzTouy83/oZaIB7nqx4eS4.oKqpO/1UJibti', 2, 49, 1, '2026-05-11 22:04:50', '2026-05-11 22:04:50'),
(59, NULL, 'ART site lead — mdy-seed-47', '$2y$12$Wn8QtvMnd2hv5jeHQr799O6fCePyaETp6ecH/j6nXoNqAMFpqJ8hC', 2, 50, 1, '2026-05-11 22:04:50', '2026-05-11 22:04:50'),
(60, NULL, 'ART site lead — mdy-seed-48', '$2y$12$kHjFsuSieGYkiJoPX.RyWOzEdkW5i92IDUA7W9PsBAiPMp3Thj.8G', 2, 51, 1, '2026-05-11 22:04:51', '2026-05-11 22:04:51'),
(61, NULL, 'ART site lead — mdy-seed-49', '$2y$12$pND5FqQRWpxDxHkDLTRcIOFToLXXuwrGhqk1OLQ/d67B8v2Y4e206', 2, 52, 1, '2026-05-11 22:04:51', '2026-05-11 22:04:51'),
(62, NULL, 'ART site lead — mdy-seed-50', '$2y$12$phVzXrpZBlnEeh6izFuk8uAdhbFmZYId9xmb.oEeYw9p4M9niTP8O', 2, 53, 1, '2026-05-11 22:04:51', '2026-05-11 22:04:51'),
(63, 'mdy_pt_001', NULL, '$2y$12$DaDjrKpVK1GLH8J4rQ2VlO9YIg4sd8UlMgcIFvFqbyHRZ5RKyRuJi', 1, NULL, 1, '2026-05-11 22:04:51', '2026-05-11 22:04:51'),
(64, 'mdy_pt_002', NULL, '$2y$12$BygVQojjWikKqIXb6dHloOhIQzhd978YO2ZOEeEDmX5iArdjtiJx.', 1, NULL, 1, '2026-05-11 22:04:52', '2026-05-11 22:04:52'),
(65, 'mdy_pt_003', NULL, '$2y$12$i0HbJ9pZij2rM27MJvjWYOMEunPj1h5W4/q6sfxhgHORyDNkCk3U.', 1, NULL, 1, '2026-05-11 22:04:52', '2026-05-11 22:04:52'),
(66, 'mdy_pt_004', NULL, '$2y$12$RRyATzEiWD4w469z3LSYu.GayUPuwttML.IUw7jFNzfilvjhsIKxe', 1, NULL, 1, '2026-05-11 22:04:52', '2026-05-11 22:04:52'),
(67, 'mdy_pt_005', NULL, '$2y$12$1Icrr5pMUstQcWvKGpvAQu1ClkAUn3A/07dCc9GvJzB24Fhv77DJO', 1, NULL, 1, '2026-05-11 22:04:52', '2026-05-11 22:04:52'),
(68, 'mdy_pt_006', NULL, '$2y$12$Jq2/sLP3FY4w0A8/N7oGGOdgm1XtILA4ihnVgawRDuThWWu5iZrwq', 1, NULL, 1, '2026-05-11 22:04:53', '2026-05-11 22:04:53'),
(69, 'mdy_pt_007', NULL, '$2y$12$SCV8pwA94cTYxPDAXJD8t.e82lyx6x9UnU9Hfwy5IVGBAHs1jv1lO', 1, NULL, 1, '2026-05-11 22:04:53', '2026-05-11 22:04:53'),
(70, 'mdy_pt_008', NULL, '$2y$12$9sh0vSHaFA0Wndz.QVJsFuLecfBj/CNXtPJ8PKPbAelNPCAyyVDT2', 1, NULL, 1, '2026-05-11 22:04:53', '2026-05-11 22:04:53'),
(71, 'mdy_pt_009', NULL, '$2y$12$BPU/DdqCJAUXC1AakSNMc.Bl9tgcaLZs/v467b.Rg1zh3ZJLrB24O', 1, NULL, 1, '2026-05-11 22:04:53', '2026-05-11 22:04:53'),
(72, 'mdy_pt_010', NULL, '$2y$12$k6ilb3VUKNqz.0gqc3U8beiXSagNDprkDRO9s4Jgx.Mu.jGN/t/x6', 1, NULL, 1, '2026-05-11 22:04:53', '2026-05-11 22:04:53'),
(73, 'mdy_pt_011', NULL, '$2y$12$5VNtwocZg1GKRxE21kSZ2.vr.bRrnrLgpNWSc/437l3l1SX.Nc1Wm', 1, NULL, 1, '2026-05-11 22:04:54', '2026-05-11 22:04:54'),
(74, 'mdy_pt_012', NULL, '$2y$12$U7v2wlITx4Lph/O3qWTxluYg1QIdlI.sM7Tq9Fssw/dKTiaeFnsie', 1, NULL, 1, '2026-05-11 22:04:54', '2026-05-11 22:04:54'),
(75, 'mdy_pt_013', NULL, '$2y$12$raiB3wxr5xmg.1UUo14P3OqMCKycGUNScd1PhUCNGESKatZdBdjxC', 1, NULL, 1, '2026-05-11 22:04:54', '2026-05-11 22:04:54'),
(76, 'mdy_pt_014', NULL, '$2y$12$UEHfX4GP4pesSEQVYPPute3aDDDzW0GrOkRQeHN42mIab3bFVkMA.', 1, NULL, 1, '2026-05-11 22:04:54', '2026-05-11 22:04:54'),
(77, 'mdy_pt_015', NULL, '$2y$12$lHiUSxwUHPit6z6YkVNnjuMX/fHnE.yzjUqHgBxc/9RTkzzKz7x6.', 1, NULL, 1, '2026-05-11 22:04:55', '2026-05-11 22:04:55'),
(78, 'mdy_pt_016', NULL, '$2y$12$jXKyw3r03Fr078VgOmBwaOCWcq9WFfZpjrXexu9E0LDcjp9Qky2Ue', 1, NULL, 1, '2026-05-11 22:04:55', '2026-05-11 22:04:55'),
(79, 'mdy_pt_017', NULL, '$2y$12$72339OnOBNEBfOL/8DNmw.iL3lTBD7sjFcd/kLD3HYIGdSBaPioQS', 1, NULL, 1, '2026-05-11 22:04:55', '2026-05-11 22:04:55'),
(80, 'mdy_pt_018', NULL, '$2y$12$n6J/NCMUiR7xo1DvWlHbMe1PnZboFhY.HiaA6qunffqganCqqqa/O', 1, NULL, 1, '2026-05-11 22:04:55', '2026-05-11 22:04:55'),
(81, 'mdy_pt_019', NULL, '$2y$12$mcK9G7LeNdjyi2/pz5woWePHDSVTbJq3NATTB7M85aYZR6UL9nS9C', 1, NULL, 1, '2026-05-11 22:04:56', '2026-05-11 22:04:56'),
(82, 'mdy_pt_020', NULL, '$2y$12$HoLinLV0gzkXivqI7iCdi.Ptl2lU8D5vhUKWsfJx3AJ/HhTWF1VIS', 1, NULL, 1, '2026-05-11 22:04:56', '2026-05-11 22:04:56'),
(83, 'mdy_pt_021', NULL, '$2y$12$29h20a6vJXtTztG38sYMU.0VeKswNoQDccoUPSpIy5s4AjAlNOIPi', 1, NULL, 1, '2026-05-11 22:04:56', '2026-05-11 22:04:56'),
(84, 'mdy_pt_022', NULL, '$2y$12$0m1oXHThW0qvNfO62NjQ3OANxAcE90rN9gfsnSMVz2Qg0soUAhdde', 1, NULL, 1, '2026-05-11 22:04:56', '2026-05-11 22:04:56'),
(85, 'mdy_pt_023', NULL, '$2y$12$LnAYetkjoYs0V1S3OakvoelLsPCfXUjBWnDxb5F.rMOzSF/EcBAWm', 1, NULL, 1, '2026-05-11 22:04:57', '2026-05-11 22:04:57'),
(86, 'mdy_pt_024', NULL, '$2y$12$OHAdoCTtBrIRiSPbv3x0ieq49PCADeTHL3bMTgykzeHZ3l0YOk8f6', 1, NULL, 1, '2026-05-11 22:04:57', '2026-05-11 22:04:57'),
(87, 'mdy_pt_025', NULL, '$2y$12$ZpzPe96Jr2726b5eJGjGougyzovh/uC/irQAG8kwPkY1206Z0ilt6', 1, NULL, 1, '2026-05-11 22:04:57', '2026-05-11 22:04:57'),
(88, 'mdy_pt_026', NULL, '$2y$12$KdLaMcIhdcNjOL9ZOm3Beuev3b2St455ECRssefqCW0wAA/omNXjK', 1, NULL, 1, '2026-05-11 22:04:57', '2026-05-11 22:04:57'),
(89, 'mdy_pt_027', NULL, '$2y$12$Isbhs3POByPMX.YhPikH/umYrFysQOpoF5o1RIjXdEhb8HiCO6QDe', 1, NULL, 1, '2026-05-11 22:04:58', '2026-05-11 22:04:58'),
(90, 'mdy_pt_028', NULL, '$2y$12$0C4.lWUSSQLZKpH51Xkj9OX5NuD5hcif5XW3J/pQodI/pj3uS8gse', 1, NULL, 1, '2026-05-11 22:04:58', '2026-05-11 22:04:58'),
(91, 'mdy_pt_029', NULL, '$2y$12$aDz5ADPrTsTY/YQJwg6eTexMuvT8oX2mOKfwNwbWeZqP/tT4AgLZK', 1, NULL, 1, '2026-05-11 22:04:58', '2026-05-11 22:04:58'),
(92, 'mdy_pt_030', NULL, '$2y$12$ALFcvG2D2Eqb8a67V0SZf.3YDJLBS4lGeP0cK2k9TwxjA0cGBEUS2', 1, NULL, 1, '2026-05-11 22:04:58', '2026-05-11 22:04:58'),
(93, 'mdy_pt_031', NULL, '$2y$12$HRH9VlaHZLu91oEjfbWXEu/FZAcsazMKZwSBZS2APxrDHYiBJKUdK', 1, NULL, 1, '2026-05-11 22:04:58', '2026-05-11 22:04:58'),
(94, 'mdy_pt_032', NULL, '$2y$12$wN2ExP5CHrGxPTgbYByY4e9UyBRdiOzEI1T7vhL8Tg9LFQA.L1phK', 1, NULL, 1, '2026-05-11 22:04:59', '2026-05-11 22:04:59'),
(95, 'mdy_pt_033', NULL, '$2y$12$rmoZA.go7nxoSrqRYdl7jOlJJU9t7hjbROkimnn4cp38sfLFcoXi2', 1, NULL, 1, '2026-05-11 22:04:59', '2026-05-11 22:04:59'),
(96, 'mdy_pt_034', NULL, '$2y$12$1bhC99YNWJsyT873idS1Nu7VC0Guf.d2ewjLik/Rb1GKtyHPGtU0y', 1, NULL, 1, '2026-05-11 22:04:59', '2026-05-11 22:04:59'),
(97, 'mdy_pt_035', NULL, '$2y$12$YuqL7ryxLqw4eokJw8p1mOVU6BBQeKY3lIokAp5j8b23oOHU7EH.m', 1, NULL, 1, '2026-05-11 22:04:59', '2026-05-11 22:04:59'),
(98, 'mdy_pt_036', NULL, '$2y$12$21uKZYh1E1VxKeLUx7L2Ye4.uB5z72Go.WDak8gm3inC2QjnvT0J6', 1, NULL, 1, '2026-05-11 22:05:00', '2026-05-11 22:05:00'),
(99, 'mdy_pt_037', NULL, '$2y$12$jRk/XmR2geffbztfZIYmFOEYcRBmSv0kDO8sGnIlxtID8llLyqE6e', 1, NULL, 1, '2026-05-11 22:05:00', '2026-05-11 22:05:00'),
(100, 'mdy_pt_038', NULL, '$2y$12$MPlBUvmTtSpFfB7JWhKfleRUcEak/EjvEN/cITRnX6qQ6eh1NT1aK', 1, NULL, 1, '2026-05-11 22:05:00', '2026-05-11 22:05:00'),
(101, 'mdy_pt_039', NULL, '$2y$12$huF1hOuhdNROb8nUCWjzOu3SkgvQFGA7Lbw2XTHhpGnNwPq2087Qu', 1, NULL, 1, '2026-05-11 22:05:00', '2026-05-11 22:05:00'),
(102, 'mdy_pt_040', NULL, '$2y$12$yt0ito0EELcchYdPpsJ3PuhAtBd7yklNuSZUZiDPWcZ5H5ZRt4MUu', 1, NULL, 1, '2026-05-11 22:05:01', '2026-05-11 22:05:01'),
(103, 'mdy_pt_041', NULL, '$2y$12$dDtyH8yDlF4EDdMtDTruwOPwTnUwkRdoiIYBOFbBVSByeXw66SYp6', 1, NULL, 1, '2026-05-11 22:05:01', '2026-05-11 22:05:01'),
(104, 'mdy_pt_042', NULL, '$2y$12$h27VYKJiVHoP2aVu91xPtOHS053OEByUHV2HtQridAhSRpJ0W5aW6', 1, NULL, 1, '2026-05-11 22:05:01', '2026-05-11 22:05:01'),
(105, 'mdy_pt_043', NULL, '$2y$12$fi1vt4M0CIvr5kZ.b/u5feDV/tBEISh4VCdgFOMKV4Dnl2KIfabBq', 1, NULL, 1, '2026-05-11 22:05:01', '2026-05-11 22:05:01'),
(106, 'mdy_pt_044', NULL, '$2y$12$dmIObpZHn15nVt.Kh9e8LOq8VaPhpGGLXS.RXGa6VAlKtBDQgYs4y', 1, NULL, 1, '2026-05-11 22:05:02', '2026-05-11 22:05:02'),
(107, 'mdy_pt_045', NULL, '$2y$12$fzfQ48/JtX1WtLGLXxc1KusJvS6/N8lQ5RD59wiFGxdhLU9VKPfsu', 1, NULL, 1, '2026-05-11 22:05:02', '2026-05-11 22:05:02'),
(108, 'mdy_pt_046', NULL, '$2y$12$CnBUw04ASw0Ixg94hBbLEe3UOLszPsXLRmWlEFeUrUToZvf/8q5ba', 1, NULL, 1, '2026-05-11 22:05:02', '2026-05-11 22:05:02'),
(109, 'mdy_pt_047', NULL, '$2y$12$Z3olQ3g79U7D8aHvSbcR8.hljAv2zgYTrs2YenIrC0fUYr82IOVB2', 1, NULL, 1, '2026-05-11 22:05:02', '2026-05-11 22:05:02'),
(110, 'mdy_pt_048', NULL, '$2y$12$s3Thmgfcuod.AeEPY9Pf1O5LYgDjYdb5tVNTP/rc.CaX9WVLbLQMe', 1, NULL, 1, '2026-05-11 22:05:03', '2026-05-11 22:05:03'),
(111, 'mdy_pt_049', NULL, '$2y$12$s6TxjOY8ffO9Lju7lagUtOAYhm1a6ezJT.taDmvh3eQldyMMdIKxm', 1, NULL, 1, '2026-05-11 22:05:03', '2026-05-11 22:05:03'),
(112, 'mdy_pt_050', NULL, '$2y$12$8awgIuLuIlDk3mJyep/vq.iKLw2idqfXWrdnMhPPQPCPugCOPq3MK', 1, NULL, 1, '2026-05-11 22:05:03', '2026-05-11 22:05:03'),
(113, 'mdy_pt_051', NULL, '$2y$12$eav/RudSZUTmAbOMqTcYxOG/OJaSeoezIS09nzIc6SQ4R7Ob3hEa.', 1, NULL, 1, '2026-05-11 22:05:03', '2026-05-11 22:05:03'),
(114, 'mdy_pt_052', NULL, '$2y$12$q2rrDPp2V6r2ss18XLYdtuvzMK6Fk8HmyycSIJjTSm/L35pkJNrjK', 1, NULL, 1, '2026-05-11 22:05:04', '2026-05-11 22:05:04'),
(115, 'mdy_pt_053', NULL, '$2y$12$Oh41AunyxpiTcoDsMiknZ.H4kJDtcG1Ip7bB/xjOTLWZNAjLIyBZG', 1, NULL, 1, '2026-05-11 22:05:04', '2026-05-11 22:05:04'),
(116, 'mdy_pt_054', NULL, '$2y$12$AdRi0WpF7jmpTYEiEiotZu5YCGr3euardZbji2gzVUvOPeroVQE1C', 1, NULL, 1, '2026-05-11 22:05:04', '2026-05-11 22:05:04'),
(117, 'mdy_pt_055', NULL, '$2y$12$2DzOV3yIzR3NX53aHza1Tu9KhNsnnhqZcz1Gq4nvW9quFQq2yvaJq', 1, NULL, 1, '2026-05-11 22:05:04', '2026-05-11 22:05:04'),
(118, 'mdy_pt_056', NULL, '$2y$12$1cwrEGXwVeHBuJfEkPmp6u4WrvWD/JYx4ob17cFgX3PxEAEJrBzde', 1, NULL, 1, '2026-05-11 22:05:05', '2026-05-11 22:05:05'),
(119, 'mdy_pt_057', NULL, '$2y$12$1wDtkxm2aEZtWW9xAlVCruweS6HDU6E7PtdqtOfulhw7sl9LtvAC6', 1, NULL, 1, '2026-05-11 22:05:05', '2026-05-11 22:05:05'),
(120, 'mdy_pt_058', NULL, '$2y$12$XouK0MUrjSWBDgaH24nM1O8itlENTlQhQ1fIp6iqtCgr7DEnUzGxC', 1, NULL, 1, '2026-05-11 22:05:05', '2026-05-11 22:05:05'),
(121, 'mdy_pt_059', NULL, '$2y$12$NObIxjCWvrsP4/SG6HhOiuhkt4W4HFJj2nrrPftKb7uQ4ARglbB76', 1, NULL, 1, '2026-05-11 22:05:05', '2026-05-11 22:05:05'),
(122, 'mdy_pt_060', NULL, '$2y$12$pRAg9GyJk9O7.YbKiT4Hj.QWXc8sVp2yjnGHhXZ0kSac/q4IsvGfW', 1, NULL, 1, '2026-05-11 22:05:05', '2026-05-11 22:05:05'),
(123, 'mdy_pt_061', NULL, '$2y$12$ducPlEsXgygDuP8ivKetseXqBzmZax/k5V/NyJDyVg9WkLi9iiydS', 1, NULL, 1, '2026-05-11 22:05:06', '2026-05-11 22:05:06'),
(124, 'mdy_pt_062', NULL, '$2y$12$sEshOYb1or3NX1eeW.7D6uAiIH88LfmwhU3QZUgSlgEN8.xGDBzBO', 1, NULL, 1, '2026-05-11 22:05:06', '2026-05-11 22:05:06'),
(125, 'mdy_pt_063', NULL, '$2y$12$DVZf/n3Fwsy33hE71veNg.lKb43UTPHyJWNj2zefi.AUJY5brR.aG', 1, NULL, 1, '2026-05-11 22:05:06', '2026-05-11 22:05:06'),
(126, 'mdy_pt_064', NULL, '$2y$12$KmJWKITuyL/BU.bX795raurTQsfI6g8Wqc.7IfcqLX5Wn.cJLmHMu', 1, NULL, 1, '2026-05-11 22:05:06', '2026-05-11 22:05:06'),
(127, 'mdy_pt_065', NULL, '$2y$12$lw.C780Yb8RUIqzL7vHvVuiLIlp2cBtKbsV0vDlxtjwvIJbdrOjaa', 1, NULL, 1, '2026-05-11 22:05:07', '2026-05-11 22:05:07'),
(128, 'mdy_pt_066', NULL, '$2y$12$TWNM5M2pb2j600o0L6ecmuiqSbHcRyAMDFLi/ZbYDRDmrfncuOxhS', 1, NULL, 1, '2026-05-11 22:05:07', '2026-05-11 22:05:07'),
(129, 'mdy_pt_067', NULL, '$2y$12$V7QaslZ.1HJrW9eLtdCc2.4cqg2UCxi4OkfKyrWpcXq2l15EuvEbO', 1, NULL, 1, '2026-05-11 22:05:07', '2026-05-11 22:05:07'),
(130, 'mdy_pt_068', NULL, '$2y$12$S7iVdT56IjxdEeHhjgYPpeMbCCB9mktVLQAFYuCfHjOchwcSK/KjG', 1, NULL, 1, '2026-05-11 22:05:07', '2026-05-11 22:05:07'),
(131, 'mdy_pt_069', NULL, '$2y$12$Zm/HGuZuxgOl6pbYwnp8qOHWnNY6QoGPYVINGWkMKvvfllsro.g5K', 1, NULL, 1, '2026-05-11 22:05:08', '2026-05-11 22:05:08'),
(132, 'mdy_pt_070', NULL, '$2y$12$9XUmeyMoUy5GC/d0NMGF6.7V7w3cwrhSpLPdO0BM2ImdcfuDlvtYG', 1, NULL, 1, '2026-05-11 22:05:08', '2026-05-11 22:05:08'),
(133, 'mdy_pt_071', NULL, '$2y$12$7mWfxmeCVF.iEUSZcH1fIuZO.iqJORqg4RpVGkXQWs2r2yd5ZjzZ6', 1, NULL, 1, '2026-05-11 22:05:08', '2026-05-11 22:05:08'),
(134, 'mdy_pt_072', NULL, '$2y$12$nuNIdtcimm2xQApT.3W5X.00mBS/yqaSguneaoa9sk1DWtJNlBx3.', 1, NULL, 1, '2026-05-11 22:05:08', '2026-05-11 22:05:08'),
(135, 'mdy_pt_073', NULL, '$2y$12$mrGFquabYRjyaMfMVwtdh.2K8MV.WW8kHksP/1GoPzXXF34D/UXka', 1, NULL, 1, '2026-05-11 22:05:09', '2026-05-11 22:05:09'),
(136, 'mdy_pt_074', NULL, '$2y$12$mHlYoD7KCxQslwt0BBfvJu8M0LnGKlYqYlVCuF96zIUTgeHNEXUT6', 1, NULL, 1, '2026-05-11 22:05:09', '2026-05-11 22:05:09'),
(137, 'mdy_pt_075', NULL, '$2y$12$q3e1EYQD6Yfzj37BfVolIO/OUS0nHLeIbq6pXFpXQGFcemjlTQRg6', 1, NULL, 1, '2026-05-11 22:05:09', '2026-05-11 22:05:09'),
(138, 'mdy_pt_076', NULL, '$2y$12$pt0JBLex9So0c/eMzmCO9uU7ZcOZNa0KJnKrSWCwLwfwtITyteuSq', 1, NULL, 1, '2026-05-11 22:05:09', '2026-05-11 22:05:09'),
(139, 'mdy_pt_077', NULL, '$2y$12$hp0Z61ynEzasXR/3dnr3kO6/TeGRtCGizNTQF6Wx7WoSfoXL8FkWm', 1, NULL, 1, '2026-05-11 22:05:09', '2026-05-11 22:05:09'),
(140, 'mdy_pt_078', NULL, '$2y$12$5Ah.WZIkINrO/pBc0hudZOmrhdz7YmAexxwCaNKylvRpiScJDKXxm', 1, NULL, 1, '2026-05-11 22:05:10', '2026-05-11 22:05:10'),
(141, 'mdy_pt_079', NULL, '$2y$12$CX87Emp1jxnlaB2szS0e3..8Aw1NfnmwQYDciM5vuNDSSbZ2BukO2', 1, NULL, 1, '2026-05-11 22:05:10', '2026-05-11 22:05:10'),
(142, 'mdy_pt_080', NULL, '$2y$12$81afUaCDgPuTzaMfecuz1uxxHuIqpS.9luLrtSQK6RP0dWC5OdYe6', 1, NULL, 1, '2026-05-11 22:05:10', '2026-05-11 22:05:10'),
(143, 'mdy_pt_081', NULL, '$2y$12$yLRWyhwJLAvn3S0eGjWq.e3jP06KwnpszBQT.cwiLGVU.yN3hVMAK', 1, NULL, 1, '2026-05-11 22:05:10', '2026-05-11 22:05:10'),
(144, 'mdy_pt_082', NULL, '$2y$12$gmjpwBADBpctPTj4v/rCs..nRtNastr8MqRCBWss1wtdO.aPtUlae', 1, NULL, 1, '2026-05-11 22:05:11', '2026-05-11 22:05:11'),
(145, 'mdy_pt_083', NULL, '$2y$12$TCW3KNcY625FrDNjyw67m.2i.y0zRbRCA3Z2R3Skh4y62fb9PSYCi', 1, NULL, 1, '2026-05-11 22:05:11', '2026-05-11 22:05:11'),
(146, 'mdy_pt_084', NULL, '$2y$12$/SDgAoekZ/jIECiS6oy7XewHVe6TzeE7RAdLc6DRn/YyYQj/h3naK', 1, NULL, 1, '2026-05-11 22:05:11', '2026-05-11 22:05:11'),
(147, 'mdy_pt_085', NULL, '$2y$12$pxGNwbT9hMOweXfilF7u1OGYLt7s6mdtnMQkWONxTGT9i.9tDiKSu', 1, NULL, 1, '2026-05-11 22:05:11', '2026-05-11 22:05:11'),
(148, 'mdy_pt_086', NULL, '$2y$12$gVhfMKEPm2p9aMU2Xb1evub1qCA3b1cL09Aek06QGPrHB1CRoVpEW', 1, NULL, 1, '2026-05-11 22:05:12', '2026-05-11 22:05:12'),
(149, 'mdy_pt_087', NULL, '$2y$12$1XIkbn1fZrj/NF39ZQzqqOA2GaskQc0b/NgdS6/CfCjetCv/G5KdS', 1, NULL, 1, '2026-05-11 22:05:12', '2026-05-11 22:05:12'),
(150, 'mdy_pt_088', NULL, '$2y$12$WQeAMV0//UtHztSJxBX93OgGML8CUPNL6YeCHfcEhueprzEzKRZmW', 1, NULL, 1, '2026-05-11 22:05:12', '2026-05-11 22:05:12'),
(151, 'mdy_pt_089', NULL, '$2y$12$WltAOf4Jq/uVzsx5vcCy0e3T5q6KrC95hB9nStB44FP4WPJCqBkt.', 1, NULL, 1, '2026-05-11 22:05:12', '2026-05-11 22:05:12'),
(152, 'mdy_pt_090', NULL, '$2y$12$hWxwlxuBjFHlzinbqnmvke3nMAy7Q8RpkZpurwLSEDRvJmSMePIHu', 1, NULL, 1, '2026-05-11 22:05:13', '2026-05-11 22:05:13'),
(153, 'mdy_pt_091', NULL, '$2y$12$UTTIA2OrL8iqQ7vF6mEjV.BdCzq2qBP8K21ATBdMS05uRUi0NDKOC', 1, NULL, 1, '2026-05-11 22:05:13', '2026-05-11 22:05:13'),
(154, 'mdy_pt_092', NULL, '$2y$12$eXdyxoXGhqMZAp2y6v98r.PRzpmLQeZVSiOyeFEBY7Ybhdg8WG3Xy', 1, NULL, 1, '2026-05-11 22:05:13', '2026-05-11 22:05:13'),
(155, 'mdy_pt_093', NULL, '$2y$12$D1L1ASWA0DPcbiJiIY9wreAv9iCa6nmce.sYO/2ZxKw37iZffZb6S', 1, NULL, 1, '2026-05-11 22:05:13', '2026-05-11 22:05:13'),
(156, 'mdy_pt_094', NULL, '$2y$12$vlv4IOQTa7lcWBq1BqRjDu/u1ROT0sKKzeSZE5/k6epSctm9Vqoga', 1, NULL, 1, '2026-05-11 22:05:13', '2026-05-11 22:05:13'),
(157, 'mdy_pt_095', NULL, '$2y$12$Q.vdYAlShBGgN1QdNesiEeQBBx5sF19Jlgo1XaqYuJKv6e6DqS9Ue', 1, NULL, 1, '2026-05-11 22:05:14', '2026-05-11 22:05:14'),
(158, 'mdy_pt_096', NULL, '$2y$12$xFFU8ZgD4TMGEWO/4N9hGe6wWm8TrkirqoOOKjVZBJzd19kSeVspG', 1, NULL, 1, '2026-05-11 22:05:14', '2026-05-11 22:05:14'),
(159, 'mdy_pt_097', NULL, '$2y$12$gIiE4dht93RHDe8JRKy8M.ZaRNC0FOoOya/nBGhNQE.cN5572TtZW', 1, NULL, 1, '2026-05-11 22:05:14', '2026-05-11 22:05:14'),
(160, 'mdy_pt_098', NULL, '$2y$12$XTjWn.IkEsbdwM2tt5Z.ae6toU00KbuABknDyIypX6g3LoFvJbIV2', 1, NULL, 1, '2026-05-11 22:05:14', '2026-05-11 22:05:14'),
(161, 'mdy_pt_099', NULL, '$2y$12$18PFIydEL2DuzK/i5dbT7eg7PhLV.TXWGcSFCIGjEU71St7Wt.rwm', 1, NULL, 1, '2026-05-11 22:05:15', '2026-05-11 22:05:15'),
(162, 'mdy_pt_100', NULL, '$2y$12$E.cO0pP924uho8P/5rk01.FZgl15KdDIoQ.VvNkAkgsXk2i22btUO', 1, NULL, 1, '2026-05-11 22:05:15', '2026-05-11 22:05:15'),
(163, 'DU DU', NULL, '$2y$12$5HhKXFtDul3d7FbRlIXDH.J7JNtXwXGrMNmlWC3tlCeSAKOGBLcOS', 1, NULL, 1, '2026-05-11 22:13:54', '2026-05-11 22:13:54');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `art_centers`
--
ALTER TABLE `art_centers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `art_centers_nickname_unique` (`nickname`),
  ADD KEY `art_centers_township_index` (`township`),
  ADD KEY `art_centers_area_index` (`area`),
  ADD KEY `art_centers_role_id_foreign` (`role_id`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bookings_user_id_foreign` (`user_id`),
  ADD KEY `bookings_art_center_id_foreign` (`art_center_id`),
  ADD KEY `bookings_staff_id_foreign` (`staff_id`),
  ADD KEY `bookings_navigation_id_foreign` (`navigation_id`),
  ADD KEY `bookings_status_index` (`status`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contact_messages_user_id_foreign` (`user_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `navigations`
--
ALTER TABLE `navigations`
  ADD PRIMARY KEY (`navigation_id`),
  ADD KEY `navigations_user_id_foreign` (`user_id`),
  ADD KEY `navigations_art_center_id_foreign` (`art_center_id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `resource_libraries`
--
ALTER TABLE `resource_libraries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reviews_booking_id_unique` (`booking_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `clinic_id` (`clinic_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_nickname_unique` (`nickname`),
  ADD KEY `users_role_id_foreign` (`role_id`),
  ADD KEY `users_art_center_id_foreign` (`art_center_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `art_centers`
--
ALTER TABLE `art_centers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `navigations`
--
ALTER TABLE `navigations`
  MODIFY `navigation_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `resource_libraries`
--
ALTER TABLE `resource_libraries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=164;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `art_centers`
--
ALTER TABLE `art_centers`
  ADD CONSTRAINT `art_centers_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_art_center_id_foreign` FOREIGN KEY (`art_center_id`) REFERENCES `art_centers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_navigation_id_foreign` FOREIGN KEY (`navigation_id`) REFERENCES `navigations` (`navigation_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `bookings_staff_id_foreign` FOREIGN KEY (`staff_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `bookings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD CONSTRAINT `contact_messages_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `navigations`
--
ALTER TABLE `navigations`
  ADD CONSTRAINT `navigations_art_center_id_foreign` FOREIGN KEY (`art_center_id`) REFERENCES `art_centers` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `navigations_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_booking_id_foreign` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`clinic_id`) REFERENCES `art_centers` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_art_center_id_foreign` FOREIGN KEY (`art_center_id`) REFERENCES `art_centers` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
