interface Props {
  title: string;
  id?: string;
}

export const HeaderText = ({ title, id }: Props) => {
  return (
    <h1
      id={id}
      className="text-2xl xs:text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold"
    >
      {title}
    </h1>
  );
};
