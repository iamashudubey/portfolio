// Shape of src/data/profile.json. Keep the two in step when you add fields.

export type SocialIcon =
  | "linkedin"
  | "github"
  | "email"
  | "twitter"
  | "instagram"
  | "medium"
  | "website";

export type SkillIcon = "code" | "cloud" | "smartphone" | "wrench" | "users" | "layers";

export interface Profile {
  meta: {
    siteTitle: string;
    description: string;
    themeColor: string;
    // Your final URL, e.g. "https://ashutoshdubey.dev". Used for share previews.
    siteUrl: string;
  };
  personal: {
    name: string;
    firstName: string;
    role: string;
    roles: string[];
    tagline: string;
    location: string;
    availability: { open: boolean; text: string };
    profileImage: string;
    casualImage: string;
    // viewUrl must be a PDF (browsers can't display .docx). downloadUrl can be PDF or .docx.
    resume: {
      viewUrl: string;
      viewLabel: string;
      downloadUrl: string;
      downloadLabel: string;
    };
    heroBadges: string[];
    codeCard: Record<string, string>;
  };
  about: {
    heading: string;
    paragraphs: string[];
    highlights: string[];
    currently: { title: string; text: string };
  };
  stats: { value: number; suffix: string; label: string }[];
  experience: Experience[];
  projects: Project[];
  skills: { group: string; icon: SkillIcon; items: string[] }[];
  education: {
    degree: string;
    institution: string;
    location: string;
    year: string;
    details: string;
  }[];
  contact: {
    heading: string;
    text: string;
    email: string;
    phone: string;
    showPhone: boolean;
    whatsapp: string;
    showWhatsapp: boolean;
    location: string;
    // Optional Formspree / Web3Forms URL. Empty: the form opens the visitor's email app.
    formEndpoint: string;
  };
  socials: { label: string; url: string; icon: SocialIcon }[];
}

export interface Experience {
  company: string;
  location: string;
  role: string;
  start: string;
  end: string;
  current: boolean;
  points: string[];
  tech: string[];
}

export interface Project {
  title: string;
  subtitle: string;
  category: string;
  featured: boolean;
  icon: string;
  color: string;
  description: string;
  points: string[];
  tech: string[];
  links: {
    live?: string;
    github?: string;
    playStore?: string;
    appStore?: string;
  };
}
