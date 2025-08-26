export function FAQ() {
  return (
    <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
      <div className="mx-auto container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Find answers to common questions about PrepMaster
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-3xl space-y-4 py-12">
          {[
            {
              question: "How easy is it to get started with PrepMaster?",
              answer:
                "Getting started is simple. Sign up for an account, import your customer data (or start fresh), and begin setting up your meal plans. Our onboarding process guides you through each step.",
            },
            {
              question: "Can I integrate PrepMaster with my existing tools?",
              answer:
                "Yes, PrepMaster integrates with popular payment processors, accounting software, and delivery management tools. We also offer API access on our Enterprise plan for custom integrations.",
            },
            {
              question:
                "Is PrepMaster suitable for small meal prep businesses?",
              answer:
                "Our Starter plan is designed specifically for small and new meal prep businesses, with features that help you grow efficiently.",
            },
            {
              question:
                "How does PrepMaster handle dietary restrictions and allergies?",
              answer:
                "PrepMaster includes comprehensive customer profile management where you can track dietary restrictions, allergies, and preferences. These are automatically flagged when creating meal plans for customers.",
            },
            {
              question: "Can I try PrepMaster before committing?",
              answer:
                "Yes, we offer a 14-day free trial on all plans with no credit card required. You can explore all features and see how PrepMaster can benefit your business.",
            },
          ].map((faq, index) => (
            <div key={index} className="rounded-lg border p-6">
              <h3 className="text-lg font-bold">{faq.question}</h3>
              <p className="mt-2 text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
