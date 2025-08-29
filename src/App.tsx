import { useEffect, useMemo, useState } from "react";
import { Sparkles, Mail, Laptop, Archive } from "lucide-react";
import { ProjectCard } from "./components/ProjectCard";
import { Section } from "./components/Section";
import { Lightbox } from "./components/Lightbox";
import { projects } from "./data/projects";
import { helloWords as initialWords, randomTitle } from "./utils/random";
import { AnimatePresence, motion } from "framer-motion";
import ThreeBackground from "./components/ThreeBackground";
import { FaTelegramPlane } from "react-icons/fa";
import Footer from "./components/Footer";
import { type Category } from "./types";
import { gatherUserFacts } from "./utils/userFacts";
import Header from "./components/Header";
import useLocalStorage from "./hooks/useLocalStorage";
import HelperToast from "./components/HelperToast";
import { startAdventure } from "./utils/startAdventure";
import { Subtitle } from "./components/Subtitle";

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

const bgProjects = ['youtube-dm', 'unlinknl', 'mental-reset', 'voxnl', 'nail-salon', 'moviebot', 'trail-shade'];

const subtitlePhrases = [
  "Welcome, I guess? How are your day?\nI am software developer since 2021.",
  "Really enjoy working on projects with new\ntech for me and love growing through dev.",
  "I don't really have something to say,\nbut I like making things.",
  "Sweet potatoes | Mashed potatoes\nFried potatoes | Oven potatoes",
  "gsap.to('.gallows',{opacity:1,duration:1})\ngsap.to('.the-bun',{y:-100,duration:2})",
];

export default function App() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Category>("all");
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ open: boolean; images: string[]; index: number }>({ open: false, images: [], index: 0 });
  const [isContentVisible, setIsContentVisible] = useState(true);

  const [helloWords, setHelloWords] = useState(initialWords);
  const [helloWordIndex, setHelloWordIndex] = useState(0);

  const [helperDismissed, setHelperDismissed] = useLocalStorage<boolean>('eyeHelper.dismissed', false);
  const [helperExpired, setHelperExpired] = useState(false);
  const [helperVisible, setHelperVisible] = useState(false);

  const isActiveProjectExists = useMemo(
    () => !!activeProject && bgProjects.includes(activeProject),
    [activeProject]
  );

  const filtered = useMemo(() => projects.filter(p => isProjectMatchesFilters(p, query, filter)), [query, filter]);

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
      const userFacts = await gatherUserFacts();
      if (userFacts.length > 0) {
        const combinedWords = [...initialWords, ...userFacts].sort(() => 0.5 - Math.random());
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
  }, []);

  useEffect(() => {
    startAdventure();
  }, []);

  useEffect(() => {
    if (activeProject && !helperDismissed && !helperExpired) {
      const t = setTimeout(() => setHelperVisible(true), 300);
      return () => clearTimeout(t);
    }
  }, [activeProject, helperDismissed]);

  const toggleContent = () => setIsContentVisible(v => !v);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-gray-100 dark:from-[#070710] dark:to-[#0b0b12] text-gray-900 dark:text-gray-100">
      <ThreeBackground activeProject={isActiveProjectExists ? activeProject : null} aria-hidden />
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
        className="w-full max-w-6xl mx-auto px-4 pt-10 pb-24 z-10 relative"
      >
        <section className="grid md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight flex items-center gap-2">
              Hello{" "}
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

            <Subtitle phrases={subtitlePhrases} reserveLines={2} />

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="https://t.me/sdwck" target="_blank" className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10"><FaTelegramPlane /> Send me DM</a>
              <a href="mailto:sdwcktarakanov@gmail.com" className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-black/10 dark:border-white/10"><Mail size={16} /> Contact</a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-indigo-500/20 via-fuchsia-500/10 to-amber-500/20 blur-2xl" />
            <div
              className="relative rounded-[2rem] border border-black/10 dark:border-white/10 overflow-hidden shadow-2xl"
              style={{ aspectRatio: "3 / 2" }}
            >
              <img src="/desk.png" alt="workspace" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        <section id="projects" className="space-y-10">
          {filtered.filter(p => p.status === 'released').length > 0 &&
            <AnimatePresence>
              <Section title="Released" icon={Sparkles}>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.filter(p => p.status === 'released').map((p) => (
                    <motion.div
                      key={p.id}
                      onMouseEnter={() => setActiveProject(p.id)}
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
          }

          {filtered.filter(p => p.status === 'development').length > 0 &&
            <AnimatePresence>
              <Section title="Development" icon={Laptop}>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.filter(p => p.status === 'development').map((p) => (
                    <motion.div
                      key={p.id}
                      onMouseEnter={() => setActiveProject(p.id)}
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
          }

          {filtered.filter(p => p.status === 'archived').length > 0 &&
            <AnimatePresence>
              <Section title="Archived" icon={Archive}>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.filter(p => p.status === 'archived').map((p) => (
                    <motion.div
                      key={p.id}
                      onMouseEnter={() => setActiveProject(p.id)}
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
            </AnimatePresence>}
        </section>
      </motion.main>

      <Footer />

      <Lightbox open={lightbox.open} images={lightbox.images} startIndex={lightbox.index} onClose={() => setLightbox({ open: false, images: [], index: 0 })} />

      <style>{`html,body,#root{height:100%;margin:0;} :root{color-scheme: light dark;}`}</style>
    </div>
  );
}
