-- 新增宠物 · 巴拉巴超兽（奥特曼A 系列致敬 · SSR）
-- 用于已 seed 上线的库；新库由更新后的 002_shop_seed.sql 处理
-- 使用 INSERT IGNORE 保证幂等（id 是主键，重复跑只插入一次）

INSERT IGNORE INTO shop_products
  (id, category, tier, name, description, image_path, price_json, sort_order, meta)
VALUES
  ('pet_baraba', 'pet', 'SSR', '巴拉巴超兽', '奥特曼A · 一の超兽', '/pets/pet_baraba.svg', '[{"color":"gold","amount":18000}]', 514, NULL);
