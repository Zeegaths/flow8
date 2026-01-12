import {
  Zap,
  ArrowRight,
  Play,
  Check,
  Bitcoin,
  Users,
  Award,
} from "lucide-react";
import { useState } from "react";
import type { Page } from "../../types";
import { scrollToSection } from "../../pages/LandingPage";
// import bitcoinAnimation from "../assets/lottie/bitcoin-animation.json";
import Lottie from "lottie-react";

export default function Hero({
  onNavigate,
}: {
  onNavigate: (page: Page) => void;
}) {
  const [isVisible, setIsVisible] = useState(true);

  const handleGetStarted = () => {
    // Direct navigation to dashboard - no authentication
    onNavigate("dashboard");
  };

  return (
    <section className="flex items-center mt-32 md:flex md:h-screen md:mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4 mr-2" />
              Powered by Internet Computer & Bitcoin
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              The Future of
              <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent font-info">
                {" "}
                Freelance
              </span>
              <br />
              Invoicing
            </h1>
            <p className="text-md md:text-xl text-gray-600 mb-8 leading-relaxed">
              Create professional Bitcoin invoices, split payments with your
              team, track tasks, and build your reputation—all on the
              decentralized web.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleGetStarted}
                className="bg-orange-500 shadow-none text-white px-8 py-3 w-full md:w-1/2 rounded-full font-semibold transition-all duration-200 transform hover:bg-transparent border-2 border-orange-500 hover:text-orange-500 flex items-center justify-center"
              >
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button
                onClick={() => scrollToSection("demo")}
                className="border-2 border-gray-300 text-gray-700 px-8 py-3 w-full md:w-1/2 rounded-full font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <div className="flex text-xs md:text-sm items-center bg-orange-500/10 hover:bg-transparent hover:text-orange-500 transition-all duration-500 cursor-pointer font-semibold rounded-full py-2 px-1 border border-orange-500">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                No credit card required
              </div>
              <div className="flex text-xs md:text-sm items-center bg-orange-500/10 hover:bg-transparent hover:text-orange-500 transition-all duration-500 cursor-pointer font-semibold rounded-full py-2 px-1 border border-orange-500">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                Free forever plan
              </div>
              <div className="flex text-xs md:text-sm items-center bg-orange-500/10 hover:bg-transparent hover:text-orange-500 transition-all duration-500 cursor-pointer font-semibold rounded-full py-2 px-1 border border-orange-500">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                Setup in 2 minutes
              </div>
            </div>
          </div>

          {/* <Lottie animationData={bitcoinAnimation} loop={true} className="" /> */}
        </div>
      </div>
    </section>
  );
}