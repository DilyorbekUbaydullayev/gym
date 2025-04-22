import { Card } from "../ui/card";
import { MdOutlineTaskAlt } from "react-icons/md";
import { HiStatusOnline } from "react-icons/hi";
import { CiPause1, CiPlay1 } from "react-icons/ci";
import { RxReload } from "react-icons/rx";
import { Button } from "../ui/button";
import { Edit2, Trash } from "lucide-react";
import { ITask, ITaskData } from "@/types";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { toast } from "sonner";
import FillLoading from "./fillLoading";
import { QueryObserverResult } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useTimer } from "react-timer-hook";
interface Props {
  task: ITask;
  onStartEditing: () => void;
  onDelete: () => void;
  refetch: () => Promise<QueryObserverResult<ITaskData, Error>>;
}

const TaskItem = ({ task, onStartEditing, onDelete, refetch }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + Number(task.timer));
  const { seconds, minutes, start, pause, resume,restart,} = useTimer({
    expiryTimestamp,
    autoStart: false,
    onExpire: async () => {
      const ref = doc(db, "tasks", task.id);
      try {
        await updateDoc(ref, {
          status: "paused",
          endTime: Date.now(),
        });
        refetch();
      } catch (error) {
        toast.error("Timer expiredda xatolik");
      }
    },
  });

  const onStart = async () => {
    setIsLoading(true);
    const ref = doc(db, "tasks", task.id);
    try {
      await updateDoc(ref, {
        status: "in_progress",
        startTime: Date.now(),
      });
      refetch();
    } catch (error) {
      toast.error("An error occured");
    } finally {
      setIsLoading(false);
    }
  };

  const onPause = async () => {
    setIsLoading(true);
    const ref = doc(db, "tasks", task.id);
    try {
      const elapsed = task.startTime ? Date.now() - task.startTime : 0;
      const newTotalTime = (task.totalTime || 0) + elapsed;
      await updateDoc(ref, {
        status: "paused",
        endTime: Date.now(),
        totalTime: newTotalTime,
      });
      refetch();
    } catch (error) {
      toast.error("An error occured");
    } finally {
      setIsLoading(false);
    }
  };

  const renderBtns = () => {
    switch (task.status) {
      case "unstarted":
        return (
          <Button 
          aria-label="start"
            variant={"ghost"}
            size={"icon"}
            onClick={() => {
              onStart(), start();
            }}
          >
            <CiPlay1 className="text-indigo-500 w-5 h-5" />
          </Button>
        );
      case "in_progress":
        return (
          <Button
          aria-label="pause"
            variant={"ghost"}
            size={"icon"}
            onClick={() => {
              onPause(), pause();
            }}
          >
            <CiPause1 className="text-indigo-500 w-5 h-5" />
          </Button>
        );
      case "paused":
        return (
          <Button
          aria-label="resume"
            variant={"ghost"}
            size={"icon"}
            onClick={() => {
              onStart();
              if (seconds > 0 || minutes > 0) {
                resume();
              } else {
                const newExpiry = new Date();
                newExpiry.setSeconds(newExpiry.getSeconds() + Number(task.timer));
                restart(newExpiry, true);
              }
            }}
          >
            <RxReload className="text-indigo-500 w-5 h-5" />
          </Button>
        );
    }
  };

  return (
    <Card className="w-full p-4 shadow-md grid grid-cols-12 items-center gap-4 relative">
      {isLoading && <FillLoading />}
      <div className="flex gap-2 items-center  col-span-5  w-full ">
        <MdOutlineTaskAlt className="text-blue-500" />
        <p className="capitalize w-full">{task.title}</p>
      </div>
      <div className="flex gap-1 items-center  col-span-4">
        <HiStatusOnline
          className={cn(
            task.status === "unstarted" && "text-blue-500",
            task.status === "paused" && "text-red-500",
            task.status === "in_progress" && "text-green-500"
          )}
        />
        <span className="capitalize text-sm">{task.status}</span>
        <span className="capitalize text-sm ms-2">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
      </div>
      <div className="flex gap-1 items-center justify-self-end col-span-3">
        {renderBtns()}
        <Button aria-label="edit icon" variant={"secondary"} size={"icon"} onClick={onStartEditing}>
          <Edit2 className=" w-5 h-5" />
        </Button>
        <Button aria-label="trash icon" variant={"destructive"} size={"icon"} onClick={onDelete}>
          <Trash className=" w-5 h-5" />
        </Button>
      </div>
    </Card>
  );
};

export default TaskItem;
