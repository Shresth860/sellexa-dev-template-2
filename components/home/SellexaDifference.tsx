const features = [
  {
    number: "01",
    title: "Curated discovery",
    description: "Products worth your attention.",
  },
  {
    number: "02",
    title: "Secure checkout",
    description: "Simple and protected payments.",
  },
  {
    number: "03",
    title: "Fast delivery",
    description: "From our store to your door.",
  },
];

export default function SellexaDifference() {
  return (
    <section
      id="deals"
      className="mx-auto mb-12 grid w-[calc(100%-28px)] max-w-[1720px] gap-8 rounded-[28px] bg-[#1a1e1b] p-7 text-white sm:p-10 lg:grid-cols-2 lg:p-14"
    >
      {/* Content */}
      <div>
        <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-zinc-400">
          The Sellexa difference
        </span>

        <h2 className="mt-4 text-4xl font-black leading-[0.95] tracking-[-0.06em] sm:text-5xl">
          Less scrolling.
          <br />
          <span className="text-zinc-500">
            More finding.
          </span>
        </h2>

        <p className="mt-5 max-w-lg text-xs leading-7 text-zinc-400 sm:text-sm">
          Smart discovery, honest pricing, and a shopping
          experience designed around what you need — not
          what gets in the way.
        </p>
      </div>

      {/* Features */}
      <div className="flex flex-col justify-center">
        {features.map((feature) => (
          <div
            key={feature.number}
            className="grid grid-cols-[35px_1fr] gap-3 border-b border-zinc-700 py-5 last:border-0"
          >
            <span className="text-[9px] text-zinc-500">
              {feature.number}
            </span>

            <div>
              <strong className="text-xs">
                {feature.title}
              </strong>

              <p className="mt-1 text-[10px] text-zinc-500">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}