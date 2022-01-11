---
title: 'The permission enum'
sidebar_position: 2
---

Similar to the role enum, the package also ships with a `app\Enums\Permission.php` file. The `Permission` class is where you will declare all the permissions required for the package to work fine.

As you have already learned, permissions are defined as constants in the `app\Enums\Permission.php` class, and can be associated with roles in the `permissions()` method of all role enum file.

:::info
There are cases where you might have to use multiple permission enum files in your application. The [using multiple permission enums section](/docs/enums/the-permission-enum#using-multiple-permission-enums) gives better explanation on how to navigate your way around this. 
:::

## File Structure

Below is an example of what the class looks like:

```php title='app\Enums\Permission.php'
<?php
namespace App\Enums;

use Ajimoti\RolesAndPermissions\Helpers\BasePermission;

final class Permission extends BasePermission
{
    const DeleteProducts = 'delete_products';
    const DeleteTransactions = 'delete_transactions';
    const ViewTransactions = 'view_transactions';
    const EditProducts = 'edit_products';
    const MarkAsSoldOut = 'mark_as_sold_out';
    const BuyProducts = 'buy_products';
}
```

As seen above, this class basically lists all the permissions available. You can use any case of your choice for the values, you are not required to use the `snake_case`. Additionally, you can decide to use integer values, but for consistency and better readability, it is considered good practice to use strings instead.

You can get all the available permissions:
```php
use App\Enums\Permission;

$permissions = Permission::all(); // returns an instance of Ajimoti\RolesAndPermissions\Collections\PermissionCollection
```

:::note
You will learn more about `Ajimoti\RolesAndPermissions\Collections\PermissionCollection` in the [collections section](/docs/collections/permission-collection)
:::

## Instantiation
For convenience, enums can be instantiated in multiple ways. It is useful to instantiate permissions in order to have access to the `key`, `value`, `title`, and `description` of the permission.

```php title='Permission Instances'
// Standard new PHP class, passing the desired enum value as a parameter
$permissionInstance = new Permission(Permission::DeleteTransactions);

// Same as the constructor, instantiate by value
$permissionInstance = Permission::fromValue(Permission::DeleteTransactions);

// Use an enum key instead of its value
$permissionInstance = Permission::fromKey('DeleteTransactions');

// Statically calling the key name as a method, utilizing __callStatic magic
$permissionInstance = Permission::DeleteTransactions();
```

### Instance properties
Once you have a permission instance, you can access the `key`, `value`, `title`, and `description` of the permission as properties.

```php title='Sample Permission Instance'
$permissionInstance = new Permission(Permission::DeleteTransactions);

$permissionInstance->key; // DeleteTransactions 
$permissionInstance->value; // delete_transactions 
$permissionInstance->title; // Delete Transactions 
$permissionInstance->description; // Delete Transactions 
```

Below is a table illustrating each property type and what they represent

| Property | Description |  Type |
| ----------- | ----------- | ----------- |  
| `key` | The constants name  |  `string` or `int`  | 
| `value` | The constant value  |  `string` or `int`  | 
| `title` | A better readable name of the role. |  `string`  | 
| `description` | A description of the permission. By default this will return the `title` property prefixed with `Can`. |  `string`  | 

:::tip
The `title`, and `description` values can both be set to custom values. You will learn how to do this on the [customizing the description and title](/docs/enums/the-permission-enum#customizing-the-description-and-title) page.
:::


### Customizing the description and title
By default, the `description` and `title` properties are usually set to a  `sentence case` text of the permission. 

You can override this behavior by writing custom descriptions or titles for the permission. To do this, add a `getDescription($value)` method to set the descriptions, or a `getTitle($value)` method to set the titles, then conditionally return the right description or title based on the value passed.

```php title='app\Enums\Permission.php' {9,23}
/**
* Set a description for the permission
*
* @return  string
*/
public static function getDescription($value): string
{
	return match ($value) {
		self::DeleteTransactions => 'The user can delete any transactions',
		self::BuyProducts => "The user has an ability to buy products on the merchant e-commerce website",
		default=> parent::getDescription($value), // returns the `sentence case'
	};
}

/**
* Set a title for the roles
*
* @return  string
*/
public static function getTitle($value): string
{
	return match ($value) {
		self::DeleteTransactions => 'Erase transaction',
		self::BuyProducts => "Buy any products",
		default=> parent::getDescription($value), // returns the `sentence case'
	};
}
```
The above will give something like this
```php {5,6}
$roleInstance = new Permission(Permission::DeleteTransactions);

$roleInstance->key; // 'DeleteTransactions' 
$roleInstance->value; // 'delete_transactions' 
$roleInstance->title; // 'Erase transaction' 
$roleInstance->description; // 'The user can delete any transactions'
```

## Using multiple permission enums
Usually, you can keep all your permissions in the `app\Enums\Permission.php` file, but sometimes, to keep your application neat, you can decide to spread your permissions across multiple enum files.

:::caution
The same way permissions are attached to roles, permission enums are tied to role enums., i.e after creating a permission enum, you have to update your role class to use it.

Without this step, the new permission class will not be available for use.
:::

To do this run the command below, then set the `protected static $permissionClass` property on your role enum to the permission class.


```bash
php artisan make:permission ExamplePermission
```

```php title='app\Enums\Role.php'
use App\Enums\ExamplePermission;

protected static $permissionClass = ExamplePermission::class;
```
