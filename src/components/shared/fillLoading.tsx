import { Loader2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

const FillLoading = () => {
  return (
    <Skeleton className="absolute inset-0 flex justify-center items-center w-full h-full opacity-20 z-50">
      <Loader2 className="animate-spin w-10 h-10"/>
    </Skeleton>
  );
};

export default FillLoading;
