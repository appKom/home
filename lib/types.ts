export type blogType = {
  title: string;
  author?: memberType;
  content: string;
  imageUri: string;
  createdAt: Date;
};

export type memberType = {
  name: string;
  href: string;
  imageUri: string;
  about?: string;
};
