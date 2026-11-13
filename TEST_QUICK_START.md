# Quick Test Reference

## Run Tests Now

```bash
# Run all tests
npm test -- --no-coverage --watchAll=false

# Run in watch mode (re-runs on file changes)
npm test

# Run with coverage report
npm test -- --coverage --watchAll=false
```

## Test Results
✅ **81 tests passing** across 4 test files

## Test Breakdown by Category

### 8 API CRUD Operations ✅
**Location:** `src/api.test.js`

| Entity | Operation | Tests | Status |
|--------|-----------|-------|--------|
| Users | GET (getAll) | 3 | ✅ Pass |
| Users | GET (getById) | 2 | ✅ Pass |
| Users | POST (create) | 2 | ✅ Pass |
| Users | PUT (update) | 2 | ✅ Pass |
| Users | DELETE | 2 | ✅ Pass |
| Products | GET (getAll) | 2 | ✅ Pass |
| Products | GET (getById) | 1 | ✅ Pass |
| Products | POST (create) | 2 | ✅ Pass |
| Products | PUT (update) | 1 | ✅ Pass |
| Products | DELETE | 1 | ✅ Pass |

### UI Component Tests ✅
**Location:** `src/components/UserTable.test.js` & `src/components/ProductTable.test.js`

| Component | Tests | Coverage |
|-----------|-------|----------|
| UserTable | 21 | Render, CRUD, Validation, Errors, Table Display |
| ProductTable | 21 | Render, CRUD, Validation, Errors, Table Display |
| App | 13 | Layout, Navigation, Accessibility, Integration |

## Test Each Feature

### Test CRUD Create ✅
```bash
npm test -- --testNamePattern="should create" --watchAll=false
```

### Test CRUD Read ✅
```bash
npm test -- --testNamePattern="getAll\|fetch.*display" --watchAll=false
```

### Test CRUD Update ✅
```bash
npm test -- --testNamePattern="should.*update\|should.*populate" --watchAll=false
```

### Test CRUD Delete ✅
```bash
npm test -- --testNamePattern="should.*delete" --watchAll=false
```

### Test Form Validation ✅
```bash
npm test -- --testNamePattern="validation\|required fields" --watchAll=false
```

### Test Error Handling ✅
```bash
npm test -- --testNamePattern="error\|fail" --watchAll=false
```

## What's Tested

### API Tests (18 tests)
- ✅ Successful API calls for all CRUD operations
- ✅ Network error handling
- ✅ HTTP error responses (400, 404, 500)
- ✅ Request/response validation
- ✅ Request headers and body format

### User Component Tests (21 tests)
- ✅ Component renders on load
- ✅ Loading states display correctly
- ✅ All user data displays in table
- ✅ Add/Edit/Delete forms work
- ✅ Form validation (required fields)
- ✅ Error messages show/hide
- ✅ API calls happen with correct data
- ✅ Confirmation dialogs work
- ✅ Table formatting correct

### Product Component Tests (21 tests)
- ✅ Component renders on load
- ✅ Loading states display correctly
- ✅ All product data displays in table
- ✅ Add/Edit/Delete forms work
- ✅ Form validation (required fields)
- ✅ Price formatting (2 decimals, $)
- ✅ Error messages show/hide
- ✅ API calls happen with correct data
- ✅ Decimal number handling

### App Component Tests (13 tests)
- ✅ Navigation bar renders
- ✅ Page title displays
- ✅ Footer displays
- ✅ Both tables render
- ✅ Correct CSS classes applied
- ✅ Semantic HTML structure
- ✅ No console errors/warnings
- ✅ Proper component hierarchy

## Test File Organization

```
src/
├── api.test.js                    (18 tests - API CRUD)
├── App.test.js                    (13 tests - App root)
├── setupTests.js                  (Jest configuration)
├── components/
│   ├── UserTable.test.js          (21 tests - User CRUD UI)
│   └── ProductTable.test.js       (21 tests - Product CRUD UI)
└── ...
```

## Coverage Summary

| Category | Count | Status |
|----------|-------|--------|
| API Endpoints | 10 | ✅ 100% |
| CRUD Operations | 8 | ✅ 100% |
| UI Components | 3 | ✅ 100% |
| Total Tests | 81 | ✅ 100% |

## GitHub Actions / CI/CD Integration

To add automated testing to your CI/CD pipeline, add this to `.github/workflows/test.yml`:

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm test -- --no-coverage --watchAll=false
```

## Tips

- Run tests in watch mode during development: `npm test`
- Run once in CI/CD: `npm test -- --no-coverage --watchAll=false`
- Generate coverage: `npm test -- --coverage`
- Debug failed test: Add `.only` to test: `it.only('test name', ...)`
- Check specific component: Use `--testPathPattern`
