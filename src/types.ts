export interface SocialItem {
  icon: string;
  link: string;
  name?: string;
}

export interface ProjectItem {
  name: string;
  link: string;
  desc: string;
  icon: string;
  tech?: string[];
  repo?: string;
}
