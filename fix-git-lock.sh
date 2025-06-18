#!/bin/bash

echo "🔧 Fixing Git index lock issue..."

# Check if lock file exists
if [ -f ".git/index.lock" ]; then
    echo "Found .git/index.lock file"
    ls -la .git/index.lock
else
    echo "No .git/index.lock file found"
fi

# Check Git status to see if we can access the repository
echo "Checking Git repository status..."
git --version

# Try to check repository status
echo "Attempting to check Git status..."
git status 2>&1 || echo "Git status failed - this confirms the lock issue"

echo "Git lock diagnosis complete."
echo ""
echo "To resolve this in Replit:"
echo "1. Close any open Git panels in Replit"
echo "2. Refresh your browser tab"
echo "3. Wait 1-2 minutes for any background processes to finish"
echo "4. Try your Git operations again through Replit's interface"
echo ""
echo "If the issue persists, the lock file may need manual removal by Replit support."