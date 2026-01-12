import {
  Award,
  Bitcoin,
  Check,
  CheckSquare,
  Shield,
  Smartphone,
  Users,
} from "lucide-react";
import ScrollStack, {
  ScrollStackItem,
} from "../../blocks/Components/ScrollStack/ScrollStack";
import React, { useState } from "react";
import FeatureCard from "./FeatureCard";
import btcInvoice from "../../assets/images/btc-invoice.png";
import teamSplit from "../../assets/images/split-bill.png";
import taskTracker from "../../assets/images/task.png";
import reputation from "../../assets/images/reputation.png";
import admin from "../../assets/images/admin.png";
import clientPortal from "../../assets/images/client.png";

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
    image: btcInvoice,
    bg: "#f7931a",
    text: "#faf6f9",
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
    image: teamSplit,
    bg: "#faf6f9",
    text: "#000",
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
    image: taskTracker,
    bg: "#faf6f9",
    text: "#000",
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
    image: reputation,
    bg: "#faf6f9",
    text: "#000",
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
    image: admin,
    bg: "#faf6f9",
    text: "#000",
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
    image: clientPortal,
    bg: "#faf6f9",
    text: "#000",
  },
];

const colors = [
  {
    bg: "#f7931a",
    text: "#faf6f9",
  },
  {
    bg: "##faf6f9",
    text: "#f7931a",
  },
  {
    bg: "#FAF7F3",
    text: "#000",
  },
  {
    bg: "#687FE5",
    text: "#faf6f9",
  },
  {
    bg: "#FFDCDC",
    text: "#000",
  },
  {
    bg: "#F9F3EF",
    text: "#000",
  },
];

function Features() {
  const [activeFeature, setActiveFeature] = useState(0);
  return (
    <section id="features" className="py-20 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From Bitcoin invoicing to team collaboration, Flow8 provides
            all the tools modern freelancers need to thrive in the decentralized
            economy.
          </p>
        </div>

        <div className="">
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center mb-20">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  benefits={feature.benefits}
                  image={feature.image}
                  bg={feature.bg}
                  text={feature.text}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
