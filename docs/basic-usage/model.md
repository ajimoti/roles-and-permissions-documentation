---
sidebar_position: 1
title: 'Model'
---

## Overview
The roles and permissions package can be used on any model. The first step is to import the `Tarzancodes\RolesAndPermissions\HasRoles` trait in your model. Once imported, an instance of the model can now be assigned roles and permissions.

:::caution
As stated in the previous chapter, for the package to work fine, ensure you do not have any of the following methods in your model file. 

`assign()`, `of()` `holds()`, `hasRole()`, `hasRoles()`, `authorize()`, `authorizeRole()`, `authorizeRoles()`, `removeRole()`, `removeRoles()`, `modelRoles()`
:::

## How it works
When a model is assigned a role, the model inherits the permissions associated with the role. You will learn more about how to associate permissions with roles in the next chapter.

## Quick Sample
Here is an illustration of how to import and use the `HasRole` trait on a model. 

For better understanding, we will use the `user` model as an example. 

```php title="app\Models\User.php" {2,6}
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tarzancodes\RolesAndPermissions\HasRoles;

class User extends Authenticatable
{
    use HasRoles;
    // ...
}
```

From the example above, we have imported the `HasRole` trait, and used it in the class; therefore an instance of the `App\Models\User` class can now be assigned roles and permissions.

After assigned roles the model inherits the permissions associated with the assigned roles.

:::note
You will later learn how to associate permissions with roles in the [enum files section](https://blah.com).
:::

## Usage
Examples of how to use the methods made available by the trait
### assign()
Assign roles to a model. You can assign one or multiple roles to a model. 
The method can accept a role constant, or multiple role constants, or an array of role constants, or a collection of the roles. 
```php
// give the user a super admin role
$user->assign(Role::SuperAdmin); // returns boolean

// or give the user multiple roles
$user->assign(Role::SuperAdmin, Role::Admin); // returns boolean

// or pass a collection of roles
$roles = Role::collect([Role::SuperAdmin, Role::Admin]);
$user->assign($role); // returns boolean
```

### roles()
Get every role that has been assigned to a model.
```php
// Get user roles
$user->roles(); // returns a collection of the user roles
```
The method returns a `Tarzancodes\RolesAndPermissions\Collections\RoleCollection` instance containing every role that has been assigned to the model. 

Similar to laravel's collection instances, you can loop through the role collection to access individual roles.

```php
foreach($user->roles() as $role) {
	dd($role); // returns an instance of the role enum.
	dd($role->title); // 'Super admin'
	dd($role->key); // 'SuperAdmin'
	dd($role->value); // 'super_admin'
	dd($role->description); // 'Super admin'
	dd($role->permissions); // a collection of the permissions associated with this role
}
```

From the above snippet, you every `$role` variable is an instance of the `App\Enums\Role` enum class. 

Below is a table explaining how the properties of the object are set.

| Property | Description |  
| ----------- | ----------- |  
| `permissions` | The permissions of the role |  
| `value` | This is the value the role constant is set to |  
| `key` | This is the same text as the constant's declaration |
|`description`|This is a conversion of the constant to `constant` to `sentence case`. You can use the `getDescription($value)` method to overwrite this behavior. _(you will learn more about this on the enum page)_. |

:::tip
`Tarzancodes\RolesAndPermissions\Collections\RoleCollection` is an extension of laravel `Illuminate\Support\Collection`. This means you can treat the `roles()` response as a laravel collection. You can chain any method to e.g `$user->roles()->toArray()`

We will better explain how to use the `RoleCollection` in the digging deep section.
::: 

### permissions()
Get all the model permissions.
```php
// Get user permissions
$user->permissions(); // returns an collection of the user permissions
```
The `permissions()` method returns a collection of all permissions associated with the roles of the model. 

For instance, if the `$user` model above has been assigned a `SuperAdmin` and `Admin` role, a collection of the `SuperAdmin` and `Admin` permissions will be returned.

Similarly, you can get the permissions of a user by calling the `getPermissions()` method on the role collection like so: `$user->roles()->getPermissions();`

### holds($permissions)
Check if the model holds all the provided permissions.

```php
// Check if the user has a permission
$user->holds(Permission::DeleteProducts); // returns boolean
```

You can decide to check for multiple permissions at once; the method will only return `true` when the model has all the permissions passed. If the model does not have at least one of the permissions passed, it returns `false` .
```php
// Check if the user has any of the following permissions.
$user->holds(Permission::DeleteProducts, Permission::DeleteTransactions); // returns boolean

// or as an array
$user->holds([Permission::DeleteProducts, Permission::DeleteTransactions]); // returns boolean


// or as a collection of permissions
$multiplePermissions = Role::SuperAdmin()->permissions;
$user->holds($multiplePermissions); // returns boolean

// or
$multiplePermissions = Role::getPermissions(Role::SuperAdmin, Role::Admin);
$user->holds($multiplePermissions); // returns boolean
```

:::tip
Models have permissions via roles, this means a model has the permissions that are associated with the roles they have been assigned. 

For instance, if a `$user` model has been assigned the `SuperAdmin` and `Admin` roles, the user has all the permissions associated with both roles.
:::

### hasRoles($roles)
Check if a model has a specific role, or multiple roles
```php
$user->hasRole(Role::SuperAdmin); // returns boolean

// Or multiple roles 
$user->hasRoles(Role::SuperAdmin, Role::Customer); // returns boolean
$user->hasRoles([Role::SuperAdmin, Role::Customer]); // returns boolean
```
When multiple roles are passed, the package will only return `true` if the model has all the roles passed.

For convenience and better readability, you can also choose to use the singularize method. The singularize method `hasRole()` does the same thing the `hasRoles()` method does.

```php 
$user->hasRole(Role::SuperAdmin) // returns true if the user has the provided role
```

### authorize($permissions)
For cases where you want to throw an exception when a model does not have a permission, or multiple permissions.

```php
$user->authorize(Permission::DeleteTransactions); // Throws a `PermissionDeniedException` if the user does not have this permission
```
The method returns `true` if the model has all the permissions passed, and throw a `PermissionDeniedException` exception if the model does not have at least one of the permissions passed.

The method also allows multiple arguments.
```php
// authorize multiple permissions
$user->authorize(Permission::DeleteTransactions, Permission::BuyProducts);

// an array
$user->authorize([Permission::DeleteTransactions, Permission::BuyProducts]);

// a collection of permissions
$multiplePermissions = Role::SuperAdmin()->permissions;
$user->authorize($multiplePermissions);
```

### authorizeRoles($role)
For cases where you want to throw an exception when a model does not have one or multiple roles.
```php
$user->authorizeRoles(Role::SuperAdmin); // throws a `PermissionDeniedException` exception if the user is not a super admin

// Or authorize multiple roles
$user->authorizeRoles(Role::SuperAdmin, Role::SuperAdmin); // throws a `PermissionDeniedException` exception if the user is not a super admin
```
The method returns true if the model has the provided roles, and throws a `PermissionDeniedException` exception if the model does not have at least one of the roles passed. 

You can also choose to use the the singularize version of this method to authorize one or multiple roles `authorizeRole($role)`.

### removeRoles($roles)
Remove the provided role from the model.
```php
// a role can be removed from a user
$user->removeRoles(Role::SuperAdmin); // returns boolean
```

:::danger 
When the `removeRoles()` is called without any arguments, the method will remove every role previously assigned to the user

```php
// remove all the user roles
$user->removeRoles(); // returns boolean
```
:::

You can provide multiple roles
```php
// remove multiple roles
$user->removeRoles(Role::SuperAdmin, Role::Admin); // returns boolean

// or as an array
$user->removeRoles([Role::SuperAdmin, Role::Admin]); // returns boolean
```

You can also choose to use the singularize version of this method to remove one or multiple roles `removeRole($role)`. They both perform the same thing.

## Direct Permissions
You have learnt how to assign roles to a model, and that models inherits the permissions associated with the roles they have. But in some cases, you may choose to give permissions directly to a model. 

For example in your application, you may want to give a particular user access to some documents that only the super admin has access to without giving the user the privileges of an admin:


### give($permissions) : bool
Give permissions directly to a model.
```php
use App\Enums\Permission;

$user->give(Permission::DeleteTransactions); // returns boolean

// or multiple permissions
$user->give(Permission::DeleteTransactions, Permission::DestroyEnemies);

// Check if the user has the permission
$user->holds(Permission::DeleteProducts) // returns true
```

When a model is assigned a permission directly, the permission is also made available when the `->permissions()` method is called. Similarly, the `holds($permissions)` and `authorize($permissions)` methods will also true if the given permission is also passed as an argument.
### revoke($permissions) : bool
Revoke permissions that were directly given to a model.
```php
use App\Enums\Permission;

$user->revoke(Permission::DeleteTransactions); // returns boolean

// or multiple permissions
$user->revoke(Permission::DeleteTransactions, Permission::DestroyEnemies);
```

:::danger 
Similar to the `removeRoles()` method, when the `revoke()` method is called without any arguments, the method will remove every permission previously given to the model directly.

```php
// remove every direct permission that has been given to the user 
$user->revoke(); // returns boolean
```
:::
