# YAML Basics

YAML (YAML Ain’t Markup Language) is a human-readable data serialization format often used for configuration files.

## Key Principles

- **Indentation**: Always use spaces (not tabs).  
- **Data Structures**: Supports scalars (strings, numbers), lists, and dictionaries.  
- **Case Sensitivity**: YAML is case sensitive.  
- **Comments**: Use the hash symbol (#) for comments.

```yaml
# Example of a YAML configuration

server:
  name: "MyApplication"
  port: 8080

database:
  host: localhost
  username: "root"
  password: "pass"

# Lists:
services:
  - frontend
  - backend
  - database
```
