---
title: 'Installation'
sidebar_position: 3
---

You can install the package via composer:
```bash
composer require ajimoti/roles-and-permissions
```

If you have existing pivot tables that you want to apply the package on, you can add the table names to the `pivot.tables` array in the `config/roles-and-permissions.php` config file. The command below will add a `role` column to every pivot table provided in the array.

Run the command below, then you are set to use the package.

```bash
php artisan roles:install
```
The above command does the following:
- Publishes a configuration file `config/roles-and-permissions.php`.
- Creates a `app\Enums\Role.php` file with sample roles.
- Creates a `app\Enums\Permission.php` file with sample permissions.
- Creates a `model_role` table which will be used to link `models` and `roles`.
- Creates a `model_permission` table which will be used to link `models` and `permissions`.
- Adds a `role` column to every pivot table listed in the `pivot.tables` array on the `config/roles-and-permissions.php` (if any).

:::caution
When the `php artisan roles:install` command is ran, the command will also attempt to run the migration command.

Ensure you do not have migration files that you are not ready to run.
:::

## After installation
After installing the package, a `Ajimoti\RolesAndPermissions\HasRoles` trait is made available to your application. This trait enables smooth communication between your models and the package.

### Importing the trait:
To assign roles and permissions to an eloquent object, you have to import the trait in the eloquent class.

For better understanding, we will be using the `App\Models\User` model in most of our examples, but the package use _**is not**_ limited to the user model alone, it can be used on any eloquent model.

Additionally, for the package to work fine, your model **must not** have any of the methods listed below as this will interfere with how the package interacts with your model:

:::caution methods not allowed
`assign()`, `of()` `holds()`, `hasRole()`, `hasRoles()`, `authorize()`, `authorizeRole()`, `authorizeRoles()`, `removeRole()`, `removeRoles()`, `modelRoles()`, `give()`, `revoke()`, `directPermissions()`  
:::   

Below is an example of how to import and use the trait:
```php title="app\Models\User.php" {2,6}
use Illuminate\Foundation\Auth\User as Authenticatable;
use Ajimoti\RolesAndPermissions\HasRoles;

class User extends Authenticatable
{
    use HasRoles;
    // ...
}
```

### Available Methods
After importing the trait in your model, the following methods are available for use on the model instance.

We will touch on how to use each one of them in the next chapter.

| Method | Description |  Response Type |
| ----------- | ----------- | ----------- |  
| `assign($roles)` | Assign one or multiple roles to a model.  |  `boolean`  | 
| `holds($permissions)` | Check if a model has all the provided permissions.  |  `boolean`  |  
| `can($permission)` | Check if a model can perform a permission. Similar to the `holds()` method, but this **only** accepts one permission.  |  `boolean`  |  
| `hasRoles($roles)` | Check if the model has been assigned all the provided roles. You can also use `hasRole($role)` to achieve the same result  |  `boolean`  |   
| `authorize($permissions)` | Throw an exception if the model does not have any of the provided permissions.  |  `true` or `PermissionDeniedException`  | 
| `authorizeRole($roles)` | Throw an exception if the model does not have any of the provided roles.  |  `true` or `PermissionDeniedException`  | 
| `removeRoles()` | Remove all roles that has been assigned to the model  |  `boolean`  |  
| `removeRoles($roles)` | Remove the provided roles from the model. Similarly, you can also use `removeRole($role)`.  |  `boolean`  |  
| `roles()` | Get the model roles  |  `RoleCollection`  |  
| `permissions()` | Get the model permissions  |  `PermissionCollection`  |  


### Only on models
The following methods are only available when using the package on a model. They are not available on a `many-to-many` relationship.

| Method | Description |  Response Type |
| ----------- | ----------- | ----------- |  
| `give()` | Get the model permissions directly  |  `boolean`  |  
| `directPermissions()` | Get permissions that were directly given to the model  |  `PermissionCollection`  |  
| `revoke()` | Revoke permissions that were directly given to the model |  `boolean`  |  
