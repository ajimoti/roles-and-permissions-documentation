---
title: 'Role enum reference'
sidebar_position: 1
---


The following static methods are made available to any role instance.

## Available methods
- [`all()`](#all-rolecollection)
- [`permissions()`](#permissions-array)
- [`getPermissions()`](#getpermissions-permissioncollection)
- [`getDescription()`](##getdescriptionrole-string)
- [`getTitle()`](#gettitlerole-string)
- [`asSelectArray()`](#asselectarray-array)
- [`getInstancesFromValues()`](#getinstancesfromvalues-rolecollection)
- [`collect()`](#collect-rolecollection)

### all(): RoleCollection
Get all the roles available and their respective permissions as a collection.
```php
use App\Enums\Role;

$roles = Role::all() // returns a collection of all roles available and their respective permissions

foreach ($roles as $role) {
    dd($role); // instance of Role::class
}

// You can decide to convert the response to an array
$roles->toArray(); // returns an array of all roles
```

### permissions(): array
Get all available roles, and their respective permissions as a multidimensional array.
```php
use App\Enums\Role;

$roles = Role::permissions(); // returns a multidimensional array of all roles and permissions
```

### getPermissions($role): PermissionCollection
This method will return all the available permissions of the role provided.
```php
use App\Enums\Role;

$roles = Role::getPermissions(Role::SuperAdmin); // returns a collection of every permissions available to the super admin role
```
You can also pass multiple roles as parameters or as an array to get their associated permissions. Below is an illustration of how to achieve this.
```php
use App\Enums\Role;

// as multiple arguments
$roles = Role::getPermissions(Role::SuperAdmin, Role::Admin, Role::Customer); 

// or as an array
$roles = Role::getPermissions([Role::SuperAdmin, Role::Admin, Role::Customer]); 
```

:::note
Both illustrations above will return an instance of `\Ajimoti\RolesAndPermissions\Collections\PermissionCollection`

We have touched on how to work with the permission collection in _[the permission class](/docs/collections/permission-collection)_
:::

### getDescription($role): string
Get the description of the role provided
```php
use App\Enums\Role;

$roles = Role::getDescription(Role::SuperAdmin); // returns the description of the role
```

### getTitle($role): string
Get the title of the role provided
```php
use App\Enums\Role;

$roles = Role::getTitle(Role::SuperAdmin); // returns the title of the role
```

### asSelectArray(): array
This will return the roles for use in a select dropdown. An array of role `values` to `title` is returned

```php
use App\Enums\Role;

Role::asSelectArray();

// returns ['super_admin' => 'Super admin', 'admin' => 'Admin', 'customer' => 'Customer']
```

### getInstancesFromValues(): RoleCollection
You can use this method to get a collection of multiple roles.

```php
use App\Enums\Role;

Role::getInstancesFromValues(Role::SuperAdmin, Role::Admin, Role::Customer); // returns a RoleCollection of the provided roles
```

### collect(): RoleCollection
Similar to the `getInstancesFromValues()` method, you can use this method to get a collection of multiple roles.

```php
use App\Enums\Role;

Role::collect(Role::SuperAdmin, Role::Admin, Role::Customer); // returns a RoleCollection of the provided roles
```

### Other methods...
The role enum leverages on [BenSampo laravel enum](https://github.com/BenSampo/laravel-enum) package. You can explore the documentation to better understand how it works, and see more available methods you can work with



:::info
The `Ajimoti\RolesAndPermissions\Collections\RoleCollection` and `Ajimoti\RolesAndPermissions\Collections\PermissionCollection` which are both extensions of laravel's `Illuminate\Support\Collection`. 

You can read more about the [Role Collection here](/docs/collections/role-collection), and [Permission Collection here](/docs/collections/permission-collection)
:::
