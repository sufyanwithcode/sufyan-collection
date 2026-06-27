require('dotenv').config();
const mongoose = require('mongoose');
const User     = require('../models/User');
const Category = require('../models/Category');
const Product  = require('../models/Product');

const URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sufyan_collection';

/* ─── Unsplash placeholder images (no auth needed) ─────────── */
const IMG = {
  menKurta:    'https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=600&q=80',
  linen:       'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80',
  lawn:        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',
  digitalPrint:'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80',
  sherwani:    'https://images.unsplash.com/photo-1614093302611-8efc4de9f941?w=600&q=80',
  waistcoat:   'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80',
  shalwar:     'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=600&q=80',
  polo:        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80',
  shawl:       'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600&q=80',
  khaddar:     'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
  dupatta:     'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  stole:       'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80',
  kids:        'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&q=80',
  abaya:       'https://images.unsplash.com/photo-1601924351433-c7e0a9bd46bc?w=600&q=80',
};

const seed = async () => {
  try {
    await mongoose.connect(URI);
    console.log('✅  Connected to MongoDB');

    await Promise.all([User.deleteMany(), Category.deleteMany(), Product.deleteMany()]);
    console.log('🗑️   Cleared existing data');

    /* ── Users ─────────────────────────────────────────────── */
    await User.create([
      { name:'Sufyan Admin',  email:'admin@sufyan-collection.com', password:'Admin@123', role:'admin',  phone:'+92-300-0000001' },
      { name:'Ali Hassan',    email:'ali@test.com',                password:'User@123',  role:'user',   phone:'+92-300-0000002' },
      { name:'Fatima Khan',   email:'fatima@test.com',             password:'User@123',  role:'user',   phone:'+92-300-0000003' },
    ]);
    console.log('👤  Users created');

    /* ── Categories ─────────────────────────────────────────── */
    const cats = await Category.insertMany([
      { name:'Men Kurta',        icon:'👔', order:1, description:'Premium stitched & unstitched kurtas for men',
        subcategories:[{name:'Stitched',slug:'stitched'},{name:'Unstitched',slug:'unstitched'},{name:'Embroidered',slug:'embroidered'}] },
      { name:'Women Lawn',       icon:'👗', order:2, description:'Elegant lawn suits for every occasion',
        subcategories:[{name:'2-Piece',slug:'2-piece'},{name:'3-Piece',slug:'3-piece'},{name:'Printed',slug:'printed'}] },
      { name:'Formal Wear',      icon:'🎩', order:3, description:'Sophisticated formal attire for weddings & events',
        subcategories:[{name:'Sherwani',slug:'sherwani'},{name:'Waistcoat Sets',slug:'waistcoat-sets'},{name:'Party Wear',slug:'party-wear'}] },
      { name:'Casual Wear',      icon:'👕', order:4, description:'Comfortable everyday essentials',
        subcategories:[{name:'T-Shirts',slug:'t-shirts'},{name:'Shalwar Kameez',slug:'shalwar-kameez'}] },
      { name:'Winter Collection',icon:'🧥', order:5, description:'Warm & stylish winter outfits',
        subcategories:[{name:'Shawls',slug:'shawls'},{name:'Khaddar',slug:'khaddar'},{name:'Wool',slug:'wool'}] },
      { name:'Accessories',      icon:'👜', order:6, description:'Complete your look with our accessories',
        subcategories:[{name:'Dupattas',slug:'dupattas'},{name:'Stoles',slug:'stoles'}] },
      { name:"Kids' Wear",       icon:'🧒', order:7, description:'Cute & comfortable outfits for children',
        subcategories:[{name:'Boys',slug:'boys'},{name:'Girls',slug:'girls'}] },
      { name:'Modest Wear',      icon:'🧕', order:8, description:'Elegant modest fashion for every occasion',
        subcategories:[{name:'Abayas',slug:'abayas'},{name:'Hijabs',slug:'hijabs'}] },
    ]);
    const C = {};
    cats.forEach(c => { C[c.name] = c._id; });
    console.log('📂  Categories created:', cats.length);

    /* ── Products ───────────────────────────────────────────── */
    const products = [
      /* MEN KURTA */
      { name:'Royal Embroidered Kurta',  price:3500,                   isFeatured:true,  isNewArrival:true,
        category:C['Men Kurta'],    subcategory:'Embroidered', stock:45,
        description:'Exquisitely hand-embroidered kurta crafted from premium cotton lawn. Delicate threadwork on collar and cuffs — perfect for Eid and festive occasions.',
        shortDescription:'Premium festive hand-embroidered kurta',
        fabric:'100% Cotton Lawn',
        care:['Dry clean only','Iron on low heat','Do not bleach'],
        tags:['kurta','embroidered','festive','eid'],
        images:[{url:IMG.menKurta, alt:'Royal Embroidered Kurta', isPrimary:true}],
        colors:[{name:'White',hex:'#FFFFFF',stock:15},{name:'Cream',hex:'#FFFDD0',stock:15},{name:'Sky Blue',hex:'#87CEEB',stock:15}],
        sizes:[{label:'S',stock:10},{label:'M',stock:15},{label:'L',stock:12},{label:'XL',stock:8}] },

      { name:'Classic Linen Kurta',      price:1800, salePrice:1500, onSale:true, isBestSeller:true,
        category:C['Men Kurta'],    subcategory:'Stitched', stock:80,
        description:'A timeless everyday kurta made from breathable linen fabric. Simple yet stylish — perfect for the office and casual outings.',
        shortDescription:'Breathable everyday linen kurta',
        fabric:'Pure Linen',
        care:['Machine washable','Warm iron'],
        tags:['kurta','linen','casual','office'],
        images:[{url:IMG.linen, alt:'Classic Linen Kurta', isPrimary:true}],
        colors:[{name:'Navy',hex:'#000080',stock:25},{name:'Grey',hex:'#808080',stock:30},{name:'Olive',hex:'#808000',stock:25}],
        sizes:[{label:'S',stock:15},{label:'M',stock:25},{label:'L',stock:25},{label:'XL',stock:15}] },

      { name:'Geometric Print Kurta',    price:2200, isNewArrival:true,
        category:C['Men Kurta'],    subcategory:'Stitched', stock:35,
        description:'Modern geometric-printed kurta with a contemporary cut. Perfect for the fashion-forward man who loves bold patterns.',
        shortDescription:'Modern geometric-patterned kurta',
        fabric:'Cotton Blend',
        care:['Machine wash cold','Do not tumble dry'],
        tags:['kurta','printed','modern'],
        images:[{url:IMG.menKurta, alt:'Geometric Kurta', isPrimary:true}],
        colors:[{name:'Teal',hex:'#008080',stock:20},{name:'Maroon',hex:'#800000',stock:15}],
        sizes:[{label:'M',stock:15},{label:'L',stock:12},{label:'XL',stock:8}] },

      { name:'Malmal Cotton Kurta',      price:1400, isBestSeller:true,
        category:C['Men Kurta'],    subcategory:'Unstitched', stock:100,
        description:'Ultra-soft malmal cotton unstitched kurta fabric. Lightweight and breathable — ideal for hot Pakistani summers.',
        shortDescription:'Lightweight summer malmal kurta fabric',
        fabric:'Malmal Cotton',
        care:['Hand wash','Dry in shade'],
        tags:['kurta','malmal','summer','unstitched'],
        images:[{url:IMG.linen, alt:'Malmal Kurta', isPrimary:true}],
        colors:[{name:'White',hex:'#FFFFFF',stock:40},{name:'Light Pink',hex:'#FFB6C1',stock:30},{name:'Mint',hex:'#98FF98',stock:30}],
        sizes:[{label:'2.5m',stock:50},{label:'3m',stock:50}] },

      /* WOMEN LAWN */
      { name:'Summer Bloom 3-Piece Lawn',price:4200, isFeatured:true, isBestSeller:true,
        category:C['Women Lawn'],   subcategory:'3-Piece', stock:60,
        description:'A stunning floral lawn suit featuring a printed shirt with complementary chiffon dupatta and dyed trouser. The perfect summer ensemble.',
        shortDescription:'Floral 3-piece summer lawn suit',
        fabric:'Premium Swiss Lawn',
        care:['Hand wash recommended','Do not wring','Dry in shade'],
        tags:['lawn','summer','floral','3-piece'],
        images:[{url:IMG.lawn, alt:'Summer Bloom Lawn', isPrimary:true}],
        colors:[{name:'Rose Pink',hex:'#FF66B2',stock:20},{name:'Sky Blue',hex:'#87CEEB',stock:20},{name:'Mint',hex:'#98FF98',stock:20}],
        sizes:[{label:'XS',stock:10},{label:'S',stock:15},{label:'M',stock:20},{label:'L',stock:15}] },

      { name:'Elegance Digital Print Lawn',price:3800, salePrice:3200, onSale:true, isNewArrival:true,
        category:C['Women Lawn'],   subcategory:'Printed', stock:50,
        description:'High-definition digital printed lawn featuring abstract art-inspired motifs. Includes printed shirt, dyed dupatta, and trouser fabric.',
        shortDescription:'HD digital art-inspired lawn suit',
        fabric:'Swiss Lawn',
        care:['Gentle machine wash','Cool iron'],
        tags:['lawn','digital','abstract'],
        images:[{url:IMG.digitalPrint, alt:'Digital Print Lawn', isPrimary:true}],
        colors:[{name:'Multi Colour',hex:'#FFD700',stock:50}],
        sizes:[{label:'S',stock:15},{label:'M',stock:20},{label:'L',stock:15}] },

      { name:'Classic Pastel 2-Piece',   price:2800, isBestSeller:true,
        category:C['Women Lawn'],   subcategory:'2-Piece', stock:70,
        description:'A minimalist 2-piece lawn suit in soft pastel tones. Versatile for both casual outings and semi-formal gatherings.',
        shortDescription:'Minimalist pastel 2-piece lawn suit',
        fabric:'Cotton Lawn',
        care:['Machine wash cold','Do not bleach'],
        tags:['lawn','pastel','minimalist','2-piece'],
        images:[{url:IMG.lawn, alt:'Pastel Lawn', isPrimary:true}],
        colors:[{name:'Lavender',hex:'#E6E6FA',stock:25},{name:'Peach',hex:'#FFCBA4',stock:25},{name:'Baby Blue',hex:'#89CFF0',stock:20}],
        sizes:[{label:'XS',stock:10},{label:'S',stock:20},{label:'M',stock:25},{label:'L',stock:15}] },

      { name:'Rangrez Printed 3-Piece',  price:5500, isFeatured:true,
        category:C['Women Lawn'],   subcategory:'3-Piece', stock:30,
        description:'An artistic rangrez-inspired print on premium lawn. Features a coordinated silk organza dupatta and embroidered border detail.',
        shortDescription:'Artistic rangrez print premium lawn',
        fabric:'Premium Lawn + Silk Organza Dupatta',
        care:['Dry clean recommended'],
        tags:['lawn','rangrez','premium'],
        images:[{url:IMG.digitalPrint, alt:'Rangrez Lawn', isPrimary:true}],
        colors:[{name:'Indigo Multi',hex:'#4B0082',stock:30}],
        sizes:[{label:'S',stock:8},{label:'M',stock:12},{label:'L',stock:10}] },

      /* FORMAL WEAR */
      { name:'Gold Zari Sherwani',       price:18000, isFeatured:true,
        category:C['Formal Wear'],  subcategory:'Sherwani', stock:15,
        description:'A majestic sherwani adorned with intricate gold zari embroidery, crafted from premium raw silk. The ultimate statement piece for weddings and grand celebrations.',
        shortDescription:'Luxury gold-embroidered wedding sherwani',
        fabric:'Raw Silk with Zari Work',
        care:['Dry clean only','Store in garment bag'],
        tags:['sherwani','wedding','gold','luxury'],
        images:[{url:IMG.sherwani, alt:'Gold Zari Sherwani', isPrimary:true}],
        colors:[{name:'Ivory Gold',hex:'#FFFFF0',stock:8},{name:'Royal Blue',hex:'#4169E1',stock:7}],
        sizes:[{label:'S',stock:3},{label:'M',stock:5},{label:'L',stock:4},{label:'XL',stock:3}] },

      { name:'Embroidered Waistcoat Set',price:8500, salePrice:7500, onSale:true, isFeatured:true,
        category:C['Formal Wear'],  subcategory:'Waistcoat Sets', stock:25,
        description:'A sophisticated waistcoat paired with matching kameez and shalwar. Subtle threadwork on collar and pockets adds elegance.',
        shortDescription:'Embroidered formal waistcoat 3-piece set',
        fabric:'Blended Fabric',
        care:['Dry clean only'],
        tags:['waistcoat','formal','party'],
        images:[{url:IMG.waistcoat, alt:'Waistcoat Set', isPrimary:true}],
        colors:[{name:'Charcoal',hex:'#36454F',stock:12},{name:'Burgundy',hex:'#800020',stock:13}],
        sizes:[{label:'S',stock:5},{label:'M',stock:8},{label:'L',stock:8},{label:'XL',stock:4}] },

      { name:'Velvet Groom Sherwani',    price:24000, isNewArrival:true,
        category:C['Formal Wear'],  subcategory:'Sherwani', stock:8,
        description:'A regal velvet sherwani with hand-stitched antique gold embroidery. Each piece is a masterwork of traditional Pakistani craftsmanship.',
        shortDescription:'Regal velvet hand-embroidered groom sherwani',
        fabric:'Velvet + Antique Gold Embroidery',
        care:['Dry clean only','Lay flat for storage'],
        tags:['sherwani','wedding','velvet','groom'],
        images:[{url:IMG.sherwani, alt:'Velvet Sherwani', isPrimary:true}],
        colors:[{name:'Midnight Blue',hex:'#191970',stock:4},{name:'Deep Maroon',hex:'#800000',stock:4}],
        sizes:[{label:'S',stock:2},{label:'M',stock:3},{label:'L',stock:2},{label:'XL',stock:1}] },

      /* CASUAL WEAR */
      { name:'Heritage Cotton Shalwar Kameez', price:1600, isBestSeller:true,
        category:C['Casual Wear'],  subcategory:'Shalwar Kameez', stock:120,
        description:'A comfortable everyday shalwar kameez made from breathable cotton. Classic cut with modern finishing.',
        shortDescription:'Classic everyday cotton shalwar kameez',
        fabric:'Pure Cotton',
        care:['Machine washable','Iron on medium heat'],
        tags:['shalwar','kameez','casual','daily'],
        images:[{url:IMG.shalwar, alt:'Cotton Shalwar Kameez', isPrimary:true}],
        colors:[{name:'White',hex:'#FFFFFF',stock:40},{name:'Sky Blue',hex:'#87CEEB',stock:40},{name:'Light Green',hex:'#90EE90',stock:40}],
        sizes:[{label:'S',stock:25},{label:'M',stock:35},{label:'L',stock:35},{label:'XL',stock:25}] },

      { name:'Capra Signature Polo',     price:1200, isNewArrival:true, isBestSeller:true,
        category:C['Casual Wear'],  subcategory:'T-Shirts', stock:200,
        description:'Premium polo shirt featuring the iconic Capra branding. Made from combed cotton for superior softness and durability.',
        shortDescription:'Iconic Capra signature polo shirt',
        fabric:'100% Combed Cotton',
        care:['Machine wash warm','Do not bleach'],
        tags:['polo','t-shirt','casual','capra'],
        images:[{url:IMG.polo, alt:'Capra Polo', isPrimary:true}],
        colors:[{name:'Black',hex:'#000000',stock:60},{name:'White',hex:'#FFFFFF',stock:60},{name:'Navy',hex:'#000080',stock:40},{name:'Red',hex:'#FF0000',stock:40}],
        sizes:[{label:'S',stock:40},{label:'M',stock:60},{label:'L',stock:60},{label:'XL',stock:40}] },

      { name:'Urban Fit Cargo Kameez',   price:1900, isNewArrival:true,
        category:C['Casual Wear'],  subcategory:'T-Shirts', stock:75,
        description:'A streetwear-inspired kameez with cargo-style pockets and a relaxed silhouette. Bridging tradition and contemporary fashion.',
        shortDescription:'Streetwear-inspired cargo pocket kameez',
        fabric:'Cotton Twill',
        care:['Machine wash','Tumble dry low'],
        tags:['kameez','urban','streetwear','modern'],
        images:[{url:IMG.shalwar, alt:'Urban Cargo Kameez', isPrimary:true}],
        colors:[{name:'Khaki',hex:'#C3B091',stock:30},{name:'Slate',hex:'#708090',stock:25},{name:'Olive',hex:'#808000',stock:20}],
        sizes:[{label:'S',stock:15},{label:'M',stock:25},{label:'L',stock:20},{label:'XL',stock:15}] },

      /* WINTER */
      { name:'Authentic Pashmina Shawl', price:6500, isFeatured:true,
        category:C['Winter Collection'], subcategory:'Shawls', stock:30,
        description:'Authentic pashmina hand-woven by artisans from the northern regions of Pakistan. Incredibly soft with intricate border patterns.',
        shortDescription:'Authentic hand-woven northern pashmina shawl',
        fabric:'Pure Pashmina',
        care:['Dry clean only','Store folded in cool place'],
        tags:['shawl','pashmina','winter','luxury'],
        images:[{url:IMG.shawl, alt:'Pashmina Shawl', isPrimary:true}],
        colors:[{name:'Camel',hex:'#C19A6B',stock:10},{name:'Charcoal',hex:'#36454F',stock:10},{name:'Burgundy',hex:'#800020',stock:10}],
        sizes:[{label:'Free Size',stock:30}] },

      { name:'Khaddar Winter Suit',      price:5200, salePrice:4500, onSale:true, isBestSeller:true,
        category:C['Winter Collection'], subcategory:'Khaddar', stock:40,
        description:'Thick and warm khaddar suit with minimal embroidery on neckline and cuffs. Includes coordinated trouser and shawl.',
        shortDescription:'Warm embroidered khaddar 3-piece winter suit',
        fabric:'Khaddar',
        care:['Hand wash cold','Dry flat','Iron on low heat'],
        tags:['khaddar','winter','warm'],
        images:[{url:IMG.khaddar, alt:'Khaddar Winter Suit', isPrimary:true}],
        colors:[{name:'Forest Green',hex:'#228B22',stock:15},{name:'Rust',hex:'#B7410E',stock:15},{name:'Teal',hex:'#008080',stock:10}],
        sizes:[{label:'S',stock:10},{label:'M',stock:15},{label:'L',stock:10},{label:'XL',stock:5}] },

      { name:'Wool Blend Waistcoat',     price:3200, isNewArrival:true,
        category:C['Winter Collection'], subcategory:'Wool', stock:35,
        description:'A sophisticated wool-blend waistcoat that layers beautifully over a kurta. Features classic herringbone pattern with warm lining.',
        shortDescription:'Classic herringbone wool-blend waistcoat',
        fabric:'Wool Blend',
        care:['Dry clean only'],
        tags:['waistcoat','wool','winter','formal'],
        images:[{url:IMG.waistcoat, alt:'Wool Waistcoat', isPrimary:true}],
        colors:[{name:'Brown Herringbone',hex:'#964B00',stock:15},{name:'Grey Herringbone',hex:'#808080',stock:20}],
        sizes:[{label:'S',stock:8},{label:'M',stock:12},{label:'L',stock:10},{label:'XL',stock:5}] },

      /* ACCESSORIES */
      { name:'Silk Chiffon Dupatta',     price:1800, isFeatured:true,
        category:C['Accessories'], subcategory:'Dupattas', stock:55,
        description:'A luxurious silk chiffon dupatta with hand-painted floral motifs along the border. The perfect finishing touch.',
        shortDescription:'Luxury silk chiffon floral dupatta',
        fabric:'Silk Chiffon',
        care:['Dry clean only','Handle with care'],
        tags:['dupatta','silk','chiffon'],
        images:[{url:IMG.dupatta, alt:'Silk Dupatta', isPrimary:true}],
        colors:[{name:'Ivory',hex:'#FFFFF0',stock:20},{name:'Blush',hex:'#FFB6C1',stock:20},{name:'Gold',hex:'#FFD700',stock:15}],
        sizes:[{label:'Free Size',stock:55}] },

      { name:'Embroidered Stole',        price:1200, salePrice:950, onSale:true,
        category:C['Accessories'], subcategory:'Stoles', stock:65,
        description:'A versatile embroidered stole that can be worn multiple ways. Geometric embroidery in contrasting thread on lightweight fabric.',
        shortDescription:'Versatile geometric embroidered stole',
        fabric:'Cotton Silk Blend',
        care:['Dry clean recommended'],
        tags:['stole','embroidered'],
        images:[{url:IMG.stole, alt:'Embroidered Stole', isPrimary:true}],
        colors:[{name:'Maroon Gold',hex:'#800000',stock:25},{name:'Navy Silver',hex:'#000080',stock:25},{name:'Black White',hex:'#000000',stock:15}],
        sizes:[{label:'Free Size',stock:65}] },

      /* KIDS */
      { name:"Kids' Eid Kurta Set",      price:2200, isNewArrival:true, isFeatured:true,
        category:C["Kids' Wear"],  subcategory:'Boys', stock:50,
        description:"An adorable embroidered kurta-shalwar set for boys. Soft fabric with minimal embroidery — perfect for Eid and festive family occasions.",
        shortDescription:"Embroidered boys' Eid kurta-shalwar set",
        fabric:'Soft Cotton',
        care:['Machine wash gentle','Warm iron'],
        tags:['kids','boys','eid','kurta'],
        images:[{url:IMG.kids, alt:"Kids Eid Kurta", isPrimary:true}],
        colors:[{name:'White',hex:'#FFFFFF',stock:20},{name:'Mint',hex:'#98FF98',stock:15},{name:'Peach',hex:'#FFCBA4',stock:15}],
        sizes:[{label:'2-3Y',stock:10},{label:'4-5Y',stock:15},{label:'6-7Y',stock:15},{label:'8-9Y',stock:10}] },

      { name:"Girls' Lawn Frock",        price:1800, isBestSeller:true,
        category:C["Kids' Wear"],  subcategory:'Girls', stock:40,
        description:"A pretty floral lawn frock for girls. Comfortable, breathable, and washable — designed for active little ones.",
        shortDescription:"Floral lawn frock for girls",
        fabric:'Kids Lawn',
        care:['Machine wash','Gentle cycle'],
        tags:['kids','girls','frock','lawn'],
        images:[{url:IMG.kids, alt:"Girls Lawn Frock", isPrimary:true}],
        colors:[{name:'Floral Pink',hex:'#FF66B2',stock:15},{name:'Floral Yellow',hex:'#FFD700',stock:15},{name:'Floral Blue',hex:'#87CEEB',stock:10}],
        sizes:[{label:'2-3Y',stock:8},{label:'4-5Y',stock:12},{label:'6-7Y',stock:12},{label:'8-9Y',stock:8}] },

      /* MODEST WEAR */
      { name:'Premium Abaya',            price:4500, isFeatured:true,
        category:C['Modest Wear'], subcategory:'Abayas', stock:30,
        description:'A flowing premium-quality abaya in luxurious crepe fabric. Minimalist design with subtle pearl button detailing on the cuffs.',
        shortDescription:'Flowing premium crepe abaya with pearl buttons',
        fabric:'Premium Crepe',
        care:['Hand wash cold','Hang to dry'],
        tags:['abaya','modest','elegant'],
        images:[{url:IMG.abaya, alt:'Premium Abaya', isPrimary:true}],
        colors:[{name:'Black',hex:'#000000',stock:15},{name:'Dark Navy',hex:'#003153',stock:10},{name:'Charcoal',hex:'#36454F',stock:5}],
        sizes:[{label:'S',stock:8},{label:'M',stock:10},{label:'L',stock:8},{label:'XL',stock:4}] },

      { name:'Chiffon Hijab Set (3-Pack)',price:900, salePrice:750, onSale:true, isBestSeller:true,
        category:C['Modest Wear'], subcategory:'Hijabs', stock:80,
        description:'A set of three high-quality chiffon hijabs in coordinating colours. Lightweight, breathable, and non-slip for all-day comfort.',
        shortDescription:'3-pack coordinating chiffon hijab set',
        fabric:'Premium Chiffon',
        care:['Hand wash','Hang to dry','Do not iron'],
        tags:['hijab','chiffon','modest','set'],
        images:[{url:IMG.dupatta, alt:'Chiffon Hijab Set', isPrimary:true}],
        colors:[{name:'Neutral Trio',hex:'#C3B091',stock:30},{name:'Pastel Trio',hex:'#FFB6C1',stock:30},{name:'Earth Trio',hex:'#808000',stock:20}],
        sizes:[{label:'Free Size',stock:80}] },
    ];

    await Product.insertMany(products);
    console.log('🛍️   Products created:', products.length);

    console.log('\n✅  Database seeded successfully!\n');
    console.log('── Login Credentials ────────────────────────────────');
    console.log('  Admin  →  admin@sufyan-collection.com  /  Admin@123');
    console.log('  User   →  ali@test.com                 /  User@123');
    console.log('─────────────────────────────────────────────────────\n');
    process.exit(0);
  } catch (err) {
    console.error('❌  Seed error:', err);
    process.exit(1);
  }
};

seed();
