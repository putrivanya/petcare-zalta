-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 18, 2026 at 04:44 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `petcare`
--

-- --------------------------------------------------------

--
-- Table structure for table `adoptions`
--

CREATE TABLE `adoptions` (
  `id` int NOT NULL,
  `name` varchar(150) NOT NULL,
  `animal` varchar(100) DEFAULT NULL,
  `breed` varchar(100) DEFAULT NULL,
  `age` varchar(100) DEFAULT NULL,
  `gender` varchar(50) DEFAULT NULL,
  `description` text,
  `status` varchar(50) DEFAULT 'Tersedia',
  `image` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `adoptions`
--

INSERT INTO `adoptions` (`id`, `name`, `animal`, `breed`, `age`, `gender`, `description`, `status`, `image`, `createdAt`, `updatedAt`) VALUES
(2, 'boy boy', 'Anjing', 'anggora', '1 tahun', 'Jantan', 'sangat jinak dan lucu', 'Tersedia', '/uploads/1788789302455-638081413.jpg', '2026-09-07 13:55:02', '2026-09-07 13:55:02'),
(3, 'moy moy', 'Kelinci', 'cantik', '1 tahun', 'Betina', 'imut lucu', 'Tersedia', '/uploads/1788789350969-965524505.webp', '2026-09-07 13:55:50', '2026-09-07 13:55:50'),
(4, 'kenan', 'Burung', 'kakak tua', '1 tahun', 'Jantan', 'gagah', 'Tersedia', '/uploads/1788789406404-231919650.jpg', '2026-09-07 13:56:46', '2026-09-07 13:56:46'),
(5, 'sicantik', 'Kucing', 'cantik', '1 tahun', 'Betina', 'cantik banget', 'Tersedia', '/uploads/1788789453493-134257869.png', '2026-09-07 13:57:33', '2026-09-07 13:57:33');

-- --------------------------------------------------------

--
-- Table structure for table `adoption_requests`
--

CREATE TABLE `adoption_requests` (
  `id` int NOT NULL,
  `animal_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `nama_lengkap` varchar(150) NOT NULL,
  `nomor_telepon` varchar(30) NOT NULL,
  `alamat` text NOT NULL,
  `alasan_adopsi` text NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `catatan_admin` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `adoption_requests`
--

INSERT INTO `adoption_requests` (`id`, `animal_id`, `user_id`, `nama_lengkap`, `nomor_telepon`, `alamat`, `alasan_adopsi`, `status`, `catatan_admin`, `created_at`, `updated_at`) VALUES
(4, 4, 11, 'vanya junita putri', '083190190938', 'balai rupih tanpuniak', 'karna pengen aja', 'approved', NULL, '2026-09-16 04:59:39', '2026-09-16 04:59:49');

-- --------------------------------------------------------

--
-- Table structure for table `animals`
--

CREATE TABLE `animals` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `icon` varchar(100) DEFAULT 'paw',
  `description` text,
  `image` text,
  `status` enum('aktif','nonaktif') DEFAULT 'aktif',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `animal_categories`
--

CREATE TABLE `animal_categories` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `image` longtext,
  `needs` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int NOT NULL,
  `userId` int NOT NULL,
  `customerName` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `service` varchar(255) NOT NULL,
  `itemId` int DEFAULT NULL,
  `itemName` varchar(255) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `price` decimal(15,2) DEFAULT '0.00',
  `quantity` int DEFAULT '1',
  `bookingDate` date NOT NULL,
  `booking_time` varchar(255) DEFAULT NULL,
  `notes` text,
  `status` enum('menunggu','waiting_payment','payment_review','paid','selesai','ditolak') DEFAULT 'menunggu',
  `paymentStatus` enum('belum_bayar','menunggu_konfirmasi','dibayar','ditolak') DEFAULT 'belum_bayar',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `consultations`
--

CREATE TABLE `consultations` (
  `id` int NOT NULL,
  `userId` int DEFAULT NULL,
  `userName` varchar(255) DEFAULT NULL,
  `userEmail` varchar(255) DEFAULT NULL,
  `userPhone` varchar(255) DEFAULT NULL,
  `doctorId` int DEFAULT NULL,
  `doctorName` varchar(255) DEFAULT NULL,
  `doctorSpecialization` varchar(255) DEFAULT NULL,
  `complaint` text,
  `reply` text,
  `status` varchar(255) DEFAULT 'menunggu',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `consultations`
--

INSERT INTO `consultations` (`id`, `userId`, `userName`, `userEmail`, `userPhone`, `doctorId`, `doctorName`, `doctorSpecialization`, `complaint`, `reply`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 11, 'vanya junita putri', 'anya@gmail.com', '083190190938', 3, 'raras', 'keperawatan hewan', '[Hewan: mochi]\n\nhsdjkhjdh', 'oh', 'dijawab', '2026-09-17 03:55:21', '2026-09-17 04:00:09');

-- --------------------------------------------------------

--
-- Table structure for table `doctors`
--

CREATE TABLE `doctors` (
  `id` int NOT NULL,
  `name` varchar(150) NOT NULL,
  `specialization` varchar(150) DEFAULT NULL,
  `description` text,
  `price` decimal(12,2) DEFAULT NULL,
  `schedule` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `doctors`
--

INSERT INTO `doctors` (`id`, `name`, `specialization`, `description`, `price`, `schedule`, `phone`, `image`, `createdAt`, `updatedAt`) VALUES
(1, 'monica', 'Spesialis Hewan Eksotis (Exotic Pets)', 'cantik ramah lucu', 0.00, '9.00-17.00', '083190190938', '/uploads/1788788873359-676265820.webp', '2026-09-07 13:47:53', '2026-09-07 13:47:53'),
(2, 'vanya', 'Spesialis Dermatologi:', 'cantik imut ramah sabar baik hati', 0.00, '9.00-17.00', '083190190938', '/uploads/1788789067478-959010662.jpeg', '2026-09-07 13:51:07', '2026-09-07 13:51:07'),
(3, 'raras', 'keperawatan hewan', 'cantik', 0.00, '9.00-17.00', '083190190938', '/uploads/1788789107382-933411195.webp', '2026-09-07 13:51:47', '2026-09-07 13:51:47');

-- --------------------------------------------------------

--
-- Table structure for table `grooming`
--

CREATE TABLE `grooming` (
  `id` int NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text,
  `price` decimal(12,2) DEFAULT NULL,
  `duration` varchar(100) DEFAULT NULL,
  `animal` varchar(100) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `grooming`
--

INSERT INTO `grooming` (`id`, `name`, `description`, `price`, `duration`, `animal`, `image`, `createdAt`, `updatedAt`) VALUES
(2, 'Zalta basic grooming', 'Layanan grooming dasar yang meliputi mandi, keramas, pengeringan, penyisiran bulu, dan pembersihan tubuh untuk membantu menjaga kebersihan hewan.', 50000.00, '1 jam', 'Anjing', '/uploads/1788789201366-227400691.jpg', '2026-09-07 13:53:21', '2026-09-08 13:04:25'),
(3, 'zalta premium grooming', 'Perawatan grooming lengkap dengan mandi, pengeringan, penyisiran, pemotongan kuku, pembersihan telinga, serta perawatan bulu agar hewan terlihat lebih bersih dan terawat.', 100000.00, '2 jam', 'Kucing', '/uploads/1788789254324-23309680.webp', '2026-09-07 13:54:14', '2026-09-07 13:54:14');

-- --------------------------------------------------------

--
-- Table structure for table `hotels`
--

CREATE TABLE `hotels` (
  `id` int NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text,
  `price` decimal(12,2) DEFAULT NULL,
  `capacity` varchar(100) DEFAULT NULL,
  `facilities` text,
  `animal` varchar(100) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `hotels`
--

INSERT INTO `hotels` (`id`, `name`, `description`, `price`, `capacity`, `facilities`, `animal`, `image`, `createdAt`, `updatedAt`) VALUES
(1, 'baju', 'dghasjhd', 100.00, '200px', 'bgaus', 'Anjing', '/uploads/1789608804820-974442567.png', '2026-09-17 01:33:24', '2026-09-17 01:33:24');

-- --------------------------------------------------------

--
-- Table structure for table `medical_records`
--

CREATE TABLE `medical_records` (
  `id` int NOT NULL,
  `petName` varchar(255) DEFAULT NULL,
  `petType` varchar(255) DEFAULT NULL,
  `ownerName` varchar(255) DEFAULT NULL,
  `ownerPhone` varchar(255) DEFAULT NULL,
  `ownerEmail` varchar(255) DEFAULT NULL,
  `doctorName` varchar(255) DEFAULT NULL,
  `visitDate` date DEFAULT NULL,
  `complaint` text,
  `diagnosis` text,
  `treatment` text,
  `notes` text,
  `image` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `medical_records`
--

INSERT INTO `medical_records` (`id`, `petName`, `petType`, `ownerName`, `ownerPhone`, `ownerEmail`, `doctorName`, `visitDate`, `complaint`, `diagnosis`, `treatment`, `notes`, `image`, `createdAt`, `updatedAt`) VALUES
(1, 'mochi', 'Anjing', 'vanya', '08319019038', '', 'laras', '2026-12-12', 'ntah', 'ntah', 'ntah', 'beli obat', '/uploads/medical-1789619740745-966587367.jpg', '2026-09-17 04:35:40', '2026-09-17 04:35:40');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int NOT NULL,
  `userId` int DEFAULT NULL,
  `bookingId` int DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `method` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `proof` longtext,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `name` varchar(150) NOT NULL,
  `category` varchar(100) NOT NULL,
  `animal` varchar(100) DEFAULT NULL,
  `description` text,
  `price` decimal(15,2) NOT NULL DEFAULT '0.00',
  `stock` int NOT NULL DEFAULT '0',
  `badge` varchar(50) DEFAULT NULL,
  `image` longtext
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `category`, `animal`, `description`, `price`, `stock`, `badge`, `image`) VALUES
(2, 'DoggyFit Adult Chicken', 'Makanan', 'Anjing', 'Makanan anjing dewasa dengan rasa ayam yang kaya protein untuk membantu menjaga energi, massa otot, dan kesehatan tubuh anjing', 20000.00, 5, '20000', '/uploads/1788786847882-2779113.jpg'),
(3, 'PawMeal Beef & Rice', 'Makanan', 'Anjing', 'Makanan anjing dengan perpaduan daging sapi dan nasi yang mudah dikonsumsi serta cocok untuk kebutuhan nutrisi harian.', 25000.00, 5, '25000', '/uploads/1788787058270-964952681.webp'),
(4, 'CaninePro Puppy Chicken', 'Makanan', 'Anjing', 'Formula khusus anak anjing dengan kandungan protein dan nutrisi yang mendukung pertumbuhan tulang, otot, serta perkembangan tubuh.', 30000.00, 3, '30000', '/uploads/1788787162805-48881888.jpg'),
(5, 'MeowDaily Tuna', 'Makanan', 'Kucing', 'Makanan kucing dengan rasa tuna yang lezat dan kandungan protein untuk membantu memenuhi kebutuhan nutrisi harian kucing', 20000.00, 5, '20000', '/uploads/1788787247694-10486602.webp'),
(6, 'CatPro Chicken Adult', 'Makanan', 'Kucing', 'Formula untuk kucing dewasa berbahan ayam dengan nutrisi seimbang untuk membantu menjaga energi dan massa otot.', 25000.00, 5, '25000', '/uploads/1788787337917-575192975.jpg'),
(7, 'KittyGrow Kitten', 'Makanan', 'Kucing', 'Makanan khusus anak kucing dengan nutrisi yang mendukung pertumbuhan, perkembangan tulang, dan pembentukan otot.', 30000.00, 5, '30000', '/uploads/1788787523723-240914250.webp'),
(8, 'RabbitGrow Pellet', 'Makanan', 'Kelinci', 'Pelet kelinci dengan nutrisi seimbang yang cocok untuk membantu memenuhi kebutuhan energi dan pertumbuhan kelinci', 30000.00, 5, '30000', '/uploads/1788787640455-78675521.jpg'),
(9, 'ChirpySeed Canary', 'Makanan', 'Burung', 'Pakan biji-bijian untuk burung kenari dengan nutrisi yang membantu menjaga energi dan kondisi tubuh.', 40000.00, 5, '40000', '/uploads/1788787710986-25874086.jpg'),
(10, 'petvita mltivitamin', 'Vitamin', 'Anjing', 'vitamin tamabahan yang di formulasikan untuk membantu menjaga energi ,kesehatan dan bulu', 50000.00, 5, '50000', '/uploads/1788787990015-282552672.png'),
(11, 'petvi', 'Vitamin', 'Kucing', 'vitamin tamabahan yang di formulasikan untuk membantu menjaga energi ,kesehatan dan bulu', 50000.00, 5, '50000', '/uploads/1788788036871-419452178.png'),
(12, 'paw bite', 'Treats', 'Anjing', 'cemilan rasa ayaman yang cocok untuk anjing sebagai cemilan tamabhan', 20000.00, 5, '20000', '/uploads/1788788192281-722895335.jpg'),
(13, 'mouw crunch', 'Treats', 'Kucing', 'cemilan kecil dengan rasa tuna', 20000.00, 5, '20000', '/uploads/1788788291832-590921779.png'),
(14, 'baju', 'Baju', 'Anjing', 'baju yang cocok digunakan untuk anjing ,memperlihatkan anjing lebih manis imut ', 100000.00, 5, '100000', '/uploads/1788788365765-210924309.png'),
(15, 'baju', 'Baju', 'Kucing', 'baju yang sangat cocok untuk kucing memperlihatkan kucing lebih imut ', 10000.00, 5, '100000', '/uploads/1788788434212-878283222.png'),
(16, 'PetHome Comfort Cage', 'Kandang', 'Anjing', 'vitamin tamabahan yang di formulasikan untuk membantu menjaga energi ,kesehatan dan bulu', 100000.00, 5, '100000', '/uploads/1788788564166-941573355.jpg'),
(17, 'PawHouse Premium', 'Kandang', 'Kucing', '\r\nKandang kokoh dengan desain modern yang cocok digunakan untuk kucing maupun anjing kecil sebagai tempat beristirahat.', 100000.00, 5, '100000', '/uploads/1788788642040-863226435.png'),
(18, 'PawBall Interactive', 'Mainan', 'Anjing', 'Bola mainan yang dapat digunakan untuk bermain lempar tangkap dan membantu membuat anjing tetap aktif', 30000.00, 5, '30000', '/uploads/1788788745528-696316476.webp'),
(19, 'MeowStick Feather Wand', 'Mainan', 'Kucing', 'Mainan berbentuk tongkat dengan hiasan bulu yang dapat digunakan untuk merangsang aktivitas bermain dan gerakan kucing.', 30000.00, 5, '30000', '/uploads/1788788824849-209554449.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int NOT NULL,
  `transactionId` int NOT NULL,
  `buyerKey` varchar(255) DEFAULT NULL,
  `userName` varchar(255) NOT NULL,
  `rating` int NOT NULL,
  `comment` text,
  `type` enum('product','store') NOT NULL DEFAULT 'product',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `transactionId`, `buyerKey`, `userName`, `rating`, `comment`, `type`, `createdAt`, `updatedAt`) VALUES
(6, 9, 'pipi@gmail.com', 'papi', 5, 'bagus banget', 'product', '2026-09-10 14:35:00', '2026-09-10 14:35:00'),
(7, 13, 'ima@gmail.com', 'yurma', 5, 'bagusss banget deh', 'product', '2026-09-10 14:47:32', '2026-09-10 14:47:32'),
(8, 17, 'rinmut@gmail.com', 'Rindu Rahmadani Imut Lucu Kiyowo', 5, 'baguss banget', 'product', '2026-09-16 00:38:58', '2026-09-16 00:38:58'),
(9, 18, 'anya@gmail.com', 'vanya junita putri', 5, 'bagus banget', 'product', '2026-09-16 04:57:06', '2026-09-16 04:57:06'),
(10, 21, 'anya@gmail.com', 'vanya junita putri', 5, NULL, 'store', '2026-09-17 03:29:14', '2026-09-17 03:29:14');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id_role` int NOT NULL,
  `nama_role` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id_role`, `nama_role`) VALUES
(1, 'admin'),
(2, 'pelanggan');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int NOT NULL,
  `items` text NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `address` text NOT NULL,
  `city` varchar(255) DEFAULT NULL,
  `postalCode` varchar(255) DEFAULT NULL,
  `phone` varchar(255) NOT NULL,
  `paymentMethod` varchar(255) DEFAULT 'COD',
  `notes` text,
  `status` enum('menunggu','dikemas','dikirim','selesai','ditolak','dibatalkan') DEFAULT 'menunggu',
  `paymentStatus` enum('belum_bayar','menunggu_verifikasi','dibayar') DEFAULT 'belum_bayar',
  `isReviewed` tinyint(1) DEFAULT '0',
  `userName` varchar(255) DEFAULT NULL,
  `userEmail` varchar(255) DEFAULT NULL,
  `userPhone` varchar(255) DEFAULT NULL,
  `itemName` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `date` varchar(255) DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `courier` varchar(255) DEFAULT '',
  `trackingNumber` varchar(255) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `items`, `total`, `address`, `city`, `postalCode`, `phone`, `paymentMethod`, `notes`, `status`, `paymentStatus`, `isReviewed`, `userName`, `userEmail`, `userPhone`, `itemName`, `type`, `date`, `time`, `quantity`, `price`, `createdAt`, `updatedAt`, `courier`, `trackingNumber`) VALUES
(14, '[{\"id\":14,\"name\":\"baju\",\"price\":100000,\"quantity\":1,\"image\":\"/uploads/1788788365765-210924309.png\",\"category\":\"Baju\"}]', 100000.00, 'pelosok', 'pyk', '12345', '6212345667890', 'COD', 'gjhgj', 'selesai', 'dibayar', 0, 'rindu', 'ndu@gmail.com', '6212345667890', 'baju', 'Produk', '2026-09-10', '18.35', 1, 100000.00, '2026-09-10 22:35:15', '2026-09-10 22:38:04', '', ''),
(24, '[{\"name\":\"baju\",\"itemName\":\"baju\",\"type\":\"hotel\",\"hotelId\":1,\"petName\":\"mochi\",\"petType\":\"Anjing\",\"checkIn\":\"2026-12-12\",\"checkOut\":\"2026-12-15\",\"quantity\":3,\"price\":100,\"subtotal\":300,\"notes\":\"sqhhha\"}]', 300.00, 'balai rupih tanpuniak', '', '', '083190190938', 'COD', 'sqhhha', 'menunggu', 'belum_bayar', 0, 'vanya junita putri', 'anya@gmail.com', '083190190938', 'baju', 'hotel', '2026-12-12', '10.35', 3, 100.00, '2026-09-17 03:35:37', '2026-09-17 03:35:37', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `nama` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `id_role` int NOT NULL,
  `alamat` text,
  `no_telpon` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nama`, `email`, `password`, `id_role`, `alamat`, `no_telpon`) VALUES
(3, 'rindu', 'ndu@gmail.com', '$2b$10$XwNLNGeO/VpzTZshPSC8JOjX2jC0IfLEXPwyTE1Sar.WE9/SLVlbW', 2, NULL, NULL),
(4, 'admin', 'adminpetcare@gmail.com', '$2b$10$uZyzRsqbK3ygxT5wwovBr.cMTKizcLv8wvG5gVgZr/PRKmzYLZ4Vm', 1, NULL, NULL),
(7, 'yurma', 'ima@gmail.com', '$2b$10$09JlzCP/IiOGfLH74ROBRupt.cYZoV9ncrxhAaU5egj9JwuiGg3pu', 2, 'balai rupih tampuniak, 40123', '081234567890'),
(9, 'akan', 'kan@gmail.com', '$2b$10$L033KhL9g3.zKbCGckobLOMo.b9UwI7Eji4KQbMnWizt91GKUOXD6', 2, 'pelosok banget', '012345667890'),
(10, 'Rindu Rahmadani Imut Lucu Kiyowo', 'rinmut@gmail.com', '$2b$10$srCsDdKo5X1D86pjNvjgNuw1N94K/8CdzMKwAbyk8uNEIU3Zp2GrW', 2, 'swiss haji rasul no 6', '0812345678'),
(11, 'vanya junita putri', 'anya@gmail.com', '$2b$10$fZjXJkBnplD82rYSPO9A2ux7VDcdziPnSBg529Yh5TCz5loVtIeIq', 2, 'balai rupih tanpuniak', '083190190938'),
(12, 'anyaaa cantik', 'nya@gmail.com', '$2b$10$DVnyz8IO13QlXZuAkEimDO7BNARcPxOcn9ZdDVjsR/iXNABSt30cq', 2, 'pelosok bangettttttttt', '012345667890');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `adoptions`
--
ALTER TABLE `adoptions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `adoption_requests`
--
ALTER TABLE `adoption_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `animals`
--
ALTER TABLE `animals`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `animal_categories`
--
ALTER TABLE `animal_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `consultations`
--
ALTER TABLE `consultations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `doctors`
--
ALTER TABLE `doctors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `grooming`
--
ALTER TABLE `grooming`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hotels`
--
ALTER TABLE `hotels`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `medical_records`
--
ALTER TABLE `medical_records`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_role`),
  ADD UNIQUE KEY `nama_role` (`nama_role`),
  ADD UNIQUE KEY `nama_role_2` (`nama_role`),
  ADD UNIQUE KEY `nama_role_3` (`nama_role`),
  ADD UNIQUE KEY `nama_role_4` (`nama_role`),
  ADD UNIQUE KEY `nama_role_5` (`nama_role`),
  ADD UNIQUE KEY `nama_role_6` (`nama_role`),
  ADD UNIQUE KEY `nama_role_7` (`nama_role`),
  ADD UNIQUE KEY `nama_role_8` (`nama_role`),
  ADD UNIQUE KEY `nama_role_9` (`nama_role`),
  ADD UNIQUE KEY `nama_role_10` (`nama_role`),
  ADD UNIQUE KEY `nama_role_11` (`nama_role`),
  ADD UNIQUE KEY `nama_role_12` (`nama_role`),
  ADD UNIQUE KEY `nama_role_13` (`nama_role`),
  ADD UNIQUE KEY `nama_role_14` (`nama_role`),
  ADD UNIQUE KEY `nama_role_15` (`nama_role`),
  ADD UNIQUE KEY `nama_role_16` (`nama_role`),
  ADD UNIQUE KEY `nama_role_17` (`nama_role`),
  ADD UNIQUE KEY `nama_role_18` (`nama_role`),
  ADD UNIQUE KEY `nama_role_19` (`nama_role`),
  ADD UNIQUE KEY `nama_role_20` (`nama_role`),
  ADD UNIQUE KEY `nama_role_21` (`nama_role`),
  ADD UNIQUE KEY `nama_role_22` (`nama_role`),
  ADD UNIQUE KEY `nama_role_23` (`nama_role`),
  ADD UNIQUE KEY `nama_role_24` (`nama_role`),
  ADD UNIQUE KEY `nama_role_25` (`nama_role`),
  ADD UNIQUE KEY `nama_role_26` (`nama_role`),
  ADD UNIQUE KEY `nama_role_27` (`nama_role`),
  ADD UNIQUE KEY `nama_role_28` (`nama_role`),
  ADD UNIQUE KEY `nama_role_29` (`nama_role`),
  ADD UNIQUE KEY `nama_role_30` (`nama_role`),
  ADD UNIQUE KEY `nama_role_31` (`nama_role`),
  ADD UNIQUE KEY `nama_role_32` (`nama_role`),
  ADD UNIQUE KEY `nama_role_33` (`nama_role`),
  ADD UNIQUE KEY `nama_role_34` (`nama_role`),
  ADD UNIQUE KEY `nama_role_35` (`nama_role`),
  ADD UNIQUE KEY `nama_role_36` (`nama_role`),
  ADD UNIQUE KEY `nama_role_37` (`nama_role`),
  ADD UNIQUE KEY `nama_role_38` (`nama_role`),
  ADD UNIQUE KEY `nama_role_39` (`nama_role`),
  ADD UNIQUE KEY `nama_role_40` (`nama_role`),
  ADD UNIQUE KEY `nama_role_41` (`nama_role`),
  ADD UNIQUE KEY `nama_role_42` (`nama_role`),
  ADD UNIQUE KEY `nama_role_43` (`nama_role`),
  ADD UNIQUE KEY `nama_role_44` (`nama_role`),
  ADD UNIQUE KEY `nama_role_45` (`nama_role`),
  ADD UNIQUE KEY `nama_role_46` (`nama_role`),
  ADD UNIQUE KEY `nama_role_47` (`nama_role`),
  ADD UNIQUE KEY `nama_role_48` (`nama_role`),
  ADD UNIQUE KEY `nama_role_49` (`nama_role`),
  ADD UNIQUE KEY `nama_role_50` (`nama_role`),
  ADD UNIQUE KEY `nama_role_51` (`nama_role`),
  ADD UNIQUE KEY `nama_role_52` (`nama_role`),
  ADD UNIQUE KEY `nama_role_53` (`nama_role`),
  ADD UNIQUE KEY `nama_role_54` (`nama_role`),
  ADD UNIQUE KEY `nama_role_55` (`nama_role`),
  ADD UNIQUE KEY `nama_role_56` (`nama_role`),
  ADD UNIQUE KEY `nama_role_57` (`nama_role`),
  ADD UNIQUE KEY `nama_role_58` (`nama_role`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `email_19` (`email`),
  ADD UNIQUE KEY `email_20` (`email`),
  ADD UNIQUE KEY `email_21` (`email`),
  ADD UNIQUE KEY `email_22` (`email`),
  ADD UNIQUE KEY `email_23` (`email`),
  ADD UNIQUE KEY `email_24` (`email`),
  ADD UNIQUE KEY `email_25` (`email`),
  ADD UNIQUE KEY `email_26` (`email`),
  ADD UNIQUE KEY `email_27` (`email`),
  ADD UNIQUE KEY `email_28` (`email`),
  ADD UNIQUE KEY `email_29` (`email`),
  ADD UNIQUE KEY `email_30` (`email`),
  ADD UNIQUE KEY `email_31` (`email`),
  ADD UNIQUE KEY `email_32` (`email`),
  ADD UNIQUE KEY `email_33` (`email`),
  ADD UNIQUE KEY `email_34` (`email`),
  ADD UNIQUE KEY `email_35` (`email`),
  ADD UNIQUE KEY `email_36` (`email`),
  ADD UNIQUE KEY `email_37` (`email`),
  ADD UNIQUE KEY `email_38` (`email`),
  ADD UNIQUE KEY `email_39` (`email`),
  ADD UNIQUE KEY `email_40` (`email`),
  ADD UNIQUE KEY `email_41` (`email`),
  ADD UNIQUE KEY `email_42` (`email`),
  ADD UNIQUE KEY `email_43` (`email`),
  ADD UNIQUE KEY `email_44` (`email`),
  ADD UNIQUE KEY `email_45` (`email`),
  ADD UNIQUE KEY `email_46` (`email`),
  ADD UNIQUE KEY `email_47` (`email`),
  ADD UNIQUE KEY `email_48` (`email`),
  ADD UNIQUE KEY `email_49` (`email`),
  ADD UNIQUE KEY `email_50` (`email`),
  ADD UNIQUE KEY `email_51` (`email`),
  ADD UNIQUE KEY `email_52` (`email`),
  ADD UNIQUE KEY `email_53` (`email`),
  ADD UNIQUE KEY `email_54` (`email`),
  ADD UNIQUE KEY `email_55` (`email`),
  ADD UNIQUE KEY `email_56` (`email`),
  ADD UNIQUE KEY `email_57` (`email`),
  ADD UNIQUE KEY `email_58` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `adoptions`
--
ALTER TABLE `adoptions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `adoption_requests`
--
ALTER TABLE `adoption_requests`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `animals`
--
ALTER TABLE `animals`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `animal_categories`
--
ALTER TABLE `animal_categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `consultations`
--
ALTER TABLE `consultations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `doctors`
--
ALTER TABLE `doctors`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `grooming`
--
ALTER TABLE `grooming`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `hotels`
--
ALTER TABLE `hotels`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `medical_records`
--
ALTER TABLE `medical_records`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id_role` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
