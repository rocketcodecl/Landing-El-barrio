import { useEffect, useState } from 'react';
import { useSiteContent } from '../context/SiteContentContext';

export function NeighborhoodStory() {
  const { content } = useSiteContent();
  const story = content.story;
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => setVideoFailed(false), [story.mediaType, story.mediaUrl]);

  if (!story.visible) return null;

  const showVideo = story.mediaType === 'video' && story.mediaUrl && !videoFailed;
  const fallbackImage = story.mediaPosterUrl || '/landing-media/historia-barrio.webp';

  return (
    <section aria-labelledby="corazon-el-barrio" className="overflow-hidden bg-[#F3F8F5] text-slate-950">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 lg:px-8">
        <figure className="relative h-[440px] overflow-hidden rounded-3xl sm:h-[560px] lg:h-[680px]">
          {/* Photo: Cláudio Luiz Castro, Santiago, via Unsplash (EtDDUG1tyJk). */}
          {showVideo ? (
            <video
              src={story.mediaUrl}
              poster={story.mediaPosterUrl || undefined}
              aria-label={story.mediaAlt}
              className="h-full w-full object-cover object-center"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              onError={() => setVideoFailed(true)}
            />
          ) : (
            <img
              src={story.mediaType === 'image' && story.mediaUrl ? story.mediaUrl : fallbackImage}
              alt={story.mediaAlt}
              className="h-full w-full object-cover object-[center_68%]"
              loading="lazy"
              decoding="async"
            />
          )}
          {story.mediaCaption && (
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-slate-950/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
              {story.mediaCaption}
            </figcaption>
          )}
        </figure>

        <div className="max-w-xl lg:py-8">
          <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.16em] text-[#0E8067] sm:text-sm">
            {story.eyebrow}
          </p>

          <h2 id="corazon-el-barrio" className="font-light leading-[1.08] tracking-[-0.03em] text-slate-950">
            {story.titlePart1}{' '}
            <span className="font-black text-[#0E8067]">{story.titleHighlight}</span>
          </h2>

          <div className="mt-8 space-y-5 text-base leading-relaxed text-slate-700 sm:text-lg">
            <p>
              {story.paragraph1}
            </p>
            <p>
              {story.paragraph2}
            </p>
            <p>
              {story.paragraph3}
            </p>
          </div>

          <p className="mt-9 border-l-2 border-[#18B68B] pl-5 text-xl font-bold leading-snug text-slate-950 sm:text-2xl">
            {story.closingText}
          </p>
        </div>
      </div>
    </section>
  );
}
