type EmptyStateProps = {
    title: string;
    description: string;
    action?: React.ReactNode;
  };
  
  export default function EmptyState({
    title,
    description,
    action,
  }: EmptyStateProps) {
    return (
      <div className="rounded-2xl border border-dashed bg-white/40 p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl">
          📚
        </div>
  
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
        </h3>
  
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
          {description}
        </p>
  
        {action && (
          <div className="mt-5">
            {action}
          </div>
        )}
      </div>
    );
  }