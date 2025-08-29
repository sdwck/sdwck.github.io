export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  id: string;
  title: string;
  stack: Stack[];
  blurb: string;
  category: Category[];
  links?: {
    primary?: ProjectLink;
    github?: ProjectLink;
  };
  screenshots: string[];
  tags?: string[];
  status: ProjectStatus;
};

export type ProjectStatus = "development" | "archived" | "released";
export type Category = "all" | "web" | "mobile" | "desktop" | "bots" | "extension";
export type Stack = "TypeScript" | "React" | "React Native" | "Next.js" | "Electron" | "C#" | "ASP.NET Core" | "ASP.NET MVC";