---
title: 'The role enum'
sidebar_position: 1
---

The package ships with a `app\Enums\Role.php` file, and uses this file when validating roles and permissions.

Roles are defined as constants in the `app\Enums\Role.php` class, and are assigned permissions in the `permissions()` method available in the file. You can choose not to include a role in the `permissions()` method provided the role does not need any permission, and the `$useHierarchy` property is not set to be `true`.

:::info
There are cases where you might have to use multiple role enum files in your application. 

You will learn more about this below. 
:::

## File Structure
Below is a sample of what a `app\Enums\Role.php` class looks like:
```php title="app\Enums\Role.php"
<?php

namespace App\Enums;

use Ajimoti\RolesAndPermissions\Helpers\BaseRole;

final class Role extends BaseRole
{
	const SUPER_ADMIN = 'super_admin';
	const ADMIN = 'admin';
	const CUSTOMER = 'customer';

    /**
    * Set available roles and their permissions.
    *
    * @return array
    */
    final public static function permissions(): array
    {
        return [
            self::SUPER_ADMIN  => [
                Permission::DeleteProducts, 
                Permission::DeleteTransactions, 
                Permission::ViewTransactions,
            ],

            self::ADMIN  => [
                Permission::EditProducts, 
                Permission::CreateProducts, 
                Permission::MarkAsSoldOut
            ],

            self::CUSTOMER  => [
                Permission::BuyProducts,
            ],
        ];
    }
}
```

From the above class, the constants `SUPER_ADMIN`, `ADMIN` and `CUSTOMER` are the declared roles, and as you can see, each role has been assigned permissions in the `permissions()` method.

**The permissions are as follows:**

| Role | Permissions |
| ----------- | ----------- |  
| **`SUPER_ADMIN`** | *Delete products*, *Delete transactions*, *View transactions*  |
| **`ADMIN`** | *Edit products*, *Create products*, *Mark as sold out*  | 
| **`CUSTOMER`** | *buy products* | 

From the table, you will notice that each role holds the exact permissions assigned to them in the `permissions()` method. This means any model assigned the **`SUPER_ADMIN`** role **will not** inherit the **`ADMIN`**, and **`CUSTOMER`** permissions, same applies to the **ADMIN** role.

:::info
If you want the senior level roles to inherit the permissions of the lower level roles, _(i.e **`SUPER_ADMIN`** role should have both **`ADMIN`** and **`CUSTOMER`** permissions)_, visit the [roles in hierarchy](/docs/enums/hierarchy) section to better understand how to achieve this.
:::


You can also decide to declare roles as integer values instead of strings. But for better readability, it is considered good practice to use `strings`.

**For example:**
```php title="app\Enums\Role.php"
// ...
    const  SUPER_ADMIN = 1;
    const  ADMIN = 2;
    const  CUSTOMER = 3;
// ...
```

You can get all the available roles:
```php
use App\Enums\Role;

$roles = Role::all(); // returns an instance of Ajimoti\RolesAndPermissions\Collections\RoleCollection
```

:::note
You will learn more about `Ajimoti\RolesAndPermissions\Collections\RoleCollection` in the [collections section](/docs/collections/role-collection)
:::

## Instantiation
For convenience, enums can be instantiated in multiple ways. It is useful to instantiate roles in order to have access to the `key`, `value`, `title`, `description` and `permissions` of the role.

Additionally, it introduces the ability to pass them between functions with the benefit of type hinting.

```php title='Role Instances'
// Standard new PHP class, passing the desired enum value as a parameter
$roleInstance = new Role(Role::SUPER_ADMIN);

// Same as the constructor, instantiate by value
$roleInstance = Role::fromValue(Role::SUPER_ADMIN);

// Use an enum key instead of its value
$roleInstance = Role::fromKey('SUPER_ADMIN');

// Statically calling the key name as a method, utilizing __callStatic magic
$roleInstance = Role::SUPER_ADMIN();
```

### Instance properties
Once you have a role instance, you can access the `key`, `value`, `title`, `description` and `permissions` of the role as properties.

```php title='Sample Role Instance'
$roleInstance = new Role(Role::SUPER_ADMIN);

$roleInstance->key; // SUPER_ADMIN 
$roleInstance->value; // super_admin 
$roleInstance->title; // SUPER ADMIN 
$roleInstance->description; // SUPER ADMIN 
$roleInstance->permissions; // instance of PermissionCollection 
```

Below is a table illustrating each property type and what they represent

| Property | Description |  Possible Types |
| ----------- | ----------- | ----------- |  
| `key` | The constants name  |  `string` or `int`  | 
| `value` | The constant value  |  `string` or `int`  | 
| `title` | A better readable name of the role. |  `string`  | 
| `description` | A description of the role. By default this will give the same value as the `title`. |  `string`  | 
| `permissions` | A collection of the role permissions. |  `PermissionCollection`  | 

:::tip
The `title`, and `description` values can both be set to custom values. You will learn how to do this on the [role enum reference](/docs/references/role-enum-reference) page.
:::


### Customizing the description and title
By default, the `description` and `title` properties are usually set to a  `sentence case` text of the role. 

You can override this behavior by writing custom descriptions or titles for the role. To do this, add a `getDescription($value)` method to set the descriptions, or a `getTitle($value)` method to set the titles, then conditionally return the right description or title based on the value passed.

```php title='app\Enums\Role.php' {9,23}
/**
* Set a description for the roles
*
* @return  string
*/
public static function getDescription($value): string
{
	return match ($value) {
		self::SUPER_ADMIN => 'Only company owners are given this role',
		self::ADMIN => "These are senior managers that oversee the company's operations",
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
		self::SUPER_ADMIN => 'CEO',
		self::ADMIN => "Admin (Managers)",
		default=> parent::getDescription($value), // returns the `sentence case'
	};
}
```
The above will give something like this
```php {5,6}
$roleInstance = new Role(Role::SUPER_ADMIN);

$roleInstance->key; // SUPER_ADMIN 
$roleInstance->value; // super_admin 
$roleInstance->title; // CEO 
$roleInstance->description; // 'Only company owners are given this role' 
$roleInstance->permissions; // instance of PermissionCollection 
```

## Using multiple role enums
In some cases, your models might have different roles, hence you will need different role enums for different models. Below is the command to create a new role enum, where `MerchantRole` is a sample name. 

```bash title='Create a role enum'
php artisan make:role MerchantRole
```
:::caution
After creating a role enum, you have to map the newly created enum to the model in the `config/role-and-permissions.php` file.

Without this step, the new role class will not be detected for use.
:::

### Mapping roles enums to models
After creating a role enum, the next step is to map the newly created role to a model _(or multiple models provided they have the roles)_. Without this step, the package will not detect the right role class to use, and then fallback to the default role class (`app\Enums\Role.php`).

The `roles_enum` array in the `config/role-and-permissions.php` file handles this.
The array holds a map of table names to role enums, where the model table name is the key, and the role enum is the value. 

```
'table_name' => \App\Enums\Role::class
```

For **_many to many_** relationships, set the **_pivot_table_** name as the `key`, and the new role enum as the `value`.

Following our example above, below is what the config file should like:
`config/role-and-permissions.php`
```php {5,7-8}
'roles_enum'  => [

    'default'  => \App\Enums\Role::class,

    'merchant_user'  => \App\Enums\MerchantUserRole::class,

    // if we decide to create a UserRole enum for the users table
    // 'users' => \App\Enums\UserRole::class,
],
```

From the sample config file above, the package will always use the `MerchantUserRole` class whenever the `of()` method is used between a merchant and user model. But when used on another model, it will result in an error, because it is tied to the `merchant_user` table, i.e only it's relating models can use it. If you would like to also use the `MerchantUserRole` class on another model, repeat the same process.

```php title='Example explained'
// The following will work fine
$user->of($merchant)->assign(MerchantUserRole::SUPER_ADMIN);
$merchant->of($user)->assign(MerchantUserRole::SUPER_ADMIN);
$user->assign(Role::SUPER_ADMIN);

// =============

// This will work NOT, as we are referencing the wrong role enum
$user->of($merchant)->assign(Role::SUPER_ADMIN);
$merchant->of($user)->assign(Role::SUPER_ADMIN);
$user->assign(MerchantUserRole::SUPER_ADMIN);
```
