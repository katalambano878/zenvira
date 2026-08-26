-- Seed room-based furniture categories for Sika Homes storefront.

INSERT INTO public.categories (name, slug, description, status, position, metadata)
VALUES
  ('Sofas', 'sofas', 'Lounge seating and sofa sets for living spaces.', 'active', 10, '{"featured": true, "subtitle": "Lounge-ready seating", "display_name": "Sofas"}'::jsonb),
  ('Living Room', 'living-room', 'Tables, storage and accents for the living room.', 'active', 20, '{"featured": true, "subtitle": "Tables, storage & accents", "display_name": "Living Room"}'::jsonb),
  ('Bedroom', 'bedroom', 'Beds, mattresses and bedroom furniture.', 'active', 30, '{"featured": true, "subtitle": "Beds & nightstands", "display_name": "Bedroom"}'::jsonb),
  ('Dining', 'dining', 'Dining tables, chairs and sets.', 'active', 40, '{"featured": true, "subtitle": "Tables & chairs", "display_name": "Dining"}'::jsonb),
  ('Kitchen', 'kitchen', 'Kitchen furniture and practical home goods.', 'active', 50, '{"featured": true, "subtitle": "Practical home goods", "display_name": "Kitchen"}'::jsonb),
  ('Décor', 'decor', 'Finishing touches, lighting accents and décor.', 'active', 60, '{"featured": true, "subtitle": "Finishing touches", "display_name": "Décor"}'::jsonb),
  ('Office', 'office', 'Desks, work chairs and office storage.', 'active', 70, '{"featured": false, "subtitle": "Desks & work seating", "display_name": "Office"}'::jsonb),
  ('Outdoor', 'outdoor', 'Patio and garden furniture.', 'active', 80, '{"featured": false, "subtitle": "Patio & garden", "display_name": "Outdoor"}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  position = EXCLUDED.position,
  metadata = COALESCE(public.categories.metadata, '{}'::jsonb) || EXCLUDED.metadata,
  updated_at = now();
