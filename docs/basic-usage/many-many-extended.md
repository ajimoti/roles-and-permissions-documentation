---
sidebar_position: 3
title: 'Many to many (extended)'
---

## Overview
There are cases where you will have extra columns on your pivot table, and want to set values for them while assigning roles. Or you may want to check for permissions based on the value of a column. This section explains how to go about this.

## Quick Sample
Using the same _merchants_ and _users_ example in the [many to many relationship](https:://blah.com) section, but in this case, the following rules applies:

- Each merchant have departments
- Users can belong to many departments in a merchant
- Users have different roles in different departments in a merchant
  
```php title='Sample database structure'
users
    id - integer
    name - string

merchant
    id - integer
    name - string

merchant_user
    merchant_id - integer
    user_id - integer
    role - string (nullable)
    department - string
```

## Usage
### Set pivot columns value when assigning roles
Chain the `withPivot()` method to the `of()` method to set values for the pivot columns.

For example, you decide to give a **_`$user`_** a **_super admin_** role in the **__product department__** department of a **_`$merchant`_**:
```php {3}
// Give the user a super admin role in the 'product' department of this merchant
$user->of($merchant)
    ->withPivot(['department' => 'product']) // set values to the pivot columns
    ->assign(Role::SuperAdmin); 
```

You may decide to set values for multiple columns: 

```php title='Set multiple pivot columns' {2-3,8-11}
$user->of($merchant)
    ->withPivot(['department' => 'product'])
    ->withPivot(['created_at' => now()])
    ->assign(Role::SuperAdmin); // returns boolean

//OR
$user->of($merchant)
    ->withPivot([
        'department' => 'product',
        'created_at' => now()
    ])
    ->assign(Role::SuperAdmin); // returns boolean

```

### Using conditions
If you would like to conditionally select a pivot record you can achieve this by chaining any of the methods below to the `of()` method.

:::tip Available methods
The package supports every method listed in the [Filtering Queries Via Intermediate Table Columns](https://laravel.com/docs/8.x/eloquent-relationships#filtering-queries-via-intermediate-table-columns) section of laravel's documentation

`wherePivot`, `wherePivotIn`, `wherePivotNotIn`, `wherePivotBetween`, `wherePivotNotBetween`, `wherePivotNull`, and `wherePivotNotNull`
:::

```php title='Filter by pivot column' {2}
$user->of($merchant)
    ->wherePivot('department', 'product')
    ->hasRole(Role::SuperAdmin); // returns boolean
```
The above code will only return `true` if the user has been previously assigned a `super admin` role in the `product` department of the merchant provided. Otherwise the code returns false, even if the user has a `super admin` role in another department.

```php title='Multiple filters' {2,3,4}
$user->of($merchant)
    ->wherePivot('department', 'product')
    ->wherePivotBetween('created_at', ['2021-12-05 00:00:00', '2021-12-08 00:00:00'])
    ->wherePivotNull('updated_at')
    ->holds(Permission::BuyProducts); // returns boolean

```