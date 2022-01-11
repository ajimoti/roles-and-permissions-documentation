---
title: 'Permission collection'
sidebar_position: 2
---

## Overview
The permission collection is a fluent, and convenient wrapper for working with the permission enum instances. 

Most times you will find yourself working with the `Ajimoti\RolesAndPermissions\Collections\PermissionCollection` class. This class is also an extension of laravel `Illuminate\Support\Collection`, and allows you chain laravel's collection methods to filter or alter the values.

:::tip
New to laravel collections? You can read up on how to use [collections here](https://laravel.com/docs/8.x/collections)
:::


## Explanation
The permission collection contains an array of the resulting permission enum instances. 
The permission collection also allows you chain laravel's collection methods to filter to alter the values.

**For example** 
```php
$permission = Permissions::all();

$permission->pluck('description'); //  returns an array of all descriptions
```

You can see the [list of methods available on a collection here](https://laravel.com/docs/8.x/collections#available-methods) 

## Customizing behaviors
### toArray()
This is one of the many methods made available on the permission collection. This method is used to convert the permission collection to an array. 

By default, when the `->toArray()` method is chained to a permission collection, an array of the permission(s) `value(s)` will be returned in their native type. You may want to have access to the another property instead of the `value` property (any of `key`, `description`, `title`).

To change this behavior, you can override the `toArray()` method in your permission enum class.

```php title='app\Enums\Permissions.php'
// ---
    // will return the description when called
    public function toArray()
    {
        return $this->description;
    }
// ---


$permissions = Permissions::all();
$permissions->toArray(); // returns an array of each permission description
```
