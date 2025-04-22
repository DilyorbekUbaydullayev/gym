import FillLoading from "@/components/shared/fillLoading";
import TaskItem from "@/components/shared/taskItem";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { db } from "@/firebase";
import TaskForm from "@/forms/taskForm";
import { taskSchema } from "@/lib/validation";
import { TaskService } from "@/services/task.service";
import { useUserState } from "@/stores/user.store";
import { ITask } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { addMilliseconds, addMinutes, format } from "date-fns";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { AlertCircle, BadgePlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const Dashboard = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState<ITask | null>(null);
  const [open, setOpen] = useState(false);
  const { user } = useUserState();
  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["tasks-data"],
    queryFn: TaskService.getTasks,
  });

  const onAdd = async ({ title,timer }: z.infer<typeof taskSchema>) => {
    if (!user) return;
    return addDoc(collection(db, "tasks"), {
      title,
      status: "unstarted",
      startTime: null,
      endTime: null,
      timer:timer,
      userId: user.uid,
    })
      .then(() => refetch())
      .finally(() => setOpen(false));
  };

  const onUpdate = async ({ title,timer }: z.infer<typeof taskSchema>) => {
    if (!user) return;
    if (!currentTask) return;
    const ref = doc(db, "tasks", currentTask.id);
    return updateDoc(ref, { title,timer })
      .then(() => refetch())
      .finally(() => setIsEditing(false));
  };

  const onDelete = async (id: string) => {
    setIsDeleting(true);
    const promise = deleteDoc(doc(db, "tasks", id))
      .then(() => refetch())
      .finally(() => {
        toast.promise(promise, {
          loading: "Loading...",
          success: "Successfully deleted!",
          error: "Something went wrong!",
        });
        setIsDeleting(false);
      });
  };

  const onStartEditing = (task: ITask) => {
    setIsEditing(true);
    setCurrentTask(task);
  };

  const formatDate = (time: number) => {
    const date = addMilliseconds(new Date(0), time);
    const formattedDate = format(
      addMinutes(date, date.getTimezoneOffset()),
      "HH:mm:ss"
    );
    return formattedDate;
  };

  return (
    <>
      <div className="min-h-screen w-full px-4 py-8 sm:px-6 md:px-8 max-w-6xl mx-auto flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-4 sm:gap-6 lg:gap-8 items-start">
          {/* Tasks Section */}
          <div className="flex flex-col space-y-3 w-full max-sm:pt-15">
            <div className="w-full p-3 sm:p-4 rounded-md flex justify-between items-center bg-gradient-to-t from-background to-secondary">
              <div className="text-xl sm:text-2xl font-bold">Trainings</div>
              <Button aria-label="add" size="sm" onClick={() => setOpen(true)}>
                <BadgePlus className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Add</span>
              </Button>
            </div>
            <Separator />
            <div className="w-full p-3 sm:p-4 rounded-md flex flex-col bg-gradient-to-b from-background to-secondary relative min-h-60 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto scroll-hidden">
              {isPending || (isDeleting && <FillLoading />)}
              {error && (
                <Alert variant="destructive" className="mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              )}
              {data && (
                <div className="flex flex-col space-y-2 sm:space-y-3 w-full">
                  {!isEditing &&
                    data.tasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onStartEditing={() => onStartEditing(task)}
                        onDelete={() => onDelete(task.id)}
                        refetch={refetch}
                      />
                    ))}
                  {isEditing && (
                    <TaskForm
                      title={currentTask?.title}
                      timer={currentTask?.timer}
                      isEdit
                      onClose={() => setIsEditing(false)}
                      handler={
                        onUpdate as (
                          values: z.infer<typeof taskSchema>
                        ) => Promise<void>
                      }
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Stats Section */}
          <div className="flex flex-col space-y-3 w-full mt-4 lg:mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 rounded-md bg-gradient-to-r from-blue-800 to-background relative h-20 sm:h-24">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold">Total week</div>
                {isPending ? (
                  <FillLoading />
                ) : (
                  data && (
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold">
                      {formatDate(data.weekTotal)}
                    </div>
                  )
                )}
              </div>
              <div className="p-3 sm:p-4 rounded-md bg-gradient-to-r from-gray-700 to-background relative h-20 sm:h-24">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold">Total month</div>
                {isPending ? (
                  <FillLoading />
                ) : (
                  data && (
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold">
                      {formatDate(data.monthTotal)}
                    </div>
                  )
                )}
              </div>
              <div className="p-3 sm:p-4 rounded-md bg-gradient-to-r from-red-800 to-background relative h-20 sm:h-24">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold">Total time</div>
                {isPending ? (
                  <FillLoading />
                ) : (
                  data && (
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold">
                      {formatDate(data.total)}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger></DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create a new task</DialogTitle>
          </DialogHeader>
          <Separator />
          <TaskForm
            handler={
              onAdd as (values: z.infer<typeof taskSchema>) => Promise<void>
            }
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Dashboard;