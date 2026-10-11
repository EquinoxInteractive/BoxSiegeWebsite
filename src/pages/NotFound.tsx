import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { useDocumentMeta } from "@/components/Page";
import { CHARACTERS } from "@/data/game";

export default function NotFound() {
  useDocumentMeta("Page not found · BOX SIEGE", "This page does not exist.");
  return (
    <section className="grid min-h-[80svh] place-items-center px-5 pt-28 text-center">
      <div>
        <img src={CHARACTERS[11].die} alt="" className="px animate-bob mx-auto w-40" />
        <h1 className="mt-6 font-display text-7xl md:text-9xl" style={{ textShadow: "0 5px 0 #000" }}>Knocked out</h1>
        <p className="mx-auto mt-3 max-w-md text-lg text-white/70">There is no page at this address. Head back to the arena.</p>
        <Link to="/" className="skew-btn mt-8"><span className="flex items-center gap-2.5"><Home className="h-5 w-5" /> Back to home</span></Link>
      </div>
    </section>
  );
}
