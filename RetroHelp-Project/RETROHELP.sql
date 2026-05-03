-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 03, 2026 at 11:17 PM
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
  `image` varchar(255) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `contact_no` varchar(255) DEFAULT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
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

INSERT INTO `art_centers` (`id`, `name`, `image`, `latitude`, `longitude`, `contact_no`, `is_verified`, `created_at`, `updated_at`, `township`, `area`, `rating_avg`, `total_reviews`) VALUES
(1, 'ART Center A', NULL, NULL, NULL, '09-00000001', 1, '2026-03-20 05:07:51', '2026-03-20 05:07:51', 'Yangon', 'Downtown', 0.00, 0),
(2, 'ART Center B', NULL, NULL, NULL, '09-00000002', 1, '2026-03-20 05:07:51', '2026-03-20 05:07:51', 'Mandalay', 'Aungmyaythazan', 0.00, 0),
(3, 'ART Center C', NULL, NULL, NULL, '09-00000003', 0, '2026-03-20 05:07:51', '2026-03-20 05:07:51', 'Naypyidaw', 'Zabuthiri', 0.00, 0);

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
(4, '2026_03_20_000004_create_pill_dispenses_table', 1),
(5, '2026_03_20_000005_create_resource_libraries_table', 1),
(6, '2026_03_20_000006_create_contact_messages_table', 1),
(7, '2026_03_20_000007_create_navigations_table', 1),
(8, '2019_12_14_000001_create_personal_access_tokens_table', 2),
(9, '2026_03_20_000008_add_township_area_to_art_centers', 3),
(10, '2026_03_20_000009_add_art_center_to_navigations', 3),
(11, '2026_03_20_000010_add_art_center_and_navigation_to_pill_dispenses', 4),
(12, '2026_03_20_100000_drop_singular_tables', 4);

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
(1, 9, 'Downtown', 'ART Center A', '2026-03-20 05:09:40', '2026-03-20 05:09:40', 1);

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
(15, 'App\\Models\\User', 11, 'api-token', '6a956fd5e82b2e93e1b8722f3c183cecfa17a76b201a2b0502502fd5db8c1ce7', '[\"*\"]', '2026-03-20 05:23:21', NULL, '2026-03-20 05:23:16', '2026-03-20 05:23:21');

-- --------------------------------------------------------

--
-- Table structure for table `pill_dispenses`
--

CREATE TABLE `pill_dispenses` (
  `dispense_id` bigint(20) UNSIGNED NOT NULL,
  `patient_id` bigint(20) UNSIGNED NOT NULL,
  `staff_id` bigint(20) UNSIGNED NOT NULL,
  `status` enum('Pending','Received','Given') NOT NULL DEFAULT 'Pending',
  `dispense_date` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `art_center_id` bigint(20) UNSIGNED DEFAULT NULL,
  `navigation_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pill_dispenses`
--

INSERT INTO `pill_dispenses` (`dispense_id`, `patient_id`, `staff_id`, `status`, `dispense_date`, `created_at`, `updated_at`, `art_center_id`, `navigation_id`) VALUES
(1, 9, 10, 'Given', '2026-03-20 11:40:04', '2026-03-20 05:09:48', '2026-03-20 05:10:04', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `resource_libraries`
--

CREATE TABLE `resource_libraries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `resource_libraries`
--

INSERT INTO `resource_libraries` (`id`, `title`, `content`, `category`, `created_at`, `updated_at`) VALUES
(1, 'What is ART?', 'ART stands for Antiretroviral Therapy. This library item is demo content.', 'Basics', '2026-03-20 05:07:51', '2026-03-20 05:07:51'),
(2, 'Medication Tips', 'Demo tips for taking medication consistently and safely.', 'Care', '2026-03-20 05:07:51', '2026-03-20 05:07:51');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `clinic_id` bigint(20) UNSIGNED NOT NULL,
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
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nickname` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nickname`, `full_name`, `password`, `role_id`, `is_verified`, `created_at`, `updated_at`) VALUES
(1, 'patient1', NULL, '$2y$12$lDm55OPsSgq7aOF98VvxKeZyBGlVdZDc2FBBTMNaN.HWcQ45v/yey', 1, 0, '2026-03-20 05:08:12', '2026-03-20 05:08:12'),
(2, NULL, 'Clinic Staff 1', '$2y$12$evKF4PmVKeVWXlaAXqS3POROXQotkDXIVyt62mTTFxIjwNDyVY.jy', 2, 1, '2026-03-20 05:08:13', '2026-03-20 05:08:13'),
(3, 'admin1', NULL, '$2y$12$/iS9nmiJVYmo9KM2XyaY8OiPp3qC9q0rFwP0iDV2HoFj8tv/JXJpe', 3, 1, '2026-03-20 05:08:13', '2026-03-20 05:08:13'),
(4, 'patient2', NULL, '$2y$12$z3J1Z6LngJLk3.2IwvOiau1XJYn6Xs1lZxXZ5NSDRM4DNGf0GTGJ2', 1, 0, '2026-03-20 05:08:26', '2026-03-20 05:08:26'),
(5, NULL, 'Clinic Staff 2', '$2y$12$s9RC2PKJqb0lCP3GyFxAXO0e7gvanSyCQhixF5VHO7Sv2uTlN635.', 2, 1, '2026-03-20 05:08:26', '2026-03-20 05:08:26'),
(6, 'admin2', NULL, '$2y$12$Z7enouJDG/KVbAcrEbCwHuZG6Z7eXsNQZOLQOPBITbcun15dbfwY.', 3, 1, '2026-03-20 05:08:26', '2026-03-20 05:08:26'),
(7, NULL, 'Clinic Staff 2', '$2y$12$zn4ApePRTUX41Le7PCjUQu9NFBAFVaudrG.AIxhSoI2sXoS4OT3L6', 2, 1, '2026-03-20 05:08:42', '2026-03-20 05:08:42'),
(8, 'patient3', NULL, '$2y$12$bN9c5tYjbGwz2D7zvWdjQuCGyOIexhEZOko/BAUnMV9UGNfZQ3V5u', 1, 0, '2026-03-20 05:08:50', '2026-03-20 05:08:50'),
(9, 'patientX', NULL, '$2y$12$BtM3pS/YRmIXapdlLF9h9eKwL/CqeaeJqUbL.ZCtNI3JRlBQ9FElK', 1, 0, '2026-03-20 05:09:24', '2026-03-20 05:09:24'),
(10, NULL, 'Clinic Staff X', '$2y$12$mOrOVWHh.BksRLwRNcCa5.dkR5YTygJN1vnX4Ao7lOkvTn4KMm7iG', 2, 1, '2026-03-20 05:09:31', '2026-03-20 05:09:31'),
(11, 'adminX', NULL, '$2y$12$.aXyK7mHCq3nVo5yQ4FRMuQ4VvxEYrw6eNE9OYlpERHQMgIniEG0i', 3, 1, '2026-03-20 05:09:34', '2026-03-20 05:09:34');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `art_centers`
--
ALTER TABLE `art_centers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `art_centers_township_index` (`township`),
  ADD KEY `art_centers_area_index` (`area`);

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
-- Indexes for table `pill_dispenses`
--
ALTER TABLE `pill_dispenses`
  ADD PRIMARY KEY (`dispense_id`),
  ADD KEY `pill_dispenses_patient_id_foreign` (`patient_id`),
  ADD KEY `pill_dispenses_staff_id_foreign` (`staff_id`),
  ADD KEY `pill_dispenses_art_center_id_foreign` (`art_center_id`),
  ADD KEY `pill_dispenses_navigation_id_foreign` (`navigation_id`);

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
  ADD KEY `user_id` (`user_id`),
  ADD KEY `clinic_id` (`clinic_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_nickname_unique` (`nickname`),
  ADD KEY `users_role_id_foreign` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `art_centers`
--
ALTER TABLE `art_centers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `navigations`
--
ALTER TABLE `navigations`
  MODIFY `navigation_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `pill_dispenses`
--
ALTER TABLE `pill_dispenses`
  MODIFY `dispense_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `resource_libraries`
--
ALTER TABLE `resource_libraries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

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
-- Constraints for table `pill_dispenses`
--
ALTER TABLE `pill_dispenses`
  ADD CONSTRAINT `pill_dispenses_art_center_id_foreign` FOREIGN KEY (`art_center_id`) REFERENCES `art_centers` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `pill_dispenses_navigation_id_foreign` FOREIGN KEY (`navigation_id`) REFERENCES `navigations` (`navigation_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `pill_dispenses_patient_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pill_dispenses_staff_id_foreign` FOREIGN KEY (`staff_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`clinic_id`) REFERENCES `art_centers` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
