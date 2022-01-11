---
sidebar_position: 2
---

# Requirements
- PHP 8.0 or higher
- Laravel 8.0 or higher
- Upon installation, the package publishes a `config/roles-and-permissions.php` file, ensure you do not have a file with the same name in your config directory.

### Pros
- The package can be used on any model, i.e any model can be assigned roles, and permissions.
- Roles can be given multiple permissions.
- Models have permissions via roles.
- Models can be assigned multiple roles.
- A `many to many` relationship can be assigned roles. (i.e the package can be used on a pivot table).
- Supports role hierarchy. (A higher level role can be configured to have the permissions of lower level roles).

### Crons
- Permissions cannot be assigned directly on a `many to many` relationship.


:::note
This package leverages on [BenSampo laravel enum](https://github.com/BenSampo/laravel-enum) package. You can explore the documentation to better understand how it works.
