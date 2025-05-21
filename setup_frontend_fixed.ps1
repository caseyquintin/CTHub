# Fixed Frontend Setup Script

# Navigate to the frontend directory
cd "$PSScriptRoot\CTS\Frontend"

# Create package.json with compatible TypeScript version
$packageJson = @"
{
  "name": "container-tracking-system",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@headlessui/react": "^1.7.15",
    "@heroicons/react": "^2.0.18",
    "@tailwindcss/forms": "^0.5.3",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.4.3",
    "@types/jest": "^29.5.2",
    "@types/node": "^20.2.5",
    "@types/react": "^18.2.9",
    "@types/react-dom": "^18.2.4",
    "axios": "^1.4.0",
    "classnames": "^2.3.2",
    "date-fns": "^2.30.0",
    "formik": "^2.4.1",
    "react": "^18.2.0",
    "react-datepicker": "^4.14.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.12.1",
    "react-scripts": "5.0.1",
    "react-table": "^7.8.0",
    "react-toastify": "^9.1.3",
    "typescript": "^4.9.5",
    "web-vitals": "^3.3.2",
    "yup": "^1.2.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "@types/react-datepicker": "^4.11.2",
    "@types/react-table": "^7.7.14",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.24",
    "tailwindcss": "^3.3.2"
  }
}
"@

# Write the package.json file
Set-Content -Path package.json -Value $packageJson

# Install dependencies with legacy peer deps flag
npm install --legacy-peer-deps

# Create .env file for API URL configuration
Set-Content -Path .env -Value "REACT_APP_API_URL=https://localhost:7243/api"

Write-Host "Frontend dependencies installed with compatible TypeScript version."
Write-Host "Run 'cd $PSScriptRoot\CTS\Frontend && npm start' to start the development server."