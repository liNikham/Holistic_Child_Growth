import React from 'react'
import LoginError from '../components/LoginError'
import { useSelector } from 'react-redux'
import LoginLoading from '../components/LoginLoading'
import { Link } from 'react-router-dom'

const LandingPage = () => {
  const { currentUser, loginLoading, loginError } = useSelector(state => state.user)
  if (loginError) {
    return <LoginError />
  }
  if (loginLoading) {
    return <LoginLoading />
  }
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-400">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Track Your Child's Growth Journey
            </h1>
            <p className="mt-6 text-xl text-blue-100 max-w-2xl mx-auto">
              Monitor milestones, get personalized activities, and create lasting memories
              of your child's development.
            </p>
            <div className="mt-10">
              <Link
                to="/register"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Everything you need to track your child's development
            </h2>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Milestone Tracking */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-blue-600 text-2xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2">Milestone Tracking</h3>
                <p className="text-gray-600">
                  Track important developmental milestones based on age-appropriate guidelines.
                </p>
              </div>

              {/* Activity Suggestions */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-blue-600 text-2xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-2">Activity Suggestions</h3>
                <p className="text-gray-600">
                  Get personalized activity suggestions to support your child's development.
                </p>
              </div>

              {/* Growth Journal */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-blue-600 text-2xl mb-4">📝</div>
                <h3 className="text-xl font-semibold mb-2">Growth Journal</h3>
                <p className="text-gray-600">
                  Create a beautiful digital journal of your child's growth journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage