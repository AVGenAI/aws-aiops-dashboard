#!/bin/bash

# Script to create a GitHub repository and push code
# This script requires GitHub CLI (gh) to be installed

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Repository details
REPO_NAME="aws-aiops-dashboard"
REPO_DESCRIPTION="A comprehensive dashboard for managing AWS resources with AIOps capabilities"
VISIBILITY="public" # or "private"
ORGANIZATION="AVGenAI" # Change this to your GitHub username or organization

echo -e "${YELLOW}AWS AIOps Dashboard - GitHub Repository Setup${NC}"
echo "======================================================="
echo ""

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}GitHub CLI (gh) is not installed.${NC}"
    echo "Please install it first:"
    echo "  - macOS: brew install gh"
    echo "  - Windows: winget install --id GitHub.cli"
    echo "  - Linux: https://github.com/cli/cli/blob/trunk/docs/install_linux.md"
    exit 1
fi

# Check if user is logged in to GitHub
echo "Checking GitHub authentication..."
if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}You need to log in to GitHub.${NC}"
    echo "Running 'gh auth login'..."
    gh auth login
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to authenticate with GitHub.${NC}"
        exit 1
    fi
fi

# Create the repository
echo ""
echo -e "${YELLOW}Creating GitHub repository: $ORGANIZATION/$REPO_NAME${NC}"
echo "Description: $REPO_DESCRIPTION"
echo "Visibility: $VISIBILITY"
echo ""

if [ -n "$ORGANIZATION" ] && [ "$ORGANIZATION" != "$(gh api user | jq -r .login)" ]; then
    # Create repository in organization
    gh repo create "$ORGANIZATION/$REPO_NAME" --description "$REPO_DESCRIPTION" --"$VISIBILITY"
else
    # Create repository for user
    gh repo create "$REPO_NAME" --description "$REPO_DESCRIPTION" --"$VISIBILITY"
fi

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to create repository.${NC}"
    echo "The repository might already exist or you might not have permission to create it."
    
    # Ask if user wants to continue with pushing to an existing repository
    read -p "Do you want to continue and push to an existing repository? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Set up git remote
echo ""
echo -e "${YELLOW}Setting up git remote...${NC}"

# Check if we're in the right directory
if [ ! -f "version.txt" ] || [ ! -d "app" ]; then
    echo -e "${RED}Error: This doesn't appear to be the AWS AIOps Dashboard directory.${NC}"
    echo "Please run this script from the root of the aws-aiops-dashboard project."
    exit 1
fi

# Set up git remote
if [ -n "$ORGANIZATION" ]; then
    git remote set-url origin "https://github.com/$ORGANIZATION/$REPO_NAME.git"
else
    git remote set-url origin "https://github.com/$(gh api user | jq -r .login)/$REPO_NAME.git"
fi

# Push the code
echo ""
echo -e "${YELLOW}Pushing code to GitHub...${NC}"
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}Success! Your code has been pushed to GitHub.${NC}"
    
    # Get the repository URL
    if [ -n "$ORGANIZATION" ]; then
        REPO_URL="https://github.com/$ORGANIZATION/$REPO_NAME"
    else
        REPO_URL="https://github.com/$(gh api user | jq -r .login)/$REPO_NAME"
    fi
    
    echo -e "Repository URL: ${GREEN}$REPO_URL${NC}"
    echo ""
    echo "You can now visit the repository in your browser."
else
    echo ""
    echo -e "${RED}Failed to push code to GitHub.${NC}"
    echo "Please check the error message above and try again."
fi
