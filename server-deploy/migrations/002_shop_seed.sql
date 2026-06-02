-- ════════════════════════════════════════════════════════════
-- 钻石商店 seed 数据 · v1.0 · 2026-06-03
-- ════════════════════════════════════════════════════════════

-- ─── 道具 ────────────────────────────────────────────────────
INSERT INTO shop_products (id, category, name, description, icon, price_json, rmb_price, sort_order, meta) VALUES
('freeze_card_1',      'item', '❄️ 冻结卡',         '错过一天不断连胜', '❄️', '[{"color":"purple","amount":8}]',  NULL, 110, '{"effect":"freeze","days":1}'),
('freeze_card_5pack',  'item', '❄️ 冻结卡 ×5 礼包', '5 张冻结卡打包',   '❄️', '[{"color":"purple","amount":30}]', 6,    111, '{"effect":"freeze","days":5}'),
('double_xp_30m',      'item', '⚡ 双倍 XP（30分钟）','30 分钟内 XP × 2','⚡', '[{"color":"green","amount":12}]',  NULL, 120, '{"effect":"xp_multi","minutes":30}'),
('double_xp_week',     'item', '⚡ 双倍 XP 周卡',    '整周 XP × 2',     '⚡', '[{"color":"green","amount":100}]', 12,   121, '{"effect":"xp_multi","minutes":10080}'),
('hint_card_5',        'item', '💡 提示卡 ×5',       '练习时跳词不扣分','💡', '[{"color":"blue","amount":10}]',   NULL, 130, '{"effect":"hint","count":5}'),
('retry_voucher_3',    'item', '🎯 错题重练券 ×3',   '直跳复习面板',   '🎯', '[{"color":"red","amount":8}]',     NULL, 140, '{"effect":"retry","count":3}'),
('skip_card_1',        'item', '🪄 跳过卡',          '卡壳跳一句',     '🪄', '[{"color":"purple","amount":15}]', NULL, 150, '{"effect":"skip","count":1}'),
('scholar_pack',       'item', '🎁 学霸礼包',        '提示×20 + 跳过×5 + 双倍3天','🎁', '[{"color":"gold","amount":180}]', 18, 160, '{"effect":"bundle"}');

-- ─── 宠物 N 档 ────────────────────────────────────────────────
INSERT INTO shop_products (id, category, tier, name, description, image_path, price_json, sort_order, meta) VALUES
('pet_duck',     'pet', 'N', '小黄鸭',     '经典浮力小黄鸭',      '/pets/pet_duck.svg',     '[{"color":"gold","amount":50}]', 210, NULL),
('pet_penguin',  'pet', 'N', '帝企鹅',     '圆滚滚帝企鹅',        '/pets/pet_penguin.svg',  '[{"color":"gold","amount":60}]', 211, NULL),
('pet_otter',    'pet', 'N', '小水獭',     '双手捧贝壳的水獭',    '/pets/pet_otter.svg',    '[{"color":"gold","amount":90}]', 212, NULL),
('pet_cat',      'pet', 'N', '橘猫',       '慵懒胖橘猫',          '/pets/pet_cat.svg',      '[{"color":"gold","amount":70}]', 213, NULL),
('pet_shiba',    'pet', 'N', '柴犬',       '微笑柴犬头',          '/pets/pet_shiba.svg',    '[{"color":"gold","amount":80}]', 214, NULL),
('pet_panda',    'pet', 'N', '国宝熊猫',   '升级版熊猫',          '/pets/pet_panda.svg',    '[{"color":"gold","amount":100}]',215, NULL),
('pet_fox',      'pet', 'N', '小狐狸',     '蓬松大尾巴狐狸',      '/pets/pet_fox.svg',      '[{"color":"gold","amount":110}]',216, NULL),
('pet_capybara', 'pet', 'N', '水豚',       '网红水豚泡温泉',      '/pets/pet_capybara.svg', '[{"color":"gold","amount":120}]',217, NULL);

-- ─── 宠物 R 档 ────────────────────────────────────────────────
INSERT INTO shop_products (id, category, tier, name, description, image_path, price_json, sort_order, meta) VALUES
('pet_axolotl',     'pet', 'R', '六角恐龙',     '粉色墨西哥钝口螈',  '/pets/pet_axolotl.svg',     '[{"color":"gold","amount":220}]', 310, NULL),
('pet_alien',       'pet', 'R', '三眼仔',       '玩具总动员风外星人','/pets/pet_alien.svg',       '[{"color":"gold","amount":250}]', 311, NULL),
('pet_unicorn',     'pet', 'R', '独角兽',       '彩虹独角兽',        '/pets/pet_unicorn.svg',     '[{"color":"gold","amount":280}]', 312, NULL),
('pet_dragon_baby', 'pet', 'R', '小恐龙',       'Q版翼龙',           '/pets/pet_dragon_baby.svg', '[{"color":"gold","amount":320}]', 313, NULL),
('pet_shield_dog',  'pet', 'R', '刀盾狗狗 DOOG','戴头盔扛盾牌的狗狗',  '/pets/pet_shield_dog.svg', '[{"color":"gold","amount":350}]', 314, NULL),
('pet_robot',       'pet', 'R', '像素机器人',   '像素风小机器人',    '/pets/pet_robot.svg',       '[{"color":"gold","amount":400}]', 315, NULL);

-- ─── 宠物 SR 档 ───────────────────────────────────────────────
INSERT INTO shop_products (id, category, tier, name, description, image_path, price_json, sort_order, meta) VALUES
('pet_lucky_cat',  'pet', 'SR', '招财猫',           '中式招财 IP',     '/pets/pet_lucky_cat.svg',  '[{"color":"gold","amount":500}]', 410, NULL),
('pet_dragon_god', 'pet', 'SR', '龙神 Q 版',        '致敬七龙珠悟空',   '/pets/pet_dragon_god.svg', '[{"color":"gold","amount":700}]', 411, NULL),
('pet_yellow_chu', 'pet', 'SR', '黄色电气鼠',       '致敬皮卡丘 Q 版',  '/pets/pet_yellow_chu.svg', '[{"color":"gold","amount":700}]', 412, NULL),
('pet_hero_red',   'pet', 'SR', '红色光之巨人',     '致敬奥特曼 Q 版',  '/pets/pet_hero_red.svg',   '[{"color":"gold","amount":800}]', 413, NULL),
('pet_hero_blue',  'pet', 'SR', '蓝色英雄',         '致敬高达 Q 版',    '/pets/pet_hero_blue.svg',  '[{"color":"gold","amount":800}]', 414, NULL);

-- ─── 宠物 SSR 档 ──────────────────────────────────────────────
INSERT INTO shop_products (id, category, tier, name, description, image_path, price_json, sort_order, meta) VALUES
('pet_phoenix',  'pet', 'SSR', '朱雀凤凰',  '中式神兽 · 烈焰之翼',  '/pets/pet_phoenix.svg',  '[{"color":"gold","amount":1500}]', 510, NULL),
('pet_kaiju',    'pet', 'SSR', '深海怪兽',  '多触手的海中王者',     '/pets/pet_kaiju.svg',    '[{"color":"gold","amount":1500}]', 511, NULL),
('pet_godzilla', 'pet', 'SSR', '巨型怪兽',  '致敬哥斯拉 Q 版',      '/pets/pet_godzilla.svg', '[{"color":"gold","amount":1800}]', 512, NULL),
('pet_kirin',    'pet', 'SSR', '麒麟',      '中式祥瑞 · 五彩瑞兽',  '/pets/pet_kirin.svg',    '[{"color":"gold","amount":2000}]', 513, NULL);

-- ─── 宠物 UR 档（限定，不通过商店购买） ───────────────────────
-- 创始熊猫·金 → 创始成员开通时自动发放
-- 春节舞狮 / 复活节兔 → 活动期间用钻石或免费派发

-- ─── 会员套餐（用钻石兑换） ──────────────────────────────────
INSERT INTO shop_products (id, category, name, description, icon, price_json, sort_order, meta) VALUES
('mem_trial_3d',  'membership', '月卡体验 3 天',  '尝鲜全功能',     '🎫', '[{"color":"gold","amount":80}]',   610, '{"days":3}'),
('mem_month',     'membership', '月度会员（30天）', '比直购贵',     '👑', '[{"color":"gold","amount":800}]',  611, '{"days":30}'),
('mem_year',      'membership', '年度会员（365天）','囤积钻石可换',  '👑', '[{"color":"gold","amount":6000}]', 612, '{"days":365}');
