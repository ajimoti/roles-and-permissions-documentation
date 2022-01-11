---
title: 'Permission enum reference'
sidebar_position: 2
---


The following static methods are made available to any permission enum instance.

## Available methods
- [`all()`](#all-permissioncollection)
- [`getDescription()`](#getdescription-string)
- [`asSelectArray()`](#asselectarray-array)
- [`getInstancesFromValues()`](#asselectarray-array)
- [`collect()`](#collect-rolecollection)

### all(): PermissionCollection
Get all the permissions available and their respective permissions as a collection.
```php
use App\Enums\Permission;

$permissions = Permission::all() // returns a collection of all permissions available and their respective permissions

foreach ($permissions as $permission) {
    dd($permission); // instance of Permission::class
}

// You can decide to convert the response to an array
$permissions->toArray(); // returns an array of all permissions
```

:::note
Both illustrations above will return an instance of `\Tarzancodes\RolesAndPermissions\Collections\PermissionCollection`

We will touch on how to work with the permission collection in _[the permission class](https://blah.com)_
:::

### getDescription($permission): string
Get the description of the permission provided
```php
use App\Enums\Permission;

$permissions = Permission::getDescription(Permission::DeleteTransactions); // returns a description of the permission
```

### asSelectArray(): array
This will return the permissions for use in a select dropdown. An array of permission `values` to `title` is returned

```php
use App\Enums\Permission;

Permission::asSelectArray();

// returns ['delete_transactions' => 'Delete transactions', 'buy_products' => 'Buy products']
```

### getInstancesFromValues(): PermissionCollection
You can use this method to get a collection of multiple permissions.

```php
use App\Enums\Permission;

Permission::getInstancesFromValues(Permission::DeleteTransactions, Permission::Admin, Permission::Customer); // returns a PermissionCollection of the provided permissions
```

### collect(): RoleCollection
Similar to the `getInstancesFromValues()` method, you can use this method to get a collection of multiple permissions.

```php
use App\Enums\Permission;

Permission::collect(Permission::DeleteTransactions, Permission::Admin, Permission::Customer); // returns a PermissionCollection of the provided permissions
```

### Other methods...
The permission enum leverages on [BenSampo laravel enum](https://github.com/BenSampo/laravel-enum) package. You can explore the documentation to better understand how it works, and see more available methods you can work with



:::info
The `Tarzancodes\RolesAndPermissions\Collections\PermissionCollection` and `Tarzancodes\RolesAndPermissions\Collections\PermissionCollection` which are both extensions of laravel's `Illuminate\Support\Collection`. 

You can read more about the [Permission Collection here](https://blah.com), and [Permission Collection here](https://blah.com)
:::
