import { Button } from "@/components/Button";

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 gap-12">
      <h2 className="text-3xl sm:text-3xl lg:text-5xl font-bold text-white">
        Fant ikke siden du lette etter
      </h2>

      <div className="py-10">
        <Button
          title="Gå tilbake til hjem siden"
          color="onlineOrange"
          href="/"
        />
      </div>
    </div>
  );
}
