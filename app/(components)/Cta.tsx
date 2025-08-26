import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Cta() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-green-600 text-white">
      <div className="mx-auto flex flex-col items-center justify-center space-y-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
          Ready to grow your meal prep business?
        </h2>
        <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Join hundreds of meal prep businesses already using PrepMaster
        </p>
        <div className="flex flex-col gap-2 min-[400px]:flex-row">
          <Link href="/signup">
            <Button className="bg-white text-green-600 hover:bg-gray-100">
              Start Your Free Trial
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              variant="outline"
              className="border-white text-green-600 hover:bg-green-700"
            >
              Contact Sales
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
