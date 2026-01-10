import { ReactNode } from 'react';

interface SectionContainerProps {
  children: ReactNode;
  id?: string;
  className?: string;
  as?: 'section' | 'div' | 'footer';
}

export default function SectionContainer({
  children,
  id,
  className = '',
  as: Component = 'section'
}: SectionContainerProps) {
  return (
    <Component
      id={id}
      className={`w-full px-6 md:px-12 lg:px-[104px] ${className}`}
    >
      {children}
    </Component>
  );
}
