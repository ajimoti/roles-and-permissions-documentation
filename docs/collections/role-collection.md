---
title: 'Role collection'
sidebar_position: 1
---

## Overview
A role collection is a fluent, and convenient wrapper for working with the role instances. 

Most times you will find yourself working with the `Tarzancodes\RolesAndPermissions\Collections\RoleCollection` class. This class is an extension of laravel `Illuminate\Support\Collection`, and allows you chain laravel's collection methods to filter or alter the values.

:::tip
New to laravel collections? You can read up on how to use [collections here](https://laravel.com/docs/8.x/collections)
:::


## Explanation
Usually, the role collection contains an array of the resulting role instances. 
The role collection also allows you chain laravel's collection methods to filter to alter the values.

**For example** 
```php
$roles = Role::all();

$roles->pluck('description'); //  returns an array of all descriptions
```

You can see the [list of methods available on a collection here](https://laravel.com/docs/8.x/collections#available-methods) 

### getPermissions(): PermissionCollection
You can fetch all the permissions in a collection. 

```php
$roles = Role::all();

$roles->getPermissions(); // returns a collection of all the permissions
```

## Customizing behaviors
### toArray()
This is one of the many methods made available on the role collection. This method is used to convert the role collection to an array. 

By default, when the `->toArray()` method is chained to a role collection, an array of the role `value(s)` will be returned in their native type. You may want to have access to the another property instead of the `value` property (any of `permissions`, `key`, `description`, `title`).

To change this behavior, you can override the `toArray()` method in your role enum.

```php title='app\Enums\Role.php'
// ---
    // will return the permissions when called
    public function toArray()
    {
        return $this->permissions;
    }
// ---


$roles = Role::all();
$roles->toArray(); // returns an array of each role permissions
```
