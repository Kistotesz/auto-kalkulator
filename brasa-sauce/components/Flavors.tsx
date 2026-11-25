import { flavors } from "@/lib/products";
import AddButton from "./AddButton";
import HeatMeter from "./HeatMeter";

/**
 * One full-height panel per sauce. The 3D jar sits centre stage and swaps
 * its sauce as each panel arrives; the name is set huge behind it.
 */
export default function Flavors() {
  return (
    <section id="flavors" aria-labelledby="flavors-title" className="relative">
      <h2 id="flavors-title" className="layer-front px-4 pt-24 text-sm text-bone/60 md:px-10 md:text-base">
        Three sauces. Each one built around a single chilli.
      </h2>

      {flavors.map((f, i) => {
        const [first, ...rest] = f.name.split(" ");
        return (
          <article
            key={f.id}
            data-flavor={i}
            aria-labelledby={`${f.id}-name`}
            className="relative flex min-h-[100svh] flex-col justify-between px-4 py-16 md:px-10 md:py-24"
          >
            <h3
              id={`${f.id}-name`}
              className="layer-back flex flex-col font-display text-giant font-black uppercase leading-[0.86] tracking-tight"
            >
              <span style={{ color: f.labelInk }}>{first}</span>
              <span className="self-end text-outline text-right" style={{ WebkitTextStrokeColor: f.labelInk }}>
                {rest.join(" ")}
              </span>
            </h3>

            <div className="layer-front mt-[38vh] grid gap-8 md:mt-0 md:grid-cols-2 md:gap-[34vw]">
              <div className="max-w-sm">
                <p className="font-display text-2xl font-bold uppercase leading-tight md:text-3xl">{f.short}</p>
                <p className="mt-4 leading-relaxed text-bone/75">{f.notes}</p>
                <p className="mt-4 text-sm text-bone/55">Try it with: {f.pairing}</p>
              </div>

              <div className="flex max-w-sm flex-col gap-5 md:items-end md:justify-self-end md:text-right">
                <HeatMeter heat={f.heat} color={f.labelInk} />
                <p className="text-sm text-bone/60">
                  Heat {f.heat}/10, {f.scoville}
                </p>
                <div className="flex items-center gap-5">
                  <p className="font-display text-5xl font-black">${f.price}</p>
                  <AddButton id={f.id} />
                </div>
                <p className="text-sm text-bone/50">{f.size} glass jar</p>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
