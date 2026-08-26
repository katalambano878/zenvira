-- Seed Sika Homes furniture catalog (idempotent by slug).
-- Images: Unsplash lifestyle furniture photos.

INSERT INTO public.categories (name, slug, description, status, position, metadata)
VALUES
  ('Sofas', 'sofas', 'Lounge seating and sofa sets for living spaces.', 'active', 10, '{"featured": true}'::jsonb),
  ('Living Room', 'living-room', 'Tables, storage and accents for the living room.', 'active', 20, '{"featured": true}'::jsonb),
  ('Bedroom', 'bedroom', 'Beds, mattresses and bedroom furniture.', 'active', 30, '{"featured": true}'::jsonb),
  ('Dining', 'dining', 'Dining tables, chairs and sets.', 'active', 40, '{"featured": true}'::jsonb),
  ('Kitchen', 'kitchen', 'Kitchen furniture and practical home goods.', 'active', 50, '{"featured": true}'::jsonb),
  ('Décor', 'decor', 'Finishing touches, lighting accents and décor.', 'active', 60, '{"featured": true}'::jsonb),
  ('Office', 'office', 'Desks, work chairs and office storage.', 'active', 70, '{"featured": false}'::jsonb),
  ('Outdoor', 'outdoor', 'Patio and garden furniture.', 'active', 80, '{"featured": false}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  position = EXCLUDED.position,
  updated_at = now();

WITH catalog (slug, name, short_description, description, price, compare_at_price, sale_price, sku, quantity, category_slug, featured, tags, image_url) AS (
  VALUES
  (
    'accra-linen-3-seater-sofa',
    'Accra Linen 3-Seater Sofa',
    'Soft linen sofa with deep cushions for everyday living.',
    'A generous 3-seater in warm linen-look fabric, built for Ghana living rooms. Sturdy hardwood frame, removable cushion covers, and a clean silhouette that pairs with wood or marble tables.',
    4200.00, 4800.00, 4200.00, 'SKH-SF-001', 12, 'sofas', true,
    ARRAY['sofa','living room','featured'],
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    'east-legon-modular-sectional',
    'East Legon Modular Sectional',
    'L-shaped sectional you can rearrange as your room grows.',
    'Modular pieces that form an L-shape lounge. Ideal for open-plan apartments. Dense foam seating and solid legs finished in matte black.',
    6500.00, 7200.00, NULL, 'SKH-SF-002', 6, 'sofas', true,
    ARRAY['sofa','sectional','modular'],
    'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    'tema-velvet-loveseat',
    'Tema Velvet Loveseat',
    'Compact two-seater in rich velvet for smaller rooms.',
    'Perfect for flats and guest lounges. Plush velvet upholstery, tapered wood legs, and a compact footprint without sacrificing comfort.',
    2800.00, 3200.00, 2800.00, 'SKH-SF-003', 10, 'sofas', false,
    ARRAY['sofa','loveseat','velvet'],
    'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    'kumasi-oak-coffee-table',
    'Kumasi Oak Coffee Table',
    'Solid oak-look coffee table with lower shelf storage.',
    'Centrepiece for living rooms. Rounded corners, durable laminate oak finish, and a lower shelf for books and trays.',
    950.00, 1100.00, NULL, 'SKH-LR-001', 20, 'living-room', true,
    ARRAY['table','living room','oak'],
    'https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    'cantonments-tv-console',
    'Cantonments TV Console',
    'Low media console with cable management and soft-close drawers.',
    'Holds up to 65" screens. Soft-close drawers, open cubbies for devices, and rear cable cut-outs. Matte finish that hides fingerprints.',
    1850.00, 2100.00, 1850.00, 'SKH-LR-002', 14, 'living-room', false,
    ARRAY['console','tv','storage'],
    'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    'labadi-accent-armchair',
    'Labadi Accent Armchair',
    'Statement lounge chair with sculpted arms.',
    'A reading chair that anchors a corner. Supportive back, wide seat, and fabric chosen for Accra humidity and daily use.',
    1650.00, 1900.00, NULL, 'SKH-LR-003', 16, 'living-room', true,
    ARRAY['chair','accent','living room'],
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    'spintex-upholstered-bed-queen',
    'Spintex Upholstered Bed — Queen',
    'Queen bed with tall padded headboard.',
    'Queen frame with a tall upholstered headboard for reading in bed. Slatted base — no box spring required. Fits standard Ghana mattress sizes.',
    3200.00, 3600.00, 3200.00, 'SKH-BD-001', 9, 'bedroom', true,
    ARRAY['bed','queen','bedroom'],
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    'airport-residential-nightstand-pair',
    'Airport Residential Nightstand Pair',
    'Matching bedside tables with drawer storage.',
    'Sold as a pair. Soft-close drawer each side, open shelf below, and a surface sized for lamps and chargers.',
    980.00, 1150.00, NULL, 'SKH-BD-002', 18, 'bedroom', false,
    ARRAY['nightstand','bedroom','pair'],
    'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    'osu-wardrobe-3-door',
    'Osu 3-Door Wardrobe',
    'Spacious wardrobe with hanging rail and shelves.',
    'Three doors, hanging rail, adjustable shelves, and a full-length mirror panel. Delivered flat-packed with assembly available on request.',
    4500.00, 5100.00, NULL, 'SKH-BD-003', 5, 'bedroom', true,
    ARRAY['wardrobe','storage','bedroom'],
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    'ridge-extendable-dining-table',
    'Ridge Extendable Dining Table',
    'Seats 6–8 with butterfly leaf extension.',
    'Everyday dining for six; extends to eight for guests. Scratch-resistant top and sturdy pedestal base that frees up legroom.',
    2900.00, 3400.00, 2900.00, 'SKH-DN-001', 8, 'dining', true,
    ARRAY['dining','table','extendable'],
    'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    'dansoman-dining-chair-set-4',
    'Dansoman Dining Chair Set of 4',
    'Upholstered dining chairs — set of four.',
    'Comfortable foam seats, wipe-clean fabric, and oak-look tapered legs. Sold as a set of four to match our dining tables.',
    1600.00, 1800.00, NULL, 'SKH-DN-002', 15, 'dining', false,
    ARRAY['dining','chairs','set'],
    'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    'madina-sideboard-buffet',
    'Madina Sideboard Buffet',
    'Dining storage for plates, glassware and linens.',
    'Three doors and two drawers. Cable cut-out for a sideboard lamp or wine cooler. Matches Ridge dining finishes.',
    2400.00, 2750.00, NULL, 'SKH-DN-003', 7, 'dining', true,
    ARRAY['sideboard','dining','storage'],
    'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    'kaneshie-kitchen-island-cart',
    'Kaneshie Kitchen Island Cart',
    'Mobile kitchen island with butcher-block top.',
    'Rolling cart with locking wheels, towel bar, and open shelves for pots. Perfect when your kitchen needs an extra prep surface.',
    1250.00, 1450.00, 1250.00, 'SKH-KT-001', 11, 'kitchen', false,
    ARRAY['kitchen','island','cart'],
    'https://images.unsplash.com/photo-1556912173-46c336c7fd55?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    'achimota-bar-stool-pair',
    'Achimota Counter Stool Pair',
    'Two counter-height stools with footrest.',
    'Sold as a pair. Contoured seat, metal footrest, and non-scratch floor protectors. Fits standard kitchen counters.',
    890.00, 980.00, NULL, 'SKH-KT-002', 22, 'kitchen', false,
    ARRAY['stool','kitchen','pair'],
    'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    'sakumono-ceramic-table-lamp',
    'Sakumono Ceramic Table Lamp',
    'Warm ceramic base with linen shade.',
    'Adds soft ambient light to bedrooms and living rooms. Gold-tone hardware, linen drum shade, and a standard E27 socket.',
    420.00, 480.00, NULL, 'SKH-DC-001', 30, 'decor', true,
    ARRAY['lamp','decor','lighting'],
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    'abito-woven-wall-art-set',
    'Abito Woven Wall Art Set',
    'Set of three textured woven wall panels.',
    'Natural fibre textures that warm a blank wall. Lightweight, easy to hang, and sized for living rooms or hallway galleries.',
    560.00, 650.00, 560.00, 'SKH-DC-002', 25, 'decor', false,
    ARRAY['wall art','decor','woven'],
    'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    'circle-desk-home-office',
    'Circle Compact Home Desk',
    'Compact desk with drawer for laptops and paperwork.',
    'Fits studio apartments and spare bedrooms. Cable grommet, one drawer, and a durable work surface sized for a 15" laptop and monitor.',
    1350.00, 1550.00, NULL, 'SKH-OF-001', 13, 'office', true,
    ARRAY['desk','office','work'],
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    'adzato-mesh-office-chair',
    'Adzato Mesh Office Chair',
    'Breathable mesh back with lumbar support.',
    'All-day comfort for WFH. Height adjust, tilt lock, and breathable mesh suited to warm climates.',
    780.00, 920.00, 780.00, 'SKH-OF-002', 20, 'office', false,
    ARRAY['chair','office','mesh'],
    'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    'weija-patio-set-4-seater',
    'Weija Patio Conversation Set',
    'Outdoor 4-seater set with coffee table.',
    'Weather-resistant woven seating for four plus a matching low table. Cushions included; store cushions indoors during heavy rain.',
    3800.00, 4300.00, NULL, 'SKH-OD-001', 4, 'outdoor', true,
    ARRAY['outdoor','patio','set'],
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    'dodowa-garden-lounge-chair',
    'Dodowa Garden Lounge Chair',
    'Single outdoor lounge chair with cushion.',
    'Relaxed outdoor seating for balconies and gardens. Powder-coated frame and quick-dry cushion fabric.',
    980.00, 1100.00, 980.00, 'SKH-OD-002', 12, 'outdoor', false,
    ARRAY['outdoor','lounge','chair'],
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  )
),
upserted AS (
  INSERT INTO public.products (
    name, slug, short_description, description,
    price, compare_at_price, sale_price,
    sku, quantity, track_quantity, category_id,
    brand, vendor, tags, status, featured,
    seo_title, seo_description, metadata
  )
  SELECT
    c.name,
    c.slug,
    c.short_description,
    c.description,
    c.price,
    c.compare_at_price,
    c.sale_price,
    c.sku,
    c.quantity,
    true,
    cat.id,
    'Sika Homes',
    'Sika Homes',
    c.tags,
    'active'::product_status,
    c.featured,
    c.name || ' | Sika Homes',
    c.short_description,
    jsonb_build_object('seed', 'furniture_v1', 'image', c.image_url)
  FROM catalog c
  JOIN public.categories cat ON cat.slug = c.category_slug
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    short_description = EXCLUDED.short_description,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    compare_at_price = EXCLUDED.compare_at_price,
    sale_price = EXCLUDED.sale_price,
    quantity = EXCLUDED.quantity,
    category_id = EXCLUDED.category_id,
    tags = EXCLUDED.tags,
    status = EXCLUDED.status,
    featured = EXCLUDED.featured,
    seo_title = EXCLUDED.seo_title,
    seo_description = EXCLUDED.seo_description,
    metadata = EXCLUDED.metadata,
    updated_at = now()
  RETURNING id, slug, metadata
)
INSERT INTO public.product_images (product_id, url, alt_text, position)
SELECT
  u.id,
  u.metadata->>'image',
  p.name,
  0
FROM upserted u
JOIN public.products p ON p.id = u.id
WHERE NOT EXISTS (
  SELECT 1 FROM public.product_images pi WHERE pi.product_id = u.id AND pi.position = 0
);

-- Ensure image URL stays in sync for seed products
UPDATE public.product_images pi
SET url = p.metadata->>'image',
    alt_text = p.name
FROM public.products p
WHERE pi.product_id = p.id
  AND pi.position = 0
  AND p.metadata->>'seed' = 'furniture_v1'
  AND p.metadata ? 'image';

SELECT
  (SELECT count(*) FROM products WHERE status = 'active') AS active_products,
  (SELECT count(*) FROM products WHERE featured) AS featured_products,
  (SELECT count(*) FROM product_images) AS images;
