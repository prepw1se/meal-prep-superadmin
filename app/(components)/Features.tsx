export function Features() {
  return (
    <section
      id="features"
      className="w-full py-12 md:py-24 lg:py-32 bg-muted/40"
    >
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Features
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Everything you need to run your meal prep business efficiently
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Customer Management",
              description:
                "Manage customer profiles, preferences, and dietary restrictions.",
            },
            {
              title: "Meal Planning",
              description:
                "Create and manage meal plans, recipes, and nutritional information.",
            },
            {
              title: "Order Processing",
              description:
                "Handle orders, payments, and subscriptions with ease.",
            },
            {
              title: "Inventory Management",
              description: "Track ingredients, costs, and reduce waste.",
            },
            {
              title: "Delivery Scheduling",
              description:
                "Organize delivery routes and pickup locations efficiently.",
            },
            {
              title: "Analytics & Reports",
              description:
                "Gain insights into your business performance and customer preferences.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-2 rounded-lg border p-4"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <div className="h-8 w-8 rounded-full bg-green-600" />
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-muted-foreground text-center">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
