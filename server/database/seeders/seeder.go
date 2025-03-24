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

	if err := SeedRoles(DB); err != nil {
		return err
	}

	if err := seedUsers(DB); err != nil {
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

	if err := seedProductReviews(DB); err != nil {
		return err
	}

	if err := seedAddresses(DB); err != nil {
		return err
	}

	if err := seedOrders(DB); err != nil {
		return err
	}

	return nil
}

func CleanTables(DB *gorm.DB) error {
	tables := []string{"product_reviews", "products", "product_categories", "product_images", "users"}

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
		{Name: "Keychron K6", Slug: "keychron-k6", Description: "The Keychron K6 is a wireless mechanical keyboard that combines compact 65% functionality with Bluetooth connectivity. Featuring RGB backlighting and a range of switch options, it's perfect for multitaskers and enthusiasts on the go.", Price: 69.99, Stock: 40, CategoryID: 1, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Keychron K8", Slug: "keychron-k8", Description: "With its compact 75% layout, the Keychron K8 offers a perfect balance of functionality and portability. This wireless mechanical keyboard supports multiple devices and is designed for both productivity and gaming.", Price: 79.99, Stock: 50, CategoryID: 1, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Varmilo VA108M", Slug: "varmilo-va108m", Description: "The Varmilo VA108M is a full-sized mechanical keyboard that blends beautiful craftsmanship with superior performance. Featuring customizable keycaps, it offers a personalized typing experience for professionals and enthusiasts alike.", Price: 160.00, Stock: 20, CategoryID: 1, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Ducky One 2 TKL", Slug: "ducky-one-2-tkl", Description: "A tenkeyless mechanical keyboard, the Ducky One 2 TKL combines functionality with compactness. With customizable RGB lighting and a robust design, it's perfect for gamers and typists looking to optimize their desk space.", Price: 109.00, Stock: 30, CategoryID: 1, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Vortex Model M SSK", Slug: "vortex-model-m-ssk", Description: "The Vortex Model M SSK is a compact version of the legendary IBM Model M keyboard. Featuring buckling spring switches, it delivers a tactile and nostalgic typing experience that mechanical keyboard enthusiasts adore.", Price: 180.00, Stock: 15, CategoryID: 1, CreatedAt: time.Now(), UpdatedAt: time.Now()},

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
		{Name: "MK 20 Bomb Keycap Keychain", Slug: "mk-20-bomb-keycap-keychain", Description: "The MK 20 Bomb Keycap Keychain is a fun and stylish accessory for keyboard enthusiasts. This detailed bomb-shaped keycap doubles as a keychain, making it the perfect gift for mechanical keyboard fans.", Price: 12.99, Stock: 100, CategoryID: 7, CreatedAt: time.Now(), UpdatedAt: time.Now()},

		// Lubricants & Tools
		{Name: "Krytox 205g0", Slug: "krytox-205g0", Description: "A premium lubricant, Krytox 205g0 is widely used for mechanical keyboard switches. It reduces friction and enhances the smoothness of your keystrokes, providing an optimal typing experience.", Price: 14.99, Stock: 100, CategoryID: 10, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Dielectric Grease", Slug: "dielectric-grease", Description: "Dielectric Grease is a versatile lubricant that minimizes stabilizer rattle. Perfect for customizing your keyboard, it ensures a smoother and quieter operation.", Price: 6.99, Stock: 200, CategoryID: 10, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Switch Puller", Slug: "switch-puller", Description: "The Switch Puller is an essential tool for safely removing switches from hot-swappable keyboards. Its ergonomic design makes it easy to use for enthusiasts and professionals alike.", Price: 7.99, Stock: 150, CategoryID: 10, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Keycap Puller", Slug: "keycap-puller", Description: "A must-have for keyboard enthusiasts, the Keycap Puller allows you to easily remove and replace keycaps without causing damage.", Price: 4.99, Stock: 300, CategoryID: 10, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Brush Set for Lubing", Slug: "brush-set-lubing", Description: "This Brush Set is designed for precise application of lubricant to mechanical keyboard switches. It ensures a clean and efficient lubing process for optimal results.", Price: 9.99, Stock: 100, CategoryID: 10, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Keychron 100 Max Edition Switch Tester", Slug: "keychron-100-max-switch-tester", Description: "The Keychron 100 Max Edition Switch Tester allows you to sample a wide variety of mechanical keyboard switches before committing to a full keyboard. Perfect for enthusiasts wanting to find their ideal switch type.", Price: 49.99, Stock: 30, CategoryID: 10, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Filco Keyboard Cleaning Brush", Slug: "filco-keyboard-cleaning-brush", Description: "The Filco Keyboard Cleaning Brush features soft bristles designed to safely remove dust and debris from between keycaps. An essential tool for maintaining your mechanical keyboard's performance and appearance.", Price: 8.99, Stock: 120, CategoryID: 10, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "MK Switch Tester Tube", Slug: "mk-switch-tester-tube", Description: "The MK Switch Tester Tube contains a carefully curated selection of popular mechanical switches in a compact, portable format. Perfect for beginners and enthusiasts alike to experience different switch feels.", Price: 24.99, Stock: 45, CategoryID: 10, CreatedAt: time.Now(), UpdatedAt: time.Now()},

		// Stabilizers
		{Name: "Durock Plate-Mounted Stabilizers", Slug: "durock-plate-mounted", Description: "The Durock Plate-Mounted Stabilizers offer smooth and rattle-free performance, enhancing the typing experience on your mechanical keyboard.", Price: 12.99, Stock: 80, CategoryID: 13, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Everglide Screw-In Stabilizers", Slug: "everglide-screw-in", Description: "Highly durable and stable, the Everglide Screw-In Stabilizers are a top choice for custom mechanical keyboards. They reduce wobble and improve overall stability.", Price: 15.99, Stock: 60, CategoryID: 13, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Cherry Clip-In Stabilizers", Slug: "cherry-clip-in", Description: "The Cherry Clip-In Stabilizers are reliable and easy to install. Designed for Cherry MX-compatible keyboards, they provide consistent and smooth performance.", Price: 9.99, Stock: 120, CategoryID: 13, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Cherry Genuine Plate Mount Stabilizers", Slug: "cherry-genuine-plate-mount", Description: "Cherry Genuine Plate Mount Stabilizers are the industry standard for quality and performance. These authentic stabilizers provide reliable, smooth operation with minimal rattle for an improved typing experience.", Price: 11.99, Stock: 100, CategoryID: 13, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Gateron Ink V2 Pro PCB Mount Screw-in Stabilizer Set", Slug: "gateron-ink-v2-pro-stabilizers", Description: "The Gateron Ink V2 Pro Stabilizers feature premium materials and precision engineering for a superior typing experience. These screw-in stabilizers minimize wobble and provide consistent performance for enthusiast builds.", Price: 18.99, Stock: 50, CategoryID: 13, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Gateron V2 Plate Mount Clip-in TKL Kit", Slug: "gateron-v2-plate-mount-kit", Description: "The Gateron V2 Plate Mount Stabilizer Kit includes everything needed for a tenkeyless keyboard. These clip-in stabilizers offer smooth action and easy installation for custom keyboard builders.", Price: 14.99, Stock: 65, CategoryID: 13, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "KBDfans Dyboox PCB Mount Screw-in Stabilizer Kit", Slug: "kbdfans-dyboox-screw-in-kit", Description: "The KBDfans Dyboox Stabilizer Kit features premium screw-in stabilizers designed for maximum stability and smooth operation. Perfect for custom keyboards where performance is essential.", Price: 16.99, Stock: 40, CategoryID: 13, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Maiz PCB Mount Clip-in Stabilizer TKL Kit", Slug: "maiz-clip-in-stabilizer-kit", Description: "The Maiz PCB Mount Stabilizers offer excellent performance at an affordable price. This complete TKL kit includes all stabilizers needed for a tenkeyless keyboard build with easy clip-in installation.", Price: 12.99, Stock: 70, CategoryID: 13, CreatedAt: time.Now(), UpdatedAt: time.Now()},

		// Keyboard Cases
		{Name: "Wooden Keyboard Case", Slug: "wooden-keyboard-case", Description: "Add a touch of elegance to your keyboard with this handcrafted Wooden Keyboard Case. Designed for 60% keyboards, it combines natural beauty with functionality.", Price: 59.99, Stock: 30, CategoryID: 11, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Acrylic Keyboard Case", Slug: "acrylic-keyboard-case", Description: "Showcase your custom PCB with this clear Acrylic Keyboard Case. Its durable construction ensures protection while highlighting the internal components of your keyboard.", Price: 49.99, Stock: 50, CategoryID: 11, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Aluminum Keyboard Case", Slug: "aluminum-keyboard-case", Description: "The Aluminum Keyboard Case offers superior durability and a sleek look. Perfect for custom builds, it provides excellent stability and heat dissipation.", Price: 79.99, Stock: 25, CategoryID: 11, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "KBDfans KBD75 Case", Slug: "kbdfans-kbd75-case", Description: "The KBDfans KBD75 Case is a premium 75% keyboard enclosure crafted from anodized aluminum. Its sophisticated design and excellent build quality make it ideal for custom keyboard enthusiasts.", Price: 89.99, Stock: 20, CategoryID: 11, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "KBDfans KBD67 Case", Slug: "kbdfans-kbd67-case", Description: "The KBDfans KBD67 Case is designed for 65% keyboards, offering a perfect balance between functionality and compactness. Its premium aluminum construction and chamfered edges provide both durability and style.", Price: 85.99, Stock: 18, CategoryID: 11, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "KBDfans Tofu65 65% Anodized Aluminum Case", Slug: "kbdfans-tofu65-case", Description: "The KBDfans Tofu65 is a premium 65% keyboard case crafted from anodized aluminum with a silver finish. Its sleek, minimalist design and solid construction make it a popular choice for custom mechanical keyboard builds.", Price: 95.99, Stock: 22, CategoryID: 11, CreatedAt: time.Now(), UpdatedAt: time.Now()},

		// Switches
		{Name: "Cherry MX2A Silent Red 45g Linear", Slug: "cherry-mx2a-silent-red", Description: "The Cherry MX2A Silent Red switches offer a smooth, linear keystroke with reduced noise. With a 45g actuation force, these switches are perfect for quiet environments where performance is still critical.", Price: 0.75, Stock: 1000, CategoryID: 2, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Cherry MX2A Blue 60g Clicky", Slug: "cherry-mx2a-blue", Description: "Cherry MX2A Blue switches provide a distinctive click sound and tactile feedback. With a 60g actuation force, these switches are ideal for typists who enjoy audible and tactile confirmation of keystrokes.", Price: 0.80, Stock: 800, CategoryID: 2, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Cherry MX2A Speed Silver 45g Linear", Slug: "cherry-mx2a-speed-silver", Description: "The Cherry MX2A Speed Silver switches feature a shorter actuation distance for faster response times. With a 45g actuation force and linear feel, they're perfect for gamers and fast typists.", Price: 0.85, Stock: 900, CategoryID: 2, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Gateron KS-3 Milky Yellow Pro 50g Linear", Slug: "gateron-ks3-milky-yellow-pro", Description: "Gateron KS-3 Milky Yellow Pro switches offer a smooth linear experience with a medium 50g actuation force. Their PCB mount design and milky housing make them a budget-friendly option for custom keyboards.", Price: 0.45, Stock: 1200, CategoryID: 2, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Cherry MX Green 80g Clicky", Slug: "cherry-mx-green", Description: "Cherry MX Green switches provide a firm tactile bump and audible click. With an 80g actuation force, these heavy switches are perfect for typists who prefer more resistance and definitive feedback.", Price: 0.90, Stock: 700, CategoryID: 2, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Cherry MX Silent Red 45g Linear", Slug: "cherry-mx-silent-red", Description: "Cherry MX Silent Red switches deliver a smooth, linear keystroke with significantly reduced noise. These 45g switches are ideal for office environments or late-night typing sessions.", Price: 0.95, Stock: 850, CategoryID: 2, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Keygeek Neo Oat 36g Linear PCB Mount", Slug: "keygeek-neo-oat", Description: "Keygeek Neo Oat switches feature an ultra-light 36g actuation force with a smooth linear feel. Their lightweight design makes them perfect for extended typing sessions with minimal finger fatigue.", Price: 0.60, Stock: 950, CategoryID: 2, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Durock T1 67g Tactile PCB Mount", Slug: "durock-t1", Description: "Durock T1 switches provide a pronounced tactile bump with a medium-heavy 67g actuation force. These PCB mount switches offer excellent feedback without the noise of clicky switches.", Price: 0.65, Stock: 800, CategoryID: 2, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Zeal PC Blue Zilents V2 Silent Tactile", Slug: "zeal-pc-blue-zilents-v2", Description: "Zeal PC Blue Zilents V2 switches combine tactile feedback with near-silent operation. These premium switches are perfect for users who want the feel of tactile switches without the noise.", Price: 1.20, Stock: 600, CategoryID: 2, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Gateron Beer 50g Tactile PCB Mount", Slug: "gateron-beer", Description: "Gateron Beer switches offer a unique tactile experience with a medium 50g actuation force. Their PCB mount design and distinctive feel make them a favorite among keyboard enthusiasts seeking something different.", Price: 0.70, Stock: 750, CategoryID: 2, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Custom Keylab Keyboard 60%", Slug: "keylab-custom-60", Description: "Compact customisable keyboard designed with personalised colour options", Price: 89.99, Stock: 100, CategoryID: 1, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Custom Keylab Keyboard 75%", Slug: "keylab-custom-75", Description: "A 75% keyboard designed with personalised colour options", Price: 99.99, Stock: 100, CategoryID: 1, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Custom Keylab Keyboard 100%", Slug: "keylab-custom-100", Description: "Full-sized ustomisable keyboard designed with personalised colour options", Price: 109.99, Stock: 100, CategoryID: 1, CreatedAt: time.Now(), UpdatedAt: time.Now()},
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
		{ProductID: 11, Image: "public/seed/vortex-model-m-ssk.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},

		// Images for Keycaps
		{ProductID: 12, Image: "public/seed/gmk-white-on-black.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 13, Image: "public/seed/ducky-pbt-keycaps.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 14, Image: "public/seed/tai-hao-rubber-keycaps.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 15, Image: "public/seed/varmilo-ec-ivy-keycaps.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 16, Image: "public/seed/ducky-frozen-llama-keycaps.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 17, Image: "public/seed/gmk-metropolis.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 18, Image: "public/seed/xda-canvas.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 19, Image: "public/seed/tai-hao-miami.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 20, Image: "public/seed/hyperx-pudding.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 21, Image: "public/seed/ducky-joker-keycaps.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 22, Image: "public/seed/mk-20-bomb-keycap-keychain.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},

		// Images for Lubricants & Tools
		{ProductID: 23, Image: "public/seed/krytox-205g0.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 24, Image: "public/seed/dielectric-grease.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 25, Image: "public/seed/switch-puller.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 26, Image: "public/seed/keycap-puller.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 27, Image: "public/seed/brush-set-lubing.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 28, Image: "public/seed/Keychron 100 Max Edition Switch Tester.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 29, Image: "public/seed/filco-keyboard-cleaning-brush.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 30, Image: "public/seed/mk-switch-tester-tube.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},

		// Images for Stabilizers
		{ProductID: 31, Image: "public/seed/durock-plate-mounted.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 32, Image: "public/seed/everglide-screw-in.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 33, Image: "public/seed/cherry-clip-in.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 34, Image: "public/seed/cherry-genuine-cherry-stabilizers-plate-mount.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 35, Image: "public/seed/gateron-ink-v2-pro-pcb-mount-screw-in-stabilizer-set.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 36, Image: "public/seed/gateron-v2-stabilizers-plate-mount-clip-in-tkl-kit.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 37, Image: "public/seed/kbdfans-dyboox-stabilizers-pcb-mount-screw-in-kit.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 38, Image: "public/seed/maiz-pcb-mount-clip-in-stabilizer-tkl-kit.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},

		// Images for Keyboard Cases
		{ProductID: 39, Image: "public/seed/wooden-keyboard-case.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 40, Image: "public/seed/acrylic-keyboard-case.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 41, Image: "public/seed/aluminum-keyboard-case.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 42, Image: "public/seed/kbdfans-kbd75-case.jpg", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 43, Image: "public/seed/KBDFans-kbd67-case.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 44, Image: "public/seed/kbdfans-tofu65-65-anodized-aluminum-case-silver.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},

		// Images for Switches
		{ProductID: 45, Image: "public/seed/cherry-mx2a-silent-red-45g-linear.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 46, Image: "public/seed/cherry-mx2a-blue-60g-clicky.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 47, Image: "public/seed/cherry-mx2a-speed-silver-45g-linear.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 48, Image: "public/seed/gateron-ks-3-milky-yellow-pro-50g-linear-pcb-mount.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 49, Image: "public/seed/cherry-mx-green-80g-clicky.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 50, Image: "public/seed/cherry-mx-silent-red-45g-linear.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 51, Image: "public/seed/keygeek-neo-oat-36g-linear-pcb-mount.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 52, Image: "public/seed/durock-t1-67g-tactile-pcb-mount-switch.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 53, Image: "public/seed/zeal-pc-blue-zilents-v2-silent-tactile.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 54, Image: "public/seed/gateron-beer-50g-tactile-pcb-mount.webp", PrimaryImage: true, CreatedAt: time.Now(), UpdatedAt: time.Now()},
	}

	if err := DB.Create(&productImages).Error; err != nil {
		return err
	}

	return nil
}

func SeedRoles(DB *gorm.DB) error {
	defaultRoles := []models.Role{
		{Name: "admin", CreatedAt: time.Now(), UpdatedAt: time.Now()},
	}

	for _, role := range defaultRoles {
		if err := DB.FirstOrCreate(&role, models.Role{Name: role.Name}).Error; err != nil {
			return err
		}
	}

	defaultPermissions := []models.Permission{
		// Category related permissions
		{Name: "categories:read", CreatedAt: time.Now()},
		{Name: "categories:create", CreatedAt: time.Now()},
		{Name: "categories:update", CreatedAt: time.Now()},
		{Name: "categories:delete", CreatedAt: time.Now()},

		// Product related permissions
		{Name: "products:read", CreatedAt: time.Now()},
		{Name: "products:create", CreatedAt: time.Now()},
		{Name: "products:update", CreatedAt: time.Now()},
		{Name: "products:delete", CreatedAt: time.Now()},
		{Name: "products:upload_image", CreatedAt: time.Now()},
		{Name: "products:delete_image", CreatedAt: time.Now()},

		// Admin dashboard permission
		{Name: "admin:dashboard", CreatedAt: time.Now()},
	}

	for _, permission := range defaultPermissions {
		if err := DB.FirstOrCreate(&permission, models.Permission{Name: permission.Name}).Error; err != nil {
			return err
		}
	}

	var adminRole models.Role
	if err := DB.Where("name = ?", "admin").First(&adminRole).Error; err != nil {
		return err
	}

	var permissions []models.Permission
	if err := DB.Find(&permissions).Error; err != nil {
		return err
	}

	for _, permission := range permissions {
		rolePermission := models.RolePermission{
			RoleID:       adminRole.ID,
			PermissionID: permission.ID,
		}
		if err := DB.FirstOrCreate(&rolePermission, models.RolePermission{RoleID: adminRole.ID, PermissionID: permission.ID}).Error; err != nil {
			return err
		}
	}

	return nil
}

func seedUsers(DB *gorm.DB) error {
	// for testing reviews
	users := []models.User{
		{Forename: "john", Surname: "doe", Email: "john@example.com", Password: "password123", RoleID: 1, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Forename: "jane", Surname: "smith", Email: "jane@example.com", Password: "password123", RoleID: 1, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Forename: "bob", Surname: "bobby", Email: "bob@example.com", Password: "password123", RoleID: 1, CreatedAt: time.Now(), UpdatedAt: time.Now()},
	}

	if err := DB.Create(&users).Error; err != nil {
		return err
	}

	return nil
}

func seedProductReviews(DB *gorm.DB) error {
	productReviews := []models.ProductReviews{
		{ProductID: 1, UserID: 1, Rating: 5, Comment: "Great keyboard, love the RGB lighting!", CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 1, UserID: 2, Rating: 4, Comment: "Compact and efficient, perfect for gaming.", CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 2, UserID: 1, Rating: 3, Comment: "The build quality is exceptional, typing feels smooth.", CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 2, UserID: 3, Rating: 4, Comment: "Beautiful keycaps, very comfortable to type on.", CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 3, UserID: 2, Rating: 5, Comment: "Simple and reliable, a pleasure to use.", CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ProductID: 4, UserID: 3, Rating: 5, Comment: "Topre switches are amazing, great for programming.", CreatedAt: time.Now(), UpdatedAt: time.Now()},
	}

	if err := DB.Create(&productReviews).Error; err != nil {
		return err
	}

	return nil
}

func seedAddresses(DB *gorm.DB) error {
	addresses := []models.Address{
		{UserID: 1, Street: "123 Main St", City: "Springfield", County: "IL", PostalCode: "62701", Country: "USA", Type: "billing", CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{UserID: 2, Street: "456 Elm St", City: "Springfield", County: "IL", PostalCode: "62701", Country: "USA", Type: "shipping", CreatedAt: time.Now(), UpdatedAt: time.Now()},
	}

	if err := DB.Create(&addresses).Error; err != nil {
		return err
	}

	return nil
}

func seedOrders(DB *gorm.DB) error {
	orders := []models.Order{
		{UserID: 1, Total: 200.00, Status: "delivered", ShippingAddressID: 1, BillingAddressID: 1, OrderDate: time.Now(), CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{UserID: 1, Total: 120.00, Status: "pending", ShippingAddressID: 1, BillingAddressID: 1, OrderDate: time.Now(), CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{UserID: 2, Total: 150.00, Status: "shipped", ShippingAddressID: 1, BillingAddressID: 1, OrderDate: time.Now(), CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{UserID: 3, Total: 100.00, Status: "delivered", ShippingAddressID: 1, BillingAddressID: 1, OrderDate: time.Now(), CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{UserID: 3, Total: 80.00, Status: "cancelled", ShippingAddressID: 1, BillingAddressID: 1, OrderDate: time.Now(), CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{UserID: 1, Total: 90.00, Status: "returned", ShippingAddressID: 1, BillingAddressID: 1, OrderDate: time.Now(), CreatedAt: time.Now(), UpdatedAt: time.Now()},
	}

	if err := DB.Create(&orders).Error; err != nil {
		return err
	}

	return nil
}
