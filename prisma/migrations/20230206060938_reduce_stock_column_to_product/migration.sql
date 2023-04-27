CREATE TRIGGER update_product_stock_on_new_order
  AFTER INSERT ON Orders
  FOR EACH ROW
  BEGIN
    UPDATE Products
    SET stock = stock - NEW.quantity
    WHERE id = NEW.product_id;
  END;

  CREATE TRIGGER update_product_stock_after_update_order
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
  DECLARE new_quantity INT;
  DECLARE old_quantity INT;
  SET new_quantity = NEW.quantity;
  SET old_quantity = OLD.quantity;
  IF new_quantity > old_quantity THEN
    UPDATE products
    SET stock = stock - (new_quantity - old_quantity)
    WHERE id = NEW.product_id;
  ELSE
    UPDATE products
    SET stock = stock + (old_quantity - new_quantity)
    WHERE id = NEW.product_id;
  END IF;
END;

create trigger increase_product_stock
  before delete on Orders
  for each row
begin
  update Products set stock = stock + old.quantity where id = old.product_id;
end;