import { ReactNode } from "react";
import { Header } from "./Header";

interface MainLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export const MainLayout = ({ children, title, description }: MainLayoutProps) => {
  return (
    <>
      <Header title={title} description={description} />
      <main className="flex-1 p-6">{children}</main>
    </>
  );
};
