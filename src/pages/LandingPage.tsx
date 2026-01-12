import React, { useState, useEffect } from "react";
import Navbar from "../components/landing/Navbar";
import {
  Bitcoin,
  Users,
  CheckSquare,
  Award,
  Shield,
  Star,
  ArrowRight,
  Play,
  Menu,
  X,
  Zap,
  Globe,
  TrendingUp,
  Clock,
  FileText,
  Smartphone,
  Monitor,
  ChevronRight,
  Quote,
  Check,
  ExternalLink,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Target,
  Layers,
  Eye,
  Loader2,
} from "lucide-react";
import type { Page } from "../types";
// import Hero from "../components/Hero";

export function CustomConnectWallet({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative overflow-hidden bg-gradient-to-r from-purple-500 to-violet-500 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 group"
    >
      <span className="relative flex items-center">
        Get Started
        <Sparkles className="ml-2 h-4 w-4" />
      </span>
    </button>
  );
}

export function CustomConnectedWallet({ principal, loading }: { principal?: string; loading?: boolean }) {
  return (
    <button
      className="relative overflow-hidden bg-gradient-to-r from-purple-500 to-violet-500 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 group"
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {principal && <span className="text-xs mr-2">{principal.slice(0, 6)}...{principal.slice(-4)}</span>}
    </button>
  );
}


interface LandingPageProps {
  onNavigate: (page: Page) => void;
}

export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

const LandingPage = ({ onNavigate }: LandingPageProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });


  // const handleConnect = async () => {
  //   try {
  //     await connect();
  //   } catch (error) {
  //     console.error("Connection error:", error);
  //   }
  // };

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const features = [
    {
      icon: Bitcoin,
      title: "Bitcoin Invoicing",
      description:
        "Create professional invoices with Bitcoin payment integration. Generate QR codes and track payments in real-time.",
      benefits: [
        "Instant Bitcoin payments",
        "QR code generation",
        "Real-time tracking",
        "USD conversion",
      ],
      color: "from-orange-500 to-yellow-500",
      bgColor: "from-orange-500/10 to-yellow-500/10",
    },
    {
      icon: Users,
      title: "Team Payment Splits",
      description:
        "Automatically split payments among team members with transparent, trustless distribution.",
      benefits: [
        "Automatic splitting",
        "Transparent allocation",
        "On-chain verification",
        "Team collaboration",
      ],
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-500/10 to-cyan-500/10",
    },
    {
      icon: CheckSquare,
      title: "Task Tracking",
      description:
        "Log tasks, track time, and seamlessly integrate with your invoices for accurate billing.",
      benefits: [
        "Time tracking",
        "Task management",
        "Invoice integration",
        "Productivity insights",
      ],
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-500/10 to-emerald-500/10",
    },
    {
      icon: Award,
      title: "Reputation System",
      description:
        "Build your professional reputation with multi-tier badges and client reviews.",
      benefits: [
        "Multi-tier badges",
        "Client reviews",
        "Reputation scoring",
        "Professional growth",
      ],
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-500/10 to-pink-500/10",
    },
    {
      icon: Shield,
      title: "Admin Controls",
      description:
        "Comprehensive admin dashboard with analytics, user management, and platform insights.",
      benefits: [
        "User management",
        "Analytics dashboard",
        "Platform insights",
        "Performance metrics",
      ],
      color: "from-red-500 to-rose-500",
      bgColor: "from-red-500/10 to-rose-500/10",
    },
    {
      icon: Smartphone,
      title: "Client Portals",
      description:
        "Branded payment portals for clients with mobile-optimized payment experience.",
      benefits: [
        "Mobile-optimized",
        "Branded experience",
        "Easy payments",
        "Client reviews",
      ],
      color: "from-indigo-500 to-purple-500",
      bgColor: "from-indigo-500/10 to-purple-500/10",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Full Stack Developer",
      company: "TechCorp",
      rating: 5,
      comment:
        "Flow8 revolutionized how I handle payments. The Bitcoin integration is seamless and the team split feature saves me hours of manual calculations.",
      avatar: "SC",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      name: "Mike Rodriguez",
      role: "Design Agency Owner",
      company: "Creative Studios",
      rating: 5,
      comment:
        "The reputation system helped me showcase my expertise to new clients. The badge progression keeps me motivated to deliver excellent work.",
      avatar: "MR",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      name: "Alex Johnson",
      role: "Blockchain Consultant",
      company: "CryptoStartup",
      rating: 5,
      comment:
        "Finally, a platform that understands crypto freelancers. The client payment portals are professional and the Bitcoin payments are instant.",
      avatar: "AJ",
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "₿0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "Up to 10 invoices/month",
        "Basic task tracking",
        "Bitcoin payments",
        "Client payment portals",
        "Basic reputation badges",
      ],
      cta: "Start Free",
      popular: false,
      gradient: "from-slate-600 to-slate-700",
    },
    {
      name: "Pro",
      price: "₿0.001",
      period: "per month",
      description: "For growing freelancers",
      features: [
        "Unlimited invoices",
        "Advanced task tracking",
        "Team payment splits",
        "Priority support",
        "Advanced analytics",
        "Custom branding",
      ],
      cta: "Upgrade to Pro",
      popular: true,
      gradient: "from-orange-500 to-yellow-500",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For agencies and teams",
      features: [
        "Everything in Pro",
        "Multi-user accounts",
        "Advanced admin controls",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantee",
      ],
      cta: "Contact Sales",
      popular: false,
      gradient: "from-purple-600 to-pink-600",
    },
  ];

  const AdvancedBackground = () => (
    <div className="fixed inset-0 -z-10">
      {/* Animated mesh gradient */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 107, 53, 0.3) 0%, transparent 50%)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/50 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900 to-slate-950" />
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Animated beams */}
      <div className="absolute inset-0">
        <div
          className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-orange-500/20 to-transparent animate-pulse"
          style={{ animationDuration: "3s" }}
        />
        <div
          className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-purple-500/20 to-transparent animate-pulse"
          style={{ animationDuration: "4s", animationDelay: "1s" }}
        />
        <div
          className="absolute top-0 left-2/3 w-px h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent animate-pulse"
          style={{ animationDuration: "5s", animationDelay: "2s" }}
        />
      </div>
    </div>
  );

  // const dummyUser = {
  //   id: "dummy-user-123",
  //   principal: "2vxsx-fae",
  //   name: "Test User"
  // };

  // if (dummyUser) {
  //   onNavigate("dashboard");
  // }

  return (
    <div className="relative min-h-screen bg-slate-950">
      <AdvancedBackground />

      {/* Navigation */}
      <Navbar onNavigate={onNavigate} currentPage="landing" />

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-40 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Advanced Animated Background System */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Bitcoin Constellation Formation */}
          <div
            className="absolute top-20 left-1/4 w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center animate-orbit-1 shadow-2xl"
            style={{ animationDuration: "20s" }}
          >
            <Bitcoin className="h-7 w-7 text-white animate-spin-slow" />
          </div>
          <div
            className="absolute top-40 right-1/4 w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-600 rounded-full flex items-center justify-center animate-orbit-2 shadow-2xl"
            style={{ animationDuration: "15s" }}
          >
            <Bitcoin className="h-6 w-6 text-white animate-spin-reverse" />
          </div>
          <div
            className="absolute bottom-40 left-1/3 w-14 h-14 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full flex items-center justify-center animate-orbit-3 shadow-2xl"
            style={{ animationDuration: "25s" }}
          >
            <Bitcoin className="h-8 w-8 text-white animate-spin-slow" />
          </div>
          <div
            className="absolute bottom-20 right-1/3 w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center animate-orbit-4 shadow-2xl"
            style={{ animationDuration: "18s" }}
          >
            <Bitcoin className="h-5 w-5 text-white animate-spin-reverse" />
          </div>

          {/* Meteor Shower Bitcoin Effect */}
          <div className="absolute -top-10 -left-10 w-6 h-6 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center animate-meteor-1 shadow-lg">
            <Bitcoin className="h-4 w-4 text-white animate-spin" />
          </div>
          <div className="absolute -top-20 left-1/4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-600 rounded-full flex items-center justify-center animate-meteor-2 shadow-lg">
            <Bitcoin className="h-5 w-5 text-white animate-spin" />
          </div>
          <div className="absolute -top-5 right-1/4 w-7 h-7 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full flex items-center justify-center animate-meteor-3 shadow-lg">
            <Bitcoin className="h-4 w-4 text-white animate-spin" />
          </div>
          <div className="absolute -top-15 right-10 w-9 h-9 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center animate-meteor-4 shadow-lg">
            <Bitcoin className="h-6 w-6 text-white animate-spin" />
          </div>

          {/* Quantum Circle Network */}
          <div className="absolute top-24 left-16 w-64 h-64 border-2 border-purple-400/20 rounded-full animate-quantum-spin shadow-2xl">
            <div className="absolute inset-8 border border-violet-500/30 rounded-full animate-quantum-spin-reverse">
              <div className="absolute inset-4 border border-fuchsia-400/25 rounded-full animate-quantum-spin">
                <div className="absolute inset-6 w-4 h-4 bg-purple-400 rounded-full animate-quantum-pulse top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div className="absolute bottom-32 right-20 w-48 h-48 border-2 border-violet-500/25 rounded-full animate-quantum-spin-reverse shadow-2xl">
            <div className="absolute inset-6 border border-purple-400/30 rounded-full animate-quantum-spin">
              <div className="absolute inset-4 border border-fuchsia-500/20 rounded-full animate-quantum-spin-reverse">
                <div className="absolute inset-4 w-3 h-3 bg-violet-400 rounded-full animate-quantum-pulse top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* DNA Helix Particles */}
          <div className="absolute top-1/4 left-8 animate-dna-helix">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-dna-particle-1" />
            <div className="w-2 h-2 bg-violet-400 rounded-full animate-dna-particle-2 mt-4" />
            <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-dna-particle-3 mt-4" />
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-dna-particle-4 mt-4" />
          </div>

          <div className="absolute top-1/3 right-12 animate-dna-helix-reverse">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-dna-particle-1" />
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-dna-particle-2 mt-4" />
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-dna-particle-3 mt-4" />
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-dna-particle-4 mt-4" />
          </div>

          {/* Fractal Lightning */}
          <div className="absolute top-1/2 left-0 w-1 h-32 bg-gradient-to-b from-transparent via-purple-400/50 to-transparent animate-lightning-1" />
          <div className="absolute top-1/3 right-0 w-1 h-24 bg-gradient-to-b from-transparent via-violet-400/60 to-transparent animate-lightning-2" />
          <div className="absolute bottom-1/3 left-1/4 w-1 h-20 bg-gradient-to-b from-transparent via-fuchsia-400/40 to-transparent animate-lightning-3" />

          {/* Cosmic Dust Particles */}
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 bg-gradient-to-r ${i % 3 === 0
                ? "from-purple-400 to-violet-400"
                : i % 3 === 1
                  ? "from-orange-400 to-yellow-400"
                  : "from-violet-400 to-fuchsia-400"
                } rounded-full animate-cosmic-dust opacity-70`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${15 + Math.random() * 10}s`,
              }}
            />
          ))}

          {/* Holographic Grid */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-grid-scan" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/20 to-transparent animate-grid-scan-vertical" />
          </div>

          {/* Plasma Waves */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500/30 via-violet-500/50 to-fuchsia-500/30 animate-plasma-wave" />
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-fuchsia-500/30 via-purple-500/50 to-violet-500/30 animate-plasma-wave-reverse" />

          {/* Quantum Tunnels */}
          <div className="absolute top-1/4 right-1/4 w-32 h-32 border-4 border-purple-400/30 rounded-full animate-quantum-tunnel">
            <div className="absolute inset-2 border-2 border-violet-400/40 rounded-full animate-quantum-tunnel-inner">
              <div className="absolute inset-2 border border-fuchsia-400/50 rounded-full animate-quantum-tunnel-core" />
            </div>
          </div>

          {/* Energy Vortex */}
          <div className="absolute bottom-1/4 left-1/4 w-24 h-24 animate-energy-vortex">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-transparent rounded-full animate-vortex-1" />
            <div className="absolute inset-2 bg-gradient-to-r from-violet-500/30 to-transparent rounded-full animate-vortex-2" />
            <div className="absolute inset-4 bg-gradient-to-r from-fuchsia-500/40 to-transparent rounded-full animate-vortex-3" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative">
          <div
            className={`transition-all duration-1000 ${isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
              }`}
          >
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-500/20 backdrop-blur-sm mb-8 animate-holographic-badge shadow-lg shadow-purple-500/10">
              <Sparkles className="h-5 w-5 text-purple-400 mr-3 animate-sparkle-dance" />
              <span className="text-base font-medium text-purple-300 animate-text-glow">
                Milestone-Based Escrow for the Gig Economy
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-8 leading-none tracking-tight">
              <span className="inline-block animate-title-emerge">
                Get Paid as You
              </span>
              <span className="block bg-gradient-to-r from-purple-400 via-violet-400 to-fuchsia-500 to-purple-600 bg-clip-text text-transparent animate-title-rainbow bg-[length:300%_300%]">
                Prove Delivery
              </span>
            </h1>

            <p
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light animate-description-float"
              style={{ animationDelay: "0.2s" }}
            >
              Smart escrow that releases MNEE stablecoin payments progressively as you complete milestones.
              Protect clients from ghost jobs. Protect freelancers from payment disputes. Built for the global gig economy.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-buttons-materialize"
              style={{ animationDelay: "0.4s" }}
            >
              <button
                onClick={() => onNavigate('dashboard')}
                className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-violet-500 text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-500 transform hover:scale-105 shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/50 animate-button-power-up hover:animate-none"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12 animate-energy-sweep" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-button-shimmer" />
                <span className="relative flex items-center justify-center">
                  Start Earning Safely
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300 group-hover:animate-arrow-rocket" />
                </span>
              </button>

              <button
                className="group relative border-2 border-purple-500/30 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-purple-500/10 backdrop-blur-sm transition-all duration-500 hover:border-purple-400/50 overflow-hidden hover:shadow-lg hover:shadow-purple-500/20 animate-button-materialize"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative flex items-center justify-center">
                  <Play className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform duration-300 group-hover:text-purple-300 group-hover:animate-play-pulse" />
                  See How It Works
                </span>
              </button>
            </div>

            <div
              className="flex items-center justify-center space-x-8 text-sm text-gray-500 animate-features-cascade"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="flex items-center hover:text-gray-400 transition-colors cursor-default animate-feature-glow">
                <Check className="h-4 w-4 text-green-400 mr-2 animate-check-success" />
                Pay as work completes
              </div>
              <div
                className="flex items-center hover:text-gray-400 transition-colors cursor-default animate-feature-glow"
                style={{ animationDelay: "0.2s" }}
              >
                <Check
                  className="h-4 w-4 text-green-400 mr-2 animate-check-success"
                  style={{ animationDelay: "0.2s" }}
                />
                AI-verified milestones
              </div>
              <div
                className="flex items-center hover:text-gray-400 transition-colors cursor-default animate-feature-glow"
                style={{ animationDelay: "0.4s" }}
              >
                <Check
                  className="h-4 w-4 text-green-400 mr-2 animate-check-success"
                  style={{ animationDelay: "0.4s" }}
                />
                Instant dispute resolution
              </div>
            </div>

            {/* Advanced scroll indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-scroll-magic">
              <div className="w-6 h-10 border-2 border-purple-400/50 rounded-full flex justify-center animate-scroll-glow">
                <div className="w-1 h-3 bg-purple-400 rounded-full mt-2 animate-scroll-dot" />
              </div>
            </div>
          </div>
        </div>

        <style>{`
    /* ORBITAL ANIMATIONS */
    @keyframes orbit-1 {
      0% {
        transform: rotate(0deg) translateX(150px) rotate(0deg);
      }
      100% {
        transform: rotate(360deg) translateX(150px) rotate(-360deg);
      }
    }
    @keyframes orbit-2 {
      0% {
        transform: rotate(0deg) translateX(120px) rotate(0deg);
      }
      100% {
        transform: rotate(-360deg) translateX(120px) rotate(360deg);
      }
    }
    @keyframes orbit-3 {
      0% {
        transform: rotate(0deg) translateX(180px) rotate(0deg);
      }
      100% {
        transform: rotate(360deg) translateX(180px) rotate(-360deg);
      }
    }
    @keyframes orbit-4 {
      0% {
        transform: rotate(0deg) translateX(100px) rotate(0deg);
      }
      100% {
        transform: rotate(-360deg) translateX(100px) rotate(360deg);
      }
    }

    /* METEOR EFFECTS */
    @keyframes meteor-1 {
      0% {
        transform: translate(-200px, -200px) rotate(45deg);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translate(calc(100vw + 200px), calc(100vh + 200px))
          rotate(45deg);
        opacity: 0;
      }
    }
    @keyframes meteor-2 {
      0% {
        transform: translate(-150px, -250px) rotate(30deg);
        opacity: 0;
      }
      15% {
        opacity: 1;
      }
      85% {
        opacity: 1;
      }
      100% {
        transform: translate(calc(100vw + 150px), calc(100vh + 250px))
          rotate(30deg);
        opacity: 0;
      }
    }
    @keyframes meteor-3 {
      0% {
        transform: translate(-300px, -100px) rotate(60deg);
        opacity: 0;
      }
      20% {
        opacity: 1;
      }
      80% {
        opacity: 1;
      }
      100% {
        transform: translate(calc(100vw + 300px), calc(100vh + 100px))
          rotate(60deg);
        opacity: 0;
      }
    }
    @keyframes meteor-4 {
      0% {
        transform: translate(-100px, -300px) rotate(20deg);
        opacity: 0;
      }
      25% {
        opacity: 1;
      }
      75% {
        opacity: 1;
      }
      100% {
        transform: translate(calc(100vw + 100px), calc(100vh + 300px))
          rotate(20deg);
        opacity: 0;
      }
    }

    /* QUANTUM EFFECTS */
    @keyframes quantum-spin {
      0% {
        transform: rotate(0deg) scale(1);
      }
      50% {
        transform: rotate(180deg) scale(1.1);
      }
      100% {
        transform: rotate(360deg) scale(1);
      }
    }
    @keyframes quantum-spin-reverse {
      0% {
        transform: rotate(0deg) scale(1);
      }
      50% {
        transform: rotate(-180deg) scale(0.9);
      }
      100% {
        transform: rotate(-360deg) scale(1);
      }
    }
    @keyframes quantum-pulse {
      0%,
      100% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
      }
      50% {
        transform: translate(-50%, -50%) scale(1.5);
        opacity: 0.5;
      }
    }
    @keyframes quantum-tunnel {
      0% {
        transform: perspective(1000px) rotateX(0deg) rotateY(0deg);
      }
      100% {
        transform: perspective(1000px) rotateX(360deg) rotateY(720deg);
      }
    }
    @keyframes quantum-tunnel-inner {
      0% {
        transform: perspective(1000px) rotateX(0deg) rotateY(0deg);
      }
      100% {
        transform: perspective(1000px) rotateX(-360deg) rotateY(-720deg);
      }
    }
    @keyframes quantum-tunnel-core {
      0% {
        transform: perspective(1000px) rotateX(0deg) rotateY(0deg)
          scale(1);
      }
      50% {
        transform: perspective(1000px) rotateX(180deg) rotateY(360deg)
          scale(1.5);
      }
      100% {
        transform: perspective(1000px) rotateX(360deg) rotateY(720deg)
          scale(1);
      }
    }

    /* DNA HELIX */
    @keyframes dna-helix {
      0% {
        transform: translateY(0px) rotate(0deg);
      }
      100% {
        transform: translateY(-400px) rotate(720deg);
      }
    }
    @keyframes dna-helix-reverse {
      0% {
        transform: translateY(0px) rotate(0deg);
      }
      100% {
        transform: translateY(-400px) rotate(-720deg);
      }
    }
    @keyframes dna-particle-1 {
      0%,
      100% {
        transform: translateX(0px) scale(1);
      }
      25% {
        transform: translateX(20px) scale(1.2);
      }
      50% {
        transform: translateX(0px) scale(0.8);
      }
      75% {
        transform: translateX(-20px) scale(1.2);
      }
    }
    @keyframes dna-particle-2 {
      0%,
      100% {
        transform: translateX(0px) scale(1);
      }
      25% {
        transform: translateX(-15px) scale(0.9);
      }
      50% {
        transform: translateX(0px) scale(1.3);
      }
      75% {
        transform: translateX(15px) scale(0.9);
      }
    }
    @keyframes dna-particle-3 {
      0%,
      100% {
        transform: translateX(0px) scale(1);
      }
      25% {
        transform: translateX(25px) scale(1.1);
      }
      50% {
        transform: translateX(0px) scale(0.7);
      }
      75% {
        transform: translateX(-25px) scale(1.1);
      }
    }
    @keyframes dna-particle-4 {
      0%,
      100% {
        transform: translateX(0px) scale(1);
      }
      25% {
        transform: translateX(-10px) scale(1.4);
      }
      50% {
        transform: translateX(0px) scale(0.6);
      }
      75% {
        transform: translateX(10px) scale(1.4);
      }
    }

    /* LIGHTNING EFFECTS */
    @keyframes lightning-1 {
      0%,
      90%,
      100% {
        opacity: 0;
        transform: scaleY(0);
      }
      5%,
      10% {
        opacity: 1;
        transform: scaleY(1) scaleX(2);
      }
      15%,
      20% {
        opacity: 0.7;
        transform: scaleY(0.8) scaleX(1.5);
      }
    }
    @keyframes lightning-2 {
      0%,
      70%,
      100% {
        opacity: 0;
        transform: scaleY(0);
      }
      10%,
      15% {
        opacity: 1;
        transform: scaleY(1) scaleX(3);
      }
      20%,
      25% {
        opacity: 0.5;
        transform: scaleY(0.6) scaleX(2);
      }
    }
    @keyframes lightning-3 {
      0%,
      80%,
      100% {
        opacity: 0;
        transform: scaleY(0);
      }
      15%,
      20% {
        opacity: 1;
        transform: scaleY(1) scaleX(2.5);
      }
      25%,
      30% {
        opacity: 0.6;
        transform: scaleY(0.7) scaleX(1.8);
      }
    }

    /* COSMIC DUST */
    @keyframes cosmic-dust {
      0% {
        transform: translateY(0px) translateX(0px) scale(0);
        opacity: 0;
      }
      10% {
        opacity: 1;
        transform: scale(1);
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translateY(-100vh) translateX(50px) scale(0);
        opacity: 0;
      }
    }

    /* GRID EFFECTS */
    @keyframes grid-scan {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }
    @keyframes grid-scan-vertical {
      0% {
        transform: translateY(-100%);
      }
      100% {
        transform: translateY(100%);
      }
    }

    /* PLASMA WAVES */
    @keyframes plasma-wave {
      0% {
        transform: translateX(-100%) scaleY(1);
      }
      50% {
        transform: translateX(50%) scaleY(2);
      }
      100% {
        transform: translateX(200%) scaleY(1);
      }
    }
    @keyframes plasma-wave-reverse {
      0% {
        transform: translateX(100%) scaleY(1);
      }
      50% {
        transform: translateX(-50%) scaleY(2);
      }
      100% {
        transform: translateX(-200%) scaleY(1);
      }
    }

    /* ENERGY VORTEX */
    @keyframes energy-vortex {
      0% {
        transform: rotate(0deg) scale(1);
      }
      100% {
        transform: rotate(360deg) scale(1.2);
      }
    }
    @keyframes vortex-1 {
      0% {
        transform: rotate(0deg) scale(1);
        opacity: 0.3;
      }
      100% {
        transform: rotate(360deg) scale(2);
        opacity: 0;
      }
    }
    @keyframes vortex-2 {
      0% {
        transform: rotate(0deg) scale(1);
        opacity: 0.4;
      }
      100% {
        transform: rotate(-360deg) scale(1.8);
        opacity: 0;
      }
    }
    @keyframes vortex-3 {
      0% {
        transform: rotate(0deg) scale(1);
        opacity: 0.5;
      }
      100% {
        transform: rotate(720deg) scale(1.5);
        opacity: 0;
      }
    }

    /* TITLE EFFECTS */
    @keyframes title-rainbow {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
    @keyframes title-emerge {
      0% {
        transform: translateY(50px) scale(0.8);
        opacity: 0;
      }
      100% {
        transform: translateY(0px) scale(1);
        opacity: 1;
      }
    }

    /* BUTTON EFFECTS */
    @keyframes button-power-up {
      0%,
      100% {
        box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
      }
      50% {
        box-shadow: 0 0 40px rgba(168, 85, 247, 0.8),
          0 0 60px rgba(139, 92, 246, 0.6);
      }
    }
    @keyframes button-shimmer {
      0% {
        transform: translateX(-100%) skewX(-45deg);
      }
      100% {
        transform: translateX(200%) skewX(-45deg);
      }
    }
    @keyframes arrow-rocket {
      0%,
      100% {
        transform: translateX(0px);
      }
      50% {
        transform: translateX(10px) scale(1.2);
      }
    }

    /* ADVANCED BADGE */
    @keyframes holographic-badge {
      0%,
      100% {
        background: linear-gradient(
          45deg,
          rgba(168, 85, 247, 0.1),
          rgba(139, 92, 246, 0.1)
        );
        border-color: rgba(168, 85, 247, 0.2);
      }
      50% {
        background: linear-gradient(
          45deg,
          rgba(139, 92, 246, 0.2),
          rgba(168, 85, 247, 0.2)
        );
        border-color: rgba(139, 92, 246, 0.4);
      }
    }
    @keyframes sparkle-dance {
      0%,
      100% {
        transform: rotate(0deg) scale(1);
      }
      25% {
        transform: rotate(90deg) scale(1.2);
      }
      50% {
        transform: rotate(180deg) scale(0.8);
      }
      75% {
        transform: rotate(270deg) scale(1.1);
      }
    }
    @keyframes text-glow {
      0%,
      100% {
        text-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
      }
      50% {
        text-shadow: 0 0 20px rgba(139, 92, 246, 0.8),
          0 0 30px rgba(168, 85, 247, 0.6);
      }
    }

    /* SCROLL INDICATOR */
    @keyframes scroll-magic {
      0%,
      100% {
        transform: translateX(-50%) translateY(0px);
      }
      50% {
        transform: translateX(-50%) translateY(-10px);
      }
    }
    @keyframes scroll-glow {
      0%,
      100% {
        box-shadow: 0 0 10px rgba(168, 85, 247, 0.3);
      }
      50% {
        box-shadow: 0 0 20px rgba(168, 85, 247, 0.6);
      }
    }
    @keyframes scroll-dot {
      0% {
        transform: translateY(0px);
        opacity: 1;
      }
      100% {
        transform: translateY(20px);
        opacity: 0;
      }
    }

    /* SPIN VARIANTS */
    @keyframes spin-slow {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
    @keyframes spin-reverse {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(-360deg);
      }
    }

    /* APPLY ANIMATIONS */
    .animate-orbit-1 {
      animation: orbit-1 linear infinite;
    }
    .animate-orbit-2 {
      animation: orbit-2 linear infinite;
    }
    .animate-orbit-3 {
      animation: orbit-3 linear infinite;
    }
    .animate-orbit-4 {
      animation: orbit-4 linear infinite;
    }

    .animate-meteor-1 {
      animation: meteor-1 8s linear infinite;
    }
    .animate-meteor-2 {
      animation: meteor-2 10s linear infinite;
    }
    .animate-meteor-3 {
      animation: meteor-3 7s linear infinite;
    }
    .animate-meteor-4 {
      animation: meteor-4 9s linear infinite;
    }

    .animate-quantum-spin {
      animation: quantum-spin 10s ease-in-out infinite;
    }
    .animate-quantum-spin-reverse {
      animation: quantum-spin-reverse 8s ease-in-out infinite;
    }
    .animate-quantum-pulse {
      animation: quantum-pulse 3s ease-in-out infinite;
    }
    .animate-quantum-tunnel {
      animation: quantum-tunnel 15s linear infinite;
    }
    .animate-quantum-tunnel-inner {
      animation: quantum-tunnel-inner 12s linear infinite;
    }
    .animate-quantum-tunnel-core {
      animation: quantum-tunnel-core 8s ease-in-out infinite;
    }

    .animate-dna-helix {
      animation: dna-helix 20s linear infinite;
    }
    .animate-dna-helix-reverse {
      animation: dna-helix-reverse 18s linear infinite;
    }
    .animate-dna-particle-1 {
      animation: dna-particle-1 4s ease-in-out infinite;
    }
    .animate-dna-particle-2 {
      animation: dna-particle-2 3s ease-in-out infinite;
    }
    .animate-dna-particle-3 {
      animation: dna-particle-3 5s ease-in-out infinite;
    }
    .animate-dna-particle-4 {
      animation: dna-particle-4 3.5s ease-in-out infinite;
    }

    .animate-lightning-1 {
      animation: lightning-1 5s ease-in-out infinite;
    }
    .animate-lightning-2 {
      animation: lightning-2 7s ease-in-out infinite;
    }
    .animate-lightning-3 {
      animation: lightning-3 6s ease-in-out infinite;
    }

    .animate-cosmic-dust {
      animation: cosmic-dust linear infinite;
    }

    .animate-grid-scan {
      animation: grid-scan 8s linear infinite;
    }
    .animate-grid-scan-vertical {
      animation: grid-scan-vertical 10s linear infinite;
    }

    .animate-plasma-wave {
      animation: plasma-wave 6s ease-in-out infinite;
    }
    .animate-plasma-wave-reverse {
      animation: plasma-wave-reverse 8s ease-in-out infinite;
    }

    .animate-energy-vortex {
      animation: energy-vortex 5s linear infinite;
    }
    .animate-vortex-1 {
      animation: vortex-1 3s ease-out infinite;
    }
    .animate-vortex-2 {
      animation: vortex-2 4s ease-out infinite;
    }
    .animate-vortex-3 {
      animation: vortex-3 2.5s ease-out infinite;
    }

    .animate-title-rainbow {
      animation: title-rainbow 5s ease infinite;
    }
    .animate-title-emerge {
      animation: title-emerge 1.2s ease-out;
    }

    .animate-button-power-up {
      animation: button-power-up 2s ease-in-out infinite;
    }
    .animate-button-shimmer {
      animation: button-shimmer 3s ease-in-out infinite;
    }
    .animate-arrow-rocket {
      animation: arrow-rocket 0.6s ease-in-out;
    }

    .animate-holographic-badge {
      animation: holographic-badge 4s ease-in-out infinite;
    }
    .animate-sparkle-dance {
      animation: sparkle-dance 4s ease-in-out infinite;
    }
    .animate-text-glow {
      animation: text-glow 3s ease-in-out infinite;
    }

    .animate-scroll-magic {
      animation: scroll-magic 2s ease-in-out infinite;
    }
    .animate-scroll-glow {
      animation: scroll-glow 2s ease-in-out infinite;
    }
    .animate-scroll-dot {
      animation: scroll-dot 1.5s ease-in-out infinite;
    }

    .animate-spin-slow {
      animation: spin-slow 10s linear infinite;
    }
    .animate-spin-reverse {
      animation: spin-reverse 8s linear infinite;
    }

    .animate-description-float {
      animation: fadeInUp 1s ease-out 0.2s both;
    }
    .animate-buttons-materialize {
      animation: fadeInUp 1s ease-out 0.4s both;
    }
    .animate-features-cascade {
      animation: fadeInUp 1s ease-out 0.6s both;
    }
    .animate-button-materialize {
      animation: fadeInUp 0.8s ease-out both;
    }
    .animate-feature-glow {
      animation: text-glow 4s ease-in-out infinite;
    }
    .animate-check-success {
      animation: quantum-pulse 2s ease-in-out infinite;
    }
    .animate-play-pulse {
      animation: quantum-pulse 1s ease-in-out;
    }
    .animate-energy-sweep {
      animation: button-shimmer 2s ease-in-out infinite;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `}</style>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-24 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                number: "$455B",
                label: "Global Gig Economy",
                icon: Globe,
                color: "from-blue-500 to-cyan-500",
              },
              {
                number: "0%",
                label: "Platform Fees",
                icon: Zap,
                color: "from-orange-500 to-yellow-500",
              },
              {
                number: "<24hrs",
                label: "Dispute Resolution",
                icon: Clock,
                color: "from-green-500 to-emerald-500",
              },
              {
                number: "100%",
                label: "Payment Security",
                icon: Shield,
                color: "from-purple-500 to-pink-500",
              },
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div
                  className={`w-20 h-20 bg-gradient-to-br ${stat.color} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-500 shadow-2xl`}
                >
                  <stat.icon className="h-10 w-10 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-black text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section
        id="features"
        className="relative z-10 py-40 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-sm mb-8">
              <Target className="h-4 w-4 text-purple-400 mr-2" />
              <span className="text-sm font-medium text-purple-300">
                Powerful Features
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
              Built for Trust in the
              <span className="block bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Gig Economy
              </span>
            </h2>

            <p className="text-xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
              Smart escrow technology that protects both freelancers and clients.
              Pay as milestones complete. Work with confidence. Scale without trust issues.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: CheckSquare,
                title: "Milestone Streaming",
                description:
                  "Set project milestones and payment automatically flows as each one completes. No upfront payment risk, no delayed payments.",
                benefits: [
                  "Progressive payment release",
                  "Customizable milestones",
                  "Real-time tracking",
                  "Automated distribution",
                ],
                color: "from-green-500 to-emerald-500",
                bgColor: "from-green-500/10 to-emerald-500/10",
              },
              {
                icon: Eye,
                title: "AI Verification",
                description:
                  "Smart agents verify simple deliverables automatically. Code commits, document uploads, and time tracking validated instantly.",
                benefits: [
                  "Automated verification",
                  "GitHub integration",
                  "Document validation",
                  "Time tracking proof",
                ],
                color: "from-purple-500 to-pink-500",
                bgColor: "from-purple-500/10 to-pink-500/10",
              },
              {
                icon: Users,
                title: "Community Validators",
                description:
                  "For complex work, trusted community validators review deliverables and approve milestone completion for a small fee.",
                benefits: [
                  "Expert review network",
                  "Fair compensation",
                  "Reputation-based",
                  "Fast turnaround",
                ],
                color: "from-blue-500 to-cyan-500",
                bgColor: "from-blue-500/10 to-cyan-500/10",
              },
              {
                icon: Shield,
                title: "Smart Escrow",
                description:
                  "MNEE stablecoin locked in smart contracts. Released automatically on milestone completion or validator approval.",
                benefits: [
                  "Trustless security",
                  "On-chain verification",
                  "No platform custody",
                  "Instant settlement",
                ],
                color: "from-orange-500 to-yellow-500",
                bgColor: "from-orange-500/10 to-yellow-500/10",
              },
              {
                icon: Zap,
                title: "Instant Disputes",
                description:
                  "Disagreement on a milestone? Funds freeze, arbitrator reviews evidence, decision in under 24 hours. Fair and fast.",
                benefits: [
                  "24-hour resolution",
                  "Evidence-based decisions",
                  "Neutral arbitrators",
                  "Transparent process",
                ],
                color: "from-red-500 to-rose-500",
                bgColor: "from-red-500/10 to-rose-500/10",
              },
              {
                icon: TrendingUp,
                title: "AI Agent Support",
                description:
                  "Hire AI agents for tasks. They complete work, get verified, receive payment autonomously. The future of freelancing.",
                benefits: [
                  "Agent-to-agent commerce",
                  "Autonomous operations",
                  "Programmable splits",
                  "Treasury management",
                ],
                color: "from-indigo-500 to-purple-500",
                bgColor: "from-indigo-500/10 to-purple-500/10",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-gradient-to-br hover:from-white/10 hover:to-white/15 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div className="relative z-10">
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-500 shadow-2xl`}
                  >
                    <feature.icon className="h-10 w-10 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-white transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-gray-300 mb-8 leading-relaxed font-light group-hover:text-gray-200 transition-colors duration-300">
                    {feature.description}
                  </p>

                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li
                        key={benefitIndex}
                        className="flex items-center text-gray-400 group-hover:text-gray-300 transition-colors duration-300"
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mr-3 flex-shrink-0`}
                        >
                          <Check className="h-3 w-3 text-white" />
                        </div>
                        <span className="font-medium">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-32 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 backdrop-blur-sm mb-8">
              <Quote className="h-4 w-4 text-green-400 mr-2" />
              <span className="text-sm font-medium text-green-300">
                Trusted by Freelancers Worldwide
              </span>
            </div>

            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Building Trust in
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                {" "}
                Every Transaction
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Full Stack Developer",
                company: "Freelance",
                rating: 5,
                comment:
                  "No more chasing clients for payment! ProofFlow releases funds as I hit milestones. I've saved hours of admin work and never worry about getting stiffed again.",
                avatar: "SC",
                gradient: "from-pink-500 to-rose-500",
              },
              {
                name: "Mike Rodriguez",
                role: "Design Agency Owner",
                company: "Creative Studios",
                rating: 5,
                comment:
                  "As a client, I love only paying for completed work. The AI verification for design deliverables is surprisingly accurate. No more awkward payment conversations.",
                avatar: "MR",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                name: "Priya Sharma",
                role: "Content Writer",
                company: "Remote Worker",
                rating: 5,
                comment:
                  "The dispute resolution saved my project! Client disagreed on one milestone but the validator reviewed my work and released payment within 18 hours. Fair and fast.",
                avatar: "PS",
                gradient: "from-green-500 to-emerald-500",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-gradient-to-br hover:from-white/10 hover:to-white/15 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="flex items-center mb-6">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${testimonial.gradient} rounded-2xl flex items-center justify-center text-white font-bold text-lg mr-4 shadow-xl`}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    <p className="text-gray-500 text-xs">
                      {testimonial.company}
                    </p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>

                <p className="text-gray-300 leading-relaxed font-light italic">
                  "{testimonial.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="relative z-10 py-40 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 backdrop-blur-sm mb-8">
              <Layers className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-300">
                Simple Process
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
              How ProofFlow
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {" "}
                Works
              </span>
            </h2>

            <p className="text-xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
              Simple escrow workflow that protects everyone. Set milestones, do the work,
              prove completion, get paid. It's that straightforward.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Create Project",
                description:
                  "Client creates a project with defined milestones and allocates MNEE payment to each milestone.",
                icon: FileText,
                color: "from-green-500 to-emerald-500",
              },
              {
                step: "02",
                title: "Accept & Work",
                description:
                  "Freelancer accepts project. MNEE locks in escrow. Start working with confidence that payment is secured.",
                icon: CheckSquare,
                color: "from-blue-500 to-cyan-500",
              },
              {
                step: "03",
                title: "Submit Proof",
                description:
                  "Complete milestone, submit deliverables. AI verifies automatically or validator reviews within hours.",
                icon: Eye,
                color: "from-purple-500 to-pink-500",
              },
              {
                step: "04",
                title: "Get Paid",
                description:
                  "Milestone approved? Payment releases instantly to your wallet. Move to next milestone. Rinse and repeat.",
                icon: Zap,
                color: "from-orange-500 to-yellow-500",
              },
            ].map((step, index) => (
              <div key={index} className="text-center group relative">
                <div className="relative mb-12">
                  <div
                    className={`w-24 h-24 bg-gradient-to-br ${step.color} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-500 shadow-2xl group-hover:shadow-3xl`}
                  >
                    <step.icon className="h-12 w-12 text-white" />
                  </div>

                  <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-white/20 text-white rounded-2xl flex items-center justify-center text-sm font-black shadow-xl backdrop-blur-sm">
                    {step.step}
                  </div>

                  {index < 3 && (
                    <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-white/20 to-transparent" />
                  )}
                </div>

                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-white transition-colors duration-300">
                  {step.title}
                </h3>

                <p className="text-gray-300 leading-relaxed font-light group-hover:text-gray-200 transition-colors duration-300 max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Pricing Section */}
      <section
        id="pricing"
        className="relative z-10 py-40 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 backdrop-blur-sm mb-8">
              <Zap className="h-4 w-4 text-yellow-400 mr-2" />
              <span className="text-sm font-medium text-yellow-300">
                Fair & Transparent
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
              Zero Platform Fees
              <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent">
                Forever
              </span>
            </h2>

            <p className="text-xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
              ProofFlow doesn't take a cut of your earnings. Pay only for optional services
              like validator reviews. Everything else is free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Core",
                price: "Free",
                period: "forever",
                description: "Everything you need to get started",
                features: [
                  "Unlimited projects",
                  "Milestone streaming",
                  "AI verification",
                  "Smart escrow",
                  "Instant payments",
                  "Basic analytics",
                ],
                cta: "Start Building",
                popular: false,
                gradient: "from-slate-600 to-slate-700",
              },
              {
                name: "With Validators",
                price: "2-3%",
                period: "per validated milestone",
                description: "For complex work needing human review",
                features: [
                  "Everything in Core",
                  "Expert validator reviews",
                  "Priority review queue",
                  "24-hour turnaround",
                  "Detailed feedback",
                  "Dispute mediation",
                ],
                cta: "Add Validators",
                popular: true,
                gradient: "from-orange-500 to-yellow-500",
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "contact us",
                description: "For agencies and teams",
                features: [
                  "Everything in Core",
                  "Multi-user accounts",
                  "Custom workflows",
                  "API access",
                  "Dedicated support",
                  "Volume discounts",
                ],
                cta: "Contact Sales",
                popular: false,
                gradient: "from-purple-600 to-pink-600",
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-3xl p-10 transition-all duration-500 hover:scale-105 group overflow-hidden ${plan.popular
                  ? "bg-gradient-to-br from-orange-500 to-yellow-500 text-white shadow-2xl transform scale-105 ring-4 ring-orange-500/50"
                  : "bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 text-white hover:bg-gradient-to-br hover:from-white/10 hover:to-white/15"
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-2xl text-sm font-bold shadow-2xl backdrop-blur-sm border border-white/20">
                      <Sparkles className="inline h-4 w-4 mr-2" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div
                  className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}
                />

                <div className="relative z-10">
                  <div className="text-center mb-10">
                    <h3 className="text-3xl font-black mb-6 text-white">
                      {plan.name}
                    </h3>

                    <div className="text-6xl font-black mb-4 text-white">
                      {plan.price}
                    </div>

                    <div
                      className={`text-sm font-medium ${plan.popular ? "text-orange-100" : "text-gray-400"
                        }`}
                    >
                      {plan.period}
                    </div>

                    <p
                      className={`mt-6 font-light ${plan.popular ? "text-orange-100" : "text-gray-300"
                        }`}
                    >
                      {plan.description}
                    </p>
                  </div>

                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <div
                          className={`w-6 h-6 rounded-full ${plan.popular ? "bg-white/20" : "bg-green-500/20"
                            } flex items-center justify-center mr-4 flex-shrink-0`}
                        >
                          <Check
                            className={`h-4 w-4 ${plan.popular ? "text-white" : "text-green-400"
                              }`}
                          />
                        </div>
                        <span
                          className={`font-medium ${plan.popular ? "text-white" : "text-gray-300"
                            }`}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-5 px-8 rounded-2xl font-bold text-lg transition-all duration-500 transform hover:scale-105 shadow-xl relative overflow-hidden group ${plan.popular
                      ? "bg-white text-orange-500 hover:bg-gray-100 shadow-2xl"
                      : "bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600"
                      }`}
                  >
                    <div
                      className={`absolute inset-0 ${plan.popular
                        ? "bg-gray-100"
                        : "bg-gradient-to-r from-orange-600 to-yellow-600"
                        } opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    />
                    <span className="relative flex items-center justify-center">
                      {plan.cta}
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-40 bg-gradient-to-r from-orange-500/20 via-yellow-500/20 to-orange-500/20 backdrop-blur-sm border-y border-orange-500/30">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-yellow-500/5" />

        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 backdrop-blur-sm mb-12">
            <Zap className="h-5 w-5 text-orange-400 mr-3" />
            <span className="text-base font-medium text-orange-300">
              Ready to work with confidence?
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black text-white mb-12 leading-tight">
            Stop Worrying About
            <span className="block bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Getting Paid
            </span>
          </h2>

          <p className="text-2xl text-gray-300 mb-16 leading-relaxed font-light max-w-4xl mx-auto">
            Join thousands of freelancers and clients building trust through milestone-based
            escrow. Work safer. Pay smarter. Scale faster.
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <button
              className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-16 py-6 rounded-2xl font-black text-2xl transition-all duration-500 transform hover:scale-105 shadow-2xl shadow-orange-500/50 hover:shadow-orange-500/70"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12" />
              <span className="relative flex items-center justify-center">
                Start Your First Project
                <ArrowRight className="ml-4 h-7 w-7 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </button>

            <button
              className="group relative border-2 border-white/30 text-white px-16 py-6 rounded-2xl font-black text-2xl hover:bg-white/10 backdrop-blur-sm transition-all duration-500 hover:border-white/50 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative flex items-center justify-center">
                <Play className="mr-4 h-7 w-7 group-hover:scale-110 transition-transform duration-300" />
                Watch Demo
              </span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-12 text-base text-gray-400 mt-12">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-400 mr-3" />
              No platform fees
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-400 mr-3" />
              Start immediately
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-400 mr-3" />
              No account needed
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-950/80 backdrop-blur-xl border-t border-white/10 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-8">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-2xl flex items-center justify-center mr-4 shadow-xl shadow-orange-500/25">
                    <Bitcoin className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-2xl blur opacity-30 animate-pulse" />
                </div>
                <span className="text-3xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Flow8
                </span>
              </div>

              <p className="text-gray-400 mb-10 max-w-md leading-relaxed font-light text-lg">
                The future of freelance invoicing. Create Bitcoin invoices,
                split payments, track tasks, and build your reputation on the
                decentralized web.
              </p>

              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-orange-500/20 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-orange-500/30"
                >
                  <Twitter className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-orange-500/20 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-orange-500/30"
                >
                  <Github className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-orange-500/20 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-orange-500/30"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-8 text-white">Product</h3>
              <ul className="space-y-4">
                <li>
                  <button
                    onClick={() => scrollToSection("features")}
                    className="text-gray-400 hover:text-white transition-colors duration-300 font-medium"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("pricing")}
                    className="text-gray-400 hover:text-white transition-colors duration-300 font-medium"
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <button
                    // onClick={() => handleConnect()}
                    className="text-gray-400 hover:text-white transition-colors duration-300 font-medium"
                  >
                    Dashboard
                  </button>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300 font-medium"
                  >
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-8 text-white">Support</h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300 font-medium"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300 font-medium"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300 font-medium"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300 font-medium"
                  >
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-20 pt-10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-base font-medium">
              © 2025 Flow8. All rights reserved.
            </p>
            <div className="flex space-x-10 mt-6 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-white text-base transition-colors duration-300 font-medium"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-base transition-colors duration-300 font-medium"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-base transition-colors duration-300 font-medium"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
