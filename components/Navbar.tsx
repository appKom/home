import { Button } from "./Button";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between flex-wrap px-5 py-5 bg-tealBlue">
      <h1 className="font-semibold text-3xl">Applikasjonskomiteen</h1>
      <Button title="Kontakt oss" href="/kontakt" color="lightBlue" />
    </nav>
  );
}
