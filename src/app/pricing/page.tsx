import { PricingTable } from "@clerk/nextjs";

export default function PricingPage() {
  return (
    <main className="flex flex-1 flex-col items-center py-16 px-4">
      <div className="w-full max-w-3xl space-y-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-50">
          Pricing
        </h1>
        <p className="text-zinc-400">
          Choose the plan that works best for you.
        </p>
        <PricingTable />
      </div>
    </main>
  );
}
