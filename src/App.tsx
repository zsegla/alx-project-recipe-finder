import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { Toaster } from "sonner";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import RecipeDetail from "./pages/RecipeDetail";
import Favorites from "./pages/Favorites";
import ShoppingList from "./pages/ShoppingList";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="flex-1">
          <Content />
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Authenticated>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/shopping-list" element={<ShoppingList />} />
        </Routes>
      </Authenticated>
      <Unauthenticated>
        <div className="flex flex-col items-center justify-center min-h-96 px-4 dark:bg-gray-900">
          <div className="w-full max-w-md mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">MealFinder</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Discover delicious recipes from around the world
            </p>
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>
    </>
  );
}
