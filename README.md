## Development

- Copy the `.env.example` file and paste the necessary values into the `.env` file.
- Follow naming conventions stated below.
- Install `prettier` in your code editor and use project's `.prettierrc` configuration file.
- The project uses the husky `pre-commit` script, which runs the linter on every commit. If you commit and encounter lint errors, you should fix them first, then run `git add .` and commit again.
- Always create PR to the `dev` branch first.

## Naming convention

### Types, interfaces and classes - Pascal case

```ts
interface User {}

type Session = {};

class User {
  constructor() {}
}
```

> [!NOTE]
> Prefer interfaces over types.

### Files - Kebab case

```sh
user.ts
user-auth.ts
```

### Constants - ALL CAPS

```ts
const SESSION_TIMEOUT = 50;
```

### Enums - Pascal case and members all caps

```ts
enum UserRoles {
  ADMIN = 'admin',
  USER = 'user',
}
```

### Constant values - lower case

```ts
const USER_ROLE = 'admin';
```

### Variables and functions - Camel case

```ts
function getUser() {}
const userData = {};
```

### Use absolute path imports

```ts
// Good:
import config from '@/config/common'
import config from '@/config'

// Bad:
import config from '../../../config'
```
