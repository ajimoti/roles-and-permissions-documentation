---
title: 'Roles in Hierarchy'
sidebar_position: 3
---

## Overview
In every role enum file, the roles are believed to be declared from higher level roles to lower level roles. 

In some cases, you might want your roles in hierarchy; meaning you want the higher roles to inherit the permissions of their respective lower roles. This helps you avoid attaching duplicate permissions across your roles.

## Explanation
To achieve this, you can override the `$useHierarchy` property in your role enum, and set the value to `true`. When set to `true` the package understands to make the higher roles inherit the permissions of the lower roles. 

An example:
```php title='app\Enums\Role.php' {12}
<?php
namespace App\Enums;

use Ajimoti\RolesAndPermissions\Helpers\BaseRole;

final class Role extends BaseRole
{
    const SUPER_ADMIN = 'super_admin';
    const ADMIN = 'admin';
    const CUSTOMER = 'customer';

    protected static $useHierarchy = true;

    // ----
    final public static function permissions(): array
    {
        return [
            self::SUPER_ADMIN  => [
                Permission::DeleteProducts,
            ],
            self::ADMIN  => [
                Permission::EditProducts,
            ],
            self::CUSTOMER  => [
                Permission::BuyProducts,
            ],
        ];
    }
}
```
From the example above, the `SUPER_ADMIN` role is know to be the highest level role because it is the first constant declared in the class, while the `CUSTOMER` role is believed to be the lowest level role as it appears last.

```php title='Hierarchy'
SUPER_ADMIN > ADMIN > CUSTOMER
```

**Hence, their permissions are as follows:**

| Role | Permissions |
| ----------- | ----------- |  
| **`SUPER_ADMIN`** | *Delete products*, *Edit products*, *Buy products*  |
| **`ADMIN`** | *Edit products*, *Buy products*  | 
| **`CUSTOMER`** | *Buy products* | 

:::caution
It is important that the roles in the `permissions()` method appear in the same order as they are declared. 

If not an `Ajimoti\RolesAndPermissions\Exceptions\InvalidRoleHierarchyException`  will be thrown, therefore ensure your roles appear in the same order they were declared.
:::

## Getting other roles
You may want to get the lower or higher roles of a selected role. Below is how to achieve this:

```php
// get a RoleCollection of roles lower than the selected role; ('admin', 'customer')
Role::hold(Role::SUPER_ADMIN)->getLowerRoles(); 

// get a RoleCollection of roles higher than the selected role; ('super_admin', 'admin')
Role::hold(Role::CUSTOMER)->getHigherRoles(); 
```

You can chain the `getPermissions()` method to get all permissions of the collection like so:

```php
// get a collection of every permission associated with a role lower than the selected role
Role::hold(Role::SUPER_ADMIN)->getLowerRoles()->getPermissions(); 
```

The above will return a collection of every permission of the lower roles. Similar to how laravel collections work, you can chain the `->toArray()` method to the collection if you want your response as an array:
```php
// get an array of every permission associated with a role lower than the selected role
Role::hold(Role::SUPER_ADMIN)->getLowerRoles()->getPermissions()->toArray();
```