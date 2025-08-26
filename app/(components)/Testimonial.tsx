export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="w-full py-12 md:py-24 lg:py-32 bg-muted/40"
    >
      <div className="mx-auto container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Testimonials
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              See what our customers are saying about PrepMaster
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              quote:
                "PrepMaster has transformed how we run our meal prep business. We've reduced waste by 30% and increased customer satisfaction.",
              author: "Sarah Johnson",
              company: "Fit Kitchen Co.",
            },
            {
              quote:
                "The customer management features alone have saved us countless hours. Our customers love the consistency and organization.",
              author: "Michael Chen",
              company: "Clean Eats Delivery",
            },
            {
              quote:
                "As a small meal prep business, PrepMaster has helped us scale efficiently. The ROI has been incredible.",
              author: "Jessica Williams",
              company: "Macro Meals",
            },
          ].map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col justify-between space-y-4 rounded-lg border p-6"
            >
              <p className="text-muted-foreground">"{testimonial.quote}"</p>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.company}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
