export function NeighborhoodStory() {
  return (
    <section aria-labelledby="corazon-el-barrio" className="overflow-hidden bg-[#F3F8F5] text-slate-950">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 lg:px-8">
        <figure className="relative h-[440px] overflow-hidden rounded-3xl sm:h-[560px] lg:h-[680px]">
          {/* Photo: Cláudio Luiz Castro, Santiago, via Unsplash (EtDDUG1tyJk). */}
          <img
            src="/landing-media/historia-barrio.webp"
            alt="Pareja caminando junta por una calle de Santiago"
            className="h-full w-full object-cover object-[center_68%]"
            loading="lazy"
            decoding="async"
          />
          <figcaption className="absolute bottom-4 left-4 rounded-full bg-slate-950/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
            Santiago de Chile
          </figcaption>
        </figure>

        <div className="max-w-xl lg:py-8">
          <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.16em] text-[#0E8067] sm:text-sm">
            El corazón de El Barrio
          </p>

          <h2 id="corazon-el-barrio" className="font-light leading-[1.08] tracking-[-0.03em] text-slate-950">
            Volver a sentir que{' '}
            <span className="font-black text-[#0E8067]">vivimos en un barrio</span>
          </h2>

          <div className="mt-8 space-y-5 text-base leading-relaxed text-slate-700 sm:text-lg">
            <p>
              Vivimos rodeados de personas cuyos nombres no conocemos. A pocos metros hay manos dispuestas a ayudar, conocimientos por compartir y soluciones que podrían hacernos la vida más simple, pero muchas veces no sabemos cómo encontrarnos.
            </p>
            <p>
              El Barrio convierte esa cercanía en comunidad. No es una red para seguir desconocidos ni competir por atención, sino un espacio organizado por territorio, donde vecinos, familias, emprendedores, prestadores y comercios pueden participar en la vida cotidiana de su sector.
            </p>
            <p>
              Porque un barrio no es solamente un conjunto de calles. Es una red de personas que pueden cuidarse, ayudarse y crear oportunidades cuando tienen una forma simple y confiable de conectarse.
            </p>
          </div>

          <p className="mt-9 border-l-2 border-[#18B68B] pl-5 text-xl font-bold leading-snug text-slate-950 sm:text-2xl">
            El Barrio pone la tecnología al servicio de algo profundamente humano: volver a estar cerca.
          </p>
        </div>
      </div>
    </section>
  );
}
