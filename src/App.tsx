import { useEffect, useMemo, useState } from "react";
import { Check, Clock, Sparkles, Shield, Gauge, ArrowRight, MousePointerClick } from "lucide-react";

// Minimal, clean landing for a limited-stock software product
// Tailwind CSS styles only. Single-file, self-contained component.
// Change the CONFIG object to customize.

const CONFIG = {
  productName: "FluxSoft",
  tagline: "Tu nueva ventaja silenciosa",
  hero: {
    title: "Software minimalista. Impacto máximo.",
    subtitle:
      "Automatiza tareas, acelera tus flujos y consigue foco real. Licencias limitadas para mantener soporte premium.",
    ctaPrimary: "Obtener licencia",
    ctaSecondary: "Ver demo",
  },
  price: {
    amount: 49,
    currency: "USD",
    note: "pago único, actualizaciones por 12 meses",
  },
  stock: {
    total: 200,
    initialSold: 137,
    // Fecha/hora de cierre (zona local del visitante)
    endsAt: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 5); // termina en 5 días por defecto
      d.setHours(23, 59, 59, 0);
      return d.toISOString();
    })(),
  },
  features: [
    { icon: Gauge, title: "Rápido por diseño", desc: "Arranca en milisegundos y corre offline." },
    { icon: Shield, title: "Privado", desc: "Tus datos se quedan en tu equipo, sin telemetría intrusiva." },
    { icon: Sparkles, title: "Automatiza", desc: "Flujos pre-armados para correo, archivos y reportes." },
  ],
  faq: [
    { q: "¿Cuántas instalaciones por licencia?", a: "Puedes activar hasta 3 dispositivos (desktop/laptop) por licencia." },
    { q: "¿Hay reembolsos?", a: "Sí, 14 días sin preguntas si no es para ti." },
    { q: "¿Funciona sin internet?", a: "Sí. Solo necesitas conexión para activar y actualizar." },
  ],
};

function useCountdown(targetISO: string) {
  const target = useMemo(() => new Date(targetISO).getTime(), [targetISO]);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(target - now, 0);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { diff, days, hours, minutes, seconds };
}

export default function LandingLimitedStock() {
  const [sold, setSold] = useState(CONFIG.stock.initialSold);
  const remaining = Math.max(CONFIG.stock.total - sold, 0);
  const pct = Math.min((sold / CONFIG.stock.total) * 100, 100);
  const { days, hours, minutes, seconds } = useCountdown(CONFIG.stock.endsAt);
  const [showCheckout, setShowCheckout] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleBuy = () => setShowCheckout(true);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulación de checkout
    setSubmitted(true);
    setTimeout(() => {
      setShowCheckout(false);
      setSold((s) => Math.min(s + 1, CONFIG.stock.total));
    }, 900);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 backdrop-blur border-b border-neutral-800/60 bg-neutral-950/70">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-white/80 to-white/20" />
            <span className="font-semibold tracking-tight">{CONFIG.productName}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <BadgeLimited remaining={remaining} />
            <button
              onClick={handleBuy}
              className="inline-flex items-center gap-2 rounded-xl bg-white text-neutral-950 px-4 py-2 font-medium hover:scale-[1.02] active:scale-[0.98] transition"
            >
              {CONFIG.hero.ctaPrimary}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full blur-3xl bg-white/10" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full blur-3xl bg-white/10" />
        </div>
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <div className="grid md:grid-cols-2 items-center gap-12">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs text-neutral-300">
                <Clock className="h-3.5 w-3.5" /> Oferta termina en
                <span className="font-mono tabular-nums">{days}d {hours}h {minutes}m {seconds}s</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-semibold leading-[1.1] tracking-tight">
                {CONFIG.hero.title}
              </h1>
              <p className="mt-4 text-neutral-300 md:text-lg">{CONFIG.hero.subtitle}</p>

              {/* Stock bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>Stock limitado</span>
                  <span>
                    {remaining} de {CONFIG.stock.total} disponibles
                  </span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full bg-white/90"
                    style={{ width: `${pct}%` }}
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    role="progressbar"
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleBuy}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-neutral-950 px-5 py-3 font-medium hover:scale-[1.02] active:scale-[0.98] transition"
                >
                  <MousePointerClick className="h-4 w-4" /> {CONFIG.hero.ctaPrimary}
                </button>
                <a
                  href="#demo"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-900 px-5 py-3 font-medium text-neutral-200 hover:border-neutral-700"
                >
                  {CONFIG.hero.ctaSecondary}
                </a>
              </div>
              <p className="mt-3 text-xs text-neutral-400">{`\u0024${CONFIG.price.amount} ${CONFIG.price.currency} — ${CONFIG.price.note}`}</p>
            </div>

            {/* Mockup / Demo card */}
            <div id="demo" className="relative">
              <div className="aspect-[16/10] rounded-3xl border border-neutral-800 bg-neutral-900/60 shadow-2xl overflow-hidden">
                <div className="p-4 border-b border-neutral-800 flex items-center gap-2 text-xs text-neutral-400">
                  <div className="h-3 w-3 rounded-full bg-neutral-700" />
                  <div className="h-3 w-3 rounded-full bg-neutral-700" />
                  <div className="h-3 w-3 rounded-full bg-neutral-700" />
                  <span className="ml-auto">Captura de demo</span>
                </div>
                <div className="p-6 grid gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-300">Panel de tareas</span>
                    <span className="text-xs text-neutral-500">Resúmenes automáticos</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {["Importar", "Limpieza", "Reportes", "Sincronizar", "Macros", "Publicar"].map((t) => (
                      <div key={t} className="rounded-xl border border-neutral-800 bg-neutral-950 p-3">
                        <div className="h-3 w-20 rounded bg-neutral-800" />
                        <div className="mt-3 h-6 w-full rounded bg-neutral-800" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-6">
          {CONFIG.features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
              <f.icon className="h-6 w-6" />
              <h3 className="mt-3 text-lg font-medium">{f.title}</h3>
              <p className="mt-2 text-sm text-neutral-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-8 md:p-10 grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Licencia {CONFIG.productName}</h2>
            <ul className="mt-4 space-y-2 text-sm text-neutral-300">
              {[
                "Activación en 3 dispositivos",
                "Actualizaciones por 12 meses",
                "Plantillas y flujos preconfigurados",
                "Soporte prioritario por correo",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6">
            <div className="text-4xl font-semibold tracking-tight">
              <span className="font-mono tabular-nums">${CONFIG.price.amount}</span>
              <span className="ml-1 text-base text-neutral-400">{CONFIG.price.currency}</span>
            </div>
            <p className="mt-1 text-xs text-neutral-400">{CONFIG.price.note}</p>
            <button
              onClick={handleBuy}
              className="mt-4 w-full rounded-xl bg-white text-neutral-950 py-3 font-medium hover:scale-[1.01] active:scale-[0.99] transition"
            >
              {CONFIG.hero.ctaPrimary}
            </button>
            <p className="mt-3 text-xs text-neutral-500 text-center">
              Quedan {remaining} licencias — no habrá reposición inmediata.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <h3 className="text-xl font-medium">Preguntas frecuentes</h3>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {CONFIG.faq.map((item) => (
            <details key={item.q} className="group rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
              <summary className="cursor-pointer list-none font-medium flex items-center justify-between">
                {item.q}
                <span className="ml-2 text-neutral-400 group-open:rotate-180 transition">▾</span>
              </summary>
              <p className="mt-3 text-sm text-neutral-400">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800/60 bg-neutral-950/60">
        <div className="mx-auto max-w-6xl px-4 py-10 text-xs text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© {new Date().getFullYear()} {CONFIG.productName}. Todos los derechos reservados.</span>
          <div className="flex items-center gap-4">
            <a className="hover:text-neutral-300" href="#">Términos</a>
            <a className="hover:text-neutral-300" href="#">Privacidad</a>
            <a className="hover:text-neutral-300" href="#">Contacto</a>
          </div>
        </div>
      </footer>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-950 p-6">
            <h4 className="text-lg font-medium">Completa tu compra</h4>
            <p className="mt-1 text-sm text-neutral-400">
              Recibirás el enlace de pago y tu licencia por correo.
            </p>
            <form onSubmit={handleSubmit} className="mt-5 grid gap-3">
              <label className="text-sm">
                Correo electrónico
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-neutral-600"
                  placeholder="tucorreo@dominio.com"
                />
              </label>
              <button
                type="submit"
                className="rounded-xl bg-white text-neutral-950 px-4 py-2 font-medium hover:scale-[1.01] active:scale-[0.99] transition"
              >
                Finalizar
              </button>
              {submitted && (
                <p className="text-sm text-emerald-400">¡Listo! Revisa tu bandeja de entrada. (Demo)</p>
              )}
              <button
                type="button"
                onClick={() => setShowCheckout(false)}
                className="text-xs text-neutral-400 hover:text-neutral-200"
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function BadgeLimited({ remaining }: { remaining: number }) {
  const critical = remaining <= 25;
  return (
    <span
      className={
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs " +
        (critical
          ? "border-white/40 bg-white text-neutral-950"
          : "border-neutral-800 bg-neutral-900 text-neutral-200")
      }
    >
      <Clock className="h-3.5 w-3.5" />
      {critical ? `Últimas ${remaining}` : `Quedan ${remaining}`}
    </span>
  );
}
