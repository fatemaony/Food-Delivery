import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home";
import AuthLayout from "../Layouts/AuthLayout";
import SignIn from "../Components/Auth/SignIn";
import SignUp from "../Components/Auth/SignUp";


export const router =createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children:[
      {
        index:true,
        Component:Home
      }
    ]
  },
  
    {
      path:'/',
      Component:AuthLayout,
      children:[
        {
          path:"signin",
          Component:SignIn
        },
        {
          path:"signUp",
          Component: SignUp
        }
      ]
    }
  
])