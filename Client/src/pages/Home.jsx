import React from "react";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import card1 from "../assets/card1.png"
import card2 from "../assets/card2.png"

function Home() {
  return (
    <div className="min-h-screen e bg-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-black">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(45,45,151,0.1),transparent_50%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(9,9,252,0.05),transparent_50%)] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 sm:pt-32 sm:pb-32 lg:flex lg:items-center">
          <div className="lg:flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl sm:text-7xl font-semibold bg-white bg-clip-text text-transparent mb-6">
                OPINIO
              </h1>
              <div className="h-16 sm:h-20">
                <TypeAnimation
                  className="text-gray-300 text-xl sm:text-3xl font-medium"
                  sequence={[
                    "Where Your Opinion Matters!", 2000,
                    "Predict Events, Win Rewards!", 2000,
                    "Join the Future of Predictions!", 2000,
                    "Make Your Voice Count!", 2000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                />
              </div>
              <p className="mt-6 text-gray-400 text-lg sm:text-xl max-w-2xl">
                Join thousands of users making predictions, sharing insights, and earning rewards on the most engaging prediction platform.
              </p>
              
              <div className="mt-10 flex gap-4">
                <Link
                  to="/events"
                  className="bg-gradient-to-r from-purple-300 to-zinc-500 text-black px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Explore Events
                </Link>
                <Link
                  to="/about"
                  className="border border-gray-700 text-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right side decorative elements */}
          <div className="hidden lg:block lg:flex-1 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              {/* Decorative cards */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xs">
                <div className="relative">
                  {/* First Card */}
                  <motion.div
                    initial={{ x: -50, y: 50, rotate: -15 }}
                    // animate={{ x: -30, y: 30, rotate: -15 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                    className="absolute z-10 w-72 h-auto"
                  >
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-200 to-blue-400 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                      <img 
                        src={card1} 
                        alt="Event Card 1" 
                        className="relative rounded-3xl border border-gray-800/50 shadow-2xl transform transition duration-500 hover:scale-105"
                      />
                    </div>
                  </motion.div>

                  {/* Second Card */}
                  <motion.div
                    initial={{ x: 50, y: -50, rotate: 15 }}
                    // animate={{ x: 30, y: -30, rotate: 15 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                    className="relative z-20 w-72 h-auto"
                  >
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-200 to-blue-400 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                      <img 
                        src={card2} 
                        alt="Event Card 2" 
                        className="relative rounded-3xl border border-gray-800/50 shadow-2xl transform transition duration-500 hover:scale-105"
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-t border-gray-800 bg-black">
        <div className="max-w-7xl mx-auto py-16 px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Active Events", value: "100+" },
              { label: "Total Users", value: "10K+" },
              { label: "Predictions Made", value: "50K+" },
              { label: "Rewards Distributed", value: "₹100K+" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-300 to-zinc-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="mt-2 text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Quotes Section */}
      <div className="border-t border-gray-800 py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-gray-400 text-lg">
              Join the community of predictors and opinion makers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "Made my first accurate prediction and earned rewards. This platform is addictive!",
                author: "Rahul M.",
              },
              {
                quote: "Love how easy it is to participate in different event predictions. Great community!",
                author: "Priya S.",
              },
              {
                quote: "From cricket to crypto, Opinio has it all. My go-to platform for predictions!",
                author: "Amit K.",
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-all duration-300"
              >
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <div className="text-2xl mb-4">💭</div>
                    <p className="text-gray-300 italic mb-4">"{item.quote}"</p>
                  </div>
                  <div>
                    <p className="text-white font-medium">{item.author}</p>
                    <div className="inline-block px-3 py-1 mt-2 text-sm bg-gradient-to-r from-purple-200/10 to-blue-400/10 rounded-full text-blue-300">
                      {item.badge}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Opinio Section */}
      <div className="border-t border-gray-800 py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Choose Opinio?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Join thousands of users who trust Opinio for making predictions and earning rewards
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "Accurate Predictions",
                description: "Our advanced algorithms and community wisdom help you make better predictions"
              },
              {
                icon: "💎",
                title: "Instant Rewards",
                description: "Earn rewards for accurate predictions and active participation"
              },
              {
                icon: "🔒",
                title: "Secure Platform",
                description: "Your data and earnings are protected with industry-standard security"
              },
              {
                icon: "🌐",
                title: "Diverse Categories",
                description: "From sports to cryptocurrency, we cover all major prediction categories"
              },
              {
                icon: "⚡",
                title: "Real-time Updates",
                description: "Get instant notifications and live updates on your predictions"
              },
              {
                icon: "👥",
                title: "Growing Community",
                description: "Join a vibrant community of prediction enthusiasts and experts"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-6 bg-zinc-900/50 rounded-xl border border-gray-800 hover:border-gray-400 transition-all duration-300"
              >
                <div className="text-3xl mb-4 transform transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

<hr className="border border-gray-700" />

      {/* Final Section */}
      <div className="relative border-gray-800 bg-black">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none"></div>
        <div className="absolute inset-0 transparent_50%)] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8">
              Ready to Make Your
              <span className="block mt-2  text-white">
                Opinion Count?
              </span>
            </h2>
            
            <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
              Join thousands of predictors and start earning rewards for your insights today.
            </p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Link
                to="/events"
                className="inline-flex items-center px-8 py-4 text-lg font-semibold text-black bg-gradient-to-r from-purple-300 to-zinc-400 rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-purple-500/20"
              >
                Start Predicting
                <svg 
                  className="w-5 h-5 ml-2 -mr-1 transform group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 7l5 5m0 0l-5 5m5-5H6" 
                  />
                </svg>
              </Link>
            </motion.div>

            {/* Floating elements for visual interest */}
            
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Home;
