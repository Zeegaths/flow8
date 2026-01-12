import { LucideProps } from "lucide-react";
import React, { ForwardRefExoticComponent, RefAttributes } from "react";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  benefits: string[];
  image: string;
  bg: string;
  text: string;
};

function FeatureCard({
  title,
  description,
  icon,
  benefits,
  image,
  bg,
  text,
}: FeatureCardProps) {
  return (
    <div
      className={`border border-gray-300 rounded-2xl p-4 h-96`}
      style={{ backgroundColor: bg, color: text }}
    >
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex items-center justify-center w-full py-2">
        <img src={image} alt={title} className="object-cover h-32" />
      </div>
      <p className="text-md my-4">{description}</p>
      <div className="flex flex-wrap gap-2 my-4">
        {benefits.map((benefit) => (
          <p
            key={benefit}
            className="text-xs text-orange-500 font-semibold py-1 px-1 bg-white rounded-full border border-orange-500"
          >
            {benefit}
          </p>
        ))}
      </div>
    </div>
  );
}

export default FeatureCard;
