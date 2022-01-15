---
sidebar_position: 2
title: 'Many to many relationship'
---

## Overview
Using the roles and permissions package on a `many-to-many` relationship is slightly different.


## Prerequisites
The following are required for the package to work correctly on a `many-to-many` relationship:
- A pivot table is needed
- The pivot table **MUST** have a `role` column. This column will be used to keep track of the role assigned to the relationship. (if you plan on using a different column name, you can set this in the config file).
- A `belongsToMany` relationship for the pivot table must exists on one of the models.
- You already understand how to use the `HasRoles` trait on a model

:::info
For better understanding on how `many to many` relationship work, or `pivot tables` read more on [laravel many to many relationship here.](https://laravel.com/docs/8.x/eloquent-relationships#many-to-many)
:::

## Explanation
---
Let's assume we are building an application that allows merchants manage their users, and in this application, a user can be a member of many merchants, and a merchant has many users.

In this case, we assume we have a `merchant_user` pivot table used as an intermediate table to link users to merchants, and a nullable `role` column to store the users role in a merchant.

```php title='sample database structure' 
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
```
:::caution 
Your pivot table **MUST** have a `role` column.

Alternatively, you can use any name of your choice, but ensure you update the new name as the value for `column_name` on the `config/roles-and-permissions.php` file.

It is important to note that the value set to the `column_name` key is what will be used on every pivot table of the application. Similarly, this value is what is used by the `model_role` table.
:::

## Quick Sample
The first step is to import the `Ajimoti\RolesAndPermissions\HasRoles` trait, and have a `belongs-to-many` relationship of the pivot table on the model.

From the above database structure, here is an illustration of what the user model should look like: 

```php title="app\Models\User.php" {2,6,9-12}
use Illuminate\Foundation\Auth\User as Authenticatable;
use Ajimoti\RolesAndPermissions\HasRoles;

class User extends Authenticatable
{
    use HasRoles;

    // ...
    public function merchants()
    {
    	return $this->belongsToMany(Merchant::class);
    }
    // ...
}
```
After importing the `HasRoles` trait and having the `BelongsToMany` relationship on the model, a user can now be assigned roles _**on a merchant**_.

After doing the above, the `HasRole` trait provides a `of()` method that can be used to perform roles and permissions related logic between two models via the `belongs to many` relationship.

The `of()` method returns an instance of `Ajimoti\RolesAndPermissions\Repositories\BelongsToManyRepository` class, which also has most of the [available methods](/docs/installation#available-methods) except `give()` `directPermissions()`, and `revoke()`.

:::info 
When the `of()` method is chained to a model, the package will automatically use Laravel relationship naming convention to guess the relationship name. Alternatively you can pass the relationship name as the second argument.
:::

## Usage
For the examples below, we would assume the variable `$merchant` is set to a merchant with name `wallmart` like so:
```php
$merchant = Merchant::where('name', 'wallmart')->first();
```

### assign()
Assign roles to a model. You can assign one or multiple roles to a model. 
The method can accept a role constant, or multiple role constants, or an array of role constants, or a collection of the roles. 
```php
// Give the user a super admin role
$user->of($merchant)->assign(Role::SuperAdmin); // returns boolean

// or give the user multiple roles
$user->of($merchant)->assign(Role::SuperAdmin, Role::Admin); // returns boolean
```

From the highlighted line above, the `$user` has been assigned a `super admin` role at wallmart. 

### roles()
Get every role that has been assigned to the user of a merchant.
```php
// Get user roles at the merchant
$user->of($merchant)->roles(); // returns a collection of the user roles
```
The method returns a `Ajimoti\RolesAndPermissions\Collections\RoleCollection` instance containing every role that has been assigned to the model. 

Similar to laravel's collection instances, you can loop through the role collection to access individual roles.

```php
foreach($user->of($merchant)->roles() as $role) {
	dd($role); // returns an instance of the role enum.
	dd($role->title); // 'Super admin'
	dd($role->key); // 'SuperAdmin'
	dd($role->value); // 'super_admin'
	dd($role->description); // 'Super admin'
	dd($role->permissions); // a collection of the role permissions
}
```

In the background, the `$user` model does not directly have these roles, the roles are only available to the user on the provided `$merchant`. i.e `$user->roles()` will not return any of the above roles provided the user not been assigned any of them directly.

```php
$user->roles(); // returns an empty collection

$user->of($merchant)->roles(); // returns an array of the user roles in the merchant
```

### permissions()
Get all the permissions the user has at a merchant. 
The method returns a collection of all permissions associated with the roles of the user in the merchant. 

```php
// Get user permissions in the merchant
// returns an collection of the user permissions in the provided merchant
$user->of($merchant)->permissions(); 
```

### holds($permissions)
Check if the model has the provided permissions at the merchant.

```php
// Check if the user has a permission
$user->of($merchant)->holds(Permission::DeleteProducts); // returns boolean
```

You can also check for a single permission like this:
```php 
$user->of($merchant)->canDeleteProducts(); // checks if the user has permissions to delete products on the merchant.

// $user->of($merchant)->can{permission_key}();
```
You can decide to check for multiple permissions at once; the method will only return `true` when the `$user` of the `$merchant` has all the permissions passed. If the model does not have any one of the permissions passed, it returns `false` .
```php
// Check if the user has any of the following permissions at the provided merchant
$user->of($merchant)->holds(Permission::DeleteProducts, Permission::DeleteTransactions); // returns boolean

// OR as an array
$user->of($merchant)->holds([Permission::DeleteProducts, Permission::DeleteTransactions]); // returns boolean
```

### hasRoles($roles)
Check if a user model has a specific role, or multiple roles at the provided merchant.
```php
$user->of($merchant)->hasRole(Role::SuperAdmin); // returns boolean

// Or
$user->of($merchant)->hasRoles(Role::SuperAdmin, Role::Customer); // returns boolean
$user->of($merchant)->hasRoles([Role::SuperAdmin, Role::Customer]); // returns boolean
```
When multiple roles are passed, the package will only return `true` if the model has all the roles passed. For convenience and better readability, you can also choose to pass multiple roles to the singularize method.

```php 
$user->hasRole(Role::SuperAdmin, Role::Customer) // returns true if the user has all roles
```

Similarly, you can choose to check for a single role like this:
```php 
$user->of($merchant)->isSuperAdmin(); // checks if the user has a super admin role on the merchant.

// $user->of($merchant)->is{role_key}();
```
### authorize($permissions)
For cases where you want to throw an exception when a `model` of another `model` does not have the permission, or multiple permissions.

```php
$user->of($merchant)->authorize(Permission::DeleteTransactions); // Throws a `PermissionDeniedException` if the user does not have the permission
```
The method returns `true` if the model has all the permission(s) passed, and throw a `PermissionDeniedException` exception if the model does not have at least one of the permissions passed.

The method also allows multiple arguments.
```php
// authorize multiple permissions
$user->of($merchant)->authorize(Permission::DeleteTransactions, Permission::BuyProducts);

// as an array
$user->of($merchant)->authorize([Permission::DeleteTransactions, Permission::BuyProducts]);
```

### authorizeRoles($role)
For cases where you want to throw an exception when a model of another model does not have one or multiple roles.
```php
$user->of($merchant)->authorizeRoles(Role::SuperAdmin); // throws a `PermissionDeniedException` exception if the user is not a super admin at the provided merchant

// Or authorize multiple roles
$user->of($merchant)->authorizeRoles(Role::SuperAdmin, Role::SuperAdmin); // throws a `PermissionDeniedException` exception if the user is not a super admin or an admin at the provided merchant
```
The method returns true if the model has the provided roles, and throws a `PermissionDeniedException` exception if the model does not have at least one of the roles passed.

:::info
You can also choose to use the the singularize version of this method to authorize one or multiple roles `authorizeRole($role)`.
:::

### removeRoles($roles)
Remove a role of a model on another model.

```php
// remove the super admin role from the user at the merchant
$user->of($merchant)->removeRoles(Role::SuperAdmin); // returns boolean
```

You can provide multiple roles
```php
// remove multiple roles
$user->of($merchant)->removeRoles(Role::SuperAdmin, Role::Admin); // returns boolean

// or as an array
$user->of($merchant)->removeRoles([Role::SuperAdmin, Role::Admin]); // returns boolean
```

By default, the pivot record will not deleted. Instead, the `role` column of that record is set to `null`. If you want the record to be deleted when the `removeRoles()` method is called, set the `$deletePivotOnRemove` property in your role enum to `true`.

```php title='app\Enums\Role.php' {17}
<?php
namespace App\Enums;

use Ajimoti\RolesAndPermissions\Helpers\BaseRole;

final class Role extends BaseRole
{
    const SuperAdmin = 'super_admin';
    const Admin = 'admin';
    const Customer = 'customer';

    /**
     * Decides if a pivot record should be delete when the role is removed.
     *
     * @var bool
     */
    protected static $deletePivotOnRemove = true;

}
```
:::info
You can also choose to use the singularize version of this method to remove one or multiple roles `removeRole($role)`. They will both perform the same thing
:::

:::danger 
When the `removeRoles()` is called without any arguments, the method will remove every role previously assigned to the user
```php
// remove all the user roles at the merchant
$user->of($merchant)->removeRoles(); // returns boolean
```
:::

## Setting a relationship name
When the `of()` method is chained to a model, the package will automatically use Laravel relationship naming convention to guess the relationship name. Alternatively you can pass the relationship name as the second argument.

**For example:**
Instead of following Laravel's naming convention, we will declare the `merchants` relationship on the user model like below:
`app\Models\User.php`
```php
// ...
    public  function  userMerchants()
    {
        return  $this->belongsToMany(Merchant::class);
    }
// ...
```

Using `$user->of($merchant)->assign(Role::SuperAdmin)` will throw the `InvalidRelationNameExceptionException` exception, as the package will try looking for a `merchants()` method instead of `userMerchants()`.

To fix this, you can pass your relationship name as the second argument of the `of()` method. So we have something like below
```php
$user->of($merchant, 'userMerchants')->assign(Role::SuperAdmin);
```