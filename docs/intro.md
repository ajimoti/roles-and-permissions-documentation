---
title: Introduction
sidebar_position: 1
---

<!-- # Introduction -->

## Laravel roles and permissions

This package allows you to assign roles and permissions to any laravel model, or on a pivot table (`many to many relationship`).

Built and written by [Ajimoti Ibukun](https://www.linkedin.com/in/ibukun-ajimoti-3420a786/)

## Quick Samples

<!-- Below are samples of how to use the package after installation. -->

<!-- ### Basic Usage (on a Model) -->
### On a Model
The example below explains how to use the package on a model after installation.  

```php title="app\Http\Controllers\HomeController.php"
use App\Enums\Role;
use App\Enums\Permission;

// Assign a 'Super Admin' role to this user
$user->assign(Role::SuperAdmin);

// Check if the user has the role
$user->hasRole(Role::SuperAdmin);

// Check if the user can perform a operation
$user->can(Permission::DeleteTransactions);

// Check if the user has multiple permissions
$user->holds(Permission::DeleteTransactions, Permission::BlockUsers);
```

### Pivot table (many to many relationship)
This demonstrates how to use the package on a `many to many` relationship.
In this example, we assume that we have a `merchant` relationship on our `User` model. And that the relationship returns an instance of Laravel's `BelongsToMany` class.

Import the `App\Enums\Role` and `App\Enums\Permission` class.
```php title="app\Http\Controllers\MerchantController.php"
use App\Enums\Role;
use App\Enums\Permission;

// Sample merchant
$merchant = Merchant::where('name', 'wallmart')->first();

// Assign a 'Super Admin' role to this user on the selected merchant (wallmart)
$user->of($merchant)->assign(Role::SuperAdmin);

// Check if the user has a super admin role on the selected merchant (wallmart)
$user->of($merchant)->hasRole(Role::SuperAdmin);

// Check if the user can 'delete transactions' on the selected merchant (wallmart)
$user->of($merchant)->can(Permission::DeleteTransactions);

// Check if the user has multiple permissions on the selected merchant (wallmart)
$user->of($merchant)->holds(Permission::DeleteTransactions, Permission::BlockUsers);
```

:::tip
We used the `user` model to make the example explanatory, similar to the examples above the package will work on any model class.
:::
