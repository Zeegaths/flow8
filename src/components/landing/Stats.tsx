import CountUp from "./../../blocks/TextAnimations/CountUp/CountUp";

const stats = [
  { number: 10000, label: "Active Freelancers", suffix: "+", prefix: "" },
  { number: 2500, label: "Bitcoin Processed", suffix: "", prefix: "₿" },
  { number: 50000, label: "Invoices Created", suffix: "+", prefix: "" },
  { number: 4.9, label: "Client Satisfaction", suffix: "/5", prefix: "" },
];

function Stats() {
  return (
    <div>
      <h2 className="text-center text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Our Targets
      </h2>
      <section className="py-16 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex items-center justify-center flex-col"
              >
                <div className="flex items-center gap-1">
                  {stat.prefix}
                  <CountUp
                    from={0}
                    to={stat.number}
                    separator=","
                    direction="up"
                    duration={3}
                    className="count-up-text font-info font-semibold text-3xl"
                  />
                  {stat.suffix}
                </div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Stats;
