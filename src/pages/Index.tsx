// Update this page (the content is just a fallback if you fail to update the page)

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-8">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold text-gray-800 mb-6">
          🌾 AgriForecast
        </h1>
        <h2 className="text-2xl text-gray-600 mb-8">
          Smarter Farming Decisions with AI
        </h2>
        <p className="text-lg text-gray-500 mb-8">
          Help farmers forecast local market demand and prevent crop gluts with AI-driven insights
        </p>
        <div className="space-y-4">
          <button 
            onClick={() => window.location.href = '/auth'}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
          >
            Get Started
          </button>
          <p className="text-sm text-gray-400">
            Ready to build the full AgriForecast application
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
