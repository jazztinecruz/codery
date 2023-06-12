type Props = {
  children: React.ReactNode;
  label?: string;
};

const Container = ({ label = "", children }: Props) => {
  return (
    <div className="flex flex-col">
      <h1 className="font-semibold">{label}</h1>
      <div className="flex w-fit flex-col flex-wrap gap-1 rounded border bg-white py-3 px-6">
        {children}
      </div>
    </div>
  );
};

export default Container;
