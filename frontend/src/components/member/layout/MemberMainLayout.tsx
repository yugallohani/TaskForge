import { ReactNode } from "react";
import { MemberHeader } from "./MemberHeader";

interface MemberMainLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export const MemberMainLayout = ({
  children,
  title,
  description,
}: MemberMainLayoutProps) => {
  return (
    <>
      <MemberHeader title={title} description={description} />
      <main className="flex-1 p-6">{children}</main>
    </>
  );
};
