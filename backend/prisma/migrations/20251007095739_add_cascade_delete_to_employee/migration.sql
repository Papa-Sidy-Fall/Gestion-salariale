-- DropForeignKey
ALTER TABLE `Attendance` DROP FOREIGN KEY `Attendance_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `Payslip` DROP FOREIGN KEY `Payslip_employeeId_fkey`;

-- DropIndex
DROP INDEX `Payslip_employeeId_fkey` ON `Payslip`;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payslip` ADD CONSTRAINT `Payslip_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
