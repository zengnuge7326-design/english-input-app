-- 年度会员钻石价：60000 → 30000
UPDATE shop_products SET price_json='[{"color":"gold","amount":30000}]' WHERE id='mem_year';
