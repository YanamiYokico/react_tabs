export type Tab = {
  id: string;
  title: string;
  url: string;
  pinned: boolean;
  // filename located in /public/icons (optional)
  icon?: string;
};
