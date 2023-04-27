-- This is an empty migration.
CREATE TRIGGER add_product_stock
AFTER INSERT ON income_products
FOR EACH ROW
BEGIN
  UPDATE products
  SET stock = stock + NEW.quantity
  WHERE id = NEW.product_id;
END;

CREATE TRIGGER update_product_stock
AFTER UPDATE ON income_products
FOR EACH ROW
BEGIN
  UPDATE products SET stock = stock + (NEW.quantity - OLD.quantity) WHERE id = NEW.product_id;
END;

CREATE TRIGGER decrement_product_stock
AFTER DELETE ON income_products
FOR EACH ROW
BEGIN
  UPDATE products SET stock = stock - OLD.quantity
  WHERE id = OLD.product_id;
END;