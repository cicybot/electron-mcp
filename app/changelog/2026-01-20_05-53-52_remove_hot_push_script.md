# Changelog: Remove hot-push script

## Changes Made

### Package.json Updates
- Removed the `hot-push` npm script from `app/package.json`
- Script was: `"hot-push": "nodemon --watch .. --exec \"cd .. && git add . && git commit -m 'auto' && git push origin mcp\" --delay 1"`

## Why This Change
- The hot-push script was automatically committing and pushing changes
- This could lead to unwanted commits and pushes
- Manual control over commits is preferred for better change management

## Technical Details
- Script removal only, no functional code changes
- Other scripts remain intact
- Maintains existing development workflow