-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : mer. 08 oct. 2025 à 10:38
-- Version du serveur : 8.0.43-0ubuntu0.24.04.2
-- Version de PHP : 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `salary_management`
--

-- --------------------------------------------------------

--
-- Structure de la table `Attendance`
--

CREATE TABLE `Attendance` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `employeeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `checkIn` datetime(3) DEFAULT NULL,
  `checkOut` datetime(3) DEFAULT NULL,
  `hoursWorked` double NOT NULL DEFAULT '0',
  `status` enum('PRESENT','ABSENT','CONGE','MALADIE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PRESENT',
  `notes` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `Attendance`
--

INSERT INTO `Attendance` (`id`, `employeeId`, `date`, `checkIn`, `checkOut`, `hoursWorked`, `status`, `notes`, `createdAt`, `updatedAt`) VALUES
('2ce50488-18a2-4479-9865-3e3d51c7c586', '62bbce11-7bc2-4419-a651-75ebca976d75', '2025-10-08', '2025-10-08 08:00:00.000', '2025-10-08 16:00:00.000', 8, 'PRESENT', '', '2025-10-08 10:27:23.066', '2025-10-08 10:27:23.066'),
('5416c798-b7a9-4379-9e90-a87117283f8b', '60800e71-5de6-4470-8041-2fb4c20b156d', '2025-10-08', '2025-10-08 08:00:00.000', '2025-10-08 16:00:00.000', 8, 'PRESENT', '', '2025-10-08 10:27:53.841', '2025-10-08 10:27:53.841'),
('8bb27a94-e619-425b-9c98-a0f04db6297c', 'a7b3afcd-fe44-4143-81a9-89e2d569b0fa', '2025-10-08', '2025-10-08 08:00:00.000', '2025-10-08 13:00:00.000', 5, 'PRESENT', '', '2025-10-08 10:26:55.587', '2025-10-08 10:26:55.587');

-- --------------------------------------------------------

--
-- Structure de la table `Company`
--

CREATE TABLE `Company` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '#6FA4AF',
  `budget` double NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `Company`
--

INSERT INTO `Company` (`id`, `name`, `address`, `phone`, `email`, `logo`, `color`, `budget`, `createdAt`, `updatedAt`) VALUES
('3237e806-f630-4382-b1ae-c454b1333a00', 'Entreprise Test', '123 Rue de Test, Dakar', '+221 77 123 45 67', 'contact@test.com', NULL, '#6FA4AF', 0, '2025-10-07 00:18:46.372', '2025-10-07 00:18:46.372'),
('72c01a1e-6dd9-4016-8562-d80321dcc98e', 'Breukh', 'Dakar', '775943708', 'Aly@breukh.com', 'http://localhost:3000/uploads/logos/logo-1759913106684-131748697.png', '#F97316', 0, '2025-10-08 08:45:06.529', '2025-10-08 08:45:06.692'),
('bf2ebec6-bd9f-4b6d-b395-5c930400b299', 'Seneau', 'Dakar', '771234567', 'seneau@gmail.com', 'http://localhost:3000/uploads/logos/logo-1759831541639-43983050.jpeg', '#10B981', 0, '2025-10-07 10:05:41.535', '2025-10-07 10:05:41.641');

-- --------------------------------------------------------

--
-- Structure de la table `Employee`
--

CREATE TABLE `Employee` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `firstName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contractType` enum('FIXE','JOURNALIER','HONORAIRE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'FIXE',
  `rate` double NOT NULL DEFAULT '0',
  `dailyRate` double NOT NULL DEFAULT '0',
  `hourlyRate` double NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `companyId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `Employee`
--

INSERT INTO `Employee` (`id`, `firstName`, `lastName`, `email`, `phone`, `address`, `position`, `contractType`, `rate`, `dailyRate`, `hourlyRate`, `isActive`, `companyId`, `createdAt`, `updatedAt`) VALUES
('60800e71-5de6-4470-8041-2fb4c20b156d', 'modou', 'diagne', NULL, NULL, NULL, 'dev mobile', 'FIXE', 100000, 0, 0, 1, '72c01a1e-6dd9-4016-8562-d80321dcc98e', '2025-10-08 10:26:29.110', '2025-10-08 10:26:29.110'),
('62bbce11-7bc2-4419-a651-75ebca976d75', 'pape', 'niang', NULL, NULL, NULL, 'dev web', 'JOURNALIER', 0, 5000, 0, 1, '72c01a1e-6dd9-4016-8562-d80321dcc98e', '2025-10-08 10:23:44.974', '2025-10-08 10:23:44.974'),
('a7b3afcd-fe44-4143-81a9-89e2d569b0fa', 'aicha', 'niang', NULL, NULL, NULL, 'Devops', 'HONORAIRE', 0, 0, 1000, 1, '72c01a1e-6dd9-4016-8562-d80321dcc98e', '2025-10-08 10:23:14.025', '2025-10-08 10:23:14.025');

-- --------------------------------------------------------

--
-- Structure de la table `Payment`
--

CREATE TABLE `Payment` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payslipId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` double NOT NULL,
  `method` enum('VIREMENT','ESPECES','CHEQUE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'VIREMENT',
  `date` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `Payment`
--

INSERT INTO `Payment` (`id`, `payslipId`, `amount`, `method`, `date`, `createdAt`, `updatedAt`) VALUES
('0eecd44b-f3cd-44a7-b244-9a88c2136110', '579d839d-22e2-4ea9-86c0-0e2d39ad003d', 4750, 'ESPECES', '2025-10-08 10:32:16.577', '2025-10-08 10:32:16.577', '2025-10-08 10:32:16.577'),
('3fc14ac6-7344-4cdf-815d-1c50a7ce71dc', '53e711ea-b844-4ab8-b044-eb7397cb398e', 4750, 'ESPECES', '2025-10-08 10:32:12.071', '2025-10-08 10:32:12.071', '2025-10-08 10:32:12.071'),
('68998d09-dab5-41ae-80f6-4a7c477a6f68', '27e3343e-6cf7-499b-8c5b-893ffe51f8fa', 95000, 'ESPECES', '2025-10-08 10:32:08.224', '2025-10-08 10:32:08.224', '2025-10-08 10:32:08.224');

-- --------------------------------------------------------

--
-- Structure de la table `PayRun`
--

CREATE TABLE `PayRun` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `period` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `companyId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('BROUILLON','APPROUVE','CLOTURE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'BROUILLON',
  `fixedEmployeePaymentOption` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'FULL_MONTH',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `PayRun`
--

INSERT INTO `PayRun` (`id`, `period`, `companyId`, `status`, `fixedEmployeePaymentOption`, `createdAt`, `updatedAt`) VALUES
('ed8a675d-ff40-4b50-9466-ba44359f098a', '2025-10', '72c01a1e-6dd9-4016-8562-d80321dcc98e', 'BROUILLON', 'FULL_MONTH', '2025-10-08 10:28:23.430', '2025-10-08 10:28:23.430');

-- --------------------------------------------------------

--
-- Structure de la table `Payslip`
--

CREATE TABLE `Payslip` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `employeeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payRunId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gross` double NOT NULL,
  `deductions` double NOT NULL,
  `net` double NOT NULL,
  `status` enum('EN_ATTENTE','PAYE','PARTIEL') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'EN_ATTENTE',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `daysWorked` double DEFAULT NULL,
  `hoursWorked` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `Payslip`
--

INSERT INTO `Payslip` (`id`, `employeeId`, `payRunId`, `gross`, `deductions`, `net`, `status`, `createdAt`, `updatedAt`, `daysWorked`, `hoursWorked`) VALUES
('27e3343e-6cf7-499b-8c5b-893ffe51f8fa', '60800e71-5de6-4470-8041-2fb4c20b156d', 'ed8a675d-ff40-4b50-9466-ba44359f098a', 100000, 5000, 95000, 'PAYE', '2025-10-08 10:28:27.129', '2025-10-08 10:32:08.232', NULL, NULL),
('53e711ea-b844-4ab8-b044-eb7397cb398e', 'a7b3afcd-fe44-4143-81a9-89e2d569b0fa', 'ed8a675d-ff40-4b50-9466-ba44359f098a', 5000, 250, 4750, 'PAYE', '2025-10-08 10:28:27.146', '2025-10-08 10:32:12.078', NULL, 5),
('579d839d-22e2-4ea9-86c0-0e2d39ad003d', '62bbce11-7bc2-4419-a651-75ebca976d75', 'ed8a675d-ff40-4b50-9466-ba44359f098a', 5000, 250, 4750, 'PAYE', '2025-10-08 10:28:27.138', '2025-10-08 10:32:16.585', 1, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `User`
--

CREATE TABLE `User` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('SUPER_ADMIN','ADMIN','CAISSIER','EMPLOYEE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'EMPLOYEE',
  `companyId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `User`
--

INSERT INTO `User` (`id`, `email`, `password`, `role`, `companyId`, `createdAt`, `updatedAt`) VALUES
('1b982baa-6006-4ad4-b1ac-cb0327185d3b', 'caisssierseneau@gmail.com', '$2b$10$Dvmv40AaghbqJBDrPoujR..1vSWjOniyyrJh50t1yarrbzr8M1oEi', 'CAISSIER', 'bf2ebec6-bd9f-4b6d-b395-5c930400b299', '2025-10-07 10:32:32.457', '2025-10-07 10:32:32.457'),
('684e5414-e042-426c-b657-123f47308d8b', 'Aly@breukh.com', '$2b$10$o3cEpeO9CpPHlZUIqK7NEuQy1g4gWMO8NHZQpSrgnPEaP7W7ssPHe', 'ADMIN', '72c01a1e-6dd9-4016-8562-d80321dcc98e', '2025-10-08 08:45:06.649', '2025-10-08 08:45:06.649'),
('7620d244-391b-47d2-8790-a95ccd9d75b3', 'caissier@test.com', '$2b$10$o7jSjfcUlKMRVgsjBwnSo.I/9VJ/nIrRBecVE1V8TI.M0iXgvHowO', 'CAISSIER', '3237e806-f630-4382-b1ae-c454b1333a00', '2025-10-07 00:18:46.569', '2025-10-07 00:18:46.569'),
('77971bb1-8a99-430c-811e-7e811847a361', 'fatouniang@gmail.com', '$2b$10$asZUY42HlUOkj65q2r/iBu51kYNj8immeo3K45OQHPCVn4qZJguGO', 'CAISSIER', '72c01a1e-6dd9-4016-8562-d80321dcc98e', '2025-10-08 08:57:58.710', '2025-10-08 08:57:58.710'),
('987a7363-2d7c-41b5-bcc1-b1066528acad', 'super@test.com', '$2b$10$paRwTxKwsNISxTaKPTEHTuaroKv/l6F.XSbUfkl.A.IKuqAViN0T6', 'SUPER_ADMIN', NULL, '2025-10-07 00:18:46.363', '2025-10-07 00:18:46.363'),
('e3e38358-9250-42c4-a621-e436ba8837ae', 'seneau@gmail.com', '$2b$10$PTx0Bwhukb/ZKGPHTc5UEeY.iQucWdoBekalrFWsvSf7WfrrCkWh6', 'ADMIN', 'bf2ebec6-bd9f-4b6d-b395-5c930400b299', '2025-10-07 10:05:41.619', '2025-10-07 10:05:41.619'),
('f8b5f3db-38fe-47ee-9ca3-af5a37cdbf50', 'sonatel@gmail.com', '$2b$10$4WVTRn2abGMncj9/zfg.ouEHuF1d1wvGBNSFXgbrBX4BePRhsgCKm', 'ADMIN', NULL, '2025-10-07 09:49:24.598', '2025-10-07 09:49:24.598');

-- --------------------------------------------------------

--
-- Structure de la table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('068f7836-1c80-453e-82f3-4714896d9af7', '285753b12898d2bdbaeebefab5bcc260237269761f36b95db42fe37ba7a53095', '2025-10-06 23:15:06.909', '20251006231505_add_fixed_employee_payment_option', NULL, NULL, '2025-10-06 23:15:06.012', 1),
('8baa6bad-427f-4c93-8664-325713e164da', '9fd0d8a4fee12bd63cc27bb0b5fb105fd61e40124d13142fce51663d854377be', '2025-10-07 09:57:39.727', '20251007095739_add_cascade_delete_to_employee', NULL, NULL, '2025-10-07 09:57:39.465', 1),
('e722550a-6ea5-47e9-9e2b-ccc3188c88a6', 'fc288689884f1901426691f82166ffbe95ba6915c319579297769356962b82bb', '2025-10-08 09:46:22.921', '20251008094622_add_days_hours_worked_to_payslip', NULL, NULL, '2025-10-08 09:46:22.860', 1);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `Attendance`
--
ALTER TABLE `Attendance`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Attendance_employeeId_date_key` (`employeeId`,`date`);

--
-- Index pour la table `Company`
--
ALTER TABLE `Company`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Company_name_key` (`name`);

--
-- Index pour la table `Employee`
--
ALTER TABLE `Employee`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Employee_email_key` (`email`),
  ADD KEY `Employee_companyId_fkey` (`companyId`);

--
-- Index pour la table `Payment`
--
ALTER TABLE `Payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Payment_payslipId_fkey` (`payslipId`);

--
-- Index pour la table `PayRun`
--
ALTER TABLE `PayRun`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `PayRun_companyId_period_key` (`companyId`,`period`);

--
-- Index pour la table `Payslip`
--
ALTER TABLE `Payslip`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Payslip_payRunId_fkey` (`payRunId`),
  ADD KEY `Payslip_employeeId_fkey` (`employeeId`);

--
-- Index pour la table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`),
  ADD KEY `User_companyId_fkey` (`companyId`);

--
-- Index pour la table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `Attendance`
--
ALTER TABLE `Attendance`
  ADD CONSTRAINT `Attendance_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `Employee`
--
ALTER TABLE `Employee`
  ADD CONSTRAINT `Employee_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Contraintes pour la table `Payment`
--
ALTER TABLE `Payment`
  ADD CONSTRAINT `Payment_payslipId_fkey` FOREIGN KEY (`payslipId`) REFERENCES `Payslip` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Contraintes pour la table `PayRun`
--
ALTER TABLE `PayRun`
  ADD CONSTRAINT `PayRun_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Contraintes pour la table `Payslip`
--
ALTER TABLE `Payslip`
  ADD CONSTRAINT `Payslip_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Payslip_payRunId_fkey` FOREIGN KEY (`payRunId`) REFERENCES `PayRun` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Contraintes pour la table `User`
--
ALTER TABLE `User`
  ADD CONSTRAINT `User_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
