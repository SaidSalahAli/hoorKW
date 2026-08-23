-- =============================================================
-- قاعدة بيانات: HoorKW - شركة الحور لنقل العفش والأثاث
-- الإصدار: 1.0.0
-- MySQL 8.0+ / MariaDB 10.6+
-- =============================================================

CREATE DATABASE IF NOT EXISTS `hoorkw`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `hoorkw`;

-- ----------------------------
-- جدول المستخدمين الإداريين
-- ----------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(120) NOT NULL,
  `email`      VARCHAR(180) NOT NULL UNIQUE,
  `password`   VARCHAR(255) NOT NULL,
  `role`       ENUM('admin','editor') NOT NULL DEFAULT 'editor',
  `status`     ENUM('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- مدير افتراضي: admin@hoorkw.com / Admin@123456
INSERT INTO `users` (`name`, `email`, `password`, `role`, `status`) VALUES
('مدير النظام', 'admin@hoorkw.com', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'active');
-- كلمة المرور: password (bcrypt hash للتجربة)

-- ----------------------------
-- جدول الخدمات
-- ----------------------------
CREATE TABLE IF NOT EXISTS `services` (
  `id`                INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title`             VARCHAR(200) NOT NULL,
  `slug`              VARCHAR(220) NOT NULL UNIQUE,
  `image`             VARCHAR(500) DEFAULT NULL,
  `short_description` VARCHAR(300) NOT NULL,
  `description`       LONGTEXT NOT NULL,
  `meta_title`        VARCHAR(70) DEFAULT NULL,
  `meta_description`  VARCHAR(170) DEFAULT NULL,
  `status`            ENUM('active','inactive','draft') NOT NULL DEFAULT 'active',
  `sort_order`        SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `created_at`        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_services_status` (`status`),
  KEY `idx_services_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- خدمات افتراضية
INSERT INTO `services` (`title`, `slug`, `short_description`, `description`, `meta_title`, `meta_description`, `status`, `sort_order`) VALUES
('نقل الأثاث المنزلي', 'naql-athath-manzili', 'خدمة نقل الأثاث المنزلي الكاملة بأحدث السيارات المقفلة في جميع مناطق الكويت.', 'نقدم خدمة شاملة لنقل جميع قطع الأثاث المنزلي من غرف النوم والمجالس والمطابخ والأجهزة الكهربائية. نستخدم أحدث سيارات النقل المقفلة المجهزة خصيصاً لحماية الأثاث من الصدمات والغبار أثناء النقل. يتضمن الفريق نجارين محترفين لفك وتركيب جميع أنواع غرف النوم.', 'نقل أثاث منزلي الكويت | الحور', 'خدمة نقل الأثاث المنزلي في الكويت بأمان واحترافية. سيارات مقفلة وعمالة مدربة وأسعار مناسبة.', 'active', 1),
('نقل الأثاث المكتبي', 'naql-athath-maktabi', 'نقل متخصص للمكاتب والشركات مع فريق فني مؤهل يضمن السلامة التامة للمعدات.', 'نتخصص في نقل الأثاث المكتبي والتجاري بكفاءة عالية وبأقل وقت توقف ممكن. نتعامل مع جميع أحجام المكاتب من الصغيرة إلى الكبيرة ونضمن إعادة تركيب كل شيء في المكان الجديد تماماً كما كان.', 'نقل أثاث مكتبي الكويت', 'نقل الأثاث المكتبي في الكويت بكفاءة عالية وبأقل تأخير. خبرة أكثر من 10 سنوات في خدمة الشركات.', 'active', 2),
('تغليف الأثاث والمقتنيات', 'taghlif-athath', 'خدمة تغليف احترافية لجميع قطع الأثاث والأجهزة والمقتنيات الثمينة لضمان سلامتها.', 'نقدم خدمة تغليف شاملة واحترافية باستخدام أفضل خامات التغليف العالمية: كرتون مضلع، رول بابلز، فوم واقي، بلاستيك استرتش، وأوراق تغليف خاصة. نغلف جميع أنواع الأثاث والأجهزة والتحف والمقتنيات الثمينة قبل النقل.', 'تغليف أثاث الكويت', 'خدمة تغليف أثاث احترافية في الكويت. مواد تغليف عالية الجودة لضمان سلامة جميع مقتنياتك.', 'active', 3),
('فك وتركيب الأثاث', 'fak-wa-tarkib', 'نجارون محترفون لفك وتركيب جميع أنواع الأثاث والغرف المجمعة بدقة متناهية.', 'يضم فريقنا نجارين محترفين متخصصين في فك وتركيب جميع أنواع الأثاث المجمع من غرف النوم والمطابخ والمكتبات. نتعامل مع جميع الماركات: ايكيا، ميداس، هوم سنتر، غرف صينية، سعودية، وطنية وغيرها.', 'فك وتركيب أثاث الكويت', 'نجارون محترفون لفك وتركيب جميع أنواع الأثاث في الكويت. خبرة في ايكيا وميداس وجميع الماركات.', 'active', 4),
('تخزين الأثاث', 'takhzin-athath', 'مستودعات آمنة ومكيفة لتخزين الأثاث والمقتنيات لأي مدة بأسعار تنافسية.', 'نوفر خدمة تخزين الأثاث في مستودعات حديثة مكيفة ومؤمنة على مدار الساعة. يمكنك تخزين أثاثك لأي مدة تريدها سواء أسابيع أو أشهر بأسعار تنافسية جداً. مستودعاتنا مجهزة بأنظمة مراقبة متطورة وإطفاء حريق آلي.', 'تخزين أثاث الكويت', 'خدمة تخزين الأثاث في الكويت في مستودعات مؤمنة ومكيفة. أسعار يومية وشهرية تنافسية.', 'active', 5),
('نقل البيانو والأجهزة الثقيلة', 'naql-piano-ajhiza-thaqila', 'نقل متخصص للبيانو والصوفا الكبيرة والخزائن الثقيلة بمعدات رفع احترافية.', 'نتخصص في نقل القطع الثقيلة التي تتطلب معدات وخبرة خاصة كالبيانو، الصوفا الكبيرة، الخزائن الحديدية، أجهزة الغسيل والثلاجات الكبيرة. نستخدم معدات رفع احترافية ورافعات هيدروليكية لضمان نقل آمن.', 'نقل بيانو وأجهزة ثقيلة الكويت', 'نقل البيانو والقطع الثقيلة بأمان في الكويت. معدات رفع احترافية وخبرة متخصصة.', 'active', 6);

-- ----------------------------
-- جدول المقالات والمدونة
-- ----------------------------
CREATE TABLE IF NOT EXISTS `articles` (
  `id`               INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title`            VARCHAR(250) NOT NULL,
  `slug`             VARCHAR(270) NOT NULL UNIQUE,
  `image`            VARCHAR(500) DEFAULT NULL,
  `excerpt`          VARCHAR(350) NOT NULL,
  `content`          LONGTEXT NOT NULL,
  `meta_title`       VARCHAR(70) DEFAULT NULL,
  `meta_description` VARCHAR(170) DEFAULT NULL,
  `views`            INT UNSIGNED NOT NULL DEFAULT 0,
  `status`           ENUM('published','draft','inactive') NOT NULL DEFAULT 'published',
  `published_at`     TIMESTAMP NULL DEFAULT NULL,
  `created_at`       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_articles_status` (`status`),
  KEY `idx_articles_slug` (`slug`),
  FULLTEXT KEY `ft_articles_search` (`title`, `excerpt`, `content`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- مقالات افتراضية
INSERT INTO `articles` (`title`, `slug`, `excerpt`, `content`, `meta_title`, `meta_description`, `status`, `published_at`, `views`) VALUES
('أفضل 10 نصائح لنقل عفشك بأمان في الكويت', 'afzal-nasaih-naql-afsh-kuwait', 'تعرف على أهم النصائح والخطوات العملية التي تضمن لك نقل أثاثك بسلامة تامة دون تعرضه لأي أضرار.', 'نقل الأثاث من منزل إلى آخر يعتبر من أكثر المهام التي تتطلب تخطيطاً دقيقاً وتنظيماً محكماً. في هذا المقال نقدم لك أهم النصائح والإرشادات التي تساعدك في الحصول على تجربة نقل ناجحة وخالية من المشكلات.

أولاً: التخطيط المبكر
ابدأ التخطيط لعملية النقل قبل أسبوعين على الأقل. قم بإعداد قائمة بجميع الأثاث والمقتنيات التي تريد نقلها، وحدد الأشياء التي يمكنك التخلص منها.

ثانياً: اختيار شركة موثوقة
اختر شركة نقل عفش معتمدة وذات سمعة جيدة في الكويت. تحقق من التقييمات والمراجعات على الإنترنت وتأكد من كفاءة وخبرة فريق العمل.

ثالثاً: التغليف الجيد
التغليف هو أهم خطوة في عملية النقل. استخدم مواد تغليف عالية الجودة مثل كرتون مضلع سميك لحماية الأجهزة الكهربائية، ورول بابلز لحماية المزهريات والتحف.', 'نصائح نقل عفش الكويت - دليلك الشامل', 'اقرأ أفضل النصائح لنقل العفش بأمان في الكويت. خطوات عملية من خبراء شركة الحور لنقل الأثاث.', 'published', NOW(), 245),
('كيف تختار أفضل شركة نقل عفش في الكويت؟', 'ikhtiyar-sharika-naql-afsh-kuwait', 'دليل شامل يساعدك على اختيار شركة نقل عفش موثوقة ومحترفة في الكويت بأفضل الأسعار.', 'مع وجود عشرات شركات نقل العفش في الكويت، يصبح اختيار الشركة المناسبة تحدياً كبيراً. إليك أهم المعايير التي يجب مراعاتها عند اختيار شركة نقل الأثاث.

أولاً: السمعة والتقييمات
ابحث عن تقييمات الشركة على جوجل وصفحاتها على وسائل التواصل الاجتماعي. اقرأ آراء العملاء السابقين وانتبه للتعليقات التفصيلية.

ثانياً: السعر والشفافية
احذر من الأسعار المبالغ فيها أو المنخفضة جداً. اطلب عرض سعر واضح ومفصل يشمل جميع الخدمات دون رسوم مخفية.

ثالثاً: حماية وسلامة العفش
تأكد من أن الشركة تتبع معايير حماية صارمة للمحافظة على الأثاث من أي خدوش أو تلفيات أثناء النقل.', 'كيف تختار شركة نقل عفش موثوقة في الكويت', 'دليلك لاختيار أفضل شركة نقل أثاث في الكويت. معايير الاختيار والتحقق من الموثوقية والأسعار.', 'published', NOW(), 189),
('أسعار نقل العفش في الكويت 2025 - الدليل الكامل', 'asaar-naql-afsh-kuwait-2025', 'تعرف على أسعار نقل العفش في مختلف مناطق الكويت وما يؤثر على تحديد تكلفة النقل.', 'تتفاوت أسعار نقل العفش في الكويت بحسب عدة عوامل أساسية. في هذا المقال نشرح بالتفصيل ما يحدد سعر النقل وكيف تحصل على أفضل صفقة.

العوامل المؤثرة على السعر:

1. حجم الأثاث: شقة غرفة واحدة تختلف عن فيلا من 5 غرف
2. المسافة: النقل داخل المنطقة أرخص من النقل بين المحافظات
3. الطابق: وجود أو غياب المصعد يؤثر كثيراً
4. الخدمات الإضافية: التغليف والفك والتركيب تضاف للسعر الأساسي

متوسط الأسعار في الكويت 2025:
- شقة غرفة وصالة: من 50 إلى 100 د.ك
- شقة 3 غرف: من 100 إلى 200 د.ك
- فيلا كاملة: من 300 إلى 600 د.ك', 'أسعار نقل عفش الكويت 2025 - دليل شامل', 'تعرف على أسعار نقل العفش في الكويت 2025. كم يكلف نقل الشقة والفيلا والمكتب؟', 'published', NOW(), 412);

-- ----------------------------
-- جدول معرض الصور
-- ----------------------------
CREATE TABLE IF NOT EXISTS `gallery` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title`      VARCHAR(200) NOT NULL,
  `image`      VARCHAR(500) NOT NULL,
  `sort_order` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- جدول آراء العملاء
-- ----------------------------
CREATE TABLE IF NOT EXISTS `testimonials` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(120) NOT NULL,
  `image`      VARCHAR(500) DEFAULT NULL,
  `job_title`  VARCHAR(150) NOT NULL,
  `comment`    TEXT NOT NULL,
  `rating`     TINYINT UNSIGNED NOT NULL DEFAULT 5 CHECK (`rating` BETWEEN 1 AND 5),
  `status`     ENUM('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_testimonials_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- آراء افتراضية
INSERT INTO `testimonials` (`name`, `job_title`, `comment`, `rating`, `status`) VALUES
('أحمد الكندري', 'مواطن - منطقة السالمية', 'شركة ممتازة جداً! نقلوا عفشي من الطابق الخامس دون أي مشكلة. الفريق كان محترم وسريع والأثاث وصل سليم 100%. أنصح الجميع بهم.', 5, 'active'),
('سارة العتيبي', 'ربة منزل - حولي', 'تجربة رائعة من البداية للنهاية. التواصل كان سريع والسعر مناسب جداً. غلفوا كل شيء بعناية خاصة الأواني والأجهزة. شكراً شركة الحور!', 5, 'active'),
('محمد الشمري', 'صاحب شركة - الفروانية', 'نقلنا مكتب الشركة كامل في يوم واحد! الفريق كان محترف ومنظم. أوصي بهم لجميع أصحاب الشركات الذين يريدون نقل سريع وآمن.', 5, 'active'),
('نورة الحربي', 'موظفة - الجهراء', 'خدمة ممتازة وأسعار معقولة. النجار فك وركب غرفة النوم بسرعة ودقة. الفريق كان نظيف ومنظم. راضية تماماً عن الخدمة.', 4, 'active'),
('خالد الرشيدي', 'مهندس - الأحمدي', 'أفضل شركة نقل عفش تعاملت معها في الكويت. محترفين ودقيقين في المواعيد والأسعار واضحة ومحددة من البداية. سأتعامل معهم دائماً.', 5, 'active'),
('فاطمة السبيعي', 'طبيبة - مشرف', 'نقلوا البيانو الخاص بي بعناية فائقة. كنت خائفة على البيانو لكن الفريق تعامل معه باحترافية عالية. شكراً جزيلاً لكم!', 5, 'active');

-- ----------------------------
-- جدول طلبات الخدمة
-- ----------------------------
CREATE TABLE IF NOT EXISTS `service_requests` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(150) NOT NULL,
  `phone`      VARCHAR(20) NOT NULL,
  `service_id` INT UNSIGNED DEFAULT NULL,
  `message`    TEXT NOT NULL,
  `status`     ENUM('new','contacted','completed','cancelled') NOT NULL DEFAULT 'new',
  `notes`      TEXT DEFAULT NULL COMMENT 'ملاحظات داخلية للموظفين',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_requests_status` (`status`),
  KEY `idx_requests_service` (`service_id`),
  CONSTRAINT `fk_requests_service` FOREIGN KEY (`service_id`)
    REFERENCES `services`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- طلبات تجريبية
INSERT INTO `service_requests` (`name`, `phone`, `service_id`, `message`, `status`) VALUES
('أبو فهد', '96550123456', 1, 'أريد نقل عفش شقة من السالمية إلى الجابرية. الشقة 3 غرف وصالة في الطابق الثالث يوجد مصعد.', 'new'),
('أم محمد', '96560987654', 3, 'أحتاج خدمة تغليف فقط قبل النقل للخارج. لدي تحف وأجهزة إلكترونية.', 'contacted'),
('الشركة العربية للتجارة', '96524567890', 2, 'نريد نقل مكتب شركة كامل في منطقة الشويخ إلى العارضية. المكتب يضم 15 موظف.', 'completed');

-- ----------------------------
-- جدول إعدادات الموقع
-- ----------------------------
CREATE TABLE IF NOT EXISTS `settings` (
  `id`              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `site_name`       VARCHAR(150) NOT NULL DEFAULT 'الحور لنقل العفش',
  `phone`           VARCHAR(25) NOT NULL DEFAULT '66091322',
  `whatsapp`        VARCHAR(25) NOT NULL DEFAULT '96566091322',
  `email`           VARCHAR(180) DEFAULT NULL,
  `address`         VARCHAR(300) DEFAULT NULL,
  `logo`            VARCHAR(500) DEFAULT NULL,
  `favicon`         VARCHAR(500) DEFAULT NULL,
  `seo_title`       VARCHAR(80) DEFAULT NULL,
  `seo_description` VARCHAR(180) DEFAULT NULL,
  `facebook`        VARCHAR(300) DEFAULT NULL,
  `instagram`       VARCHAR(300) DEFAULT NULL,
  `twitter`         VARCHAR(300) DEFAULT NULL,
  `youtube`         VARCHAR(300) DEFAULT NULL,
  `created_at`      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- إعدادات افتراضية
INSERT INTO `settings`
  (`site_name`, `phone`, `whatsapp`, `email`, `address`, `seo_title`, `seo_description`)
VALUES
  ('الحور لنقل العفش',
   '66091322',
   '96566091322',
   'info@hoorkw.com',
   'دولة الكويت - العاصمة',
   'الحور لنقل العفش | أفضل شركة نقل أثاث في الكويت',
   'شركة الحور لنقل العفش والأثاث في الكويت. خدمات نقل وتغليف وتخزين الأثاث بأفضل الأسعار وأعلى معايير الأمان.');

-- ----------------------------
-- جدول جلسات JWT (اختياري - للتوكنز المُبطلة)
-- ----------------------------
CREATE TABLE IF NOT EXISTS `revoked_tokens` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `token_jti`  VARCHAR(64) NOT NULL UNIQUE COMMENT 'JWT ID للتوكن المُبطل',
  `revoked_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_revoked_expires` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- ملاحظات قاعدة البيانات:
-- 1. كلمة المرور الافتراضية للمدير: password (يجب تغييرها فوراً)
-- 2. بعد الإنشاء شغّل: UPDATE users SET password = '$2y$12$hash...' WHERE email = 'admin@hoorkw.com';
-- 3. تأكد من إعطاء صلاحيات المستخدم:
--    CREATE USER 'hoorkw_user'@'localhost' IDENTIFIED BY 'StrongPassword123!';
--    GRANT ALL PRIVILEGES ON hoorkw.* TO 'hoorkw_user'@'localhost';
--    FLUSH PRIVILEGES;
-- ----------------------------
