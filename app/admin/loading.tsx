export default function AdminLoadingPage() {
  return (
    <div className="min-h-screen text-white flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-y-2  mb-4"></div>
        <h2 className="text-2xl font-semibold">
          Laster inn administrasjonspanel...
        </h2>
        <p className="text-slate-400 mt-2">
          Vennligst vent mens vi henter informasjonen din
        </p>
      </div>
    </div>
  );
}
