import { ArrowRight } from "lucide-react";

export default function Newsletter() {
  return (
    <section
      id="new"
      className="mx-auto flex w-[calc(100%-28px)] max-w-[1720px] flex-col gap-7 border-t border-zinc-200 py-12 sm:py-16 lg:flex-row lg:items-center lg:justify-between"
    >
      {/* Content */}
      <div>
        <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-zinc-500">
          Stay in the loop
        </span>

        <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] sm:text-3xl">
          Good finds, straight to you.
        </h2>

        <p className="mt-2 max-w-xl text-xs text-zinc-500">
          Get first access to new arrivals, limited drops,
          and offers worth knowing about.
        </p>
      </div>

      {/* Subscription Form */}
      <form
        onSubmit={(event) => event.preventDefault()}
        className="flex h-[52px] w-full max-w-[400px] rounded-xl border border-zinc-200 bg-white p-1"
      >
        <input
          type="email"
          placeholder="Your email address"
          aria-label="Email address"
          className="min-w-0 flex-1 bg-transparent px-3 text-xs outline-none placeholder:text-zinc-400"
        />

        <button
          type="submit"
          className="flex items-center gap-2 rounded-lg bg-[#171a18] px-4 text-[10px] font-extrabold text-white transition hover:bg-zinc-700"
        >
          Subscribe

          <ArrowRight size={15} />
        </button>
      </form>
    </section>
  );
}