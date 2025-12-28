type Props = {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
};

export default function Section({ title, children, actions }: Props) {
  return (
    <section className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        {actions && <div>{actions}</div>}
      </div>
      {children}
    </section>
  );
}
