import type { Project } from "../types";

export const projects: Project[] = [
    {
        id: "togglemesh",
        title: "ToggleMesh",
        stack: ["C#", ".NET", "React", "TypeScript", "PostgreSQL", "Redis"],
        blurb: "A scalable feature flag and experimentation platform built with modern enterprise patterns.",
        category: ["web"],
        links: {
            github: { label: "GitHub", href: "https://github.com/sdwck/ToggleMesh" },
        },
        screenshots: [
            ...Array.from({ length: 27 }, (_, i) => `/togglemesh/${i + 1}.png`),
            "/togglemesh/cover.png"
        ],
        tags: ["FeatureFlags", "ABTesting", "Enterprise", "DataPlane"],
        status: "development",
        isFeatured: true
    },
    {
        id: "youtube-dm",
        title: "YouTube DM",
        stack: ["TypeScript"],
        blurb: "A browser extension that reverts the private messaging system to the YouTube.",
        category: ["web", "extension"],
        links: {
            primary: { label: "Chrome Web Store", href: "https://chromewebstore.google.com/detail/youtube-direct-messages/dbkdcdmeokoneaoibbgclfafjikffibm" },
            github: { label: "GitHub", href: "https://github.com/sdwck/youtube-direct-messages" },
        },
        screenshots: [
            "/youtube-dm/1.png",
            "/youtube-dm/2.png",
            "/youtube-dm/3.png",
            "/youtube-dm/4.png",
            "/youtube-dm/5.png",
            "/youtube-dm/cover.png",
        ],
        tags: ["Social", "YouTube", "Firebase"],
        status: "released",
        isFeatured: true
    },
    {
        id: "unlinknl",
        title: "UnlinkNL",
        stack: ["C#", "Electron", "React", "Next.js"],
        blurb: "Manage and isolate Steam profiles for truly fresh starts across accounts.",
        category: ["desktop"],
        links: {
            primary: { label: "Website", href: "https://unlink-nl.vercel.app/" },
            github: { label: "GitHub", href: "https://github.com/sdwck/UnlinkNL" },
        },
        screenshots: [
            "/unlink-nl/1.png",
            "/unlink-nl/2.png",
            "/unlink-nl/3.png",
            "/unlink-nl/cover.png",
        ],
        tags: ["Steam", "Gaming"],
        status: "released",
        isFeatured: true
    },
    {
        id: "mental-reset",
        title: "Mental Reset",
        stack: ["React Native"],
        blurb: "Rest with breath counting and meditative music. Built in a few day and approved on Google Play.",
        category: ["mobile"],
        links: {
            primary: { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.sdwck.mentalreset" },
        },
        screenshots: [
            "/mental-reset/1.png",
            "/mental-reset/2.png",
            "/mental-reset/3.png",
            "/mental-reset/4.png",
            "/mental-reset/5.png",
            "/mental-reset/6.png",
            "/mental-reset/7.png",
            "/mental-reset/8.png",
            "/mental-reset/9.png",
            "/mental-reset/cover.png",
        ],
        tags: ["Rest", "Expo"],
        status: "released",
        isFeatured: false
    },
    {
        id: "nail-salon",
        title: "Nail Salon App",
        stack: ["Next.js", "React", "TypeScript"],
        blurb: "A nail salon app with online booking and a gallery of works. Quite generic.",
        category: ["web", "bots"],
        links: {},
        screenshots: [
            "/nail-salon/1.png",
            "/nail-salon/2.png",
            "/nail-salon/3.png",
            "/nail-salon/4.png",
            "/nail-salon/5.png",
            "/nail-salon/6.png",
            "/nail-salon/cover.png",
        ],
        tags: ["Business", "Telegram"],
        status: "released",
        isFeatured: false
    },
    {
        id: "solartrack",
        title: "SolarTrack",
        stack: ["ASP.NET Core", "React", "TypeScript", "Node.js"],
        blurb: "A monitoring app that reads data from solar panels and displays statistics.",
        category: ["web", "IoT"],
        links: {
            primary: { label: "Live Demo", href: "https://solartrack.runasp.net/" },
        },
        screenshots: [
            "/solartrack/1.png",
            "/solartrack/2.png",
            "/solartrack/3.png",
            "/solartrack/4.png",
            "/solartrack/cover.png",
        ],
        tags: ["IoT", "Monitoring"],
        status: "released",
        isFeatured: true
    },
    {
        id: "trail-shade",
        title: "Trail Shade",
        stack: ["React Native", "ASP.NET Core"],
        blurb: "Draw polygons on maps to trace zones you walk in. Timeline and friends zones included.",
        category: ["mobile"],
        links: {},
        screenshots: [
            "/trail-shade/1.png",
            "/trail-shade/cover.png",
        ],
        tags: ["Maps", "Rest", "Social", "Expo"],
        status: "archived",
        isFeatured: true
    },
    {
        id: "voxnl",
        title: "VoxNL",
        stack: ["React Native", "ASP.NET Core"],
        blurb: "Convert any book or document to audio. Read and listen together with SRT subtitles.",
        category: ["web", "mobile", "bots"],
        links: {
            // primary: { label: "Telegram Bot", href: "https://t.me/VoxNL_bot" },
        },
        screenshots: [
            "/voxnl/1.png",
            "/voxnl/2.png",
            "/voxnl/3.png",
            "/voxnl/cover.png",
        ],
        tags: ["TTS", "Telegram", "Multiplatform"],
        status: "archived",
        isFeatured: true
    },
    {
        id: "moviebot",
        title: "MovieBot",
        stack: ["C#", "ASP.NET Core"],
        blurb: "Search movies and get recommendations right in Telegram. Powered by TMDB.",
        category: ["bots"],
        links: {},
        screenshots: [
            "/moviebot/1.png",
            "/moviebot/2.png",
            "/moviebot/3.png",
            "/moviebot/4.png",
            "/moviebot/5.png",
            "/moviebot/6.png",
            "/moviebot/7.png",
            "/moviebot/8.png",
            "/moviebot/9.png",
            "/moviebot/10.png",
            "/moviebot/11.png",
            "/moviebot/cover.png",
        ],
        tags: ["Telegram", "Rest"],
        status: "archived",
        isFeatured: true
    },
    {
        id: "flower-garden",
        title: "Flower Garden",
        stack: ["React", "ASP.NET Core"],
        blurb: "Flower shop website with Telegram notification integration.",
        screenshots: [
            "/flower-garden/1.png",
            "/flower-garden/2.png",
            "/flower-garden/3.png",
            "/flower-garden/cover.png",
        ],
        category: ["web", "bots"],
        tags: ["Business", "Telegram"],
        status: "archived",
        isFeatured: false
    },
    {
        id: "bytecore",
        title: "ByteCore",
        stack: ["ASP.NET MVC"],
        blurb: "Upload or study digital IT courses free of any charge.",
        screenshots: [
            "/bytecore/1.png",
            "/bytecore/2.png",
            "/bytecore/3.png",
            "/bytecore/4.png",
            "/bytecore/5.png",
            "/bytecore/6.png",
            "/bytecore/cover.png",
        ],
        category: ["web"],
        tags: ["Education", "IT"],
        status: "archived",
        isFeatured: false
    },
    {
        id: "bnl",
        title: "BNL",
        stack: ["React", "ASP.NET Core"],
        blurb: "Order game account boosts and services from a team of professionals.",
        screenshots: [
            "/bnl/1.png",
            "/bnl/2.png",
            "/bnl/3.png",
            "/bnl/4.png",
            "/bnl/5.png",
            "/bnl/cover.png",
        ],
        category: ["web"],
        tags: ["Gaming", "Business"],
        status: "archived",
        isFeatured: false
    },
];

projects.forEach(project => {
    if (project.tags) {
        project.tags.sort();
    }
});