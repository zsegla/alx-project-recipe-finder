# MealFinder - Recipe Discovery App

A modern, responsive recipe discovery app built with React, Convex, and TheMealDB API. Search for recipes by dish name, browse categories, view detailed cooking instructions with embedded videos, and manage your favorites and shopping list.

## Features

### 🔍 **Smart Search & Browse**
- Search recipes by dish name using TheMealDB API
- Browse recipes by predefined categories (Beef, Chicken, Dessert, etc.)
- Real-time search results with loading states
- User-friendly "no results found" messages

### 📱 **Responsive Design**
- Clean, modern interface with consistent colors and typography
- Fully responsive layout for desktop, tablet, and mobile
- Dark mode toggle for low-light usability
- Touch-friendly interface elements

### 🍽️ **Recipe Details**
- High-resolution recipe images
- Complete ingredient lists with quantities
- Step-by-step preparation instructions
- Embedded YouTube cooking videos (when available)
- Direct links to original recipe sources
- Category and cuisine information

### ❤️ **Favorites System**
- Save and manage favorite recipes
- Persistent storage with Convex database
- Real-time updates across devices
- Easy add/remove with heart icon

### 🛒 **Shopping List**
- Add ingredients directly from recipe details
- Editable shopping list with local storage persistence
- Mark items as completed/uncompleted
- Remove items from the list
- Organized view of pending and completed items

### 🔐 **User Authentication**
- Secure login with Convex Auth
- User-specific favorites and shopping lists
- Protected routes and data

### ⚡ **Performance & UX**
- Real-time updates using Convex's reactive database
- Graceful error handling with informative messages
- Loading states and skeleton screens
- Toast notifications for user feedback

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Convex (database, auth, API functions)
- **Routing**: React Router DOM
- **API**: TheMealDB API (free, no API key required)
- **Styling**: Tailwind CSS with dark mode support
- **Notifications**: Sonner
- **State Management**: React hooks (useState, useEffect)

## Project Structure

```
src/
├── components/
│   ├── Header.tsx          # Navigation with dark mode toggle
│   ├── SearchForm.tsx      # Recipe search form
│   ├── RecipeCard.tsx      # Individual recipe card
│   ├── RecipeList.tsx      # Grid of recipe cards
│   └── CategoryGrid.tsx    # Browse categories grid
├── pages/
│   ├── Home.tsx           # Main search and browse page
│   ├── RecipeDetail.tsx   # Detailed recipe view
│   ├── Favorites.tsx      # User's favorite recipes
│   └── ShoppingList.tsx   # Editable shopping list
└── App.tsx               # Main app component with routing

convex/
├── schema.ts             # Database schema
├── recipes.ts           # Recipe-related functions
└── auth.ts             # Authentication setup
```

## Key Features in Detail

### Search & Display
- **Smart Search**: Find recipes by dish name with real-time results
- **Category Browse**: Explore recipes by food categories
- **Recipe Cards**: Display thumbnail, title, category, and cuisine
- **Responsive Grid**: Adapts to screen size (1-4 columns)

### Recipe Details View
- **Complete Information**: Ingredients with quantities, instructions, nutrition
- **Video Integration**: Embedded YouTube videos when available
- **Source Links**: Direct links to original recipe sources
- **Interactive Elements**: Add to favorites, add ingredients to shopping list

### User Experience
- **Loading States**: Skeleton screens during data fetching
- **Error Handling**: Graceful handling of network errors and API failures
- **Toast Notifications**: User feedback for actions
- **Dark Mode**: Toggle for better usability in low light

### Data Management
- **Favorites**: Persistent storage of user's favorite recipes
- **Shopping List**: Add ingredients from recipes, mark as completed
- **Real-time Sync**: Updates across devices using Convex

## API Integration

The app uses TheMealDB API which provides:
- Free access with no API key required
- Recipe search by name
- Browse by categories
- Detailed recipe information including ingredients and instructions
- High-quality recipe images
- YouTube video links for cooking tutorials

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Access the App**
   - The app will open automatically in your browser
   - Create an account or sign in to start using features

## Usage

1. **Sign Up/Login**: Create an account to access all features
2. **Search Recipes**: Enter dish names in the search bar
3. **Browse Categories**: Click category tiles to explore recipes
4. **View Details**: Click recipe cards for detailed information
5. **Save Favorites**: Click heart icons to save recipes
6. **Build Shopping List**: Add ingredients from recipe details
7. **Manage Lists**: View and edit favorites and shopping list

## Optional Enhancements Implemented

- ✅ **Favorites List**: With persistent storage
- ✅ **Shopping List**: Editable with ingredient management
- ✅ **Category Browse**: Predefined category exploration
- ✅ **Dark Mode**: Toggle for low-light usability
- ✅ **Responsive Design**: Works on all device sizes
- ✅ **Video Integration**: Embedded YouTube tutorials
- ✅ **Real-time Updates**: Live data synchronization

## Error Handling

- Network error recovery with retry mechanisms
- Invalid API response handling
- User-friendly error messages
- Graceful fallbacks for missing data
- Loading states for better UX

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on different devices
5. Submit a pull request

## License

This project is open source and available under the MIT License.
