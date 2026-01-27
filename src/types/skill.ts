export interface TechIcon {
  src: string;
  name: string;
}

export interface Skill {
  name: string;
  icons: TechIcon[];
  desc: string;
}
