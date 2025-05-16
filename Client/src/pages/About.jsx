import React from 'react'

function About() {
  return (
    <div className="min-h-screen bg-black text-white pt-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-300 to-zinc-700 bg-clip-text text-transparent mb-6">
            About Opinio
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Share Opinions, Influence Outcomes, Win Rewards
          </p>
          <p className="text-lg text-gray-400 leading-relaxed">
            Opinio is a dynamic, opinion-sharing platform where your thoughts matter. Use your knowledge, express your predictions with a simple YES or NO, and earn exciting rewards based on real-world outcomes. Whether it's sports, entertainment, current affairs, or trending topics – your opinion has power.
          </p>
        </div>

        {/* How it Works Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">How it works</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🔮</span>
                <h3 className="text-xl font-semibold">Predict with Purpose</h3>
              </div>
              <p className="text-gray-400">
                Cast your vote by choosing YES or NO on live events based on your understanding, logic, or gut feeling.
              </p>
            </div>
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">💸</span>
                <h3 className="text-xl font-semibold">Earn for Accuracy</h3>
              </div>
              <p className="text-gray-400">
                The more accurate your opinions, the more rewards you unlock. It's simple — the smarter your prediction, the greater your earnings.
              </p>
            </div>
          </div>
        </div>

        {/* Why Opinio Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Opinio?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🌐</span>
                <h3 className="text-lg font-semibold">Wide Range of Topics</h3>
              </div>
              <p className="text-gray-400">
                From politics to pop culture — explore and engage with a wide variety of real-time events and questions.
              </p>
            </div>
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">💡</span>
                <h3 className="text-lg font-semibold">Power to the People</h3>
              </div>
              <p className="text-gray-400">
                Opinio turns your knowledge and perspective into something valuable. Be an early voice, influence trends, and get rewarded for it.
              </p>
            </div>
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">⚡</span>
                <h3 className="text-lg font-semibold">Real-Time Experience</h3>
              </div>
              <p className="text-gray-400">
                Vote, watch the numbers change live, and stay updated as events unfold — all in real-time.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-br from-zinc-900/50 to-gray-900/50 p-8 rounded-2xl border border-purple-800/50">
          <p className="text-xl text-gray-200 mb-6">
            Don't just scroll through opinions — create your own impact.
          </p>
          <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-gray-500 bg-clip-text text-transparent">
            Join Opinio today, make your voice count, and turn your insight into influence.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About