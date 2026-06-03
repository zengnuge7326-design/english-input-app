-- 充值与商店标价调整 · 基准 ¥1 = 500 金钻（原 50，×10）
-- 线上已 seed 的库执行本文件；新库请用更新后的 002_shop_seed.sql

-- 道具
UPDATE shop_products SET price_json='[{"color":"purple","amount":80}]' WHERE id='freeze_card_1';
UPDATE shop_products SET price_json='[{"color":"purple","amount":300}]' WHERE id='freeze_card_5pack';
UPDATE shop_products SET price_json='[{"color":"green","amount":120}]' WHERE id='double_xp_30m';
UPDATE shop_products SET price_json='[{"color":"green","amount":1000}]' WHERE id='double_xp_week';
UPDATE shop_products SET price_json='[{"color":"blue","amount":100}]' WHERE id='hint_card_5';
UPDATE shop_products SET price_json='[{"color":"red","amount":80}]' WHERE id='retry_voucher_3';
UPDATE shop_products SET price_json='[{"color":"purple","amount":150}]' WHERE id='skip_card_1';
UPDATE shop_products SET price_json='[{"color":"gold","amount":1800}]' WHERE id='scholar_pack';

-- 宠物 N
UPDATE shop_products SET price_json='[{"color":"gold","amount":500}]' WHERE id='pet_duck';
UPDATE shop_products SET price_json='[{"color":"gold","amount":600}]' WHERE id='pet_penguin';
UPDATE shop_products SET price_json='[{"color":"gold","amount":900}]' WHERE id='pet_otter';
UPDATE shop_products SET price_json='[{"color":"gold","amount":700}]' WHERE id='pet_cat';
UPDATE shop_products SET price_json='[{"color":"gold","amount":800}]' WHERE id='pet_shiba';
UPDATE shop_products SET price_json='[{"color":"gold","amount":1000}]' WHERE id='pet_panda';
UPDATE shop_products SET price_json='[{"color":"gold","amount":1100}]' WHERE id='pet_fox';
UPDATE shop_products SET price_json='[{"color":"gold","amount":1200}]' WHERE id='pet_capybara';

-- 宠物 R
UPDATE shop_products SET price_json='[{"color":"gold","amount":2200}]' WHERE id='pet_axolotl';
UPDATE shop_products SET price_json='[{"color":"gold","amount":2500}]' WHERE id='pet_alien';
UPDATE shop_products SET price_json='[{"color":"gold","amount":2800}]' WHERE id='pet_unicorn';
UPDATE shop_products SET price_json='[{"color":"gold","amount":3200}]' WHERE id='pet_dragon_baby';
UPDATE shop_products SET price_json='[{"color":"gold","amount":3500}]' WHERE id='pet_shield_dog';
UPDATE shop_products SET price_json='[{"color":"gold","amount":4000}]' WHERE id='pet_robot';

-- 宠物 SR
UPDATE shop_products SET price_json='[{"color":"gold","amount":5000}]' WHERE id='pet_lucky_cat';
UPDATE shop_products SET price_json='[{"color":"gold","amount":7000}]' WHERE id='pet_dragon_god';
UPDATE shop_products SET price_json='[{"color":"gold","amount":7000}]' WHERE id='pet_yellow_chu';
UPDATE shop_products SET price_json='[{"color":"gold","amount":8000}]' WHERE id='pet_hero_red';
UPDATE shop_products SET price_json='[{"color":"gold","amount":8000}]' WHERE id='pet_hero_blue';

-- 宠物 SSR
UPDATE shop_products SET price_json='[{"color":"gold","amount":15000}]' WHERE id='pet_phoenix';
UPDATE shop_products SET price_json='[{"color":"gold","amount":15000}]' WHERE id='pet_kaiju';
UPDATE shop_products SET price_json='[{"color":"gold","amount":18000}]' WHERE id='pet_godzilla';
UPDATE shop_products SET price_json='[{"color":"gold","amount":20000}]' WHERE id='pet_kirin';

-- 会员（金钻兑换）
UPDATE shop_products SET price_json='[{"color":"gold","amount":800}]' WHERE id='mem_trial_3d';
UPDATE shop_products SET price_json='[{"color":"gold","amount":8000}]' WHERE id='mem_month';
UPDATE shop_products SET price_json='[{"color":"gold","amount":60000}]' WHERE id='mem_year';
