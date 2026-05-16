import { LoadingSpinner } from "./LoadingSpinner";

export const PageLoader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingSpinner size="lg" text="Loading..." />
    </div>
  );
};
