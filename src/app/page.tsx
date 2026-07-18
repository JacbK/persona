import Link from "next/link";

const steps = [
  ["01", "Share your story", "Add your goals, links, work, and visual taste locally."],
  ["02", "Choose a direction", "Your coding agent researches and presents a design before building."],
  ["03", "Make it yours", "The agent builds, checks, and helps publish a portfolio unique to you."],
];

export default function Home() {
  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <main className="min-h-screen px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col">
        <header className="flex items-center justify-between border-b border-neutral-800 pb-5">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-semibold text-black">
              P
            </span>
            <span className="font-medium">Persona</span>
          </div>
          <span className="hidden text-xs uppercase tracking-[0.2em] text-neutral-500 sm:block">Portfolio starter kit</span>
        </header>

        <section className="grid flex-1 items-center gap-14 py-16 lg:grid-cols-[1.25fr_0.75fr] lg:py-24">
          <div>
            <p className="mb-5 text-sm text-neutral-500">For people with more personality than a template</p>
            <h1 className="max-w-4xl text-5xl font-medium leading-[0.98] tracking-[-0.05em] sm:text-7xl">
              Build a portfolio that feels like you.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-neutral-400">
              Persona gives your coding agent the context and guardrails to design a personal site—not paste your name into the same developer portfolio everyone has.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href={isDevelopment ? "/config" : "https://github.com/new?template_name=persona&template_owner=JacbK"}
                className="rounded-lg bg-white px-5 py-3 text-center text-sm font-medium text-black transition-colors hover:bg-neutral-200"
              >
                {isDevelopment ? "Open local setup" : "Use this template"}
              </Link>
              <code className="rounded-lg border border-neutral-800 bg-neutral-900 px-5 py-3 text-center text-sm text-neutral-300">
                ./setup.sh
              </code>
            </div>
            <p className="mt-4 text-xs text-neutral-600">Your profile and materials stay in your local repository.</p>
          </div>

          <ol className="divide-y divide-neutral-800 border-y border-neutral-800">
            {steps.map(([number, title, description]) => (
              <li key={number} className="grid grid-cols-[2.5rem_1fr] gap-4 py-6">
                <span className="font-mono text-xs text-neutral-600">{number}</span>
                <div>
                  <h2 className="font-medium">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-neutral-500">{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}
