import React from 'react'
import LoginError from '../components/LoginError'
import { useSelector } from 'react-redux'
import LoginLoading from '../components/LoginLoading'
import { Link } from 'react-router-dom'
import { FaQuoteRight, FaUserShield, FaChartLine, FaBrain, FaBook, FaCalendarCheck, FaHeart, FaLock, FaArrowRight, FaChild, FaStar, FaMobileAlt, FaUsers, FaShieldAlt, FaRocket, FaComments, FaAward } from 'react-icons/fa'
import { motion } from 'framer-motion'

const fadeInUp = {
  initial: {
    opacity: 0,
    y: 60
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const fadeInLeft = {
  initial: {
    opacity: 0,
    x: -60
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const fadeInRight = {
  initial: {
    opacity: 0,
    x: 60
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const scaleIn = {
  initial: {
    opacity: 0,
    scale: 0.8
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const LandingPage = () => {
  const { currentUser, loginLoading, loginError } = useSelector(state => state.user)
  if (loginError) {
    return <LoginError />
  }
  if (loginLoading) {
    return <LoginLoading />
  }
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-pink-50 opacity-70"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Cpath d="M0 0h20L0 20z"/%3E%3C/g%3E%3C/svg%3E")',
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        {/* Navigation */}
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <FaChild className="text-blue-600 text-3xl" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Child Growth
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-6 py-2.5 rounded-full hover:bg-blue-700 transition-all duration-300 font-medium shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </motion.nav>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="relative z-10"
            >
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-50 rounded-full filter blur-3xl opacity-50"></div>
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-pink-50 rounded-full filter blur-3xl opacity-50"></div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Track Your Child's
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                  Growth Journey
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                A comprehensive platform for monitoring milestones, daily activities, and development progress. Make informed decisions with AI-powered insights and expert guidance.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 font-medium shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 group"
                >
                  Start Monitoring
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-gray-700 rounded-full hover:bg-gray-50 transition-all duration-300 font-medium border border-gray-200 hover:border-blue-200 hover:text-blue-600"
                >
                  Learn More
                </a>
              </div>
              <div className="mt-8 flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span>4.9/5 Rating</span>
                </div>
                <div className="flex items-center">
                  <FaChild className="text-blue-400 mr-1" />
                  <span>10k+ Parents Trust Us</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="relative lg:ml-4"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-pink-600/10 rounded-2xl transform rotate-3"></div>
              <img
                src="https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?auto=format&fit=crop&q=80"
                alt="Happy child playing"
                className="relative rounded-2xl shadow-2xl w-full object-cover transform -rotate-3 hover:rotate-0 transition-transform duration-500"
                style={{ height: '500px' }}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: false, amount: 0.3 }}
        variants={staggerContainer}
        id="features"
        className="py-24 bg-white relative overflow-hidden"
      >
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%239C92AC" fill-opacity="0.03"%3E%3Cpath d="M0 0h20L0 20z"/%3E%3C/g%3E%3C/svg%3E")',
          backgroundSize: '20px 20px'
        }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <span className="text-blue-600 font-semibold text-sm tracking-wide uppercase">Features</span>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Everything you need to track development
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and features designed to help you monitor and support your child's growth journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Daily Tracking */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.03 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 group"
            >
              <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                <FaCalendarCheck className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Daily Tracking</h3>
              <p className="text-gray-600">
                Record daily activities, meals, sleep patterns, and important moments in your child's life.
              </p>
            </motion.div>

            {/* AI Insights */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.03 }}
              className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 group"
            >
              <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                <FaBrain className="text-purple-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Insights</h3>
              <p className="text-gray-600">
                Get personalized recommendations and answers to your questions about child development.
              </p>
            </motion.div>

            {/* Growth Analytics */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.03 }}
              className="bg-gradient-to-br from-pink-50 to-pink-100/50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 group"
            >
              <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                <FaChartLine className="text-pink-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Growth Analytics</h3>
              <p className="text-gray-600">
                Track physical growth, milestones, and development progress with detailed analytics.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Testimonials Section */}
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: false, amount: 0.3 }}
        variants={staggerContainer}
        className="py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm tracking-wide uppercase">Testimonials</span>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Trusted by Parents Worldwide
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See what other parents are saying about their experience with Child Growth.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Parent of 2",
                content: "This app has been a game-changer in tracking my children's development. The AI insights are incredibly helpful!",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80"
              },
              {
                name: "Michael Chen",
                role: "New Parent",
                content: "As a first-time parent, the guidance and tracking features have given me confidence in monitoring my baby's growth.",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80"
              },
              {
                name: "Emily Rodriguez",
                role: "Parent of 3",
                content: "The milestone tracking and daily journal features help me keep memories of all my children's special moments.",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="bg-white rounded-2xl shadow-lg p-8 relative"
              >
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                  <div className="bg-blue-100 rounded-full p-3">
                    <FaQuoteRight className="text-blue-600 text-xl" />
                  </div>
                </div>
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">{testimonial.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: false, amount: 0.3 }}
        variants={staggerContainer}
        className="py-24 bg-white relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm tracking-wide uppercase">Our Impact</span>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Making a Difference
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how Child Growth is helping parents around the world track their children's development.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: FaUsers, label: "Active Parents", value: "50,000+" },
              { icon: FaChild, label: "Children Tracked", value: "75,000+" },
              { icon: FaBook, label: "Journal Entries", value: "1M+" },
              { icon: FaAward, label: "Milestones Recorded", value: "500,000+" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="text-center"
              >
                <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="text-blue-600 text-2xl" />
                </div>
                <div className="font-bold text-3xl text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Security Section */}
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: false, amount: 0.3 }}
        variants={staggerContainer}
        className="py-24 bg-gradient-to-br from-blue-50 to-blue-100/50 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeInLeft} className="space-y-6">
              <span className="text-blue-600 font-semibold text-sm tracking-wide uppercase">Security First</span>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Your Data Security is Our Priority
              </h2>
              <p className="text-lg text-gray-600">
                We understand the importance of protecting your family's information. That's why we implement the highest standards of security and privacy protection.
              </p>
              <div className="space-y-4">
                {[
                  { icon: FaShieldAlt, title: "End-to-End Encryption", desc: "Your data is encrypted at rest and in transit" },
                  { icon: FaLock, title: "Secure Authentication", desc: "Multi-factor authentication available" },
                  { icon: FaUserShield, title: "Privacy Controls", desc: "Full control over your data sharing preferences" }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="flex items-start space-x-4 bg-white p-4 rounded-xl shadow-sm"
                  >
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <feature.icon className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                      <p className="text-gray-600">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div variants={fadeInRight} className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-600/5 rounded-2xl transform rotate-3"></div>
              <img
                src="https://images.unsplash.com/photo-1553484771-047a44eee27b?auto=format&fit=crop&q=80"
                alt="Security"
                className="relative rounded-2xl shadow-2xl w-full object-cover transform -rotate-3 hover:rotate-0 transition-transform duration-500"
                style={{ height: '500px' }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Support Section */}
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: false, amount: 0.3 }}
        variants={staggerContainer}
        className="py-24 bg-white relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm tracking-wide uppercase">Support</span>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              We're Here to Help
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get the support you need, when you need it. Our team is available 24/7 to assist you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FaComments,
                title: "24/7 Chat Support",
                desc: "Get instant help from our support team anytime, anywhere."
              },
              {
                icon: FaBook,
                title: "Knowledge Base",
                desc: "Access our comprehensive guides and documentation."
              },
              {
                icon: FaRocket,
                title: "Quick Start Guide",
                desc: "Get up and running quickly with our easy-to-follow guide."
              }
            ].map((support, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="bg-gradient-to-br from-gray-50 to-gray-100/50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300"
              >
                <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-md">
                  <support.icon className="text-blue-600 text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{support.title}</h3>
                <p className="text-gray-600">{support.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Journal Section */}
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: false, amount: 0.3 }}
        variants={staggerContainer}
        className="py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
      >
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%239C92AC" fill-opacity="0.03"%3E%3Cpath d="M0 0h20L0 20z"/%3E%3C/g%3E%3C/svg%3E")',
          backgroundSize: '20px 20px'
        }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={fadeInUp}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-pink-600/10 rounded-2xl transform rotate-3"></div>
              <img
                src="https://images.unsplash.com/photo-1602810316693-3667c854239a?auto=format&fit=crop&q=80"
                alt="Child development"
                className="relative rounded-2xl shadow-2xl w-full object-cover transform -rotate-3 hover:rotate-0 transition-transform duration-500"
                style={{ height: '400px' }}
              />
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="space-y-6"
            >
              <span className="text-blue-600 font-semibold text-sm tracking-wide uppercase">Digital Journal</span>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Capture Every Precious Moment
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Create a beautiful digital journal of your child's growth journey. Document milestones, daily activities, and special moments with our easy-to-use tools.
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FaBook className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Digital Journal</h4>
                    <p className="text-gray-600">Keep all memories in one secure place</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <FaChartLine className="text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Progress Tracking</h4>
                    <p className="text-gray-600">Monitor development milestones</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-pink-100 p-3 rounded-lg">
                    <FaBrain className="text-pink-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Smart Insights</h4>
                    <p className="text-gray-600">Get AI-powered development recommendations</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Mobile App Section */}
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: false, amount: 0.3 }}
        variants={staggerContainer}
        className="py-24 bg-white relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm tracking-wide uppercase">Mobile App</span>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Track Growth On The Go
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Download our mobile app to track your child's growth journey anywhere, anytime.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <button className="bg-black text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:bg-gray-800 transition-colors">
                <FaMobileAlt className="text-xl" />
                <span>App Store</span>
              </button>
              <button className="bg-black text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:bg-gray-800 transition-colors">
                <FaMobileAlt className="text-xl" />
                <span>Play Store</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.7 }}
        className="py-24 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-600">
              <div className="absolute inset-0" style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23FFFFFF" fill-opacity="0.05"%3E%3Cpath d="M0 0h20L0 20z"/%3E%3C/g%3E%3C/svg%3E")',
                backgroundSize: '20px 20px'
              }}></div>
            </div>
            <div className="relative">
              <h2 className="text-3xl font-bold text-white mb-4">
                Start Tracking Your Child's Growth Today
              </h2>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of parents who are already using our platform to monitor and support their children's development.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-blue-600 rounded-full hover:bg-blue-50 transition-all duration-300 font-medium shadow-lg hover:shadow-white/20 hover:-translate-y-0.5 group"
              >
                Get Started Free
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="bg-white border-t border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <FaChild className="text-blue-600 text-2xl" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Child Growth
              </span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Terms</a>
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Contact</a>
            </div>
            <p className="text-gray-500">© 2024 Child Growth. All rights reserved.</p>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

export default LandingPage