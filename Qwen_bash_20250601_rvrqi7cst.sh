# Initialize git
git init

# Create .gitignore (optional)
echo "node_modules" > .gitignore
echo ".env" >> .gitignore

# Add remote GitHub repo
git remote add origin https://github.com/YOUR_USERNAME/dream-interpreter.git 

# Optional: Rename branch to main
git branch -M main