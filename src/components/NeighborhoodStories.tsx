import { useSiteContent } from '../context/SiteContentContext';

export function NeighborhoodStories() {
  const { content } = useSiteContent();
  const scene = content.scene;
  const stories = [
    { image: scene.story1ImageUrl, title: scene.story1Title, text: scene.story1Text },
    { image: scene.story2ImageUrl, title: scene.story2Title, text: scene.story2Text },
  ];

  return (
    <section className="bg-[#FAFDFB] py-6 sm:py-10" aria-label="La vida en El Barrio">
      <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
        {stories.map((story) => (
          <article key={story.title} className="group relative min-h-[520px] overflow-hidden rounded-[2rem] bg-slate-900 shadow-xl sm:min-h-[620px]">
            <img src={story.image} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 z-10 p-7 text-white sm:p-10">
              <h2 className="max-w-lg text-3xl font-black leading-tight sm:text-4xl">{story.title}</h2>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">{story.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
