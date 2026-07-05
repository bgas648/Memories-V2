interface Props {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, action }: Props) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="text-[15px] text-neutral-500 dark:text-neutral-400 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
