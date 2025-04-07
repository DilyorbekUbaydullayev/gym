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

  const onAdd = async ({ title }: z.infer<typeof taskSchema>) => {
    if (!user) return;
    return addDoc(collection(db, "tasks"), {
      title,
      status: "unstarted",
      startTime: null,
      endTime: null,
      userId: user.uid,
    })
      .then(() => refetch())
      .finally(() => setOpen(false));
  };

  const onUpdate = async ({ title }: z.infer<typeof taskSchema>) => {
    if (!user) return;
    if (!currentTask) return;
    const ref = doc(db, "tasks", currentTask.id);
    return updateDoc(ref, { title })
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
          success: "Succsessfully deleted!",
          error: "Something went wrong!",
        });
        setIsDeleting(false)
      });
  };

  const onStartEditing = (task: ITask) => {
    setIsEditing(true);
    setCurrentTask(task);
  };

  return (
    <>
      <div className="min-h-screen py-8 max-w-5xl mx-auto flex items-center ">
        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-8 items-center">
          <div className="flex flex-col space-y-3">
            <div className="w-full p-4 rounded-md flex justify-between bg-gradient-to-t from-background to-secondary">
              <div className="text-2xl font-bold">Trainings</div>
              <Button onClick={() => setOpen(true)}>
                <BadgePlus />
              </Button>
            </div>
            <Separator />
            <div className="w-full p-4 rounded-md flex flex-col bg-gradient-to-b from-background to-secondary relative min-h-60 max-h-[60vh] overflow-y-auto scroll-hidden">
              {isPending||isDeleting && <FillLoading />}
              {error && (
                <Alert variant="destructive" className="mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              )}
              {data && (
                <div className="flex flex-col space-y-3 w-full">
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
          <div className="flex flex-col space-y-3 w-full">
            <div className="p-4 rounded-md bg-gradient-to-r from-blue-500 to-background relative h-24">
              <div className="text-2xl font-bold">Total week</div>
              <div className="text-3xl font-bold">02:08:47</div>
            </div>
            <div className="p-4 rounded-md bg-gradient-to-r from-blue-500 to-background relative h-24">
              <div className="text-2xl font-bold">Total month</div>
              <div className="text-3xl font-bold">02:08:47</div>
            </div>
            <div className="p-4 rounded-md bg-gradient-to-r from-blue-500 to-background relative h-24">
              <div className="text-2xl font-bold">Total year</div>
              <div className="text-3xl font-bold">02:08:47</div>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger></DialogTrigger>
        <DialogContent>
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
