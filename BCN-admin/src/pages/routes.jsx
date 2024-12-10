// Admin Dashboard Routes
import ApprovalRequests from './approvalRequests'
import ChangePin from './changePin'
import DashboardFeatures from './dashboard/features'
import DashboardDemographics from './dashboard/demographics'
import DashboardDemographicsTestimonies from './dashboard/demographics/testimonies'
import DashboardDemographicsFaqs from './dashboard/demographics/faq'
import CategoryAnalytics from './dashboard/features/categoryAnalytics'
import AddOrEditCategory from './dashboard/features/addOrEditCategory'
import EditProfile from './editProfile'
import Login from './login'
import SignOut from './signOut'
import Users from './users'

// User Admin Routes
import ChangeUserPin from './userAdmin/changePin'
import EditUserProfile from './userAdmin/editProfile'
import Listings from './userAdmin/business/listings'
import AddOrEditListing from './userAdmin/business/listings/addOrEditListing'
import Business from './userAdmin/business'
import ViewBusinessLeads from './userAdmin/business/viewLeads'
import RegisterBusiness from './userAdmin/business/register'
import Notifications from './userAdmin/notifications'
import ViewLeads from './userAdmin/business/listings/viewLeads'
import Subscription from './userAdmin/subscription'
import MemberShipCard from './userAdmin/memberShipCard'

import * as Layout from 'layouts'

const dashboardRoutes = [
  {
    path: '/admin/approvalRequests',
    Component: ApprovalRequests,
    Super: Layout.Admin,
    auth: true
  },
  {
    path: '/admin/changePin',
    Component: ChangePin,
    Super: Layout.Admin,
    auth: true
  },
  {
    path: '/admin/dashboard/features',
    Component: DashboardFeatures,
    Super: Layout.Admin,
    auth: true
  },
  {
    path: '/admin/dashboard/features/category/:categoryId',
    Component: CategoryAnalytics,
    Super: Layout.Admin,
    auth: true
  },
  {
    path: '/admin/dashboard/features/category/:categoryId/editCategory',
    Component: AddOrEditCategory,
    Super: Layout.Admin,
    auth: true
  },
  {
    path: '/admin/dashboard/demographics',
    Component: DashboardDemographics,
    Super: Layout.Admin,
    auth: true
  },
  {
    path: '/admin/dashboard/demographics/testimonies',
    Component: DashboardDemographicsTestimonies,
    Super: Layout.Admin,
    auth: true
  },
  {
    path: '/admin/dashboard/demographics/faq',
    Component: DashboardDemographicsFaqs,
    Super: Layout.Admin,
    auth: true
  },
  {
    path: '/admin/editProfile',
    Component: EditProfile,
    Super: Layout.Admin,
    auth: true
  },
  {
    path: '/login',
    Component: Login,
    auth: false
  },
  {
    path: '/signOut',
    Component: SignOut,
    Super: Layout.Admin,
    auth: true
  },
  {
    path: '/admin/users',
    Component: Users,
    Super: Layout.Admin,
    auth: true
  },
  {
    path: '/admin/users/addUser',
    Component: EditUserProfile,
    Super: Layout.Admin,
    auth: true
  }
]

const userAdminRoutes = [
  {
    path: '/userAdmin/editProfile',
    Component: EditUserProfile,
    Super: Layout.UserAdmin,
    auth: true
  },
  {
    path: '/userAdmin/editProfile/changePin',
    Component: ChangeUserPin,
    Super: Layout.UserAdmin,
    auth: true
  },
  {
    path: '/userAdmin/businesses/:businessId/listings',
    Component: Listings,
    Super: Layout.UserAdmin,
    auth: true
  },
  {
    path: '/userAdmin/businesses/:businessId/listings/addListing',
    Component: AddOrEditListing,
    Super: Layout.UserAdmin,
    auth: true
  },
  {
    path: '/userAdmin/businesses/:businessId/listings/editListing/:listingId',
    Component: AddOrEditListing,
    Super: Layout.UserAdmin,
    auth: true
  },
  {
    path: '/userAdmin/businesses',
    Component: Business,
    Super: Layout.UserAdmin,
    auth: true
  },
  {
    path: '/userAdmin/businesses/viewLeads/:businessId',
    Component: ViewBusinessLeads,
    Super: Layout.UserAdmin,
    auth: true
  },
  {
    path: '/userAdmin/businesses/editBusiness/:partNo/:businessId',
    Component: RegisterBusiness,
    Super: Layout.UserAdmin,
    auth: true
  },
  {
    path: '/userAdmin/businesses/registerBusiness/:partNo',
    Component: RegisterBusiness,
    Super: Layout.UserAdmin,
    auth: true
  },
  {
    path: '/userAdmin/businesses/listings/viewLeads/:listingId',
    Component: ViewLeads,
    Super: Layout.UserAdmin,
    auth: true
  },
  {
    path: '/userAdmin/notifications',
    Component: Notifications,
    Super: Layout.UserAdmin,
    auth: true
  },
  {
    path: '/userAdmin/subscription',
    Component: Subscription,
    Super: Layout.UserAdmin,
    auth: true
  },
  {
    path: '/userAdmin/memberShipCard',
    Component: MemberShipCard,
    Super: Layout.UserAdmin,
    auth: true
  }
]

const routes = [...dashboardRoutes, ...userAdminRoutes]

export default routes
