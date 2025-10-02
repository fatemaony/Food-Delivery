import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home";
import AuthLayout from "../Layouts/AuthLayout";
import SignIn from "../Components/Auth/SignIn";
import SignUp from "../Components/Auth/SignUp";
import DashboardLayout from "../Layouts/DashboardLayout";

import UserHome from "../Components/Dashboard/UserDashboard/UserHome";
import AdminHome from "../Components/Dashboard/AdminDashboard/AdminHome";
import AddMenu from "../Components/Dashboard/AdminDashboard/AddMenu";
import AllMenu from "../Components/Dashboard/AdminDashboard/AllMenu";
import AllMenuCard from "../Pages/Menu/AllMenuCard";
import PrivateRouter from "../Private/PrivateRoute";
import MenuDetails from "../Pages/details/MenuDetails";


export const router =createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children:[
      {
        index:true,
        Component:Home
      },
      {
        path:"menus",
        Component:AllMenuCard
      },
      {
        path:"menuDetails/:id",
        element:<PrivateRouter>
          <MenuDetails/>
        </PrivateRouter>
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
    },
    {
      path:"/dashboard",
      Component:DashboardLayout,
      children:[
        {
          index: true,
          Component: UserHome
        },
        {
          path: "admin",
          Component: AdminHome
        },
        {
          path: "user",
          Component: UserHome
        },
        {
          path:"Admin/AddMenu",
          Component:AddMenu
        },
        {
          path:"admin/allMenu",
          Component:AllMenu
        }
      ]
      
    }
  
])