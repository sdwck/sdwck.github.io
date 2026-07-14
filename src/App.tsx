import { useEffect, useMemo, useState } from "react";
import { Sparkles, Mail, Laptop, Archive, Briefcase } from "lucide-react";
import { ProjectCard } from "./components/ProjectCard";
import { Section } from "./components/Section";
import { Lightbox } from "./components/Lightbox";
import { projects } from "./data/projects";
import { randomTitle } from "./utils/random";
import { AnimatePresence, motion } from "framer-motion";
import ThreeBackground from "./components/ThreeBackground";
import { FaTelegramPlane } from "react-icons/fa";
import Footer from "./components/Footer";
import { type Category, type WorkExperience } from "./types";
import { gatherUserFacts, gatherUserFactStarters } from "./utils/userFacts";
import Header from "./components/Header";
import useLocalStorage from "./hooks/useLocalStorage";
import HelperToast from "./components/HelperToast";
import { startAdventure } from "./utils/startAdventure";
import { Subtitle } from "./components/Subtitle";
import { Badge } from "./components/Badge";
import { workExperiences } from "./data/work";

const isProjectMatchesFilters = (p: typeof projects[number], query: string, filter: Category) => {
  const matchesFilter = filter === "all" || p.category.includes(filter);
  const normalizedQuery = query.toLowerCase().trim();
  const matchesQuery =
    p.title.toLowerCase().includes(normalizedQuery) ||
    p.blurb.toLowerCase().includes(normalizedQuery) ||
    p.tags?.some(tag => tag.toLowerCase().includes(normalizedQuery) || `#${tag}`.toLocaleLowerCase().includes(normalizedQuery)) ||
    p.stack.some(tech => tech.toLowerCase().includes(normalizedQuery));
  return matchesFilter && matchesQuery;
}

const isWorkMatchesFilters = (w: WorkExperience, query: string, filter: Category) => {
  const matchesFilter = filter === "all" || w.category.includes(filter);
  const normalizedQuery = query.toLowerCase().trim();
  const matchesQuery =
    w.role.toLowerCase().includes(normalizedQuery) ||
    w.company.toLowerCase().includes(normalizedQuery) ||
    w.bullets.some(b => b.toLowerCase().includes(normalizedQuery)) ||
    w.stack.some(tech => tech.toLowerCase().includes(normalizedQuery));
  return matchesFilter && matchesQuery;
}

const formatText = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-white opacity-100 group-hover:text-indigo-300 transition-colors">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
};

const bgProjects = ['togglemesh', 'youtube-dm', 'unlinknl', 'mental-reset', 'voxnl', 'nail-salon', 'moviebot', 'trail-shade', 'solartrack'];

const subtitlePhrases = [
  "Software Engineer specializing\nin .NET and Python ecosystems.",
  "Building scalable backend systems\nand resilient infrastructure.",
  "Turning complex business logic\ninto clean, maintainable code.",
  "Experienced with Docker, CI/CD,\nand Event-Driven Architecture."
];

export default function App() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Category>("all");
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ open: boolean; images: string[]; index: number }>({ open: false, images: [], index: 0 });
  const [isContentVisible, setIsContentVisible] = useState(true);

  const [starterWord, setStarterWord] = useState("Hello");
  const [helloWords, setHelloWords] = useState(["friend"]);
  const [helloWordIndex, setHelloWordIndex] = useState(0);

  const [helperDismissed, setHelperDismissed] = useLocalStorage<boolean>('eyeHelper.dismissed', false);
  const [helperExpired, setHelperExpired] = useState(false);
  const [helperVisible, setHelperVisible] = useState(false);

  const isActiveProjectExists = useMemo(
    () => !!activeProject && bgProjects.includes(activeProject),
    [activeProject]
  );

  const filtered = useMemo(() => projects.filter(p => isProjectMatchesFilters(p, query, filter)), [query, filter]);
  const filteredWork = useMemo(() => workExperiences.filter(w => isWorkMatchesFilters(w, query, filter)), [query, filter]);

  const openLightbox = (images: string[], index = 0) => setLightbox({ open: true, images, index });

  const onBadgeClick = (stack: string) => {
    if (!stack) return;
    if (stack === filter) {
      setFilter("all");
      return;
    } else if (stack === query) {
      setQuery("");
      return;
    }
    else if (["all", "web", "mobile", "desktop", "bots"].includes(stack)) {
      setFilter(stack as Category);
    } else {
      setQuery(stack);
    }
  }

  useEffect(() => {
    document.title = randomTitle();
  }, []);

  useEffect(() => {
    const fetchAndSetUserFacts = async () => {
      const starters = gatherUserFactStarters();
      if (starters.length > 0)
        setStarterWord(starters[Math.floor(Math.random() * starters.length)]);
      const userFacts = await gatherUserFacts();
      if (userFacts.length > 0) {
        const combinedWords = [...userFacts].sort(() => 0.5 - Math.random());
        setHelloWords(combinedWords);
      }
    };
    fetchAndSetUserFacts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHelloWordIndex((prev) => (prev + 1) % helloWords.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [helloWords.length]);

  useEffect(() => {
    startAdventure();
  }, []);

  useEffect(() => {
    if (activeProject && !helperDismissed && !helperExpired) {
      const t = setTimeout(() => setHelperVisible(true), 300);
      return () => clearTimeout(t);
    }
  }, [activeProject, helperDismissed, helperExpired]);

  const toggleContent = () => setIsContentVisible(v => !v);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#070710] to-[#0b0b12] text-gray-100">
      <ThreeBackground activeProject={isActiveProjectExists ? activeProject : null} />
      <Header query={query} setQuery={setQuery} filter={filter} setFilter={setFilter} isContentVisible={isContentVisible} toggleContent={toggleContent} />

      <AnimatePresence>
        {helperVisible && !helperExpired && (
          <HelperToast
            onClose={() => {
              setHelperVisible(false);
              setHelperDismissed(true);
            }}
            onExpire={() => {
              setHelperVisible(false);
              setHelperExpired(true);
            }}
          />
        )}
      </AnimatePresence>

      <motion.main
        initial={{ opacity: 1 }}
        animate={{ opacity: isContentVisible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{ pointerEvents: isContentVisible ? 'auto' : 'none' }}
        className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-16 sm:pb-24 z-10 relative"
      >
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center mb-8 sm:mb-12">
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <h1 className="text-5xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight flex flex-row items-center justify-center lg:justify-start gap-2 flex-wrap">
              <span>{starterWord}</span>{" "}
              <span className="inline-block align-baseline">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={helloWords[helloWordIndex]}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-amber-500"
                    style={{ lineHeight: 1.4 }}
                  >
                    {helloWords[helloWordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>

            <div className="mt-4 sm:mt-6 flex justify-center lg:justify-start">
              <div className="w-full max-w-md lg:max-w-none">
                <Subtitle phrases={subtitlePhrases} reserveLines={2} />
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3 justify-center lg:justify-start">
              <a
                href="https://t.me/sdwck"
                target="_blank"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-2 rounded-2xl border border-white/10 bg-white/10 text-sm sm:text-base transition-colors hover:bg-white/20"
              >
                <FaTelegramPlane className="flex-shrink-0" />
                <span>Send me DM</span>
              </a>
              <a
                href="mailto:sdwcktarakanov@gmail.com"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-2 rounded-2xl border border-white/10 text-sm sm:text-base transition-colors hover:bg-white/5"
              >
                <Mail size={16} className="flex-shrink-0" />
                <span>Contact</span>
              </a>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="absolute -inset-3 sm:-inset-6 rounded-xl sm:rounded-[2rem] bg-gradient-to-tr from-indigo-500/20 via-fuchsia-500/10 to-amber-500/20 blur-xl sm:blur-2xl" />
            <div
              className="relative rounded-xl sm:rounded-[2rem] border border-white/10 overflow-hidden shadow-xl sm:shadow-2xl"
              style={{ aspectRatio: "3 / 2" }}
            >
              <img
                src="/desk.jpg"
                alt="workspace"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <AnimatePresence>
          {filteredWork.length > 0 && (
            <motion.section
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="mb-12 sm:mb-16 mt-8"
            >
              <Section title="Work Experience" icon={Briefcase}>
                <div className="flex flex-col gap-6">
                  {filteredWork.map((work) => (
                    <div key={work.id} className="p-5 sm:p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl hover:shadow-xl transition-shadow">
                      <div className="flex justify-between items-start flex-wrap gap-4">
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">{work.role}</h3>
                          <p className="text-indigo-400 font-medium mt-1">
                            {work.company} <span className="text-gray-400 text-sm">({work.location})</span>
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                          {/* {work.startDate && (
                            <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-400 border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 rounded-full whitespace-nowrap">
                              <Clock size={14} />
                              <span>
                                {(() => {
                                  const start = new Date(work.startDate);
                                  const end = work.endDate ? new Date(work.endDate) : new Date();

                                  const months =
                                    (end.getFullYear() - start.getFullYear()) * 12 +
                                    (end.getMonth() - start.getMonth());

                                  return `${months} ${months === 1 ? "month" : "months"}`;
                                })()}
                              </span>
                            </div>
                          )} */}

                          <div className="text-sm font-semibold border border-white/10 bg-white/5 px-3 py-1.5 rounded-full whitespace-nowrap">
                            {work.startDate &&
                              `${new Date(work.startDate).toLocaleString("en-US", {
                                month: "short",
                                year: "numeric",
                              })} - ${work.endDate
                                ? new Date(work.endDate).toLocaleString("en-US", {
                                  month: "short",
                                  year: "numeric",
                                })
                                : "Present"
                              }`}
                          </div>
                        </div>
                      </div>

                      <ul className="mt-5 space-y-3 opacity-80 text-sm sm:text-base leading-relaxed list-disc list-outside pl-5 marker:text-indigo-500">
                        {work.bullets.map((bullet, idx) => (
                          <li key={idx}>{formatText(bullet)}</li>
                        ))}
                      </ul>

                      <div className="mt-6 flex flex-wrap gap-2">
                        {work.stack.map(tech => (
                          <div
                            key={tech}
                            onClick={() => onBadgeClick(tech)}
                            className="cursor-pointer hover:scale-105 transition-transform"
                          >
                            <Badge>{tech}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            </motion.section>
          )}
        </AnimatePresence>

        <section id="projects" className="space-y-8 sm:space-y-10">
          {filtered.filter(p => p.isFeatured).length > 0 && (
            <AnimatePresence>
              <Section title="Featured" icon={Laptop}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filtered.filter(p => p.isFeatured).map((p) => (
                    <motion.div
                      key={p.id}
                      onMouseEnter={() => setActiveProject(p.id)}
                      onTouchStart={() => setActiveProject(p.id)}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ProjectCard
                        p={p}
                        onOpenLightbox={openLightbox}
                        onBadgeClick={onBadgeClick}
                      />
                    </motion.div>
                  ))}
                </div>
              </Section>
            </AnimatePresence>
          )}

          {filtered.filter(p => p.status === 'released' && !p.isFeatured).length > 0 && (
            <AnimatePresence>
              <Section title="Released" icon={Sparkles}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filtered.filter(p => p.status === 'released' && !p.isFeatured).map((p) => (
                    <motion.div
                      key={p.id}
                      onMouseEnter={() => setActiveProject(p.id)}
                      onTouchStart={() => setActiveProject(p.id)}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ProjectCard
                        p={p}
                        onOpenLightbox={openLightbox}
                        onBadgeClick={onBadgeClick}
                      />
                    </motion.div>
                  ))}
                </div>
              </Section>
            </AnimatePresence>
          )}

          {filtered.filter(p => p.status === 'development' && !p.isFeatured).length > 0 && (
            <AnimatePresence>
              <Section title="Development" icon={Laptop}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filtered.filter(p => p.status === 'development' && !p.isFeatured).map((p) => (
                    <motion.div
                      key={p.id}
                      onMouseEnter={() => setActiveProject(p.id)}
                      onTouchStart={() => setActiveProject(p.id)}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ProjectCard
                        p={p}
                        onOpenLightbox={openLightbox}
                        onBadgeClick={onBadgeClick}
                      />
                    </motion.div>
                  ))}
                </div>
              </Section>
            </AnimatePresence>
          )}

          {filtered.filter(p => p.status === 'archived' && !p.isFeatured).length > 0 && (
            <AnimatePresence>
              <Section title="Archived" icon={Archive}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filtered.filter(p => p.status === 'archived' && !p.isFeatured).map((p) => (
                    <motion.div
                      key={p.id}
                      onMouseEnter={() => setActiveProject(p.id)}
                      onTouchStart={() => setActiveProject(p.id)}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5 }}
                    >
                      <ProjectCard
                        p={p}
                        onOpenLightbox={openLightbox}
                        onBadgeClick={onBadgeClick}
                      />
                    </motion.div>
                  ))}
                </div>
              </Section>
            </AnimatePresence>
          )}
        </section>
      </motion.main>
      <Footer />
      <Lightbox
        open={lightbox.open}
        images={lightbox.images}
        startIndex={lightbox.index}
        onClose={() => setLightbox({ open: false, images: [], index: 0 })}
      />
    </div>
  );
}