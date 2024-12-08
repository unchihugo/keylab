package seeders

import (
	"keylab/database/models"
	"time"

	"gorm.io/gorm"
)

// Seeds all data into the database
func SeedAll(DB *gorm.DB) error {
	if err := CleanTables(DB); err != nil {
		return err
	}

	if err := seedProductCategories(DB); err != nil {
		return err
	}

	if err := seedProducts(DB); err != nil {
		return err
	}

	if err := seedProductImages(DB); err != nil {
		return err
	}

	return nil
}

func CleanTables(DB *gorm.DB) error {
	tables := []string{"products", "product_categories"}

	// Disable foreign key checks
	if err := DB.Exec("SET FOREIGN_KEY_CHECKS = 0").Error; err != nil {
		return err
	}

	for _, table := range tables {
		if err := DB.Exec("DELETE FROM " + table).Error; err != nil {
			return err
		}
		if err := DB.Exec("ALTER TABLE " + table + " AUTO_INCREMENT = 1").Error; err != nil {
			return err
		}
	}

	if err := DB.Exec("SET FOREIGN_KEY_CHECKS = 1").Error; err != nil {
		return err
	}

	return nil
}

func seedProductCategories(DB *gorm.DB) error {
	toPtr := func(i int64) *int64 {
		return &i
	}

	categories := []models.ProductCategory{
		{ParentID: nil, Name: "Keyboards", Slug: "keyboards", Description: "Find your next mechanical, ergonomic, or aesthetic keyboards here", CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ParentID: toPtr(1), Name: "Mechanical Keyboards", Slug: "mechanical-keyboards", Description: "Explore a wide range of mechanical keyboards for enthusiasts and professionals", CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ParentID: toPtr(1), Name: "Ergonomic Keyboards", Slug: "ergonomic-keyboards", Description: "Keyboards designed for comfort and long hours of typing", CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ParentID: toPtr(1), Name: "Wireless Keyboards", Slug: "wireless-keyboards", Description: "Discover convenient and clutter-free wireless keyboards", CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ParentID: toPtr(1), Name: "Gaming Keyboards", Slug: "gaming-keyboards", Description: "High-performance keyboards for gaming enthusiasts", CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ParentID: nil, Name: "Keycaps", Slug: "keycaps", Description: "Customize your keyboard with a variety of stylish keycaps", CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ParentID: nil, Name: "Switches", Slug: "switches", Description: "Find your next tactile, clicky, or linear switches here", CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ParentID: toPtr(7), Name: "Cherry MX Switches", Slug: "cherry-mx", Description: "A collection of popular Cherry MX switches", CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ParentID: nil, Name: "Lubricants & Tools", Slug: "lubricants-tools", Description: "Accessories for maintaining and customizing your keyboard switches", CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ParentID: nil, Name: "Keyboard Cases", Slug: "keyboard-cases", Description: "Protective and stylish cases for your keyboards", CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ParentID: nil, Name: "Keyboard PCBs", Slug: "keyboard-pcbs", Description: "Explore PCBs for building and customizing your own keyboard", CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ParentID: nil, Name: "Stabilizers", Slug: "stabilizers", Description: "Enhance the stability and feel of your keyboard", CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ParentID: nil, Name: "Keyboards Under $100", Slug: "keyboards-under-100", Description: "Affordable keyboard options without compromising quality", CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ParentID: nil, Name: "Premium Keyboards", Slug: "premium-keyboards", Description: "Luxury keyboards for the discerning enthusiast", CreatedAt: time.Now(), UpdatedAt: time.Now()},
	}

	for _, category := range categories {
		if err := DB.Create(&category).Error; err != nil {
			return err
		}
	}

	return nil
}

func seedProducts(DB *gorm.DB) error {
	products := []models.Product{
		// Keyboards
		{Name: "Ducky One 2 Mini", Slug: "ducky-one-2-mini", Description: "The Ducky One 2 Mini is a highly compact 60% mechanical keyboard, designed for those who prefer a minimalist setup. Featuring customizable RGB lighting, this keyboard delivers a clean and efficient typing experience, perfect for gamers and professionals alike.", Price: 99.00, Stock: 50, CategoryID: 1, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Leopold FC660M", Slug: "leopold-fc660m", Description: "A compact 65% mechanical keyboard, the Leopold FC660M is renowned for its exceptional build quality and smooth typing experience. Ideal for tight spaces and those who want functionality without the bulk of a full-sized keyboard.", Price: 120.00, Stock: 30, CategoryID: 1, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Varmilo VA87M", Slug: "varmilo-va87m", Description: "The Varmilo VA87M is a tenkeyless mechanical keyboard that combines premium build quality with a stunning aesthetic. Equipped with dye-sublimated PBT keycaps, this keyboard is designed to last while delivering a luxurious typing experience.", Price: 150.00, Stock: 20, CategoryID: 1, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Filco Majestouch 2", Slug: "filco-majestouch-2", Description: "A timeless classic, the Filco Majestouch 2 is a full-sized mechanical keyboard that offers unmatched reliability and simplicity. Its durable design and responsive key switches make it a favorite for both office and home use.", Price: 140.00, Stock: 25, CategoryID: 1, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "HHKB Professional Hybrid", Slug: "hhkb-professional-hybrid", Description: "The HHKB Professional Hybrid features Topre electrocapacitive switches for an unparalleled typing experience. This compact keyboard is a favorite among programmers and professionals who value precision and efficiency.", Price: 240.00, Stock: 15, CategoryID: 1, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Ducky One 3 Daybreak", Slug: "ducky-one-3-daybreak", Description: "The Ducky One 3 Daybreak is a full-sized mechanical keyboard offering hot-swappable switches and vibrant RGB lighting. Its high-quality construction ensures durability, while its sleek design fits seamlessly into any setup.", Price: 129.00, Stock: 20, CategoryID: 1, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Keychron K6", Slug: "keychron-k6", Description: "The Keychron K6 is a wireless mechanical keyboard that combines compact 65% functionality with Bluetooth connectivity. Featuring RGB backlighting and a range of switch options, it’s perfect for multitaskers and enthusiasts on the go.", Price: 69.99, Stock: 40, CategoryID: 1, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Keychron K8", Slug: "keychron-k8", Description: "With its compact 75% layout, the Keychron K8 offers a perfect balance of functionality and portability. This wireless mechanical keyboard supports multiple devices and is designed for both productivity and gaming.", Price: 79.99, Stock: 50, CategoryID: 1, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Varmilo VA108M", Slug: "varmilo-va108m", Description: "The Varmilo VA108M is a full-sized mechanical keyboard that blends beautiful craftsmanship with superior performance. Featuring customizable keycaps, it offers a personalized typing experience for professionals and enthusiasts alike.", Price: 160.00, Stock: 20, CategoryID: 1, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Ducky One 2 TKL", Slug: "ducky-one-2-tkl", Description: "A tenkeyless mechanical keyboard, the Ducky One 2 TKL combines functionality with compactness. With customizable RGB lighting and a robust design, it’s perfect for gamers and typists looking to optimize their desk space.", Price: 109.00, Stock: 30, CategoryID: 1, CreatedAt: time.Now(), UpdatedAt: time.Now()},

		// Keycaps
		{Name: "GMK White-on-Black", Slug: "gmk-white-on-black", Description: "A classic design, the GMK White-on-Black keycap set features high-quality ABS plastic and double-shot legends for durability. Its timeless look complements any keyboard setup.", Price: 110.00, Stock: 40, CategoryID: 7, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Ducky PBT Seamless Double-Shot Keycaps", Slug: "ducky-pbt-keycaps", Description: "The Ducky PBT Seamless Double-Shot Keycaps offer enhanced durability and a premium feel. Their double-shot construction ensures the legends never fade, making them a long-lasting upgrade for any keyboard.", Price: 50.00, Stock: 60, CategoryID: 7, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Tai-Hao Rubber Gaming Keycaps", Slug: "tai-hao-rubber-keycaps", Description: "Designed for enhanced grip and durability, the Tai-Hao Rubber Gaming Keycaps are perfect for gamers. Their textured surface ensures precision during intense gaming sessions.", Price: 20.00, Stock: 70, CategoryID: 7, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Varmilo EC Ivy Keycap Set", Slug: "varmilo-ec-ivy-keycaps", Description: "Featuring a delicate ivy design, the Varmilo EC Ivy Keycap Set is both stylish and durable. Made from PBT plastic, these keycaps are resistant to wear and provide a unique aesthetic to your keyboard.", Price: 80.00, Stock: 30, CategoryID: 7, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Ducky Frozen Llama Keycap Set", Slug: "ducky-frozen-llama-keycaps", Description: "The Ducky Frozen Llama Keycap Set offers a unique and vibrant design, perfect for enthusiasts looking to make their keyboard stand out. Made from durable PBT plastic, these keycaps are built to last.", Price: 90.00, Stock: 20, CategoryID: 7, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "GMK Metropolis", Slug: "gmk-metropolis", Description: "Inspired by cityscapes, the GMK Metropolis keycap set features bold colors and premium ABS construction. Its design adds a touch of urban sophistication to any keyboard.", Price: 129.99, Stock: 15, CategoryID: 7, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "XDA Canvas Keycaps", Slug: "xda-canvas", Description: "The XDA Canvas Keycaps offer a minimalist and artistic design. Created by MiTo, this set features a flat profile and is perfect for those who want a clean and elegant keyboard aesthetic.", Price: 89.99, Stock: 20, CategoryID: 7, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Tai-Hao Miami Keycaps", Slug: "tai-hao-miami", Description: "Bright and playful, the Tai-Hao Miami Keycaps bring vibrant colors inspired by Miami sunsets. Made from ABS plastic, these keycaps are both durable and eye-catching.", Price: 39.99, Stock: 60, CategoryID: 7, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "HyperX Pudding Keycaps", Slug: "hyperx-pudding", Description: "The HyperX Pudding Keycaps feature a translucent design that enhances RGB lighting. Perfect for gamers and enthusiasts, these keycaps are both functional and stylish.", Price: 24.99, Stock: 70, CategoryID: 7, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Ducky Joker Keycap Set", Slug: "ducky-joker-keycaps", Description: "The Ducky Joker Keycap Set combines vibrant colors with a bold design, making it a striking addition to any keyboard. Made from durable PBT plastic, these keycaps offer both style and longevity.", Price: 79.00, Stock: 25, CategoryID: 7, CreatedAt: time.Now(), UpdatedAt: time.Now()},

		// Lubricants & Tools
		{Name: "Krytox 205g0", Slug: "krytox-205g0", Description: "A premium lubricant, Krytox 205g0 is widely used for mechanical keyboard switches. It reduces friction and enhances the smoothness of your keystrokes, providing an optimal typing experience.", Price: 14.99, Stock: 100, CategoryID: 10, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Dielectric Grease", Slug: "dielectric-grease", Description: "Dielectric Grease is a versatile lubricant that minimizes stabilizer rattle. Perfect for customizing your keyboard, it ensures a smoother and quieter operation.", Price: 6.99, Stock: 200, CategoryID: 10, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Switch Puller", Slug: "switch-puller", Description: "The Switch Puller is an essential tool for safely removing switches from hot-swappable keyboards. Its ergonomic design makes it easy to use for enthusiasts and professionals alike.", Price: 7.99, Stock: 150, CategoryID: 10, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Keycap Puller", Slug: "keycap-puller", Description: "A must-have for keyboard enthusiasts, the Keycap Puller allows you to easily remove and replace keycaps without causing damage.", Price: 4.99, Stock: 300, CategoryID: 10, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Brush Set for Lubing", Slug: "brush-set-lubing", Description: "This Brush Set is designed for precise application of lubricant to mechanical keyboard switches. It ensures a clean and efficient lubing process for optimal results.", Price: 9.99, Stock: 100, CategoryID: 10, CreatedAt: time.Now(), UpdatedAt: time.Now()},

		// Stabilizers
		{Name: "Durock Plate-Mounted Stabilizers", Slug: "durock-plate-mounted", Description: "The Durock Plate-Mounted Stabilizers offer smooth and rattle-free performance, enhancing the typing experience on your mechanical keyboard.", Price: 12.99, Stock: 80, CategoryID: 13, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Everglide Screw-In Stabilizers", Slug: "everglide-screw-in", Description: "Highly durable and stable, the Everglide Screw-In Stabilizers are a top choice for custom mechanical keyboards. They reduce wobble and improve overall stability.", Price: 15.99, Stock: 60, CategoryID: 13, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Cherry Clip-In Stabilizers", Slug: "cherry-clip-in", Description: "The Cherry Clip-In Stabilizers are reliable and easy to install. Designed for Cherry MX-compatible keyboards, they provide consistent and smooth performance.", Price: 9.99, Stock: 120, CategoryID: 13, CreatedAt: time.Now(), UpdatedAt: time.Now()},

		// Keyboard Cases
		{Name: "Wooden Keyboard Case", Slug: "wooden-keyboard-case", Description: "Add a touch of elegance to your keyboard with this handcrafted Wooden Keyboard Case. Designed for 60% keyboards, it combines natural beauty with functionality.", Price: 59.99, Stock: 30, CategoryID: 11, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Acrylic Keyboard Case", Slug: "acrylic-keyboard-case", Description: "Showcase your custom PCB with this clear Acrylic Keyboard Case. Its durable construction ensures protection while highlighting the internal components of your keyboard.", Price: 49.99, Stock: 50, CategoryID: 11, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Aluminum Keyboard Case", Slug: "aluminum-keyboard-case", Description: "The Aluminum Keyboard Case offers superior durability and a sleek look. Perfect for custom builds, it provides excellent stability and heat dissipation.", Price: 79.99, Stock: 25, CategoryID: 11, CreatedAt: time.Now(), UpdatedAt: time.Now()},
	}

	if err := DB.Create(&products).Error; err != nil {
		return err
	}

	return nil
}

func seedProductImages(DB *gorm.DB) error {
	productImages := []models.ProductImage{
		// Images for Keyboards
		{ProductID: 1, Image: "public/seed/ducky-one-2-mini.jpg", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 2, Image: "public/seed/leopold-fc660m.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 3, Image: "public/seed/varmilo-va87m.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 4, Image: "public/seed/filco-majestouch-2.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 5, Image: "public/seed/hhkb-professional-hybrid.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 6, Image: "public/seed/ducky-one-3-daybreak.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 7, Image: "public/seed/keychron-k6.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 8, Image: "public/seed/keychron-k8.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 9, Image: "public/seed/varmilo-va108m.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 10, Image: "public/seed/ducky-one-2-tkl.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},

		// Images for Keycaps
		{ProductID: 11, Image: "public/seed/gmk-white-on-black.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 12, Image: "public/seed/ducky-pbt-keycaps.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 13, Image: "public/seed/tai-hao-rubber-keycaps.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 14, Image: "public/seed/varmilo-ec-ivy-keycaps.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 15, Image: "public/seed/ducky-frozen-llama-keycaps.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 16, Image: "public/seed/gmk-metropolis.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 17, Image: "public/seed/xda-canvas.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 18, Image: "public/seed/tai-hao-miami.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 19, Image: "public/seed/hyperx-pudding.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 20, Image: "public/seed/ducky-joker-keycaps.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},

		// Images for Lubricants & Tools
		{ProductID: 21, Image: "public/seed/krytox-205g0.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 22, Image: "public/seed/dielectric-grease.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 23, Image: "public/seed/switch-puller.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 24, Image: "public/seed/keycap-puller.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 25, Image: "public/seed/brush-set-lubing.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},

		// Images for Stabilizers
		{ProductID: 26, Image: "public/seed/durock-plate-mounted-stabilizers.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 27, Image: "public/seed/everglide-screw-in-stabilizers.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 28, Image: "public/seed/cherry-clip-in-stabilizers.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},

		// Images for Keyboard Cases
		{ProductID: 29, Image: "public/seed/wooden-keyboard-case.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 30, Image: "public/seed/acrylic-keyboard-case.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 31, Image: "public/seed/aluminum-keyboard-case.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
	}

	if err := DB.Create(&productImages).Error; err != nil {
		return err
	}

	return nil
}
