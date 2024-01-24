-- INSERT
INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- Update the Stark reord
UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony'
    AND account.account_lastname = 'Stark';
-- Delete Tony Stark
DELETE FROM public.account
WHERE account.account_firstname = 'Tony'
    AND account_lastname = 'Stark';
-- Update Hummer from small interior to Big interitio
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';
-- Select make and model fields from the inventory and classification tables for items belonging to sports category
SELECT i.inv_make,
    i.inv_model,
    c.classification_name
FROM public.inventory i
    INNER JOIN public.classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';
-- Update all records in inventory to add /vehicles to the middle of the file path
-- SIXTH QUERY
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');