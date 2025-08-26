import { Button } from "@/components/ui/button";

export function Pricing() {
  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
      <div className="mx-auto container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Pricing
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Choose the plan that fits your business needs
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
          {[
            {
              title: "Starter",
              price: "$49",
              description: "Perfect for new meal prep businesses",
              features: [
                "Up to 100 customers",
                "Basic meal planning",
                "Order management",
                "Email support",
              ],
            },
            {
              title: "Professional",
              price: "$99",
              description: "For growing meal prep businesses",
              features: [
                "Up to 500 customers",
                "Advanced meal planning",
                "Inventory management",
                "Delivery scheduling",
                "Priority support",
              ],
              highlighted: true,
            },
            {
              title: "Enterprise",
              price: "$199",
              description: "For established meal prep businesses",
              features: [
                "Unlimited customers",
                "Complete meal planning suite",
                "Advanced analytics",
                "API access",
                "Dedicated support",
              ],
            },
          ].map((plan, index) => (
            <div
              key={index}
              className={`flex flex-col rounded-lg border p-6 ${
                plan.highlighted ? "border-green-600 shadow-lg" : ""
              }`}
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">{plan.title}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>
              <ul className="mt-6 space-y-2 flex-1">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-green-600"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Button
                  className={`w-full ${
                    plan.highlighted ? "bg-green-600 hover:bg-green-700" : ""
                  }`}
                >
                  Get Started
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
