import { cn } from '../../lib/cn';

export const Skeleton = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'inline-block animate-pulse bg-bg-subtle align-middle',
      className,
    )}
    aria-hidden
  />
);
